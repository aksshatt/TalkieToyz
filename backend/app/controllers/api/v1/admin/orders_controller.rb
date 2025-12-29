module Api
  module V1
    module Admin
      class OrdersController < BaseController
        before_action :set_order, only: [:show, :update_status, :refund, :create_shipment, :cancel_shipment, :shipping_label]

        # GET /api/v1/admin/orders
        def index
          @orders = Order.includes(:user, :order_items)
                        .order(created_at: :desc)

          # Apply filters
          @orders = apply_filters(@orders)

          # Pagination
          @orders = @orders.page(params[:page])
                          .per(params[:per_page] || 20)

          render_success(
            {
              orders: @orders.map { |o| admin_order_summary(o) },
              meta: pagination_meta(@orders)
            },
            'Orders retrieved successfully'
          )
        end

        # GET /api/v1/admin/orders/:id
        def show
          render_success(
            admin_order_details(@order),
            'Order retrieved successfully'
          )
        end

        # PATCH /api/v1/admin/orders/:id/status
        def update_status
          old_status = @order.status
          new_status = params[:status]
          notes = params[:notes]

          unless Order.statuses.keys.include?(new_status)
            return render_error('Invalid status', nil, status: :bad_request)
          end

          if @order.update(status: new_status, notes: notes)
            # Send notification if status changed to shipped or delivered
            send_status_notification(@order, old_status, new_status)

            log_activity('update_status', 'Order', @order.id, {
              order_number: @order.order_number,
              old_status: old_status,
              new_status: new_status
            })

            render_success(
              admin_order_details(@order),
              'Order status updated successfully'
            )
          else
            render_error('Failed to update order status', @order.errors.full_messages)
          end
        end

        # POST /api/v1/admin/orders/bulk_update_status
        def bulk_update_status
          order_ids = params[:order_ids] || []
          new_status = params[:status]

          unless Order.statuses.keys.include?(new_status)
            return render_error('Invalid status', nil, status: :bad_request)
          end

          orders = Order.where(id: order_ids)
          orders.update_all(status: new_status)

          log_activity('bulk_update_status', 'Order', nil, {
            count: order_ids.size,
            new_status: new_status
          })

          render_success(nil, "#{order_ids.size} orders updated successfully")
        end

        # GET /api/v1/admin/orders/export
        def export
          @orders = Order.includes(:user, :order_items)

          # Apply filters
          @orders = apply_filters(@orders)

          csv_data = generate_orders_csv(@orders)

          send_data csv_data,
                    filename: "orders_#{Date.current}.csv",
                    type: 'text/csv',
                    disposition: 'attachment'
        end

        # GET /api/v1/admin/orders/statistics
        def statistics
          stats = {
            by_status: orders_by_status,
            by_payment_method: orders_by_payment_method,
            by_payment_status: orders_by_payment_status,
            average_processing_time: calculate_average_processing_time
          }

          render_success(stats, 'Order statistics retrieved successfully')
        end

        # POST /api/v1/admin/orders/:id/refund
        def refund
          # Validate order can be refunded
          unless @order.can_refund?
            return render_error(
              'Order cannot be refunded',
              ["Order status: #{@order.status}, Payment status: #{@order.payment_status}"],
              status: :unprocessable_entity
            )
          end

          # Get refund amount (full or partial)
          refund_amount = params[:amount]&.to_f || @order.total.to_f
          reason = params[:reason] || 'Admin initiated refund'

          # Validate refund amount
          if refund_amount <= 0 || refund_amount > @order.total.to_f
            return render_error(
              'Invalid refund amount',
              ["Amount must be between 0 and #{@order.total}"],
              status: :bad_request
            )
          end

          # Initiate refund through Razorpay
          result = @order.initiate_refund(refund_amount, reason)

          if result[:success]
            log_activity('refund', 'Order', @order.id, {
              order_number: @order.order_number,
              amount: refund_amount,
              reason: reason
            })

            render_success(
              admin_order_details(@order),
              'Refund initiated successfully'
            )
          else
            render_error('Refund failed', [result[:error]])
          end
        rescue => e
          Rails.logger.error("Refund error: #{e.message}")
          render_error('Refund processing failed', [e.message])
        end

        # POST /api/v1/admin/orders/:id/create_shipment
        def create_shipment
          # Validate order can be shipped
          unless @order.can_create_shipment?
            return render_error(
              'Cannot create shipment for this order',
              ["Order status: #{@order.status}, Payment status: #{@order.payment_status}"],
              status: :unprocessable_entity
            )
          end

          # Check if shipment already exists
          if @order.shipment.present?
            return render_error(
              'Shipment already exists for this order',
              ["Shipment ID: #{@order.shipment.id}, AWB: #{@order.shipment.awb_code}"],
              status: :unprocessable_entity
            )
          end

          # Get optional courier_id from params
          courier_id = params[:courier_id]

          # Create shipment
          result = @order.create_shiprocket_shipment(courier_id)

          if result[:success]
            log_activity('create_shipment', 'Order', @order.id, {
              order_number: @order.order_number,
              awb_code: result[:shipment].awb_code,
              courier: result[:shipment].courier_name
            })

            render_success(
              {
                order: admin_order_details(@order.reload),
                shipment: ShipmentSerializer.new(result[:shipment]).as_json
              },
              'Shipment created successfully'
            )
          else
            render_error('Shipment creation failed', [result[:error]])
          end
        rescue => e
          Rails.logger.error("Shipment creation error: #{e.message}")
          render_error('Shipment creation failed', [e.message])
        end

        # POST /api/v1/admin/orders/:id/cancel_shipment
        def cancel_shipment
          unless @order.shipment.present?
            return render_error('No shipment found for this order', nil, status: :not_found)
          end

          if @order.shipment.cancel
            log_activity('cancel_shipment', 'Order', @order.id, {
              order_number: @order.order_number,
              awb_code: @order.shipment.awb_code
            })

            render_success(
              admin_order_details(@order.reload),
              'Shipment cancelled successfully'
            )
          else
            render_error('Failed to cancel shipment', ['Shipment may already be cancelled or in transit'])
          end
        rescue => e
          Rails.logger.error("Shipment cancellation error: #{e.message}")
          render_error('Shipment cancellation failed', [e.message])
        end

        # GET /api/v1/admin/orders/:id/shipping_label
        def shipping_label
          unless @order.shipment.present?
            return render_error('No shipment found for this order', nil, status: :not_found)
          end

          label_url = @order.shipment.generate_label

          if label_url
            render_success({ label_url: label_url }, 'Shipping label retrieved successfully')
          else
            render_error('Failed to generate shipping label', ['Label may not be available yet'])
          end
        rescue => e
          Rails.logger.error("Shipping label error: #{e.message}")
          render_error('Shipping label retrieval failed', [e.message])
        end

        private

        def set_order
          @order = Order.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Order not found', nil, status: :not_found)
        end

        def apply_filters(orders)
          orders = orders.where(status: params[:status]) if params[:status].present?
          orders = orders.where(payment_status: params[:payment_status]) if params[:payment_status].present?
          orders = orders.where(payment_method: params[:payment_method]) if params[:payment_method].present?
          orders = orders.where(user_id: params[:user_id]) if params[:user_id].present?

          if params[:date_from].present?
            orders = orders.where('created_at >= ?', params[:date_from])
          end

          if params[:date_to].present?
            orders = orders.where('created_at <= ?', params[:date_to])
          end

          if params[:search].present?
            orders = orders.where('order_number ILIKE ?', "%#{params[:search]}%")
          end

          if params[:min_amount].present?
            orders = orders.where('total >= ?', params[:min_amount])
          end

          if params[:max_amount].present?
            orders = orders.where('total <= ?', params[:max_amount])
          end

          orders
        end

        def admin_order_summary(order)
          {
            id: order.id,
            order_number: order.order_number,
            customer_name: order.user.name,
            customer_email: order.user.email,
            total: order.total.to_f.round(2),
            status: order.status,
            payment_status: order.payment_status,
            payment_method: order.payment_method,
            items_count: order.order_items.size,
            created_at: order.created_at.iso8601,
            shipping_address: order.shipping_address
          }
        end

        def admin_order_details(order)
          OrderSerializer.new(order).as_json.merge(
            customer: {
              id: order.user.id,
              name: order.user.name,
              email: order.user.email,
              phone: order.user.phone
            },
            timeline: order_timeline(order)
          )
        end

        def order_timeline(order)
          timeline = [
            { event: 'Order Created', timestamp: order.created_at.iso8601 }
          ]

          timeline << { event: 'Payment Confirmed', timestamp: order.updated_at.iso8601 } if order.payment_status == 'paid'
          timeline << { event: 'Order Shipped', timestamp: order.updated_at.iso8601 } if order.status == 'shipped'
          timeline << { event: 'Order Delivered', timestamp: order.updated_at.iso8601 } if order.status == 'delivered'
          timeline << { event: 'Order Cancelled', timestamp: order.cancelled_at } if order.cancelled_at.present?

          timeline
        end

        def send_status_notification(order, old_status, new_status)
          if new_status == 'shipped' && old_status != 'shipped'
            OrderMailer.order_shipped(order.id).deliver_later
          elsif new_status == 'delivered' && old_status != 'delivered'
            OrderMailer.order_delivered(order.id).deliver_later
          end
        end

        def orders_by_status
          Order.group(:status).count
        end

        def orders_by_payment_method
          Order.group(:payment_method).count
        end

        def orders_by_payment_status
          Order.group(:payment_status).count
        end

        def calculate_average_processing_time
          # Average time from created to delivered
          delivered_orders = Order.where(status: 'delivered')
                                  .where.not(created_at: nil)

          return 0 if delivered_orders.empty?

          total_time = delivered_orders.sum do |order|
            (order.updated_at - order.created_at) / 86400.0 # Convert to days
          end

          (total_time / delivered_orders.count).round(2)
        end

        def generate_orders_csv(orders)
          require 'csv'

          CSV.generate(headers: true) do |csv|
            csv << ['Order Number', 'Customer', 'Email', 'Total', 'Status', 'Payment Status',
                    'Payment Method', 'Created At']

            orders.each do |order|
              csv << [
                order.order_number,
                order.user.name,
                order.user.email,
                order.total,
                order.status,
                order.payment_status,
                order.payment_method,
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
              ]
            end
          end
        end
      end
    end
  end
end
