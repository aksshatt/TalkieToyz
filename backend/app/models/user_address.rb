class UserAddress < ApplicationRecord
  belongs_to :user

  # Validations
  validates :name, :phone, :address_line_1, :city, :state, :postal_code, :country, presence: true
  validates :postal_code, format: { with: /\A\d{6}\z/, message: "must be a 6-digit Indian PIN code" }
  validates :phone, format: { with: /\A[6-9]\d{9}\z/, message: "must be a valid 10-digit Indian mobile number" }

  # Callbacks
  before_save :ensure_only_one_default, if: :is_default?

  # Scopes
  scope :default_address, -> { where(is_default: true).first }

  # Convert to hash format used in orders
  def to_order_format
    {
      'name' => name,
      'phone' => phone,
      'address_line_1' => address_line_1,
      'address_line_2' => address_line_2,
      'city' => city,
      'state' => state,
      'postal_code' => postal_code,
      'country' => country
    }
  end

  private

  def ensure_only_one_default
    # If setting this address as default, unset all other default addresses for this user
    UserAddress.where(user_id: user_id, is_default: true)
               .where.not(id: id)
               .update_all(is_default: false)
  end
end
