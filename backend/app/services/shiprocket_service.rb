class ShiprocketService
  class << self
    # Authenticate and get token
    def authenticate
      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/auth/login",
        body: {
          email: SHIPROCKET_CONFIG[:email],
          password: SHIPROCKET_CONFIG[:password]
        }.to_json,
        headers: { 'Content-Type' => 'application/json' }
      )

      if response.success?
        response.parsed_response['token']
      else
        Rails.logger.error("Shiprocket authentication failed: #{response.body}")
        raise "Shiprocket authentication failed"
      end
    rescue => e
      Rails.logger.error("Shiprocket authentication error: #{e.message}")
      raise
    end

    # Create order in Shiprocket
    def create_order(order)
      token = authenticate

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/orders/create/adhoc",
        body: build_order_payload(order).to_json,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket order creation failed: #{response.body}")
        raise "Shiprocket order creation failed: #{response.parsed_response['message']}"
      end
    rescue => e
      Rails.logger.error("Shiprocket order creation error: #{e.message}")
      raise
    end

    # Create full shipment (order + AWB)
    def create_shipment(order, courier_id = nil)
      # First create order in Shiprocket
      order_response = create_order(order)
      shiprocket_order_id = order_response['order_id']
      shiprocket_shipment_id = order_response['shipment_id']

      # Generate AWB (tracking number)
      awb_response = generate_awb(shiprocket_shipment_id, courier_id)

      {
        shiprocket_order_id: shiprocket_order_id,
        shiprocket_shipment_id: shiprocket_shipment_id,
        awb_code: awb_response['response']['data']['awb_code'],
        courier_name: awb_response['response']['data']['courier_name'],
        courier_id: awb_response['response']['data']['courier_company_id'],
        label_url: awb_response['response']['data']['label_url'],
        tracking_url: awb_response['response']['data']['tracking_url']
      }
    rescue => e
      Rails.logger.error("Shiprocket shipment creation error: #{e.message}")
      raise
    end

    # Generate AWB/tracking number
    def generate_awb(shipment_id, courier_id = nil)
      token = authenticate

      payload = { shipment_id: shipment_id }
      payload[:courier_id] = courier_id if courier_id

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/courier/assign/awb",
        body: payload.to_json,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket AWB generation failed: #{response.body}")
        raise "AWB generation failed"
      end
    rescue => e
      Rails.logger.error("Shiprocket AWB generation error: #{e.message}")
      raise
    end

    # Track shipment
    def track_shipment(awb_code)
      token = authenticate

      response = HTTParty.get(
        "#{SHIPROCKET_CONFIG[:api_url]}/courier/track/awb/#{awb_code}",
        headers: { 'Authorization' => "Bearer #{token}" }
      )

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket tracking failed: #{response.body}")
        nil
      end
    rescue => e
      Rails.logger.error("Shiprocket tracking error: #{e.message}")
      nil
    end

    # Calculate shipping rates
    def calculate_shipping_rates(order)
      token = authenticate

      response = HTTParty.get(
        "#{SHIPROCKET_CONFIG[:api_url]}/courier/serviceability",
        query: {
          pickup_postcode: '110001', # Your warehouse PIN
          delivery_postcode: order.shipping_address['postal_code'],
          weight: order.weight_kg || DEFAULT_WEIGHT_KG,
          cod: order.payment_method == 'cod' ? 1 : 0
        },
        headers: { 'Authorization' => "Bearer #{token}" }
      )

      if response.success?
        response.parsed_response['data']
      else
        Rails.logger.error("Shiprocket rate calculation failed: #{response.body}")
        []
      end
    rescue => e
      Rails.logger.error("Shiprocket rate calculation error: #{e.message}")
      []
    end

    # Cancel shipment
    def cancel_shipment(awb_codes)
      token = authenticate

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/orders/cancel/shipment/awbs",
        body: { awbs: Array(awb_codes) }.to_json,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket cancellation failed: #{response.body}")
        false
      end
    rescue => e
      Rails.logger.error("Shiprocket cancellation error: #{e.message}")
      false
    end

    # Generate shipping label
    def generate_label(shipment_ids)
      token = authenticate

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/courier/generate/label",
        body: { shipment_id: Array(shipment_ids) }.to_json,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )

      if response.success?
        response.parsed_response['label_url']
      else
        Rails.logger.error("Shiprocket label generation failed: #{response.body}")
        nil
      end
    rescue => e
      Rails.logger.error("Shiprocket label generation error: #{e.message}")
      nil
    end

    # Create return/RTO
    def create_return(order)
      token = authenticate

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/orders/create/return",
        body: {
          order_id: order.shipment&.shiprocket_order_id,
          order_date: order.created_at.strftime('%Y-%m-%d %H:%M'),
          channel_id: '',
          pickup_customer_name: order.shipping_address['full_name'],
          pickup_customer_phone: order.shipping_address['phone'],
          pickup_address: order.shipping_address['address_line_1'],
          pickup_address_2: order.shipping_address['address_line_2'],
          pickup_city: order.shipping_address['city'],
          pickup_state: order.shipping_address['state_province'],
          pickup_country: order.shipping_address['country'],
          pickup_pincode: order.shipping_address['postal_code']
        }.to_json,
        headers: {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket return creation failed: #{response.body}")
        false
      end
    rescue => e
      Rails.logger.error("Shiprocket return creation error: #{e.message}")
      false
    end

    private

    # Build order payload for Shiprocket API
    def build_order_payload(order)
      {
        order_id: order.order_number,
        order_date: order.created_at.strftime('%Y-%m-%d %H:%M'),
        pickup_location: 'Primary', # Configure your pickup location in Shiprocket
        channel_id: '',
        comment: order.customer_notes || '',
        billing_customer_name: order.billing_address&.dig('full_name') || order.shipping_address['full_name'],
        billing_last_name: '',
        billing_address: order.billing_address&.dig('address_line_1') || order.shipping_address['address_line_1'],
        billing_address_2: order.billing_address&.dig('address_line_2') || order.shipping_address['address_line_2'] || '',
        billing_city: order.billing_address&.dig('city') || order.shipping_address['city'],
        billing_pincode: order.billing_address&.dig('postal_code') || order.shipping_address['postal_code'],
        billing_state: order.billing_address&.dig('state_province') || order.shipping_address['state_province'],
        billing_country: order.billing_address&.dig('country') || order.shipping_address['country'],
        billing_email: order.user.email,
        billing_phone: order.billing_address&.dig('phone') || order.shipping_address['phone'],
        shipping_is_billing: order.billing_address.blank?,
        shipping_customer_name: order.shipping_address['full_name'],
        shipping_last_name: '',
        shipping_address: order.shipping_address['address_line_1'],
        shipping_address_2: order.shipping_address['address_line_2'] || '',
        shipping_city: order.shipping_address['city'],
        shipping_pincode: order.shipping_address['postal_code'],
        shipping_country: order.shipping_address['country'],
        shipping_state: order.shipping_address['state_province'],
        shipping_email: order.user.email,
        shipping_phone: order.shipping_address['phone'],
        order_items: build_order_items(order),
        payment_method: order.payment_method == 'cod' ? 'COD' : 'Prepaid',
        shipping_charges: order.shipping_cost&.to_f || 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: order.discount&.to_f || 0,
        sub_total: order.subtotal.to_f,
        length: order.dimensions_cm&.dig('length') || DEFAULT_SHIPPING_DIMENSIONS[:length],
        breadth: order.dimensions_cm&.dig('breadth') || DEFAULT_SHIPPING_DIMENSIONS[:breadth],
        height: order.dimensions_cm&.dig('height') || DEFAULT_SHIPPING_DIMENSIONS[:height],
        weight: order.weight_kg || DEFAULT_WEIGHT_KG
      }
    end

    # Build order items array
    def build_order_items(order)
      order.order_items.map do |item|
        {
          name: item.product_name,
          sku: item.product.sku || "PROD-#{item.product.id}",
          units: item.quantity,
          selling_price: item.price.to_f,
          discount: 0,
          tax: 0,
          hsn: item.product.hsn_code || ''
        }
      end
    end
  end
end
