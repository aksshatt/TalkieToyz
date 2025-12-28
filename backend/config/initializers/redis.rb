require 'redis'

# Configure Redis connection
$redis = Redis.new(
  url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1'),
  timeout: 1,
  reconnect_attempts: 3
)
