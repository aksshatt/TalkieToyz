module AuthHelpers
  def auth_headers(user)
    token = JWT.encode(
      {
        user_id: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
        exp: 24.hours.from_now.to_i
      },
      ENV.fetch('DEVISE_JWT_SECRET_KEY', Rails.application.credentials.secret_key_base),
      'HS256'
    )
    { 'Authorization' => "Bearer #{token}", 'Content-Type' => 'application/json' }
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
  config.include AuthHelpers, type: :service
end
