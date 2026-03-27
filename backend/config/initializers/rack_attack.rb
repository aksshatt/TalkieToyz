class Rack::Attack
  # Throttle login attempts by email param
  throttle('login/email', limit: 10, period: 1.minute) do |req|
    if req.path == '/api/v1/users/sign_in' && req.post?
      req.params['user']&.dig('email')&.downcase&.gsub(/\s+/, '')
    end
  end

  # Throttle login attempts by IP
  throttle('login/ip', limit: 20, period: 1.minute) do |req|
    req.ip if req.path == '/api/v1/users/sign_in' && req.post?
  end

  # Throttle signup by IP
  throttle('signup/ip', limit: 10, period: 1.hour) do |req|
    req.ip if req.path == '/api/v1/users' && req.post?
  end

  # Throttle password reset requests
  throttle('password_reset/email', limit: 5, period: 1.hour) do |req|
    if req.path.include?('password') && req.post?
      req.params.dig('user', 'email')&.downcase
    end
  end

  # Throttle general API requests per IP
  throttle('api/ip', limit: 300, period: 1.minute) do |req|
    req.ip if req.path.start_with?('/api/')
  end

  # Return 429 with JSON response
  self.throttled_responder = lambda do |env|
    [
      429,
      { 'Content-Type' => 'application/json' },
      [{ error: 'Too many requests. Please try again later.', status: 429 }.to_json]
    ]
  end
end
