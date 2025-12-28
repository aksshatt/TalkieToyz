module Api
  module V1
    class AuthController < BaseController
      # POST /api/v1/auth/signup
      def signup
        user = User.new(signup_params)
        user.role ||= :customer

        if user.save
          # Generate JWT tokens
          token = generate_jwt_token(user)
          refresh_token = generate_refresh_token(user)

          render json: {
            success: true,
            message: 'User created successfully',
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone
              },
              access_token: token,
              refresh_token: refresh_token
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
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone
              },
              access_token: token,
              refresh_token: refresh_token
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

      # GET /api/v1/auth/me
      def me
        # For development, return first user
        user = User.first

        if user
          render json: {
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone
              }
            }
          }
        else
          render json: {
            success: false,
            message: 'Not authenticated'
          }, status: :unauthorized
        end
      end

      private

      def signup_params
        # Accept both formats: {user: {...}} or {...} directly
        if params[:user].present?
          params.require(:user).permit(:email, :password, :password_confirmation, :name, :phone)
        else
          params.permit(:email, :password, :password_confirmation, :name, :phone)
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

      def generate_jwt_token(user)
        payload = {
          user_id: user.id,
          email: user.email,
          role: user.role,
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
