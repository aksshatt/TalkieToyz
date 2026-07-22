module Api
  module V1
    module Admin
      class CustomersController < BaseController
        before_action :authenticate_user!
        before_action :require_admin
        before_action :set_customer, only: [:show, :update, :destroy]

        # GET /api/v1/admin/customers
        def index
          @customers = User.where(role: 'customer')
                          .order(created_at: :desc)

          # Apply filters
          @customers = apply_filters(@customers)

          # Pagination
          @customers = @customers.page(params[:page])
                                .per([[params[:per_page].to_i, 1].max, 100].min.nonzero? || 20)

          ids = @customers.map(&:id)
          order_counts = Order.where(user_id: ids).group(:user_id).count
          paid_totals = Order.where(user_id: ids, payment_status: 'paid').group(:user_id).sum(:total)
          last_orders = Order.where(user_id: ids).group(:user_id).maximum(:created_at)

          render_success(
            {
              customers: @customers.map { |c|
                customer_summary(c,
                  total_orders: order_counts[c.id] || 0,
                  total_spent: (paid_totals[c.id] || 0).to_f.round(2),
                  last_order_at: last_orders[c.id]&.iso8601
                )
              },
              meta: pagination_meta(@customers)
            },
            'Customers retrieved successfully'
          )
        end

        # GET /api/v1/admin/customers/:id
        def show
          render_success(
            customer_details(@customer),
            'Customer retrieved successfully'
          )
        end

        # PATCH /api/v1/admin/customers/:id
        def update
          if @customer.update(customer_params)
            log_activity('update', 'User', @customer.id, { name: @customer.name })
            render_success(
              customer_details(@customer),
              'Customer updated successfully'
            )
          else
            render_error('Failed to update customer', @customer.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/customers/:id
        def destroy
          @customer.update(deleted_at: Time.current)
          log_activity('delete', 'User', @customer.id, { name: @customer.name })

          render_success(nil, 'Customer deleted successfully')
        end

        # GET /api/v1/admin/customers/export
        def export
          @customers = User.where(role: 'customer')

          headers['Content-Type'] = 'text/csv'
          headers['Content-Disposition'] = "attachment; filename=\"customers_#{Date.current}.csv\""
          headers.delete('Content-Length')
          headers['X-Accel-Buffering'] = 'no'
          self.response_body = customers_csv_stream(@customers)
        end

        # GET /api/v1/admin/customers/statistics
        def statistics
          stats = {
            total_customers: User.where(role: 'customer').count,
            new_customers_this_month: User.where(role: 'customer')
                                          .where('created_at >= ?', Time.current.beginning_of_month)
                                          .count,
            customers_with_orders: User.where(role: 'customer')
                                      .joins(:orders)
                                      .distinct
                                      .count,
            average_order_value_by_customer: calculate_average_order_value_by_customer,
            top_customers: top_customers_by_revenue(10)
          }

          render_success(stats, 'Customer statistics retrieved successfully')
        end

        private

        def set_customer
          @customer = User.where(role: 'customer').find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Customer not found', nil, status: :not_found)
        end

        def require_admin
          unless current_user&.admin?
            render_error('Admin access required', nil, status: :forbidden)
          end
        end

        def customer_params
          params.require(:customer).permit(:name, :email, :phone, :bio)
        end

        def apply_filters(customers)
          if params[:search].present?
            customers = customers.where('name ILIKE ? OR email ILIKE ?',
                                       "%#{params[:search]}%", "%#{params[:search]}%")
          end

          if params[:has_orders] == 'true'
            customers = customers.joins(:orders).distinct
          elsif params[:has_orders] == 'false'
            customers = customers.left_outer_joins(:orders)
                                .where(orders: { id: nil })
          end

          if params[:date_from].present?
            customers = customers.where('users.created_at >= ?', params[:date_from])
          end

          if params[:date_to].present?
            customers = customers.where('users.created_at <= ?', params[:date_to])
          end

          customers
        end

        def customer_summary(customer, total_orders: nil, total_spent: nil, last_order_at: nil)
          {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            total_orders: total_orders.nil? ? customer.orders.count : total_orders,
            total_spent: total_spent.nil? ? customer.orders.where(payment_status: 'paid').sum(:total).to_f.round(2) : total_spent,
            created_at: customer.created_at.iso8601,
            last_order_at: last_order_at.nil? ? customer.orders.maximum(:created_at)&.iso8601 : last_order_at
          }
        end

        def customer_details(customer)
          # Single aggregate query for counts/sums
          stats = customer.orders
                          .select('COUNT(*) as total_count, ' \
                                  'COALESCE(SUM(CASE WHEN payment_status = \'paid\' THEN total ELSE 0 END), 0) as paid_total, ' \
                                  'COUNT(CASE WHEN payment_status = \'paid\' THEN 1 END) as paid_count')
                          .first

          total_count = stats.total_count.to_i
          paid_total  = stats.paid_total.to_f
          paid_count  = stats.paid_count.to_i
          avg_order   = paid_count > 0 ? (paid_total / paid_count).round(2) : 0

          recent_orders = customer.orders.order(created_at: :desc).limit(5).to_a

          {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            bio: customer.bio,
            created_at: customer.created_at.iso8601,
            updated_at: customer.updated_at.iso8601,
            orders_count: total_count,
            total_spent: paid_total.round(2),
            average_order_value: avg_order,
            last_order: recent_orders.first&.then do |order|
              {
                id: order.id,
                order_number: order.order_number,
                total: order.total.to_f.round(2),
                status: order.status,
                created_at: order.created_at.iso8601
              }
            end,
            order_history: recent_orders.map do |order|
              {
                id: order.id,
                order_number: order.order_number,
                total: order.total.to_f.round(2),
                status: order.status,
                payment_status: order.payment_status,
                created_at: order.created_at.iso8601
              }
            end
          }
        end

        def calculate_average_order_value_by_customer
          customers_with_orders = User.where(role: 'customer')
                                     .joins(:orders)
                                     .where(orders: { payment_status: 'paid' })
                                     .distinct
                                     .count

          return 0 if customers_with_orders.zero?

          total_revenue = Order.where(payment_status: 'paid').sum(:total).to_f
          (total_revenue / customers_with_orders).round(2)
        end

        def top_customers_by_revenue(limit = 10)
          User.where(role: 'customer')
              .joins(:orders)
              .where(orders: { payment_status: 'paid' })
              .select('users.*, SUM(orders.total) as total_revenue, COUNT(orders.id) as orders_count')
              .group('users.id')
              .order('total_revenue DESC')
              .limit(limit)
              .map do |customer|
            {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              total_revenue: customer.total_revenue.to_f.round(2),
              orders_count: customer.orders_count.to_i
            }
          end
        end

        def customers_csv_stream(scope)
          Enumerator.new do |y|
            y << CSV.generate_line(['ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Created At'])
            scope.find_in_batches(batch_size: 500) do |batch|
              ids = batch.map(&:id)
              order_counts = Order.where(user_id: ids).group(:user_id).count
              paid_totals  = Order.where(user_id: ids, payment_status: 'paid').group(:user_id).sum(:total)
              batch.each do |customer|
                y << CSV.generate_line([
                  customer.id,
                  customer.name,
                  customer.email,
                  customer.phone,
                  order_counts[customer.id] || 0,
                  paid_totals[customer.id] || 0,
                  customer.created_at.strftime('%Y-%m-%d %H:%M:%S')
                ])
              end
            end
          end
        end
      end
    end
  end
end
