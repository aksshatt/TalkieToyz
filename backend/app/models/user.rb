class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Enums
  enum role: { customer: 0, therapist: 1, admin: 2 }
  enum approval_status: { pending: 'pending', approved: 'approved', rejected: 'rejected' }, _prefix: :approval

  # Associations
  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :addresses, dependent: :destroy
  has_many :user_addresses, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :assessment_results, dependent: :destroy
  has_many :wishlists, dependent: :destroy
  has_many :child_profiles, dependent: :destroy
  has_many :success_stories, dependent: :destroy
  has_many :loyalty_points, dependent: :destroy
  has_many :milestone_achievements, dependent: :destroy
  # has_many :progress_logs, dependent: :destroy
  has_many :blog_posts, foreign_key: :author_id, dependent: :destroy

  # Therapist associations
  has_many :therapist_assignments, class_name: 'TherapistPatientAssignment', foreign_key: :therapist_id, dependent: :destroy
  has_many :assigned_patients, through: :therapist_assignments, source: :patient
  has_many :therapist_conversations, class_name: 'Conversation', foreign_key: :therapist_id, dependent: :destroy

  # Patient associations
  has_many :patient_assignments, class_name: 'TherapistPatientAssignment', foreign_key: :patient_id, dependent: :destroy
  has_many :assigned_therapists, through: :patient_assignments, source: :therapist
  has_many :patient_conversations, class_name: 'Conversation', foreign_key: :patient_id, dependent: :destroy

  has_many :sent_messages, class_name: 'Message', foreign_key: :sender_id, dependent: :destroy
  has_many :message_templates, foreign_key: :created_by_id, dependent: :destroy

  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :phone, format: { with: /\A[+]?[\d\s\-()]+\z/, allow_blank: true }
  validates :role, presence: true

  # Callbacks
  after_create :ensure_cart

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

  def ensure_cart
    Cart.create!(user: self) unless cart
  end
end
