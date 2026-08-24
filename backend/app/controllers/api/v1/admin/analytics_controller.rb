module Api
  module V1
    module Admin
      class AnalyticsController < BaseController
        # GET /api/v1/admin/analytics
        def index
          period = params[:period] || '30days'
          analytics_data = Rails.cache.fetch("admin:analytics:index:#{period}", expires_in: 15.minutes) do
            {
              sales_by_category: sales_by_category,
              popular_products: popular_products,
              revenue_trends: revenue_trends,
              customer_demographics: customer_demographics,
              conversion_metrics: conversion_metrics,
              product_performance: product_performance
            }
          end

          render_success(analytics_data, 'Analytics data retrieved successfully')
        end

        # GET /api/v1/admin/analytics/sales_by_category
        def sales_by_category
          period = params[:period] || '30days' # 7days, 30days, 90days, year

          data = Rails.cache.fetch("admin:analytics:sales_by_category:#{period}", expires_in: 15.minutes) do
            date_from = case period
                        when '7days' then 7.days.ago
                        when '30days' then 30.days.ago
                        when '90days' then 90.days.ago
                        when 'year' then 1.year.ago
                        else 30.days.ago
                        end

            result = Category.joins(products: { order_items: :order })
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
            total_revenue = result.sum { |d| d[:revenue] }
            result.each do |item|
              item[:percentage] = total_revenue > 0 ? ((item[:revenue] / total_revenue) * 100).round(2) : 0
            end

            result
          end

          render_success(data, 'Sales by category retrieved successfully')
        end

        # GET /api/v1/admin/analytics/popular_products
        def popular_products
          limit = params[:limit]&.to_i || 10
          period = params[:period] || '30days'

          data = Rails.cache.fetch("admin:analytics:popular_products:#{period}:#{limit}", expires_in: 15.minutes) do
            date_from = case period
                        when '7days' then 7.days.ago
                        when '30days' then 30.days.ago
                        when '90days' then 90.days.ago
                        when 'year' then 1.year.ago
                        else 30.days.ago
                        end

            Product.joins(order_items: :order)
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
          end

          render_success(data, 'Popular products retrieved successfully')
        end

        # GET /api/v1/admin/analytics/revenue_trends
        def revenue_trends
          period = params[:period] || 'monthly' # daily, weekly, monthly
          limit = params[:limit]&.to_i || 12

          data = Rails.cache.fetch("admin:analytics:revenue_trends:#{period}:#{limit}", expires_in: 15.minutes) do
            case period
            when 'daily'
              daily_revenue_trend(limit)
            when 'weekly'
              weekly_revenue_trend(limit)
            when 'monthly'
              monthly_revenue_trend(limit)
            else
              monthly_revenue_trend(limit)
            end
          end

          render_success(data, 'Revenue trends retrieved successfully')
        end

        # GET /api/v1/admin/analytics/customer_demographics
        def customer_demographics
          data = Rails.cache.fetch("admin:analytics:customer_demographics", expires_in: 15.minutes) do
            {
              total_customers: User.where(role: 'customer').count,
              new_customers_by_month: new_customers_by_month,
              customer_lifetime_value: customer_lifetime_value_distribution,
              order_frequency: order_frequency_distribution,
              geographic_distribution: geographic_distribution
            }
          end

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
                .select('products.*, SUM(order_items.quantity) as total_sold, SUM(order_items.total_price) as total_revenue')
                .group('products.id')
                .order('total_sold DESC')
                .limit(10)
                .map do |product|
            {
              product_id: product.id,
              product_name: product.name,
              units_sold: product.total_sold,
              revenue: product.total_revenue.to_f.round(2)
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
          counts = User.where(role: 'customer')
                       .select('COUNT(*) as total, COUNT(DISTINCT orders.id) FILTER (WHERE orders.id IS NOT NULL) as with_orders')
                       .joins('LEFT OUTER JOIN orders ON orders.user_id = users.id')
                       .take
          total_customers = counts.total.to_i
          customers_with_orders = counts.with_orders.to_i

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
            average_product_rating: Review.average(:rating).to_f.round(2)
          }
        end

        def daily_revenue_trend(days = 30)
          start_date = (days - 1).days.ago.beginning_of_day
          rows = Order.where('created_at >= ? AND payment_status = ?', start_date, 'paid')
                      .group('DATE(created_at)')
                      .select('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders_count')
          by_date = rows.index_by { |r| r.date.to_date }

          (0...days).map do |days_ago|
            date = days_ago.days.ago.to_date
            row = by_date[date]
            revenue = row&.revenue.to_f.round(2)
            count = row&.orders_count.to_i
            {
              date: date.iso8601,
              revenue: revenue,
              orders_count: count,
              average_order_value: count > 0 ? (revenue / count).round(2) : 0
            }
          end.reverse
        end

        def weekly_revenue_trend(weeks = 12)
          start_date = (weeks - 1).weeks.ago.beginning_of_week
          rows = Order.where('created_at >= ? AND payment_status = ?', start_date, 'paid')
                      .group("DATE_TRUNC('week', created_at)")
                      .select("DATE_TRUNC('week', created_at) as week_start, SUM(total) as revenue, COUNT(*) as orders_count")
          by_week = rows.index_by { |r| r.week_start.to_date }

          (0...weeks).map do |weeks_ago|
            week_start = weeks_ago.weeks.ago.beginning_of_week.to_date
            week_end = weeks_ago.weeks.ago.end_of_week.to_date
            row = by_week[week_start]
            {
              week_start: week_start.iso8601,
              week_end: week_end.iso8601,
              revenue: row&.revenue.to_f.round(2),
              orders_count: row&.orders_count.to_i
            }
          end.reverse
        end

        def monthly_revenue_trend(months = 12)
          start_date = (months - 1).months.ago.beginning_of_month
          rows = Order.where('created_at >= ? AND payment_status = ?', start_date, 'paid')
                      .group("DATE_TRUNC('month', created_at)")
                      .select("DATE_TRUNC('month', created_at) as month_start, SUM(total) as revenue, COUNT(*) as orders_count")
          by_month = rows.index_by { |r| r.month_start.to_date }

          (0...months).map do |months_ago|
            month_start = months_ago.months.ago.beginning_of_month
            row = by_month[month_start.to_date]
            revenue = row&.revenue.to_f.round(2)
            count = row&.orders_count.to_i
            {
              month: month_start.strftime('%B %Y'),
              year: month_start.year,
              month_number: month_start.month,
              revenue: revenue,
              orders_count: count,
              average_order_value: count > 0 ? (revenue / count).round(2) : 0
            }
          end.reverse
        end

        def new_customers_by_month(months = 6)
          start_date = (months - 1).months.ago.beginning_of_month
          rows = User.where(role: 'customer')
                     .where('created_at >= ?', start_date)
                     .group("DATE_TRUNC('month', created_at)")
                     .select("DATE_TRUNC('month', created_at) as month_start, COUNT(*) as new_customers")
          by_month = rows.index_by { |r| r.month_start.to_date }

          (0...months).map do |months_ago|
            month_start = months_ago.months.ago.beginning_of_month
            row = by_month[month_start.to_date]
            {
              month: month_start.strftime('%B %Y'),
              new_customers: row&.new_customers.to_i
            }
          end.reverse
        end

        def customer_lifetime_value_distribution
          # Single query: bucket each customer's lifetime spend, then count per bucket
          buckets = User.where(role: 'customer')
                        .joins(:orders)
                        .where(orders: { payment_status: 'paid' })
                        .group('users.id')
                        .select(<<~SQL)
                          CASE
                            WHEN SUM(orders.total) < 100   THEN '$0-$100'
                            WHEN SUM(orders.total) < 500   THEN '$100-$500'
                            WHEN SUM(orders.total) < 1000  THEN '$500-$1000'
                            ELSE '$1000+'
                          END as ltv_range
                        SQL
          counts = buckets.group_by(&:ltv_range).transform_values(&:count)

          [
            { range: '$0-$100',    customer_count: counts['$0-$100'].to_i },
            { range: '$100-$500',  customer_count: counts['$100-$500'].to_i },
            { range: '$500-$1000', customer_count: counts['$500-$1000'].to_i },
            { range: '$1000+',     customer_count: counts['$1000+'].to_i }
          ]
        end

        def order_frequency_distribution
          # Single query: bucket each customer's order count, then count per bucket
          buckets = User.where(role: 'customer')
                        .joins(:orders)
                        .group('users.id')
                        .select(<<~SQL)
                          CASE
                            WHEN COUNT(orders.id) = 1              THEN '1 order'
                            WHEN COUNT(orders.id) BETWEEN 2 AND 3  THEN '2-3 orders'
                            WHEN COUNT(orders.id) BETWEEN 4 AND 10 THEN '4-10 orders'
                            ELSE '10+ orders'
                          END as freq_range
                        SQL
          counts = buckets.group_by(&:freq_range).transform_values(&:count)

          [
            { label: '1 order',     count: counts['1 order'].to_i },
            { label: '2-3 orders',  count: counts['2-3 orders'].to_i },
            { label: '4-10 orders', count: counts['4-10 orders'].to_i },
            { label: '10+ orders',  count: counts['10+ orders'].to_i }
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
          rows = User.where(role: 'customer')
                     .joins(:orders)
                     .group('users.id')
                     .select('users.created_at as signup_at, MIN(orders.created_at) as first_order_at')
          return 0 if rows.empty?

          days = rows.map { |r| (r.first_order_at - r.signup_at) / 86400.0 }
          (days.sum / days.size).round(2)
        end
      end
    end
  end
end
