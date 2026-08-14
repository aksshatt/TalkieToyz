module Api
  module V1
    class ReferralsController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/referrals
      # Returns current user's referral code, referral count, and points earned
      def index
        referrals = current_user.referrals
        points_earned = LoyaltyPoint.where(user: current_user, source: 'referral').sum(:points)

        render_success({
          referral_code: current_user.referral_code,
          referral_url: "#{ENV.fetch('FRONTEND_URL', 'https://talkietoys.com')}/signup?ref=#{current_user.referral_code}",
          total_referrals: referrals.count,
          points_earned: points_earned,
          referrals: referrals.select(:id, :name, :created_at).as_json
        }, 'Referral info retrieved successfully')
      end

      # POST /api/v1/referrals/apply
      # Called during signup to apply a referral code
      def apply
        code = params[:referral_code].to_s.upcase.strip
        referrer = User.find_by(referral_code: code)

        if referrer.nil?
          return render_error('Invalid referral code', nil, status: :not_found)
        end

        if current_user.referred_by_id.present?
          return render_error('Referral already applied', nil, status: :unprocessable_entity)
        end

        if referrer.id == current_user.id
          return render_error('Cannot use your own referral code', nil, status: :unprocessable_entity)
        end

        current_user.update!(referred_by_id: referrer.id)

        # Award points to referrer
        LoyaltyPoint.award(
          user: referrer,
          source: 'referral',
          reference: current_user,
          description: "Referral bonus — #{current_user.name} signed up"
        )

        render_success({ message: 'Referral applied successfully' }, 'Referral applied')
      end
    end
  end
end
