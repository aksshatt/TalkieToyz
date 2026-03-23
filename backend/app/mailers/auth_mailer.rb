class AuthMailer < ApplicationMailer
  def reset_password(user, reset_url)
    @user = user
    @reset_url = reset_url

    mail(
      to: @user.email,
      subject: 'Reset your TalkieToys password'
    )
  end
end
