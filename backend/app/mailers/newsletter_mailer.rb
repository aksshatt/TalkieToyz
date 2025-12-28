class NewsletterMailer < ApplicationMailer
  # Send confirmation email with subscription token
  def confirmation_email(subscription)
    @subscription = subscription
    @confirmation_url = "#{ENV['FRONTEND_URL']}/newsletter/confirm/#{@subscription.subscription_token}"

    mail(
      to: @subscription.email,
      subject: 'Please confirm your TalkieToys newsletter subscription'
    )
  end

  # Send welcome email after confirmation
  def welcome_email(subscription)
    @subscription = subscription
    @unsubscribe_url = "#{ENV['FRONTEND_URL']}/newsletter/unsubscribe/#{@subscription.subscription_token}"

    mail(
      to: @subscription.email,
      subject: 'Welcome to the TalkieToys Newsletter!'
    )
  end
end
