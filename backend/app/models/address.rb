class Address < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :full_name, :phone, :address_line_1, :city, :state_province, :postal_code, :country, presence: true
  validates :phone, format: { with: /\A[+]?[\d\s\-()]+\z/ }
  validates :postal_code, format: { with: /\A[\w\s\-]+\z/ }

  # Callbacks
  before_save :ensure_only_one_default, if: :is_default?

  # Scopes
  scope :active, -> { where(deleted_at: nil) }
  scope :default_address, -> { where(is_default: true, deleted_at: nil) }
  scope :shipping_addresses, -> { where(is_shipping: true, deleted_at: nil) }
  scope :billing_addresses, -> { where(is_billing: true, deleted_at: nil) }

  # Methods
  def full_address
    [
      address_line_1,
      address_line_2,
      city,
      state_province,
      postal_code,
      country
    ].compact.join(', ')
  end

  def soft_delete
    update(deleted_at: Time.current, is_default: false)
  end

  def to_json_object
    {
      full_name: full_name,
      phone: phone,
      address_line_1: address_line_1,
      address_line_2: address_line_2,
      city: city,
      state_province: state_province,
      postal_code: postal_code,
      country: country
    }
  end

  private

  def ensure_only_one_default
    user.addresses.where.not(id: id).update_all(is_default: false)
  end
end
