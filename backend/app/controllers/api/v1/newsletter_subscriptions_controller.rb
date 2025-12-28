module Api
  module V1
    class NewsletterSubscriptionsController < BaseController
      # POST /api/v1/newsletter_subscriptions
      def create
        @subscription = NewsletterSubscription.find_or_initialize_by(email: params[:email])

        if @subscription.persisted? && @subscription.confirmed?
          return render_error('Email is already subscribed', nil, status: :unprocessable_entity)
        end

        if @subscription.persisted? && @subscription.unsubscribed?
          # Resubscribe
          if @subscription.resubscribe!
            NewsletterMailer.confirmation_email(@subscription).deliver_later
            return render_success(nil, 'Please check your email to confirm your subscription')
          else
            return render_error('Failed to resubscribe', @subscription.errors.full_messages)
          end
        end

        @subscription.name = params[:name] if params[:name].present?
        @subscription.preferences = params[:preferences] || {}

        if @subscription.save
          # Send confirmation email
          NewsletterMailer.confirmation_email(@subscription).deliver_later

          render_success(
            nil,
            'Please check your email to confirm your subscription',
            status: :created
          )
        else
          render_error('Failed to subscribe', @subscription.errors.full_messages)
        end
      end

      # GET /api/v1/newsletter_subscriptions/confirm/:token
      def confirm
        @subscription = NewsletterSubscription.find_by(subscription_token: params[:token])

        unless @subscription
          return render_error('Invalid confirmation token', nil, status: :not_found)
        end

        if @subscription.confirmed?
          return render_success(nil, 'Email is already confirmed')
        end

        if @subscription.confirm!
          # Send welcome email
          NewsletterMailer.welcome_email(@subscription).deliver_later

          render_success(nil, 'Subscription confirmed successfully! Welcome to our newsletter.')
        else
          render_error('Failed to confirm subscription', @subscription.errors.full_messages)
        end
      end

      # DELETE /api/v1/newsletter_subscriptions/unsubscribe/:token
      def unsubscribe
        @subscription = NewsletterSubscription.find_by(subscription_token: params[:token])

        unless @subscription
          return render_error('Invalid unsubscribe token', nil, status: :not_found)
        end

        if @subscription.unsubscribed?
          return render_success(nil, 'You are already unsubscribed')
        end

        if @subscription.unsubscribe!
          render_success(nil, 'You have been unsubscribed successfully. Sorry to see you go!')
        else
          render_error('Failed to unsubscribe', @subscription.errors.full_messages)
        end
      end
    end
  end
end
