module Api
  module V1
    class ShippingRatesController < BaseController
      skip_before_action :authenticate_user!, only: [:create]

      # POST /api/v1/shipping_rates
      # Calculate shipping rates for given destination and package details
      def create
        postal_code = params[:postal_code]
        weight_kg = params[:weight_kg]&.to_f || DEFAULT_WEIGHT_KG
        dimensions = params[:dimensions] || {}

        # Validate required parameters
        if postal_code.blank?
          return render json: {
            error: 'Postal code is required'
          }, status: :bad_request
        end

        # Validate postal code format (Indian PIN codes are 6 digits)
        unless postal_code.match?(/^\d{6}$/)
          return render json: {
            error: 'Invalid postal code format. Indian PIN codes must be 6 digits.'
          }, status: :bad_request
        end

        # Create a temporary order object for rate calculation
        temp_order = build_temp_order(postal_code, weight_kg, dimensions)

        # Get shipping rates from Shiprocket
        rates = ShiprocketService.calculate_shipping_rates(temp_order)

        if rates.empty?
          render json: {
            message: 'No shipping options available for this location',
            rates: []
          }, status: :ok
        else
          # Transform and sort rates by price
          formatted_rates = format_shipping_rates(rates)

          render json: {
            rates: formatted_rates,
            destination: {
              postal_code: postal_code,
              weight_kg: weight_kg
            }
          }, status: :ok
        end

      rescue => e
        Rails.logger.error("Shipping rate calculation error: #{e.message}")
        Rails.logger.error(e.backtrace.join("\n"))

        render json: {
          error: 'Unable to calculate shipping rates. Please try again.',
          details: Rails.env.development? ? e.message : nil
        }, status: :unprocessable_entity
      end

      private

      def build_temp_order(postal_code, weight_kg, dimensions)
        # Create a temporary order-like object for Shiprocket API
        OpenStruct.new(
          shipping_address: {
            'postal_code' => postal_code,
            'full_name' => 'Customer',
            'phone' => '9999999999',
            'address_line_1' => 'Address',
            'address_line_2' => '',
            'city' => 'City',
            'state_province' => 'State',
            'country' => 'India'
          },
          weight_kg: weight_kg,
          dimensions_cm: dimensions.presence || {
            'length' => DEFAULT_SHIPPING_DIMENSIONS[:length],
            'breadth' => DEFAULT_SHIPPING_DIMENSIONS[:breadth],
            'height' => DEFAULT_SHIPPING_DIMENSIONS[:height]
          },
          payment_method: params[:payment_method] || 'prepaid'
        )
      end

      def format_shipping_rates(rates)
        rates.map do |rate|
          {
            courier_id: rate['courier_company_id'],
            courier_name: rate['courier_name'],
            rate: rate['rate']&.to_f,
            estimated_delivery_days: rate['etd'],
            cod_available: rate['cod'] == 1 || rate['cod'] == true,
            mode: rate['mode'], # Surface, Air, etc.
            description: "#{rate['courier_name']} - Delivery in #{rate['etd']} days",
            rating: rate['rating']&.to_f,
            is_surface: rate['is_surface'],
            is_air: !rate['is_surface']
          }
        end.sort_by { |r| r[:rate] || Float::INFINITY }
      end
    end
  end
end
