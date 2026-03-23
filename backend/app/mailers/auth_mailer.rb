class AuthMailer < ApplicationMailer
  def reset_password(user, reset_url)
    @user = user
    @reset_url = reset_url

    mail(
      to: @user.email,
      subject: 'Reset your TalkieToys password'
    )
  end

  def welcome(user)
    @user = user
    @shop_url = ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')

    mail(
      to: @user.email,
      subject: 'Welcome to TalkieToys!'
    )
  end
end
