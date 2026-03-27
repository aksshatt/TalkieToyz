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
          # Combine order aggregates into a single query
          today_start = Time.current.beginning_of_day
          order_stats = Order.select(
            'COUNT(*) AS total_orders',
            "SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END) AS total_sales",
            "SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) AS pending_orders",
            "SUM(CASE WHEN created_at >= '#{today_start.to_fs(:db)}' THEN 1 ELSE 0 END) AS orders_today",
            "SUM(CASE WHEN created_at >= '#{today_start.to_fs(:db)}' AND payment_status = 'paid' THEN total ELSE 0 END) AS revenue_today",
            "SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_orders_count"
          ).first

          total_sales = order_stats.total_sales.to_f.round(2)
          paid_count = order_stats.paid_orders_count.to_i
          avg_order_value = paid_count > 0 ? (total_sales / paid_count).round(2) : 0

          {
            total_sales: total_sales,
            total_orders: order_stats.total_orders.to_i,
            total_customers: User.where(role: 'customer').count,
            total_products: Product.active.count,
            pending_orders: order_stats.pending_orders.to_i,
            orders_today: order_stats.orders_today.to_i,
            revenue_today: order_stats.revenue_today.to_f.round(2),
            average_order_value: avg_order_value
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

          # Monthly comparison — single query with conditional aggregation
          month_start = Time.current.beginning_of_month
          prev_month_start = 1.month.ago.beginning_of_month
          monthly = Order.where('created_at >= ? AND payment_status = ?', prev_month_start, 'paid')
                         .select(
                           "SUM(CASE WHEN created_at >= '#{month_start.to_fs(:db)}' THEN total ELSE 0 END) AS current_month_total",
                           "SUM(CASE WHEN created_at < '#{month_start.to_fs(:db)}' THEN total ELSE 0 END) AS last_month_total"
                         ).first
          current_month = monthly.current_month_total.to_f.round(2)
          last_month = monthly.last_month_total.to_f.round(2)

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
