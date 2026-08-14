class PaymentService
  Result = Struct.new(:success, :data, :error, keyword_init: true) do
    def success? = success
  end

  def self.create_razorpay_order(order)
    unless order.payment_method == 'razorpay'
      return Result.new(success: false, error: 'Order does not use Razorpay')
    end

    razorpay_order = RazorpayService.create_order(order)

    if razorpay_order
      Result.new(success: true, data: {
        razorpay_order_id: razorpay_order.id,
        razorpay_key_id: ENV['RAZORPAY_KEY_ID'],
        amount: razorpay_order.amount
      })
    else
      Rails.logger.error("PaymentService: Razorpay order creation failed. KEY_ID present: #{ENV['RAZORPAY_KEY_ID'].present?}, Order: #{order.id}")
      Result.new(success: false, error: 'Failed to create Razorpay order')
    end
  end

  def self.verify_payment(order, razorpay_order_id:, razorpay_payment_id:, razorpay_signature:)
    # Guard: order_id must match what we issued — prevents cross-order signature replay
    if order.payment_intent_id.blank? || order.payment_intent_id != razorpay_order_id
      Rails.logger.warn("PaymentService: order_id mismatch for order #{order.id}")
      order.payment_failed!
      return Result.new(success: false, error: 'Payment verification failed')
    end

    unless RazorpayService.verify_payment_signature(
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature
    )
      order.payment_failed!
      return Result.new(success: false, error: 'Payment verification failed')
    end

    # Amount check — defense-in-depth against tampered order records
    payment = RazorpayService.fetch_payment(razorpay_payment_id)
    expected_paise = (order.total.to_f * 100).round.to_i
    actual_paise   = payment&.amount.to_i

    if payment.nil? || actual_paise != expected_paise
      Rails.logger.warn("PaymentService: amount mismatch order=#{order.id} expected=#{expected_paise} got=#{actual_paise}")
      order.payment_failed!
      return Result.new(success: false, error: 'Payment amount mismatch')
    end

    order.update(
      payment_details: {
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      }
    )
    order.payment_successful!

    Result.new(success: true, data: order)
  end

  def self.retry_payment(order)
    unless order.payment_method == 'razorpay'
      return Result.new(success: false, error: 'Payment retry is only available for Razorpay orders')
    end

    unless order.can_retry_payment?
      return Result.new(success: false, error: 'Payment cannot be retried for this order')
    end

    razorpay_order = RazorpayService.create_order(order)

    if razorpay_order
      Result.new(success: true, data: {
        razorpay_order_id: razorpay_order.id,
        razorpay_key_id: ENV['RAZORPAY_KEY_ID'],
        amount: razorpay_order.amount
      })
    else
      Result.new(success: false, error: 'Failed to initiate payment retry')
    end
  end
end
