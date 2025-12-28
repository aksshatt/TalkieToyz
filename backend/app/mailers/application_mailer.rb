class ApplicationMailer < ActionMailer::Base
  default from: ENV['DEFAULT_EMAIL_FROM'] || 'TalkieToys <noreply@talkietoys.com>'
  layout "mailer"
end
