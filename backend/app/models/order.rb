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

  enum refund_status: {
    no_refund: 0,
    refund_pending: 1,
    refund_processing: 2,
    refund_completed: 3,
    refund_failed: 4
  }, _prefix: :refund

  # Associations
  belongs_to :user
  belongs_to :coupon, optional: true
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  has_one :shipment, dependent: :destroy

  # Validations
  validates :order_number, presence: true, uniqueness: true
  validates :subtotal, :total, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :tax, :shipping_cost, :discount, numericality: { greater_than_or_equal_to: 0 }
  validates :payment_method, presence: true, inclusion: { in: %w[razorpay cod] }

  # Callbacks
  before_validation :generate_order_number, if: -> { order_number.blank? }
  before_validation :calculate_total
  after_create :increment_coupon_usage
  after_create :send_order_confirmation_email
  after_update :send_status_update_email, if: :saved_change_to_status?
  after_update :auto_create_shipment, if: :should_auto_create_shipment?

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }

  # Class method to create from cart
  def self.create_from_cart(cart, payment_method:, shipping_address:, billing_address: nil, coupon: nil, clear_cart: true)
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

      # Only clear cart if explicitly requested (for COD orders)
      # For payment gateway orders, cart will be cleared after payment verification
      cart.clear if clear_cart

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

  # Refund Methods
  def can_refund?
    # Order must be paid and not already refunded
    payment_status == 'paid' && (refund_no_refund? || refund_refund_failed?) && !cancelled?
  end

  def initiate_refund(amount, reason = 'Customer request')
    unless can_refund?
      return { success: false, error: 'Order cannot be refunded' }
    end

    # Get payment ID from payment_details
    payment_id = payment_details&.dig('razorpay_payment_id')

    unless payment_id
      return { success: false, error: 'Payment ID not found' }
    end

    begin
      # Create refund via RazorpayService
      refund = RazorpayService.create_refund(payment_id, amount)

      if refund
        # Update order with refund details
        update(
          refund_status: :refund_processing,
          refund_details: (refund_details || {}).merge(
            razorpay_refund_id: refund.id,
            amount: amount,
            reason: reason,
            initiated_at: Time.current,
            status: refund.status
          )
        )

        { success: true, refund: refund }
      else
        update(refund_status: :refund_failed)
        { success: false, error: 'Failed to create refund' }
      end
    rescue => e
      Rails.logger.error("Refund error for order #{order_number}: #{e.message}")
      update(refund_status: :refund_failed)
      { success: false, error: e.message }
    end
  end

  # Shipment Methods
  def can_create_shipment?
    # Order must be paid (or COD) and in confirmed or processing status
    (payment_status == 'paid' || payment_method == 'cod') &&
    status.in?(['confirmed', 'processing']) &&
    !cancelled?
  end

  def create_shiprocket_shipment(courier_id = nil)
    unless can_create_shipment?
      return { success: false, error: 'Order is not ready for shipment' }
    end

    if shipment.present?
      return { success: false, error: 'Shipment already exists' }
    end

    begin
      # Create shipment via ShiprocketService
      shipment_data = ShiprocketService.create_shipment(self, courier_id)

      # Create shipment record
      new_shipment = create_shipment!(
        shiprocket_order_id: shipment_data[:shiprocket_order_id],
        shiprocket_shipment_id: shipment_data[:shiprocket_shipment_id],
        awb_code: shipment_data[:awb_code],
        courier_name: shipment_data[:courier_name],
        courier_id: shipment_data[:courier_id],
        tracking_url: shipment_data[:tracking_url],
        label_url: shipment_data[:label_url],
        status: 'Pickup Scheduled',
        shipment_details: shipment_data
      )

      # Update order tracking number
      update(tracking_number: shipment_data[:awb_code], status: :processing)

      { success: true, shipment: new_shipment }
    rescue => e
      Rails.logger.error("Shipment creation error for order #{order_number}: #{e.message}")
      { success: false, error: e.message }
    end
  end

  # Payment Retry Methods
  def can_retry_payment?
    payment_method == 'razorpay' && payment_status.in?(['awaiting_payment', 'failed']) && !cancelled?
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

  def should_auto_create_shipment?
    # Auto-create shipment when status changes to processing
    saved_change_to_status? && processing? && shipment.nil? && can_create_shipment?
  end

  def auto_create_shipment
    Rails.logger.info("Auto-creating shipment for order #{order_number}")
    result = create_shiprocket_shipment

    if result[:success]
      Rails.logger.info("Shipment created successfully for order #{order_number}")
    else
      Rails.logger.error("Failed to auto-create shipment for order #{order_number}: #{result[:error]}")
    end
  rescue => e
    Rails.logger.error("Auto-create shipment error for order #{order_number}: #{e.message}")
  end
end
