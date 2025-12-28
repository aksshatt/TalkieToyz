class Order < ApplicationRecord
  # Enums
  enum status: {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: 5,
    refunded: 6
  }

  # Associations
  belongs_to :user
  belongs_to :coupon, optional: true
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items

  # Validations
  validates :order_number, presence: true, uniqueness: true
  validates :subtotal, :total, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :tax, :shipping_cost, :discount, numericality: { greater_than_or_equal_to: 0 }
  validates :payment_method, presence: true, inclusion: { in: %w[razorpay cod] }

  # Callbacks
  before_validation :generate_order_number, if: -> { order_number.blank? }
  before_save :calculate_total
  after_create :increment_coupon_usage
  after_create :send_order_confirmation_email
  after_update :send_status_update_email, if: :saved_change_to_status?

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }

  # Class method to create from cart
  def self.create_from_cart(cart, payment_method:, shipping_address:, billing_address: nil, coupon: nil)
    raise 'Cart is empty' if cart.empty?

    Order.transaction do
      order = new(
        user: cart.user,
        coupon: coupon,
        payment_method: payment_method,
        shipping_address: shipping_address,
        billing_address: billing_address || shipping_address,
        payment_status: payment_method == 'cod' ? 'pending' : 'awaiting_payment'
      )

      # Calculate amounts
      order.subtotal = cart.subtotal
      order.tax = cart.tax_amount
      order.shipping_cost = 0 # Could be calculated based on shipping method
      order.discount = coupon&.calculate_discount(order.subtotal) || 0

      # Create order items from cart items
      cart.cart_items.includes(:product, :product_variant).each do |cart_item|
        order.order_items.build(
          product: cart_item.product,
          product_variant: cart_item.product_variant,
          quantity: cart_item.quantity,
          unit_price: cart_item.item_price
        )
      end

      order.save!
      cart.clear
      order
    end
  end

  # Methods
  def mark_as_confirmed
    update(status: :confirmed)
  end

  def mark_as_processing
    update(status: :processing)
  end

  def mark_as_shipped(tracking_number = nil)
    update(status: :shipped, shipped_at: Time.current, tracking_number: tracking_number)
  end

  def mark_as_delivered
    update(status: :delivered, delivered_at: Time.current)
  end

  def mark_as_cancelled
    return false unless can_be_cancelled?
    update(status: :cancelled)
  end

  def can_be_cancelled?
    pending? || confirmed?
  end

  def payment_successful!
    update(payment_status: 'paid', status: :confirmed)
    # Send confirmation email for Razorpay payments
    OrderMailer.order_confirmation(id).deliver_later(queue: 'mailers') if payment_method == 'razorpay'
  end

  def payment_failed!
    update(payment_status: 'failed')
  end

  private

  def generate_order_number
    self.order_number = "ORD-#{Time.current.strftime('%Y%m%d')}-#{SecureRandom.alphanumeric(8).upcase}"
  end

  def calculate_total
    self.total = subtotal + tax + shipping_cost - discount
  end

  def increment_coupon_usage
    coupon&.increment_usage!
  end

  def send_order_confirmation_email
    # Only send confirmation for COD orders or paid Razorpay orders
    if payment_method == 'cod' || (payment_method == 'razorpay' && payment_status == 'paid')
      OrderMailer.order_confirmation(id).deliver_later(queue: 'mailers')
    end
  end

  def send_status_update_email
    case status.to_sym
    when :shipped
      OrderMailer.order_shipped(id).deliver_later(queue: 'mailers')
    when :delivered
      OrderMailer.order_delivered(id).deliver_later(queue: 'mailers')
    when :cancelled
      OrderMailer.order_cancelled(id).deliver_later(queue: 'mailers')
    end
  end
end
