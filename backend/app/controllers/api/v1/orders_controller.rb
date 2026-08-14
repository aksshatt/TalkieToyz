module Api
  module V1
    class OrdersController < BaseController
      before_action :authenticate_user!
      before_action :set_order, only: [:show, :update, :cancel, :retry_payment, :track]
      before_action :require_admin, only: [:update]

      # GET /api/v1/orders
      def index
        per_page = [[params[:per_page].to_i, 1].max, 100].min
        per_page = 20 if params[:per_page].blank?
        @orders = current_user.orders
                              .includes(order_items: [:product, :product_variant], coupon: [], shipment: [])
                              .recent
                              .page(params[:page])
                              .per(per_page)

        @orders = @orders.by_status(params[:status]) if params[:status].present?

        render_success(
          {
            orders: ActiveModelSerializers::SerializableResource.new(
              @orders,
              each_serializer: OrderSerializer,
              include: ['order_items', 'order_items.product', 'order_items.product_variant', 'coupon', 'shipment']
            ).as_json,
            pagination: {
              current_page: @orders.current_page,
              total_pages: @orders.total_pages,
              total_count: @orders.total_count,
              per_page: @orders.limit_value
            }
          },
          'Orders retrieved successfully'
        )
      end

      # GET /api/v1/orders/:id
      def show
        render_success(OrderSerializer.new(@order).as_json, 'Order retrieved successfully')
      end

      # POST /api/v1/orders
      def create
        result = OrderCreationService.call(user: current_user, params: params)

        if result.success?
          if params[:save_address] == true || params[:save_address] == 'true'
            save_shipping_address(permitted_address(params[:shipping_address]))
          end
          render_success(OrderSerializer.new(result.order).as_json, 'Order created successfully', status: :created)
        else
          render_error(result.error, nil, status: :unprocessable_entity)
        end
      end

      # PATCH /api/v1/orders/:id (Admin only)
      def update
        updates = {}
        updates[:status] = params[:status] if params[:status].present?
        updates[:tracking_number] = params[:tracking_number] if params[:tracking_number].present?
        updates[:notes] = params[:notes] if params[:notes].present?

        if @order.update(updates)
          case @order.status.to_sym
          when :shipped
            @order.update(shipped_at: Time.current) unless @order.shipped_at.present?
          when :delivered
            @order.update(delivered_at: Time.current) unless @order.delivered_at.present?
          end

          render_success(OrderSerializer.new(@order.reload).as_json, 'Order updated successfully')
        else
          render_error('Failed to update order', @order.errors.full_messages)
        end
      end

      # POST /api/v1/orders/:id/track
      def track
        unless @order.shipment.present?
          return render_error('No shipment found for this order', nil, status: :not_found)
        end

        @order.shipment.refresh_tracking
        render_success(OrderSerializer.new(@order.reload).as_json, 'Tracking refreshed successfully')
      rescue StandardError => e
        Rails.logger.error("Tracking refresh error: #{e.message}")
        render_error('Failed to refresh tracking', e.message, status: :unprocessable_entity)
      end

      # POST /api/v1/orders/:id/cancel
      def cancel
        unless @order.user_id == current_user.id
          return render_error('You can only cancel your own orders', nil, status: :forbidden)
        end

        unless @order.can_be_cancelled?
          return render_error('Order cannot be cancelled at this stage', { status: @order.status }, status: :unprocessable_entity)
        end

        if @order.mark_as_cancelled
          begin
            OrderMailer.order_cancelled(@order.id).deliver_later
          rescue => e
            Rails.logger.error "Order cancelled email failed: #{e.message}"
          end
          render_success(OrderSerializer.new(@order).as_json, 'Order cancelled successfully')
        else
          render_error('Failed to cancel order', @order.errors.full_messages)
        end
      end

      # POST /api/v1/orders/:id/retry_payment
      def retry_payment
        unless @order.user_id == current_user.id
          return render_error('You can only retry payment for your own orders', nil, status: :forbidden)
        end

        result = PaymentService.retry_payment(@order)

        if result.success?
          render_success(
            { order: OrderSerializer.new(@order.reload).as_json }.merge(result.data),
            'Payment retry initiated successfully'
          )
        else
          render_error(result.error, nil, status: :unprocessable_entity)
        end
      rescue => e
        Rails.logger.error("Payment retry error: #{e.message}")
        render_error('Failed to retry payment', [e.message])
      end

      # POST /api/v1/orders/:id/create_razorpay_order
      def create_razorpay_order
        order = current_user.orders.find_by(id: params[:id])
        return render_error('Order not found', nil, status: :not_found) unless order

        result = PaymentService.create_razorpay_order(order)

        if result.success?
          render_success(
            { order: OrderSerializer.new(order.reload).as_json }.merge(result.data),
            'Razorpay order created successfully'
          )
        else
          render_error(result.error, nil, status: :unprocessable_entity)
        end
      end

      # POST /api/v1/orders/:id/payment/verify
      def verify_payment
        order = current_user.orders.find_by(id: params[:id])
        return render_error('Order not found', nil, status: :not_found) unless order

        result = PaymentService.verify_payment(
          order,
          razorpay_order_id: params[:razorpay_order_id],
          razorpay_payment_id: params[:razorpay_payment_id],
          razorpay_signature: params[:razorpay_signature]
        )

        if result.success?
          current_user.cart.clear
          render_success(OrderSerializer.new(result.data).as_json, 'Payment verified successfully')
        else
          render_error(result.error, nil, status: :unprocessable_entity)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Order not found', nil, status: :not_found)
      end

      private

      def set_order
        @order = Order.includes(order_items: [:product, :product_variant], coupon: [], shipment: []).find(params[:id])

        unless current_user.admin? || @order.user_id == current_user.id
          render_error('Access denied', nil, status: :forbidden)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Order not found', nil, status: :not_found)
      end

      def require_admin
        unless current_user.admin?
          render_error('Admin access required', nil, status: :forbidden)
        end
      end

      def permitted_address(raw)
        return nil unless raw.is_a?(ActionController::Parameters) || raw.is_a?(Hash)
        raw.to_unsafe_h.slice(
          'name', 'phone', 'address_line_1', 'address_line_2',
          'city', 'state', 'pincode', 'country', 'landmark'
        )
      end

      def save_shipping_address(address_data)
        return unless address_data

        existing = current_user.user_addresses.find_by(
          address_line_1: address_data['address_line_1'],
          address_line_2: address_data['address_line_2'],
          city: address_data['city'],
          state: address_data['state'],
          postal_code: address_data['postal_code']
        )
        return if existing.present?

        current_user.user_addresses.create!(
          name: address_data['name'],
          phone: address_data['phone'],
          address_line_1: address_data['address_line_1'],
          address_line_2: address_data['address_line_2'],
          city: address_data['city'],
          state: address_data['state'],
          postal_code: address_data['postal_code'],
          country: address_data['country'] || 'India',
          is_default: current_user.user_addresses.empty?
        )
      rescue => e
        Rails.logger.error("Failed to save shipping address for user #{current_user.id}: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
      end
    end
  end
end
