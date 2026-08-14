class FestivalMailer < ApplicationMailer
  def promo_email(user, festival)
    @user = user
    @festival = festival
    @shop_url = ENV.fetch('FRONTEND_URL', 'https://talkietoyz.shop')

    mail(
      to: user.email,
      subject: festival['email_subject']
    )
  end
end
