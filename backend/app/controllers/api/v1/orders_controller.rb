module Api
  module V1
    class OrdersController < BaseController
      before_action :set_order, only: [:show, :update, :cancel, :retry_payment]
      before_action :require_admin, only: [:update]

      # GET /api/v1/orders
      def index
        @orders = current_user.orders
                              .includes(order_items: [:product, :product_variant], coupon: [], shipment: [])
                              .recent
                              .page(params[:page])
                              .per(params[:per_page] || 20)

        # Filter by status if provided
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
        # Only clear cart for COD orders - for payment gateway orders, cart will be cleared after payment verification
        @order = Order.create_from_cart(
          cart,
          payment_method: params[:payment_method],
          shipping_address: params[:shipping_address],
          billing_address: params[:billing_address],
          coupon: coupon,
          clear_cart: params[:payment_method] == 'cod'
        )

        if params[:customer_notes].present?
          @order.update(customer_notes: params[:customer_notes])
        end

        # Save shipping address for future use if requested
        if params[:save_address].present? && params[:save_address] == true
          save_shipping_address(params[:shipping_address])
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

      # POST /api/v1/orders/:id/retry_payment
      def retry_payment
        # Only allow users to retry payment for their own orders
        unless @order.user_id == current_user.id
          return render_error('You can only retry payment for your own orders', nil, status: :forbidden)
        end

        # Only allow retry for Razorpay orders
        unless @order.payment_method == 'razorpay'
          return render_error(
            'Payment retry is only available for Razorpay orders',
            nil,
            status: :unprocessable_entity
          )
        end

        # Check if order is in a state where payment can be retried
        unless @order.can_retry_payment?
          return render_error(
            'Payment cannot be retried for this order',
            {
              status: @order.status,
              payment_status: @order.payment_status,
              reason: 'Order must be in awaiting_payment or failed payment status'
            },
            status: :unprocessable_entity
          )
        end

        # Create new Razorpay order
        razorpay_order = RazorpayService.create_order(@order)

        if razorpay_order
          render_success(
            {
              order: OrderSerializer.new(@order.reload).as_json,
              razorpay_order_id: razorpay_order.id,
              razorpay_key_id: ENV['RAZORPAY_KEY_ID'],
              amount: razorpay_order.amount
            },
            'Payment retry initiated successfully'
          )
        else
          render_error('Failed to initiate payment retry', nil, status: :unprocessable_entity)
        end
      rescue => e
        Rails.logger.error("Payment retry error: #{e.message}")
        render_error('Failed to retry payment', [e.message])
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

          # Clear cart after successful payment
          current_user.cart.clear

          # Trigger email notification job
          OrderMailer.order_confirmation(order.id).deliver_later

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

      def save_shipping_address(address_data)
        # Check if an identical address already exists
        existing_address = current_user.user_addresses.find_by(
          address_line_1: address_data['address_line_1'],
          address_line_2: address_data['address_line_2'],
          city: address_data['city'],
          state: address_data['state'],
          postal_code: address_data['postal_code']
        )

        return if existing_address.present?

        # Create new address
        current_user.user_addresses.create(
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
        # Log error but don't fail the order creation
        Rails.logger.error("Failed to save shipping address: #{e.message}")
      end
    end
  end
end
