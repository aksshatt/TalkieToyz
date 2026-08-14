class FestivalPromoEmailJob < ApplicationJob
  queue_as :mailers

  def perform
    festival = FestivalThemeService.today
    return unless festival

    # Send to users who have email promo notifications enabled
    User.where(role: 'customer').find_each do |user|
      prefs = user.notification_preferences
      next unless prefs['email'] && prefs['promotions']

      FestivalMailer.promo_email(user, festival).deliver_later
    end

    Rails.logger.info("FestivalPromoEmailJob: sent for #{festival['name']}")
  end
end
