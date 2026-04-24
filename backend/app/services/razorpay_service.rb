require 'net/http'
require 'json'

class RazorpayService
  class << self
    # Create a Razorpay order
    def create_order(order)
      amount_in_paise = (order.total.to_f * 100).round.to_i
      Rails.logger.info "Razorpay creating order: amount=#{amount_in_paise}, receipt=#{order.order_number}"

      uri = URI('https://api.razorpay.com/v1/orders')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(uri)
      request.basic_auth(ENV['RAZORPAY_KEY_ID'], ENV['RAZORPAY_KEY_SECRET'])
      request['Content-Type'] = 'application/json'
      request.body = {
        amount: amount_in_paise,
        currency: 'INR',
        receipt: order.order_number
      }.to_json

      response = http.request(request)
      body = JSON.parse(response.body)

      Rails.logger.info "Razorpay API response: #{response.code} #{body.inspect}"

      unless response.code.to_i == 200
        Rails.logger.error "Razorpay Order Creation Error: #{body['error']&.dig('description') || body.inspect}"
        return nil
      end

      order.update(payment_intent_id: body['id'])

      OpenStruct.new(id: body['id'], amount: body['amount'])
    rescue => e
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
      payment.refund(amount: (amount.to_f * 100).round.to_i) # Amount in paise
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Refund Error: #{e.message}"
      nil
    end

    # Capture payment (for authorized payments)
    def capture_payment(payment_id, amount)
      payment = Razorpay::Payment.fetch(payment_id)
      payment.capture(amount: (amount.to_f * 100).round.to_i) # Amount in paise
    rescue Razorpay::Error => e
      Rails.logger.error "Razorpay Payment Capture Error: #{e.message}"
      nil
    end
  end
end
