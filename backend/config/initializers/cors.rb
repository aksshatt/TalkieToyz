Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Development origins
    if Rails.env.development? || Rails.env.test?
      origins 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:3000'
    else
      # Production origins - Update with your actual domains
      origins ENV.fetch('FRONTEND_URL', '').split(','),
              /https:\/\/.*\.talkietoys\.com/,
              'https://talkietoys.com',
              'https://www.talkietoys.com'
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end
