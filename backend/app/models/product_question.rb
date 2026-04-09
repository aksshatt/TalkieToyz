class ProductQuestion < ApplicationRecord
  belongs_to :product
  belongs_to :user
  belongs_to :answered_by, class_name: 'User', optional: true

  validates :question, presence: true, length: { minimum: 10, maximum: 1000 }
  validates :answer, length: { maximum: 2000 }, allow_blank: true

  scope :approved, -> { where(approved: true) }
  scope :answered, -> { where.not(answer: nil).where.not(answer: '') }
  scope :unanswered, -> { where(answer: nil).or(where(answer: '')) }

  def answered?
    answer.present?
  end
end
