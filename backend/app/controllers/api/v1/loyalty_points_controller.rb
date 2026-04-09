module Api
  module V1
    class LoyaltyPointsController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/loyalty_points
      def index
        @transactions = current_user.loyalty_points.order(created_at: :desc)
                                    .page(params[:page] || 1).per(20)

        render_success(
          {
            balance: current_user.loyalty_points_total,
            rupee_value: (current_user.loyalty_points_total / LoyaltyPoint::REDEMPTION_RATE.to_f * 10).round(2),
            transactions: @transactions.map { |lp| serialize_point(lp) }
          },
          'Loyalty points retrieved',
          meta: pagination_meta(@transactions)
        )
      end

      # POST /api/v1/loyalty_points/redeem
      def redeem
        points = params[:points].to_i

        if points <= 0
          return render_error('Points must be greater than 0', nil)
        end

        if current_user.loyalty_points_total < points
          return render_error('Insufficient loyalty points', nil)
        end

        min_redemption = LoyaltyPoint::REDEMPTION_RATE
        if points < min_redemption
          return render_error("Minimum redemption is #{min_redemption} points (₹10 off)", nil)
        end

        lp = LoyaltyPoint.redeem(user: current_user, points: points)
        discount = (points / LoyaltyPoint::REDEMPTION_RATE.to_f * 10).round(2)

        render_success(
          {
            redeemed_points: points,
            discount_rupees: discount,
            new_balance: current_user.reload.loyalty_points_total
          },
          "Redeemed #{points} points for ₹#{discount} discount"
        )
      rescue ArgumentError => e
        render_error(e.message, nil)
      end

      private

      def serialize_point(lp)
        {
          id: lp.id,
          points: lp.points,
          source: lp.source,
          description: lp.description,
          created_at: lp.created_at
        }
      end
    end
  end
end
