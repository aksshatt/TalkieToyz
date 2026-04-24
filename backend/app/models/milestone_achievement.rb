class MilestoneAchievement < ApplicationRecord
  belongs_to :user
  belongs_to :child_profile, optional: true
  belongs_to :milestone

  validates :achieved_at, presence: true
  validates :milestone_id, uniqueness: { scope: :child_profile_id, message: 'already achieved for this child' }, if: -> { child_profile_id.present? }

  after_create :award_loyalty_points

  private

  def award_loyalty_points
    LoyaltyPoint.award(
      user: user,
      source: 'milestone',
      points: 20,
      reference: self,
      description: "Milestone unlocked: #{milestone.title}"
    )
  end
end
