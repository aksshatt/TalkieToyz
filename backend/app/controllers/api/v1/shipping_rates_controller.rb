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
        rates = fallback_rates(postal_code, weight_kg, payment_method) if rates.empty?

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

      def warehouse_pincode
        ENV.fetch('SHIPROCKET_PICKUP_POSTCODE', ENV.fetch('WAREHOUSE_PINCODE', '110001'))
      end

      def fetch_rates(postal_code, weight_kg, payment_method)
        response = ShiprocketService.authorized_request(:get, '/courier/serviceability', query: {
          pickup_postcode: warehouse_pincode,
          delivery_postcode: postal_code,
          weight: weight_kg,
          cod: payment_method == 'cod' ? 1 : 0
        })

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

      # Dynamic fallback when Shiprocket returns no couriers.
      # Zone-based formula: base + (per_kg * weight) * zone_multiplier.
      def fallback_rates(postal_code, weight_kg, payment_method)
        zone_mult = zone_multiplier(warehouse_pincode, postal_code)
        billable_kg = [weight_kg.to_f, 0.5].max
        cod_surcharge = payment_method == 'cod' ? 30.0 : 0.0

        surface_rate = ((40.0 + 35.0 * billable_kg) * zone_mult + cod_surcharge).round(2)
        air_rate     = ((75.0 + 60.0 * billable_kg) * zone_mult + cod_surcharge).round(2)

        [
          {
            courier_id: -1,
            courier_name: 'Standard Delivery',
            rate: surface_rate,
            estimated_delivery_days: '5-7',
            cod_available: true,
            mode: 'surface',
            description: 'Standard surface delivery',
            rating: 4.0,
            is_surface: true,
            is_air: false
          },
          {
            courier_id: -2,
            courier_name: 'Express Delivery',
            rate: air_rate,
            estimated_delivery_days: '2-3',
            cod_available: false,
            mode: 'air',
            description: 'Express air delivery',
            rating: 4.5,
            is_surface: false,
            is_air: true
          }
        ]
      end

      # Approximate zone from first digit of pincode (India). Same digit = local,
      # adjacent = regional, far = national, NE/remote = bulkier multiplier.
      def zone_multiplier(pickup, delivery)
        p = pickup.to_s[0].to_i
        d = delivery.to_s[0].to_i
        diff = (p - d).abs
        case diff
        when 0 then 1.0   # same zone
        when 1 then 1.2   # adjacent
        when 2 then 1.4
        when 3 then 1.6
        else        1.8   # far/remote
        end
      end
    end
  end
end
