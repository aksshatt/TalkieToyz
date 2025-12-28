module Api
  module V1
    module Admin
      class AnalyticsController < BaseController
        # GET /api/v1/admin/analytics
        def index
          analytics_data = {
            sales_by_category: sales_by_category,
            popular_products: popular_products,
            revenue_trends: revenue_trends,
            customer_demographics: customer_demographics,
            conversion_metrics: conversion_metrics,
            product_performance: product_performance
          }

          render_success(analytics_data, 'Analytics data retrieved successfully')
        end

        # GET /api/v1/admin/analytics/sales_by_category
        def sales_by_category
          period = params[:period] || '30days' # 7days, 30days, 90days, year

          date_from = case period
                      when '7days' then 7.days.ago
                      when '30days' then 30.days.ago
                      when '90days' then 90.days.ago
                      when 'year' then 1.year.ago
                      else 30.days.ago
                      end

          data = Category.joins(products: { order_items: :order })
                        .where('orders.created_at >= ? AND orders.payment_status = ?', date_from, 'paid')
                        .select('categories.id, categories.name,
                                SUM(order_items.total_price) as total_revenue,
                                SUM(order_items.quantity) as total_units_sold')
                        .group('categories.id, categories.name')
                        .order('total_revenue DESC')
                        .map do |category|
            {
              category_id: category.id,
              category_name: category.name,
              revenue: category.total_revenue.to_f.round(2),
              units_sold: category.total_units_sold,
              percentage: 0 # Will calculate below
            }
          end

          # Calculate percentages
          total_revenue = data.sum { |d| d[:revenue] }
          data.each do |item|
            item[:percentage] = total_revenue > 0 ? ((item[:revenue] / total_revenue) * 100).round(2) : 0
          end

          render_success(data, 'Sales by category retrieved successfully')
        end

        # GET /api/v1/admin/analytics/popular_products
        def popular_products
          limit = params[:limit]&.to_i || 10
          period = params[:period] || '30days'

          date_from = case period
                      when '7days' then 7.days.ago
                      when '30days' then 30.days.ago
                      when '90days' then 90.days.ago
                      when 'year' then 1.year.ago
                      else 30.days.ago
                      end

          data = Product.joins(order_items: :order)
                       .where('orders.created_at >= ? AND orders.payment_status = ?', date_from, 'paid')
                       .select('products.*,
                               SUM(order_items.quantity) as total_sold,
                               SUM(order_items.total_price) as total_revenue,
                               COUNT(DISTINCT orders.id) as order_count')
                       .group('products.id')
                       .order('total_sold DESC')
                       .limit(limit)
                       .map do |product|
            {
              product_id: product.id,
              product_name: product.name,
              units_sold: product.total_sold,
              revenue: product.total_revenue.to_f.round(2),
              order_count: product.order_count,
              average_order_quantity: (product.total_sold.to_f / product.order_count).round(2)
            }
          end

          render_success(data, 'Popular products retrieved successfully')
        end

        # GET /api/v1/admin/analytics/revenue_trends
        def revenue_trends
          period = params[:period] || 'monthly' # daily, weekly, monthly
          limit = params[:limit]&.to_i || 12

          data = case period
                when 'daily'
                  daily_revenue_trend(limit)
                when 'weekly'
                  weekly_revenue_trend(limit)
                when 'monthly'
                  monthly_revenue_trend(limit)
                else
                  monthly_revenue_trend(limit)
                end

          render_success(data, 'Revenue trends retrieved successfully')
        end

        # GET /api/v1/admin/analytics/customer_demographics
        def customer_demographics
          data = {
            total_customers: User.where(role: 'customer').count,
            new_customers_by_month: new_customers_by_month,
            customer_lifetime_value: customer_lifetime_value_distribution,
            order_frequency: order_frequency_distribution,
            geographic_distribution: geographic_distribution
          }

          render_success(data, 'Customer demographics retrieved successfully')
        end

        private

        def sales_by_category
          Category.joins(products: { order_items: :order })
                 .where('orders.created_at >= ? AND orders.payment_status = ?', 30.days.ago, 'paid')
                 .select('categories.id, categories.name,
                         SUM(order_items.total_price) as total_revenue,
                         SUM(order_items.quantity) as total_units_sold')
                 .group('categories.id, categories.name')
                 .order('total_revenue DESC')
                 .limit(10)
                 .map do |category|
            {
              category_id: category.id,
              category_name: category.name,
              revenue: category.total_revenue.to_f.round(2),
              units_sold: category.total_units_sold
            }
          end
        end

        def popular_products
          Product.joins(order_items: :order)
                .where('orders.created_at >= ? AND orders.payment_status = ?', 30.days.ago, 'paid')
                .select('products.*, SUM(order_items.quantity) as total_sold')
                .group('products.id')
                .order('total_sold DESC')
                .limit(10)
                .map do |product|
            {
              product_id: product.id,
              product_name: product.name,
              units_sold: product.total_sold,
              revenue: OrderItem.joins(:order)
                               .where(product_id: product.id)
                               .where('orders.payment_status = ?', 'paid')
                               .sum(:total_price).to_f.round(2)
            }
          end
        end

        def revenue_trends
          monthly_revenue_trend(12)
        end

        def customer_demographics
          {
            total_customers: User.where(role: 'customer').count,
            customers_with_orders: User.where(role: 'customer').joins(:orders).distinct.count,
            average_order_value: calculate_average_order_value,
            repeat_customer_rate: calculate_repeat_customer_rate
          }
        end

        def conversion_metrics
          total_customers = User.where(role: 'customer').count
          customers_with_orders = User.where(role: 'customer').joins(:orders).distinct.count

          {
            total_registered_users: total_customers,
            users_with_purchases: customers_with_orders,
            conversion_rate: total_customers > 0 ? ((customers_with_orders.to_f / total_customers) * 100).round(2) : 0,
            average_time_to_first_purchase: calculate_average_time_to_first_purchase
          }
        end

        def product_performance
          products_with_low_stock = Product.active.where('stock_quantity < ?', 10).count
          out_of_stock = Product.active.where(stock_quantity: 0).count

          {
            total_active_products: Product.active.count,
            low_stock_products: products_with_low_stock,
            out_of_stock_products: out_of_stock,
            average_product_rating: Product.active.average(:average_rating).to_f.round(2)
          }
        end

        def daily_revenue_trend(days = 30)
          (0...days).map do |days_ago|
            date = days_ago.days.ago.to_date
            revenue = Order.where('DATE(created_at) = ? AND payment_status = ?', date, 'paid')
                          .sum(:total).to_f.round(2)
            orders_count = Order.where('DATE(created_at) = ? AND payment_status = ?', date, 'paid').count

            {
              date: date.iso8601,
              revenue: revenue,
              orders_count: orders_count,
              average_order_value: orders_count > 0 ? (revenue / orders_count).round(2) : 0
            }
          end.reverse
        end

        def weekly_revenue_trend(weeks = 12)
          (0...weeks).map do |weeks_ago|
            week_start = weeks_ago.weeks.ago.beginning_of_week
            week_end = weeks_ago.weeks.ago.end_of_week

            revenue = Order.where(created_at: week_start..week_end, payment_status: 'paid')
                          .sum(:total).to_f.round(2)
            orders_count = Order.where(created_at: week_start..week_end, payment_status: 'paid').count

            {
              week_start: week_start.to_date.iso8601,
              week_end: week_end.to_date.iso8601,
              revenue: revenue,
              orders_count: orders_count
            }
          end.reverse
        end

        def monthly_revenue_trend(months = 12)
          (0...months).map do |months_ago|
            month_start = months_ago.months.ago.beginning_of_month
            month_end = months_ago.months.ago.end_of_month

            revenue = Order.where(created_at: month_start..month_end, payment_status: 'paid')
                          .sum(:total).to_f.round(2)
            orders_count = Order.where(created_at: month_start..month_end, payment_status: 'paid').count

            {
              month: month_start.strftime('%B %Y'),
              year: month_start.year,
              month_number: month_start.month,
              revenue: revenue,
              orders_count: orders_count,
              average_order_value: orders_count > 0 ? (revenue / orders_count).round(2) : 0
            }
          end.reverse
        end

        def new_customers_by_month(months = 6)
          (0...months).map do |months_ago|
            month_start = months_ago.months.ago.beginning_of_month
            month_end = months_ago.months.ago.end_of_month

            count = User.where(role: 'customer')
                       .where(created_at: month_start..month_end)
                       .count

            {
              month: month_start.strftime('%B %Y'),
              new_customers: count
            }
          end.reverse
        end

        def customer_lifetime_value_distribution
          ranges = [
            { label: '$0-$100', min: 0, max: 100 },
            { label: '$100-$500', min: 100, max: 500 },
            { label: '$500-$1000', min: 500, max: 1000 },
            { label: '$1000+', min: 1000, max: Float::INFINITY }
          ]

          ranges.map do |range|
            count = User.where(role: 'customer')
                       .joins(:orders)
                       .where(orders: { payment_status: 'paid' })
                       .select('users.id')
                       .group('users.id')
                       .having('SUM(orders.total) >= ? AND SUM(orders.total) < ?', range[:min], range[:max])
                       .count
                       .size

            {
              range: range[:label],
              customer_count: count
            }
          end
        end

        def order_frequency_distribution
          [
            { label: '1 order', count: User.where(role: 'customer').joins(:orders).group('users.id').having('COUNT(orders.id) = 1').count.size },
            { label: '2-3 orders', count: User.where(role: 'customer').joins(:orders).group('users.id').having('COUNT(orders.id) BETWEEN 2 AND 3').count.size },
            { label: '4-10 orders', count: User.where(role: 'customer').joins(:orders).group('users.id').having('COUNT(orders.id) BETWEEN 4 AND 10').count.size },
            { label: '10+ orders', count: User.where(role: 'customer').joins(:orders).group('users.id').having('COUNT(orders.id) > 10').count.size }
          ]
        end

        def geographic_distribution
          # Group by state from shipping addresses
          Order.select("shipping_address->>'state' as state, COUNT(*) as order_count")
               .where.not(shipping_address: nil)
               .group("shipping_address->>'state'")
               .order('order_count DESC')
               .limit(10)
               .map do |result|
            {
              state: result.state,
              order_count: result.order_count
            }
          end
        end

        def calculate_average_order_value
          orders = Order.where(payment_status: 'paid')
          return 0 if orders.empty?

          (orders.sum(:total).to_f / orders.count).round(2)
        end

        def calculate_repeat_customer_rate
          total_customers_with_orders = User.where(role: 'customer').joins(:orders).distinct.count
          return 0 if total_customers_with_orders.zero?

          repeat_customers = User.where(role: 'customer')
                                .joins(:orders)
                                .group('users.id')
                                .having('COUNT(orders.id) > 1')
                                .count
                                .size

          ((repeat_customers.to_f / total_customers_with_orders) * 100).round(2)
        end

        def calculate_average_time_to_first_purchase
          users_with_orders = User.where(role: 'customer')
                                 .joins(:orders)
                                 .select('users.id, users.created_at, MIN(orders.created_at) as first_order_date')
                                 .group('users.id, users.created_at')

          return 0 if users_with_orders.empty?

          total_days = users_with_orders.sum do |user|
            (user.first_order_date.to_date - user.created_at.to_date).to_i
          end

          (total_days.to_f / users_with_orders.count).round(2)
        end
      end
    end
  end
end
