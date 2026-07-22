class PurgeExpiredTokensJob < ApplicationJob
  queue_as :default

  def perform
    RefreshToken.purge_expired!
    JwtDenylist.where('exp < ?', Time.current).delete_all
  end
end
