class ShiprocketService
  TOKEN_CACHE_KEY = 'shiprocket:auth_token'.freeze
  # Shiprocket issues 10-day tokens but occasionally invalidates early. Cache
  # for 6 hours so we refresh well inside the server's stated TTL; 401 responses
  # still trigger a forced re-auth via authorized_request.
  TOKEN_CACHE_TTL = 6.hours
  MAX_RETRIES = 2
  VOLUMETRIC_DIVISOR = 5000.0 # cm³ → kg for air; Shiprocket standard

  class << self
    # Authenticate and get token (cached)
    def authenticate(force: false)
      Rails.cache.delete(TOKEN_CACHE_KEY) if force

      cached = Rails.cache.read(TOKEN_CACHE_KEY)
      return cached if cached.present?

      response = HTTParty.post(
        "#{SHIPROCKET_CONFIG[:api_url]}/auth/login",
        body: {
          email: SHIPROCKET_CONFIG[:email],
          password: SHIPROCKET_CONFIG[:password]
        }.to_json,
        headers: { 'Content-Type' => 'application/json' }
      )

      if response.success?
        token = response.parsed_response['token']
        Rails.cache.write(TOKEN_CACHE_KEY, token, expires_in: TOKEN_CACHE_TTL)
        token
      else
        Rails.logger.error("Shiprocket authentication failed: #{response.body}")
        raise "Shiprocket authentication failed"
      end
    rescue => e
      Rails.logger.error("Shiprocket authentication error: #{e.message}")
      raise
    end

    # HTTP wrapper with retry on 5xx + 401 refresh
    def authorized_request(method, path, body: nil, query: nil)
      attempt = 0
      begin
        token = authenticate
        headers = {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
        opts = { headers: headers }
        opts[:body] = body.to_json if body
        opts[:query] = query if query

        response = HTTParty.send(method, "#{SHIPROCKET_CONFIG[:api_url]}#{path}", opts)

        if response.code == 401 && attempt == 0
          authenticate(force: true)
          attempt += 1
          raise 'retry-after-reauth'
        end

        if response.code >= 500 && attempt < MAX_RETRIES
          attempt += 1
          sleep(0.5 * attempt)
          raise 'retry-5xx'
        end

        response
      rescue => e
        retry if ['retry-after-reauth', 'retry-5xx'].include?(e.message) && attempt <= MAX_RETRIES
        raise
      end
    end

    # Create order in Shiprocket (idempotent via order_number as order_id — Shiprocket dedupes)
    def create_order(order)
      response = authorized_request(:post, '/orders/create/adhoc', body: build_order_payload(order))

      if response.success?
        response.parsed_response
      else
        msg = response.parsed_response.is_a?(Hash) ? response.parsed_response['message'] : response.body
        Rails.logger.error("Shiprocket order creation failed: #{response.body}")
        raise "Shiprocket order creation failed: #{msg}"
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
      payload = { shipment_id: shipment_id }
      payload[:courier_id] = courier_id if courier_id

      response = authorized_request(:post, '/courier/assign/awb', body: payload)

      if response.success?
        response.parsed_response
      else
        Rails.logger.error("Shiprocket AWB generation failed: #{response.body}")
        raise "AWB generation failed"
      end
    end

    # Track shipment
    def track_shipment(awb_code)
      response = authorized_request(:get, "/courier/track/awb/#{awb_code}")

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

    # Calculate shipping rates for an Order
    def calculate_shipping_rates(order)
      response = authorized_request(:get, '/courier/serviceability', query: {
        pickup_postcode: ENV.fetch('SHIPROCKET_PICKUP_POSTCODE', '110001'),
        delivery_postcode: order.shipping_address['postal_code'],
        weight: billable_weight(order),
        cod: order.payment_method == 'cod' ? 1 : 0
      })

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

    # Verify pickup location exists in Shiprocket
    def verify_pickup_location(nickname = ENV.fetch('SHIPROCKET_PICKUP_LOCATION', 'Primary'))
      list_pickup_locations.any? { |n| n.to_s.casecmp?(nickname) }
    end

    # Return array of pickup nicknames present in the Shiprocket account.
    def list_pickup_locations
      response = authorized_request(:get, '/settings/company/pickup')
      Rails.logger.info("Shiprocket pickup list status=#{response.code} body=#{response.body.to_s[0, 500]}")
      return [] unless response.success?
      data = response.parsed_response.is_a?(Hash) ? response.parsed_response : {}
      candidates = [
        data.dig('data', 'shipping_address'),
        data['shipping_address'],
        data['data']
      ].find { |x| x.is_a?(Array) } || []
      candidates.map { |l| l.is_a?(Hash) ? (l['pickup_location'] || l['nickname']) : nil }.compact
    rescue => e
      Rails.logger.error("Shiprocket pickup list error: #{e.message}")
      []
    end

    # Cancel shipment
    def cancel_shipment(awb_codes)
      response = authorized_request(:post, '/orders/cancel/shipment/awbs', body: { awbs: Array(awb_codes) })

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
      response = authorized_request(:post, '/courier/generate/label', body: { shipment_id: Array(shipment_ids) })

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

    # Create return/RTO (pickup is CUSTOMER's address so goods travel back to us)
    def create_return(order)
      payload = build_return_payload(order)
      response = authorized_request(:post, '/orders/create/return', body: payload)

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

    # Volumetric weight (cm³/5000) vs actual. Shiprocket bills on max.
    def billable_weight(order)
      actual = (order.weight_kg || DEFAULT_WEIGHT_KG).to_f
      dims = order.dimensions_cm || {}
      l = (dims['length'] || DEFAULT_SHIPPING_DIMENSIONS[:length]).to_f
      b = (dims['breadth'] || DEFAULT_SHIPPING_DIMENSIONS[:breadth]).to_f
      h = (dims['height'] || DEFAULT_SHIPPING_DIMENSIONS[:height]).to_f
      volumetric = (l * b * h) / VOLUMETRIC_DIVISOR
      [actual, volumetric].max.round(3)
    end

    private

    # Build order payload for Shiprocket API
    def build_order_payload(order)
      ship = order.shipping_address || {}
      bill = order.billing_address.presence || ship

      {
        order_id: order.order_number,
        order_date: order.created_at.strftime('%Y-%m-%d %H:%M'),
        pickup_location: ENV.fetch('SHIPROCKET_PICKUP_LOCATION', 'Primary'),
        channel_id: '',
        comment: order.customer_notes || '',
        billing_customer_name: bill['name'],
        billing_last_name: '',
        billing_address: bill['address_line_1'],
        billing_address_2: bill['address_line_2'] || '',
        billing_city: bill['city'],
        billing_pincode: bill['postal_code'],
        billing_state: bill['state'],
        billing_country: bill['country'] || 'India',
        billing_email: order.user.email,
        billing_phone: bill['phone'],
        shipping_is_billing: order.billing_address.blank? || order.billing_address == order.shipping_address,
        shipping_customer_name: ship['name'],
        shipping_last_name: '',
        shipping_address: ship['address_line_1'],
        shipping_address_2: ship['address_line_2'] || '',
        shipping_city: ship['city'],
        shipping_pincode: ship['postal_code'],
        shipping_country: ship['country'] || 'India',
        shipping_state: ship['state'],
        shipping_email: order.user.email,
        shipping_phone: ship['phone'],
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
        weight: billable_weight(order)
      }
    end

    def build_return_payload(order)
      ship = order.shipping_address || {}
      {
        order_id: "RTN-#{order.order_number}",
        order_date: Time.current.strftime('%Y-%m-%d %H:%M'),
        channel_id: '',
        pickup_customer_name: ship['name'],
        pickup_customer_phone: ship['phone'],
        pickup_address: ship['address_line_1'],
        pickup_address_2: ship['address_line_2'],
        pickup_city: ship['city'],
        pickup_state: ship['state'],
        pickup_country: ship['country'] || 'India',
        pickup_pincode: ship['postal_code'],
        pickup_email: order.user.email,
        shipping_customer_name: ENV.fetch('RTO_CONTACT_NAME', 'TalkieToyz Warehouse'),
        shipping_phone: ENV.fetch('RTO_CONTACT_PHONE', ''),
        shipping_address: ENV.fetch('RTO_ADDRESS_LINE_1', ''),
        shipping_city: ENV.fetch('RTO_CITY', ''),
        shipping_country: 'India',
        shipping_pincode: ENV.fetch('SHIPROCKET_PICKUP_POSTCODE', '110001'),
        shipping_state: ENV.fetch('RTO_STATE', ''),
        shipping_email: ENV.fetch('CONTACT_EMAIL', 'support@talkietoyz.shop'),
        order_items: build_order_items(order),
        payment_method: 'Prepaid',
        sub_total: order.subtotal.to_f,
        length: order.dimensions_cm&.dig('length') || DEFAULT_SHIPPING_DIMENSIONS[:length],
        breadth: order.dimensions_cm&.dig('breadth') || DEFAULT_SHIPPING_DIMENSIONS[:breadth],
        height: order.dimensions_cm&.dig('height') || DEFAULT_SHIPPING_DIMENSIONS[:height],
        weight: billable_weight(order)
      }
    end

    # Build order items array
    def build_order_items(order)
      order.order_items.includes(:product).map do |item|
        product = item.product
        {
          name: product&.name || 'Item',
          sku: product&.sku.presence || "PROD-#{product&.id}",
          units: item.quantity,
          selling_price: item.unit_price.to_f,
          discount: 0,
          tax: 0,
          hsn: (product.respond_to?(:hsn_code) ? product.hsn_code.presence : nil) || DEFAULT_HSN_CODE
        }
      end
    end
  end
end
