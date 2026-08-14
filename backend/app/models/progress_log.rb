class ProgressLog < ApplicationRecord
  belongs_to :user
  belongs_to :milestone, optional: true
  belongs_to :product, optional: true

  CATEGORIES = %w[speech language motor social cognitive].freeze

  validates :child_name, presence: true
  validates :child_age_months, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :log_date, presence: true
  validates :category, presence: true, inclusion: { in: CATEGORIES }

  scope :active, -> { where(deleted_at: nil) }
  scope :recent, -> { order(log_date: :desc) }
  scope :for_child, ->(name) { where(child_name: name) }
  scope :by_category, ->(cat) { where(category: cat) }

  def soft_delete!
    update!(deleted_at: Time.current)
  end
end
