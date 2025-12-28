module Api
  module V1
    module Admin
      class CustomersController < BaseController
        before_action :set_customer, only: [:show, :update, :destroy]

        # GET /api/v1/admin/customers
        def index
          @customers = User.where(role: 'customer')
                          .order(created_at: :desc)

          # Apply filters
          @customers = apply_filters(@customers)

          # Pagination
          @customers = @customers.page(params[:page])
                                .per(params[:per_page] || 20)

          render_success(
            {
              customers: @customers.map { |c| customer_summary(c) },
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

          csv_data = generate_customers_csv(@customers)

          send_data csv_data,
                    filename: "customers_#{Date.current}.csv",
                    type: 'text/csv',
                    disposition: 'attachment'
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

        def customer_summary(customer)
          {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            total_orders: customer.orders.count,
            total_spent: customer.orders.where(payment_status: 'paid').sum(:total).to_f.round(2),
            created_at: customer.created_at.iso8601,
            last_order_at: customer.orders.maximum(:created_at)&.iso8601
          }
        end

        def customer_details(customer)
          {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            bio: customer.bio,
            created_at: customer.created_at.iso8601,
            updated_at: customer.updated_at.iso8601,
            orders_count: customer.orders.count,
            total_spent: customer.orders.where(payment_status: 'paid').sum(:total).to_f.round(2),
            average_order_value: calculate_customer_average_order_value(customer),
            last_order: customer.orders.order(created_at: :desc).first&.then do |order|
              {
                id: order.id,
                order_number: order.order_number,
                total: order.total.to_f.round(2),
                status: order.status,
                created_at: order.created_at.iso8601
              }
            end,
            order_history: customer.orders.order(created_at: :desc).limit(5).map do |order|
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

        def calculate_customer_average_order_value(customer)
          paid_orders = customer.orders.where(payment_status: 'paid')
          return 0 if paid_orders.empty?

          total = paid_orders.sum(:total).to_f
          (total / paid_orders.count).round(2)
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
              .select('users.*, SUM(orders.total) as total_revenue')
              .group('users.id')
              .order('total_revenue DESC')
              .limit(limit)
              .map do |customer|
            {
              id: customer.id,
              name: customer.name,
              email: customer.email,
              total_revenue: customer.total_revenue.to_f.round(2),
              orders_count: customer.orders.where(payment_status: 'paid').count
            }
          end
        end

        def generate_customers_csv(customers)
          require 'csv'

          CSV.generate(headers: true) do |csv|
            csv << ['ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Created At']

            customers.each do |customer|
              csv << [
                customer.id,
                customer.name,
                customer.email,
                customer.phone,
                customer.orders.count,
                customer.orders.where(payment_status: 'paid').sum(:total),
                customer.created_at.strftime('%Y-%m-%d %H:%M:%S')
              ]
            end
          end
        end
      end
    end
  end
end
