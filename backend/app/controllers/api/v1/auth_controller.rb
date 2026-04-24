module Api
  module V1
    class AuthController < BaseController
      # POST /api/v1/auth/signup
      def signup
        user = User.new(signup_params)
        user.role ||= :customer

        # Therapists start as pending until admin approves
        if user.therapist?
          user.approval_status = 'pending'
        else
          user.approval_status = 'approved'
        end

        if user.save
          # Generate JWT tokens (issued even for pending therapists; API blocks access)
          token = generate_jwt_token(user)
          refresh_token = generate_refresh_token(user)

          # Send welcome / pending email
          begin
            if user.therapist?
              TherapistMailer.approval_pending(user).deliver_later
              # Notify admin
              admin = User.find_by(role: :admin)
              # Simple admin notification via existing contact mailer or log
              Rails.logger.info "New therapist signup pending approval: #{user.email}"
            else
              AuthMailer.welcome(user).deliver_now
            end
          rescue => e
            Rails.logger.error "Signup email failed: #{e.message}"
          end

          render json: {
            success: true,
            message: user.therapist? ? 'Application submitted. Awaiting admin approval.' : 'User created successfully',
            data: {
              user: serialize_user(user),
              access_token: token,
              refresh_token: refresh_token,
              pending_approval: user.therapist? && user.approval_pending?
            }
          }, status: :created
        else
          render json: {
            success: false,
            message: 'Signup failed',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: login_params[:email])

        if user&.valid_password?(login_params[:password])
          # Generate JWT tokens
          token = generate_jwt_token(user)
          refresh_token = generate_refresh_token(user)

          render json: {
            success: true,
            message: 'Login successful',
            data: {
              user: serialize_user(user),
              access_token: token,
              refresh_token: refresh_token,
              pending_approval: user.therapist? && user.approval_pending?
            }
          }
        else
          render json: {
            success: false,
            message: 'Invalid email or password',
            errors: ['Invalid credentials']
          }, status: :unauthorized
        end
      end

      # DELETE /api/v1/auth/logout
      def logout
        render json: {
          success: true,
          message: 'Logged out successfully'
        }
      end

      # POST /api/v1/auth/refresh
      def refresh
        token = params[:refresh_token]
        unless token
          return render json: { success: false, message: 'Refresh token required' }, status: :unprocessable_entity
        end

        begin
          secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base
          payload = JWT.decode(token, secret, true, algorithms: ['HS256']).first

          unless payload['type'] == 'refresh'
            return render json: { success: false, message: 'Invalid token type' }, status: :unauthorized
          end

          user = User.find_by(id: payload['user_id'])
          unless user
            return render json: { success: false, message: 'User not found' }, status: :unauthorized
          end

          new_access_token = generate_jwt_token(user)
          new_refresh_token = generate_refresh_token(user)

          render json: {
            success: true,
            data: { access_token: new_access_token, refresh_token: new_refresh_token }
          }
        rescue JWT::DecodeError, JWT::ExpiredSignature
          render json: { success: false, message: 'Invalid or expired refresh token' }, status: :unauthorized
        end
      end

      # POST /api/v1/auth/password/reset
      def forgot_password
        user = User.find_by(email: params[:email]&.downcase&.strip)

        if user
          begin
            raw_token = user.send(:set_reset_password_token)
            frontend_url = ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')
            reset_url = "#{frontend_url}/reset-password?token=#{raw_token}"
            AuthMailer.reset_password(user, reset_url).deliver_now
          rescue => e
            Rails.logger.error "Password reset email failed: #{e.message}"
          end
        end

        # Always return success to prevent email enumeration
        render json: {
          success: true,
          message: 'If an account with that email exists, we have sent password reset instructions.'
        }
      end

      # POST /api/v1/auth/password/reset/confirm
      def reset_password
        user = User.reset_password_by_token(
          reset_password_token: params[:reset_token],
          password: params[:password],
          password_confirmation: params[:password_confirmation]
        )

        if user.errors.empty?
          render json: {
            success: true,
            message: 'Password has been reset successfully. You can now log in.'
          }
        else
          render json: {
            success: false,
            message: user.errors.full_messages.first || 'Invalid or expired reset token',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/auth/me
      def me
        user = current_user

        if user
          render json: {
            success: true,
            data: { user: serialize_user(user) }
          }
        else
          render json: {
            success: false,
            message: 'Not authenticated'
          }, status: :unauthorized
        end
      end

      # PATCH /api/v1/auth/profile
      def update_profile
        user = current_user

        unless user
          return render json: { success: false, message: 'Authentication required' }, status: :unauthorized
        end

        if user.update(profile_params)
          render json: {
            success: true,
            message: 'Profile updated successfully',
            data: { user: serialize_user(user) }
          }
        else
          render json: {
            success: false,
            message: 'Failed to update profile',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def serialize_user(user)
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          bio: user.bio,
          avatar_url: user.avatar_url,
          approval_status: user.approval_status,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      end

      def signup_params
        # Accept both formats: {user: {...}} or {...} directly
        if params[:user].present?
          params.require(:user).permit(:email, :password, :password_confirmation, :name, :phone, :role)
        else
          params.permit(:email, :password, :password_confirmation, :name, :phone, :role)
        end
      end

      def login_params
        # Accept both formats: {user: {...}} or {...} directly
        if params[:user].present?
          params.require(:user).permit(:email, :password)
        else
          params.permit(:email, :password)
        end
      end

      def profile_params
        params.permit(:name, :phone, :bio, :avatar_url)
      end

      def generate_jwt_token(user)
        payload = {
          user_id: user.id,
          email: user.email,
          role: user.role,
          type: 'access',
          exp: 24.hours.from_now.to_i
        }
        JWT.encode(payload, jwt_secret, 'HS256')
      end

      def generate_refresh_token(user)
        payload = {
          user_id: user.id,
          email: user.email,
          type: 'refresh',
          exp: 7.days.from_now.to_i
        }
        JWT.encode(payload, jwt_secret, 'HS256')
      end

      def jwt_secret
        ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base
      end
    end
  end
end
