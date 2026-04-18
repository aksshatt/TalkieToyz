class MessageTemplate < ApplicationRecord
  belongs_to :created_by, class_name: 'User'

  CATEGORIES = %w[greeting progress reminder exercise assessment other].freeze

  validates :title,   presence: true
  validates :content, presence: true
  validates :category, inclusion: { in: CATEGORIES, allow_blank: true }

  scope :accessible_to, ->(user) {
    where(created_by: user).or(where(shared: true))
  }
  scope :by_category, ->(cat) { where(category: cat) }
end
