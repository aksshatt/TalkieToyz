class HealthController < ApplicationController
  def index
    health_status = {
      status: 'ok',
      timestamp: Time.current.iso8601,
      services: {
        database: check_database,
        redis: check_redis
      }
    }

    status_code = health_status[:services].values.all? { |s| s[:status] == 'ok' } ? :ok : :service_unavailable

    render json: health_status, status: status_code
  end

  private

  def check_database
    ActiveRecord::Base.connection.execute('SELECT 1')
    { status: 'ok' }
  rescue StandardError => e
    { status: 'error', message: e.message }
  end

  def check_redis
    $redis.ping
    { status: 'ok' }
  rescue StandardError => e
    { status: 'error', message: e.message }
  end
end
