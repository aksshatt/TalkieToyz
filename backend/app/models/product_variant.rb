class ProductVariant < ApplicationRecord
  belongs_to :product

  # Validations
  validates :name, presence: true
  validates :sku, presence: true, uniqueness: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :stock_quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Scopes
  scope :active, -> { where(active: true, deleted_at: nil) }
  scope :in_stock, -> { where('stock_quantity > ?', 0) }

  # Methods
  def in_stock?
    stock_quantity > 0
  end

  def soft_delete
    update(deleted_at: Time.current, active: false)
  end
end
