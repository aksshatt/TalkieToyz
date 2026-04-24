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
  # Use after_commit so a rolled-back order never enqueues a confirmation email.
  after_commit :send_order_confirmation_email, on: :create
  after_update :send_status_update_email, if: :saved_change_to_status?
  after_update :auto_create_shipment, if: :should_auto_create_shipment?

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_status, ->(status) { where(status: status) }

  # Class method to create from cart
  def self.create_from_cart(cart, payment_method:, shipping_address:, billing_address: nil, coupon: nil, clear_cart: true, gift_wrap: false, gift_message: nil, shipping_cost: 0, selected_courier_id: nil)
    raise 'Cart is empty' if cart.empty?

    Order.transaction do
      order = new(
        user: cart.user,
        coupon: coupon,
        payment_method: payment_method,
        shipping_address: shipping_address,
        billing_address: billing_address || shipping_address,
        payment_status: payment_method == 'cod' ? 'pending' : 'awaiting_payment',
        gift_wrap: gift_wrap,
        gift_message: gift_message
      )

      # Calculate amounts
      order.subtotal = cart.subtotal
      order.tax = cart.tax_amount
      order.shipping_cost = shipping_cost.to_f
      order.discount = coupon&.calculate_discount(order.subtotal) || 0
      order.selected_courier_id = selected_courier_id if order.respond_to?(:selected_courier_id=) && selected_courier_id.present?

      # Aggregate weight & max dimensions from cart products (if set on product level)
      products = cart.cart_items.includes(:product).map(&:product).compact
      product_weights = products.map.with_index { |p, i|
        qty = cart.cart_items[i].quantity
        (p.respond_to?(:weight_kg) && p.weight_kg ? p.weight_kg.to_f : 0) * qty
      }
      total_weight = product_weights.sum
      if total_weight > 0
        order.weight_kg = total_weight
      end
      if products.any? { |p| p.respond_to?(:dimensions_cm) && p.dimensions_cm.present? }
        max_dims = { 'length' => 0, 'breadth' => 0, 'height' => 0 }
        products.each do |p|
          next unless p.respond_to?(:dimensions_cm) && p.dimensions_cm.present?
          d = p.dimensions_cm
          max_dims['length']  = [max_dims['length'],  d['length'].to_f].max
          max_dims['breadth'] = [max_dims['breadth'], d['breadth'].to_f].max
          max_dims['height']  = [max_dims['height'],  d['height'].to_f].max
        end
        order.dimensions_cm = max_dims if max_dims.values.any?(&:positive?)
      end

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

      # Decrement stock for each ordered item (pessimistic lock prevents overselling)
      order.order_items.each do |item|
        if item.product_variant_id
          item.product_variant.with_lock do
            item.product_variant.decrement!(:stock_quantity, item.quantity)
          end
        else
          item.product.with_lock do
            item.product.decrement!(:stock_quantity, item.quantity)
          end
        end
      end

      # Only clear cart if explicitly requested (for COD orders)
      # For payment gateway orders, cart will be cleared after payment verification
      cart.clear if clear_cart

      # Send low-stock alert email if any products are now below threshold
      threshold = ENV.fetch('LOW_STOCK_THRESHOLD', 5).to_i
      low_products = order.order_items.map { |item|
        item.product_variant_id ? item.product_variant.product : item.product
      }.uniq.select { |p| p.stock_quantity <= threshold }

      if low_products.any?
        begin
          InventoryMailer.low_stock_alert(low_products).deliver_later
        rescue => e
          Rails.logger.error "Inventory alert email failed: #{e.message}"
        end
      end

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
    transaction do
      update!(status: :cancelled)
      # Restore stock for cancelled orders
      order_items.each do |item|
        if item.product_variant_id
          item.product_variant.increment!(:stock_quantity, item.quantity)
        else
          item.product.increment!(:stock_quantity, item.quantity)
        end
      end
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
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
    # Idempotent: if already marked failed + cancelled we've already restored stock.
    return if payment_status == 'failed' && cancelled?

    transaction do
      already_cancelled = cancelled?
      update(payment_status: 'failed', status: :cancelled)
      # Stock was decremented at order creation; restore it so inventory isn't leaked
      # when a Razorpay payment never completes. Skip if order was already cancelled
      # (stock was restored via mark_as_cancelled) to avoid double-credit.
      next if already_cancelled

      order_items.each do |item|
        if item.product_variant_id
          item.product_variant.with_lock { item.product_variant.increment!(:stock_quantity, item.quantity) }
        else
          item.product.with_lock { item.product.increment!(:stock_quantity, item.quantity) }
        end
      end
    end
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
    self.with_lock do
      reload
      unless can_create_shipment?
        return { success: false, error: 'Order is not ready for shipment' }
      end

      if shipment.present?
        return { success: false, error: 'Shipment already exists' }
      end
    end

    # Pre-check pickup location — avoid Shiprocket "Wrong Pickup location" after order-create
    unless ShiprocketService.verify_pickup_location
      return { success: false, error: "Pickup location '#{ENV.fetch('SHIPROCKET_PICKUP_LOCATION', 'Primary')}' not found in Shiprocket. Add it under Settings → Pickup Addresses." }
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
    # Clamp at 0 so an over-sized coupon/discount can never produce a negative
    # order total (which would cascade into negative Razorpay amounts).
    raw = subtotal.to_f + tax.to_f + shipping_cost.to_f - discount.to_f
    self.total = raw.negative? ? 0 : raw
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
    prior_status = status_before_last_save
    result = create_shiprocket_shipment

    if result[:success]
      Rails.logger.info("Shipment created successfully for order #{order_number}")
    else
      Rails.logger.error("Failed to auto-create shipment for order #{order_number}: #{result[:error]}")
      # Revert to prior status so order isn't stuck in processing without shipment
      if prior_status.present? && prior_status != status
        update_columns(status: Order.statuses[prior_status])
      end
    end
  rescue => e
    Rails.logger.error("Auto-create shipment error for order #{order_number}: #{e.message}")
  end
end
