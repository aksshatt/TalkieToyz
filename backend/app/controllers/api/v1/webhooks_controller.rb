module Api
  module V1
    class WebhooksController < ActionController::API
      # Skip CSRF token verification for webhooks
      skip_before_action :verify_authenticity_token, raise: false

      # Razorpay Webhook Handler
      def razorpay
        # Verify webhook signature
        unless verify_razorpay_signature(request.body.read, request.headers['X-Razorpay-Signature'])
          Rails.logger.error("Razorpay webhook signature verification failed")
          return render json: { error: 'Invalid signature' }, status: :unauthorized
        end

        payload = JSON.parse(request.body.read)
        event = payload['event']

        Rails.logger.info("Razorpay webhook received: #{event}")

        case event
        when 'payment.authorized'
          handle_payment_authorized(payload)
        when 'payment.captured'
          handle_payment_captured(payload)
        when 'payment.failed'
          handle_payment_failed(payload)
        when 'refund.created'
          handle_refund_created(payload)
        when 'refund.processed'
          handle_refund_processed(payload)
        else
          Rails.logger.info("Unhandled Razorpay event: #{event}")
        end

        render json: { status: 'ok' }, status: :ok
      rescue => e
        Rails.logger.error("Razorpay webhook error: #{e.message}")
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Shiprocket Webhook Handler
      def shiprocket
        payload = JSON.parse(request.body.read)

        Rails.logger.info("Shiprocket webhook received: #{payload.inspect}")

        awb_code = payload['awb']
        status = payload['current_status']

        return render json: { error: 'Missing AWB code' }, status: :bad_request unless awb_code

        shipment = Shipment.find_by(awb_code: awb_code)

        unless shipment
          Rails.logger.warn("Shipment not found for AWB: #{awb_code}")
          return render json: { error: 'Shipment not found' }, status: :not_found
        end

        # Update shipment status
        shipment.update(
          status: status,
          delivered_date: payload['delivered_date'],
          shipment_details: shipment.shipment_details.merge(webhook_data: payload)
        )

        # Sync order status
        shipment.sync_order_status

        # Send appropriate email notifications
        case status
        when 'Shipped', 'In Transit'
          OrderMailer.order_shipped(shipment.order).deliver_later unless shipment.order.shipped_at
        when 'Delivered'
          OrderMailer.order_delivered(shipment.order).deliver_later unless shipment.order.delivered_at
        when 'RTO Initiated', 'RTO Delivered', 'Canceled'
          # Handle RTO/cancellation
          OrderMailer.order_cancelled(shipment.order).deliver_later if shipment.order.status != 'cancelled'
        end

        render json: { status: 'ok' }, status: :ok
      rescue => e
        Rails.logger.error("Shiprocket webhook error: #{e.message}")
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def verify_razorpay_signature(body, signature)
        return false unless signature

        secret = ENV.fetch('RAZORPAY_WEBHOOK_SECRET', '')
        return false if secret.blank?

        expected_signature = OpenSSL::HMAC.hexdigest(
          OpenSSL::Digest.new('sha256'),
          secret,
          body
        )

        Rack::Utils.secure_compare(expected_signature, signature)
      end

      def handle_payment_authorized(payload)
        payment_id = payload.dig('payload', 'payment', 'entity', 'id')
        order_id_from_razorpay = payload.dig('payload', 'payment', 'entity', 'order_id')

        order = Order.find_by(payment_intent_id: order_id_from_razorpay)
        return unless order

        # Update order with payment details
        order.update(
          payment_details: order.payment_details.merge(
            razorpay_payment_id: payment_id,
            authorized_at: Time.current,
            webhook_payload: payload
          )
        )

        Rails.logger.info("Payment authorized for order #{order.order_number}")
      end

      def handle_payment_captured(payload)
        payment_id = payload.dig('payload', 'payment', 'entity', 'id')
        order_id_from_razorpay = payload.dig('payload', 'payment', 'entity', 'order_id')
        amount = payload.dig('payload', 'payment', 'entity', 'amount')

        order = Order.find_by(payment_intent_id: order_id_from_razorpay)
        return unless order

        # Mark payment as successful
        order.update(
          payment_details: order.payment_details.merge(
            razorpay_payment_id: payment_id,
            captured_at: Time.current,
            captured_amount: amount,
            webhook_payload: payload
          )
        )

        order.payment_successful!

        Rails.logger.info("Payment captured for order #{order.order_number}")
      end

      def handle_payment_failed(payload)
        order_id_from_razorpay = payload.dig('payload', 'payment', 'entity', 'order_id')
        error_description = payload.dig('payload', 'payment', 'entity', 'error_description')

        order = Order.find_by(payment_intent_id: order_id_from_razorpay)
        return unless order

        order.update(
          payment_details: order.payment_details.merge(
            failed_at: Time.current,
            failure_reason: error_description,
            webhook_payload: payload
          )
        )

        order.payment_failed!

        Rails.logger.info("Payment failed for order #{order.order_number}: #{error_description}")
      end

      def handle_refund_created(payload)
        payment_id = payload.dig('payload', 'refund', 'entity', 'payment_id')
        refund_id = payload.dig('payload', 'refund', 'entity', 'id')

        # Find order by payment_id stored in payment_details
        order = Order.where("payment_details->>'razorpay_payment_id' = ?", payment_id).first
        return unless order

        order.update(
          refund_details: order.refund_details.merge(
            razorpay_refund_id: refund_id,
            refund_created_at: Time.current,
            webhook_payload: payload
          ),
          refund_status: :refund_processing
        )

        Rails.logger.info("Refund created for order #{order.order_number}")
      end

      def handle_refund_processed(payload)
        payment_id = payload.dig('payload', 'refund', 'entity', 'payment_id')
        refund_amount = payload.dig('payload', 'refund', 'entity', 'amount')

        order = Order.where("payment_details->>'razorpay_payment_id' = ?", payment_id).first
        return unless order

        order.update(
          refund_details: order.refund_details.merge(
            refund_processed_at: Time.current,
            webhook_payload: payload
          ),
          refund_status: :refund_completed,
          refund_amount: refund_amount / 100.0, # Convert from paise to rupees
          refunded_at: Time.current
        )

        # Send refund confirmation email
        OrderMailer.refund_processed(order).deliver_later

        Rails.logger.info("Refund processed for order #{order.order_number}")
      end
    end
  end
end
