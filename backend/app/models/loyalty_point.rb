class LoyaltyPoint < ApplicationRecord
  belongs_to :user

  SOURCES = %w[purchase review assessment referral redemption bonus].freeze
  POINTS_PER_SOURCE = {
    'purchase' => 1,    # 1 point per rupee spent (calculated at time of award)
    'review' => 50,
    'assessment' => 30,
    'referral' => 100,
    'bonus' => 0        # arbitrary
  }.freeze
  REDEMPTION_RATE = 100  # 100 points = ₹10 discount

  validates :points, presence: true, numericality: { other_than: 0 }
  validates :source, presence: true, inclusion: { in: SOURCES }

  scope :credits, -> { where('points > 0') }
  scope :debits, -> { where('points < 0') }

  after_create :update_user_total

  def self.balance_for(user)
    where(user: user).sum(:points)
  end

  def self.award(user:, source:, points: nil, reference: nil, description: nil)
    pts = points || POINTS_PER_SOURCE[source] || 0
    return if pts == 0

    ref_type = reference&.class&.name
    ref_id = reference&.id

    create!(
      user: user,
      points: pts,
      source: source,
      reference_type: ref_type,
      reference_id: ref_id,
      description: description || "Earned #{pts} points for #{source}"
    )
  end

  def self.redeem(user:, points:)
    raise ArgumentError, 'Insufficient points' if balance_for(user) < points

    create!(
      user: user,
      points: -points,
      source: 'redemption',
      description: "Redeemed #{points} points for discount"
    )
  end

  private

  def update_user_total
    user.increment!(:loyalty_points_total, points)
  end
end
