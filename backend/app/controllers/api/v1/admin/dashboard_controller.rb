module Api
  module V1
    module Admin
      class DashboardController < BaseController
        # GET /api/v1/admin/dashboard
        def index
          log_activity('view', 'Dashboard')

          stats = {
            overview: overview_stats,
            recent_orders: recent_orders_stats,
            top_products: top_products_stats,
            revenue: revenue_stats
          }

          render_success(stats, 'Dashboard stats retrieved successfully')
        end

        private

        def overview_stats
          today_start = Time.current.beginning_of_day
          paid_orders = Order.where(payment_status: 'paid')
          total_sales = paid_orders.sum(:total).to_f.round(2)
          paid_count = paid_orders.count

          {
            total_sales: total_sales,
            total_orders: Order.count,
            total_customers: User.where(role: 'customer').count,
            total_products: Product.active.count,
            pending_orders: Order.where(status: 'pending').count,
            orders_today: Order.where('created_at >= ?', today_start).count,
            revenue_today: Order.where('created_at >= ? AND payment_status = ?', today_start, 'paid').sum(:total).to_f.round(2),
            average_order_value: paid_count > 0 ? (total_sales / paid_count).round(2) : 0
          }
        end

        def recent_orders_stats
          Order.includes(:user, :order_items)
               .order(created_at: :desc)
               .limit(10)
               .map do |order|
            {
              id: order.id,
              order_number: order.order_number,
              customer_name: order.user.name,
              total: order.total.to_f.round(2),
              status: order.status,
              payment_status: order.payment_status,
              created_at: order.created_at.iso8601
            }
          end
        end

        def top_products_stats
          # Get top 5 products by order count in last 30 days
          OrderItem.joins(:product, :order)
                   .where('orders.created_at >= ?', 30.days.ago)
                   .group('products.id, products.name')
                   .select('products.id, products.name, SUM(order_items.quantity) as total_sold,
                           SUM(order_items.total_price) as total_revenue')
                   .order('total_sold DESC')
                   .limit(5)
                   .map do |item|
            {
              product_id: item.id,
              product_name: item.name,
              units_sold: item.total_sold,
              revenue: item.total_revenue.to_f.round(2)
            }
          end
        end

        def revenue_stats
          # Last 7 days revenue — single GROUP BY query instead of 7 individual queries
          start_date = 6.days.ago.beginning_of_day
          daily_rows = Order.where('created_at >= ? AND payment_status = ?', start_date, 'paid')
                            .group("DATE(created_at)")
                            .sum(:total)

          last_7_days = (0..6).map do |days_ago|
            date = days_ago.days.ago.to_date
            { date: date.iso8601, revenue: daily_rows[date].to_f.round(2) }
          end.reverse

          # Monthly comparison
          current_month = Order.where('created_at >= ? AND payment_status = ?',
                                      Time.current.beginning_of_month, 'paid')
                              .sum(:total).to_f.round(2)
          last_month = Order.where('created_at >= ? AND created_at < ? AND payment_status = ?',
                                   1.month.ago.beginning_of_month,
                                   Time.current.beginning_of_month,
                                   'paid')
                           .sum(:total).to_f.round(2)

          {
            last_7_days: last_7_days,
            current_month: current_month,
            last_month: last_month,
            growth_percentage: calculate_growth_percentage(current_month, last_month)
          }
        end

        def calculate_growth_percentage(current, previous)
          return 0 if previous.zero?
          ((current - previous) / previous * 100).round(2)
        end
      end
    end
  end
end
