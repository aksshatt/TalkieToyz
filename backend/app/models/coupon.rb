class Coupon < ApplicationRecord
  # Associations
  has_many :orders

  # Validations
  validates :code, presence: true, uniqueness: { case_sensitive: false }
  validates :discount_type, presence: true, inclusion: { in: %w[percentage fixed] }
  validates :discount_value, presence: true, numericality: { greater_than: 0 }
  validates :min_order_amount, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :max_discount_amount, numericality: { greater_than: 0 }, allow_nil: true
  validates :usage_limit, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :usage_count, numericality: { greater_than_or_equal_to: 0 }
  validate :valid_date_range

  # Scopes
  scope :active, -> { where(active: true) }
  scope :valid_now, -> {
    where('(valid_from IS NULL OR valid_from <= ?) AND (valid_until IS NULL OR valid_until >= ?)',
          Time.current, Time.current)
  }
  scope :available, -> {
    active.valid_now.where('usage_limit = 0 OR usage_count < usage_limit')
  }

  # Callbacks
  before_validation :upcase_code

  # Methods
  def valid_for_order?(order_amount)
    return false unless active?
    return false unless valid_dates?
    return false unless usage_available?
    return false if min_order_amount.present? && order_amount < min_order_amount
    true
  end

  def calculate_discount(order_amount)
    return 0 unless valid_for_order?(order_amount)

    discount = if discount_type == 'percentage'
                 order_amount * (discount_value / 100.0)
               else
                 discount_value
               end

    # Apply max discount cap if set
    discount = [discount, max_discount_amount].min if max_discount_amount.present?

    # Ensure discount doesn't exceed order amount
    [discount, order_amount].min
  end

  def increment_usage!
    increment!(:usage_count)
  end

  def can_be_used?
    active? && valid_dates? && usage_available?
  end

  private

  def upcase_code
    self.code = code&.upcase
  end

  def valid_date_range
    if valid_from.present? && valid_until.present? && valid_from > valid_until
      errors.add(:valid_until, 'must be after valid_from')
    end
  end

  def valid_dates?
    (valid_from.nil? || valid_from <= Time.current) &&
      (valid_until.nil? || valid_until >= Time.current)
  end

  def usage_available?
    usage_limit.zero? || usage_count < usage_limit
  end
end
