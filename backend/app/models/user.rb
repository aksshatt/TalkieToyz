class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Enums
  enum role: { customer: 0, therapist: 1, admin: 2 }

  # Associations
  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :addresses, dependent: :destroy
  has_many :user_addresses, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :assessment_results, dependent: :destroy
  has_many :progress_logs, dependent: :destroy
  has_many :blog_posts, foreign_key: :author_id, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :phone, format: { with: /\A[+]?[\d\s\-()]+\z/, allow_blank: true }
  validates :role, presence: true

  # Callbacks
  after_create :create_cart

  # Scopes
  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  # Soft delete
  def soft_delete
    update(deleted_at: Time.current)
  end

  def restore
    update(deleted_at: nil)
  end

  def deleted?
    deleted_at.present?
  end

  private

  def create_cart
    Cart.create(user: self)
  end
end
