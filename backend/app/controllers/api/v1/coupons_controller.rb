module Api
  module V1
    class CouponsController < BaseController
      skip_before_action :authenticate_user!, only: [:validate]

      # POST /api/v1/coupons/validate
      def validate
        coupon_code = params[:code]&.upcase
        order_amount = params[:order_amount]&.to_f

        unless coupon_code.present? && order_amount.present? && order_amount > 0
          return render_error(
            'Coupon code and order amount are required',
            nil,
            status: :unprocessable_entity
          )
        end

        coupon = Coupon.find_by(code: coupon_code)

        unless coupon
          return render_error('Coupon not found', nil, status: :not_found)
        end

        unless coupon.valid_for_order?(order_amount)
          reasons = []
          reasons << 'Coupon is inactive' unless coupon.active?
          reasons << 'Coupon has expired' unless coupon.valid_dates?
          reasons << 'Coupon usage limit reached' unless coupon.usage_available?
          reasons << "Minimum order amount is #{coupon.min_order_amount}" if coupon.min_order_amount.present? && order_amount < coupon.min_order_amount

          return render_error(
            'Coupon is not valid',
            { reasons: reasons },
            status: :unprocessable_entity
          )
        end

        discount_amount = coupon.calculate_discount(order_amount)

        render_success(
          {
            coupon: CouponSerializer.new(coupon).as_json,
            discount_amount: discount_amount.round(2),
            final_amount: (order_amount - discount_amount).round(2)
          },
          'Coupon is valid'
        )
      end
    end
  end
end
