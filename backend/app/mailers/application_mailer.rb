class ApplicationMailer < ActionMailer::Base
  default from: ENV['DEFAULT_EMAIL_FROM'] || 'TalkieToys <noreply@talkietoyz.shop>'
  layout "mailer"
end
