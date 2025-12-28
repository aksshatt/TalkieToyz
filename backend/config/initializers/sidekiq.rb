Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }

  # Scheduled jobs configuration
  config.on(:startup) do
    # Load scheduled jobs if using sidekiq-scheduler
    # Sidekiq.schedule = YAML.load_file(Rails.root.join('config/schedule.yml'))
    # SidekiqScheduler::Scheduler.instance.reload_schedule!
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
end
