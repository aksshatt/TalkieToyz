module Api
  module V1
    class OrdersController < BaseController
      before_action :set_order, only: [:show, :update, :cancel]
      before_action :require_admin, only: [:update]

      # GET /api/v1/orders
      def index
        @orders = current_user.orders
                              .includes(:order_items, :coupon)
                              .recent
                              .page(params[:page])
                              .per(params[:per_page] || 20)

        # Filter by status if provided
        @orders = @orders.by_status(params[:status]) if params[:status].present?

        render_success(
          {
            orders: @orders.map { |order| OrderSerializer.new(order).as_json },
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
        render_success(
          OrderSerializer.new(@order).as_json,
          'Order retrieved successfully'
        )
      end

      # POST /api/v1/orders
      def create
        cart = current_user.cart

        if cart.empty?
          return render_error('Cart is empty', nil, status: :unprocessable_entity)
        end

        # Validate coupon if provided
        coupon = nil
        if params[:coupon_code].present?
          coupon = Coupon.find_by(code: params[:coupon_code]&.upcase)

          unless coupon&.valid_for_order?(cart.subtotal)
            return render_error('Invalid or expired coupon code', nil, status: :unprocessable_entity)
          end
        end

        # Validate required parameters
        unless params[:payment_method].present? && params[:shipping_address].present?
          return render_error(
            'Payment method and shipping address are required',
            nil,
            status: :unprocessable_entity
          )
        end

        # Create order from cart
        @order = Order.create_from_cart(
          cart,
          payment_method: params[:payment_method],
          shipping_address: params[:shipping_address],
          billing_address: params[:billing_address],
          coupon: coupon
        )

        if params[:customer_notes].present?
          @order.update(customer_notes: params[:customer_notes])
        end

        # For COD orders, mark as confirmed immediately
        if @order.payment_method == 'cod'
          @order.mark_as_confirmed
        end

        render_success(
          OrderSerializer.new(@order).as_json,
          'Order created successfully',
          status: :created
        )
      rescue StandardError => e
        render_error('Failed to create order', e.message, status: :unprocessable_entity)
      end

      # PATCH /api/v1/orders/:id (Admin only)
      def update
        updates = {}
        updates[:status] = params[:status] if params[:status].present?
        updates[:tracking_number] = params[:tracking_number] if params[:tracking_number].present?
        updates[:notes] = params[:notes] if params[:notes].present?

        if @order.update(updates)
          # Update shipped_at or delivered_at based on status
          case @order.status.to_sym
          when :shipped
            @order.update(shipped_at: Time.current) unless @order.shipped_at.present?
          when :delivered
            @order.update(delivered_at: Time.current) unless @order.delivered_at.present?
          end

          render_success(
            OrderSerializer.new(@order.reload).as_json,
            'Order updated successfully'
          )
        else
          render_error('Failed to update order', @order.errors.full_messages)
        end
      end

      # POST /api/v1/orders/:id/cancel
      def cancel
        # Only allow users to cancel their own orders
        unless @order.user_id == current_user.id
          return render_error('You can only cancel your own orders', nil, status: :forbidden)
        end

        unless @order.can_be_cancelled?
          return render_error(
            'Order cannot be cancelled at this stage',
            { status: @order.status },
            status: :unprocessable_entity
          )
        end

        if @order.mark_as_cancelled
          render_success(
            OrderSerializer.new(@order).as_json,
            'Order cancelled successfully'
          )
        else
          render_error('Failed to cancel order', @order.errors.full_messages)
        end
      end

      # POST /api/v1/orders/:id/create_razorpay_order
      def create_razorpay_order
        order = Order.find(params[:id])

        # Only allow users to create Razorpay order for their own orders
        unless order.user_id == current_user.id
          return render_error('Access denied', nil, status: :forbidden)
        end

        # Check if order is already paid or not using Razorpay
        unless order.payment_method == 'razorpay'
          return render_error('This order does not use Razorpay payment', nil, status: :unprocessable_entity)
        end

        razorpay_order = RazorpayService.create_order(order)

        if razorpay_order
          render_success(
            {
              order: OrderSerializer.new(order.reload).as_json,
              razorpay_order_id: razorpay_order.id,
              razorpay_key_id: ENV['RAZORPAY_KEY_ID'],
              amount: razorpay_order.amount
            },
            'Razorpay order created successfully'
          )
        else
          render_error('Failed to create Razorpay order', nil, status: :unprocessable_entity)
        end
      end

      # POST /api/v1/orders/:id/payment/verify
      def verify_payment
        order = Order.find(params[:id])

        # Only allow users to verify payment for their own orders
        unless order.user_id == current_user.id
          return render_error('Access denied', nil, status: :forbidden)
        end

        # Verify Razorpay signature
        if RazorpayService.verify_payment_signature(
          razorpay_order_id: params[:razorpay_order_id],
          razorpay_payment_id: params[:razorpay_payment_id],
          razorpay_signature: params[:razorpay_signature]
        )
          # Store payment details
          order.update(
            payment_details: {
              razorpay_order_id: params[:razorpay_order_id],
              razorpay_payment_id: params[:razorpay_payment_id],
              razorpay_signature: params[:razorpay_signature]
            }
          )

          order.payment_successful!

          # TODO: Trigger email notification job
          # OrderMailer.order_confirmation(order.id).deliver_later

          render_success(
            OrderSerializer.new(order).as_json,
            'Payment verified successfully'
          )
        else
          order.payment_failed!
          render_error('Payment verification failed', nil, status: :unprocessable_entity)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Order not found', nil, status: :not_found)
      end

      private

      def set_order
        @order = Order.includes(:order_items, :coupon, :user).find(params[:id])

        # Non-admin users can only view their own orders
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
    end
  end
end
