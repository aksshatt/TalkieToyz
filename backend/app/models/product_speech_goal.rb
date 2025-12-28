class ProductSpeechGoal < ApplicationRecord
  belongs_to :product
  belongs_to :speech_goal

  validates :product_id, uniqueness: { scope: :speech_goal_id }
end
