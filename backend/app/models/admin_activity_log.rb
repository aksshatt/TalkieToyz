class AdminActivityLog < ApplicationRecord
  belongs_to :user

  validates :action, presence: true

  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_action, ->(action) { where(action: action) }
  scope :by_resource, ->(resource_type) { where(resource_type: resource_type) }

  # Common actions
  ACTIONS = %w[
    create update delete view
    bulk_update bulk_delete
    update_status export
    login logout
  ].freeze
end
