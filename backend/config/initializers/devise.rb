# frozen_string_literal: true

Devise.setup do |config|
  # The secret key used by Devise. Devise uses this key to generate
  # random tokens. Changing this key will render invalid all existing
  # confirmation, reset password and unlock tokens in the database.
  config.secret_key = ENV['DEVISE_JWT_SECRET_KEY'] || 'temp_key_for_development'

  # ==> Mailer Configuration
  config.mailer_sender = 'noreply@talkietoys.com'

  # ==> ORM configuration
  require 'devise/orm/active_record'

  # ==> Configuration for :database_authenticatable
  config.stretches = Rails.env.test? ? 1 : 12

  # ==> Configuration for :validatable
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # ==> Configuration for :timeoutable
  config.timeout_in = 30.minutes

  # ==> Configuration for :lockable
  # config.lock_strategy = :failed_attempts
  # config.unlock_strategy = :both
  # config.maximum_attempts = 20
  # config.unlock_in = 1.hour
  # config.last_attempt_warning = true

  # ==> Configuration for :recoverable
  config.reset_password_within = 6.hours

  # ==> Configuration for :rememberable
  config.remember_for = 2.weeks
  config.extend_remember_period = false

  # ==> Navigation configuration
  config.sign_out_via = :delete

  # ==> Warden configuration
  config.warden do |manager|
    manager.failure_app = proc do
      [401, { 'Content-Type' => 'application/json' }, [{ error: 'Unauthorized' }.to_json]]
    end
  end
end
