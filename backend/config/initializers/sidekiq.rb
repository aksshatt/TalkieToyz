Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }

  config.on(:startup) do
    Sidekiq::Cron::Job.load_from_hash({
      'festival_promo_email' => {
        'cron'  => '0 8 * * *',  # 8am IST daily
        'class' => 'FestivalPromoEmailJob',
        'queue' => 'mailers'
      },
      'purge_expired_tokens' => {
        'cron'  => '0 2 * * *',
        'class' => 'PurgeExpiredTokensJob',
        'queue' => 'default'
      }
    })
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
end
