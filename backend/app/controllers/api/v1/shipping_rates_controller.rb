module Api
  module V1
    class ShippingRatesController < BaseController
      # POST /api/v1/shipping_rates
      def create
        postal_code = params[:postal_code].to_s.strip
        weight_kg   = (params[:weight_kg] || 0.5).to_f
        payment_method = params[:payment_method] || 'prepaid'

        unless postal_code =~ /\A\d{6}\z/
          return render_error('Invalid postal code', ['Postal code must be 6 digits'], status: :bad_request)
        end

        rates = fetch_rates(postal_code, weight_kg, payment_method)

        render_success(
          {
            rates: rates,
            destination: { postal_code: postal_code, weight_kg: weight_kg }
          },
          'Shipping rates retrieved'
        )
      rescue => e
        Rails.logger.error("Shipping rate error: #{e.message}")
        render_error('Failed to fetch shipping rates', [e.message])
      end

      private

      WAREHOUSE_PINCODE = ENV.fetch('WAREHOUSE_PINCODE', '110001').freeze

      def fetch_rates(postal_code, weight_kg, payment_method)
        token = ShiprocketService.send(:authenticate)

        response = HTTParty.get(
          "#{ShiprocketService::SHIPROCKET_CONFIG[:api_url]}/courier/serviceability",
          query: {
            pickup_postcode: WAREHOUSE_PINCODE,
            delivery_postcode: postal_code,
            weight: weight_kg,
            cod: payment_method == 'cod' ? 1 : 0
          },
          headers: { 'Authorization' => "Bearer #{token}" }
        )

        return [] unless response.success?

        couriers = response.parsed_response.dig('data', 'available_courier_companies') || []
        couriers.map do |c|
          {
            courier_id: c['courier_company_id'],
            courier_name: c['courier_name'],
            rate: c['rate'].to_f,
            estimated_delivery_days: c['estimated_delivery_days'].to_s,
            cod_available: c['cod'] == 1,
            mode: c['mode'] || 'surface',
            description: c['courier_name'],
            rating: c['rating'].to_f,
            is_surface: c['is_surface'] == 1,
            is_air: c['is_air'] == 1
          }
        end
      rescue => e
        Rails.logger.error("Shiprocket serviceability check failed: #{e.message}")
        []
      end
    end
  end
end
