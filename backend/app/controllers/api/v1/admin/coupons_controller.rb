module Api
  module V1
    module Admin
      class CouponsController < BaseController
        before_action :require_admin

        # GET /api/v1/admin/coupons
        def index
          @coupons = Coupon.order(created_at: :desc)
          @coupons = @coupons.where("LOWER(code) LIKE ?", "%#{params[:q].downcase}%") if params[:q].present?
          @coupons = @coupons.where(active: params[:active] == 'true') if params[:active].present?
          @coupons = @coupons.page(params[:page] || 1).per(params[:per_page] || 50)

          render_success(
            {
              coupons: @coupons.map { |c| coupon_json(c) },
              meta: pagination_meta(@coupons)
            },
            'Coupons retrieved successfully'
          )
        end

        # POST /api/v1/admin/coupons/bulk_generate
        def bulk_generate
          count       = (params[:count] || 1).to_i.clamp(1, 100)
          prefix      = params[:prefix].to_s.upcase.gsub(/[^A-Z0-9]/, '').first(8)
          discount_type  = params[:discount_type]
          discount_value = params[:discount_value].to_f
          min_order_amount = params[:min_order_amount].present? ? params[:min_order_amount].to_f : nil
          max_discount_amount = params[:max_discount_amount].present? ? params[:max_discount_amount].to_f : nil
          usage_limit  = (params[:usage_limit] || 1).to_i
          valid_until  = params[:valid_until].present? ? Time.zone.parse(params[:valid_until]) : nil
          valid_from   = params[:valid_from].present? ? Time.zone.parse(params[:valid_from]) : Time.current

          unless %w[percentage fixed].include?(discount_type)
            return render_error('discount_type must be percentage or fixed', nil, status: :unprocessable_entity)
          end

          if discount_value <= 0
            return render_error('discount_value must be greater than 0', nil, status: :unprocessable_entity)
          end

          generated = []
          errors    = []
          count.times do
            code = "#{prefix}#{SecureRandom.alphanumeric(8).upcase}"
            coupon = Coupon.new(
              code: code,
              discount_type: discount_type,
              discount_value: discount_value,
              min_order_amount: min_order_amount,
              max_discount_amount: max_discount_amount,
              usage_limit: usage_limit,
              usage_count: 0,
              valid_from: valid_from,
              valid_until: valid_until,
              active: true
            )
            if coupon.save
              generated << coupon_json(coupon)
            else
              errors << { code: code, errors: coupon.errors.full_messages }
            end
          end

          render_success(
            { generated: generated, errors: errors, total_generated: generated.size },
            "#{generated.size} coupon(s) generated"
          )
        end

        # DELETE /api/v1/admin/coupons/:id
        def destroy
          coupon = Coupon.find(params[:id])
          coupon.destroy
          render_success(nil, 'Coupon deleted')
        rescue ActiveRecord::RecordNotFound
          render_error('Coupon not found', nil, status: :not_found)
        end

        # PATCH /api/v1/admin/coupons/:id/toggle
        def toggle
          coupon = Coupon.find(params[:id])
          coupon.update!(active: !coupon.active)
          render_success(coupon_json(coupon), coupon.active? ? 'Coupon activated' : 'Coupon deactivated')
        rescue ActiveRecord::RecordNotFound
          render_error('Coupon not found', nil, status: :not_found)
        end

        private

        def coupon_json(coupon)
          {
            id: coupon.id,
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.to_f,
            min_order_amount: coupon.min_order_amount&.to_f,
            max_discount_amount: coupon.max_discount_amount&.to_f,
            usage_limit: coupon.usage_limit,
            usage_count: coupon.usage_count,
            valid_from: coupon.valid_from,
            valid_until: coupon.valid_until,
            active: coupon.active,
            created_at: coupon.created_at
          }
        end
      end
    end
  end
end
