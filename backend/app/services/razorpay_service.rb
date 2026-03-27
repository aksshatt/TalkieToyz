class RazorpayService
  class << self
    # Create a Razorpay order
    def create_order(order)
      amount_in_paise = (order.total.to_f * 100).round.to_i
      razorpay_order = Razorpay::Order.create(
        'amount' => amount_in_paise,
        'currency' => 'INR',
        'receipt' => order.order_number
      )

      # Store Razorpay order ID in payment_intent_id
      order.update(payment_intent_id: razorpay_order.id)

      razorpay_order
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Order Creation Error: #{e.message}"
      nil
    end

    # Verify payment signature
    def verify_payment_signature(razorpay_order_id:, razorpay_payment_id:, razorpay_signature:)
      params_dict = {
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      }

      Razorpay::Utility.verify_payment_signature(params_dict)
      true
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Signature Verification Error: #{e.message}"
      false
    end

    # Fetch payment details
    def fetch_payment(payment_id)
      Razorpay::Payment.fetch(payment_id)
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Payment Fetch Error: #{e.message}"
      nil
    end

    # Initiate refund
    def create_refund(payment_id, amount)
      payment = Razorpay::Payment.fetch(payment_id)
      payment.refund(amount: (amount * 100).to_i) # Amount in paise
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Refund Error: #{e.message}"
      nil
    end

    # Capture payment (for authorized payments)
    def capture_payment(payment_id, amount)
      payment = Razorpay::Payment.fetch(payment_id)
      payment.capture(amount: (amount * 100).to_i) # Amount in paise
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Payment Capture Error: #{e.message}"
      nil
    end
  end
end
