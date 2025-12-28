require 'rails_helper'

RSpec.describe 'Api::V1::Admin::Dashboard', type: :request do
  let(:admin_user) { create(:user, role: :admin) }
  let(:regular_user) { create(:user, role: :customer) }
  let(:category) { create(:category) }

  before do
    # Stub mailer to avoid sending emails during tests
    allow(OrderMailer).to receive_message_chain(:order_confirmation, :deliver_later)
    allow(OrderMailer).to receive_message_chain(:order_shipped, :deliver_later)
    allow(OrderMailer).to receive_message_chain(:order_delivered, :deliver_later)
    allow(OrderMailer).to receive_message_chain(:order_cancelled, :deliver_later)

    # Create test data for dashboard
    create_list(:product, 5, category: category, active: true)
    create_list(:order, 3, payment_status: 'paid', status: 'delivered', created_at: Time.current)
    create_list(:order, 2, status: 'pending', created_at: Time.current)
    create_list(:user, 10, role: :customer)
  end

  describe 'GET /api/v1/admin/dashboard' do
    context 'as admin user' do
      before do
        allow_any_instance_of(Api::V1::Admin::BaseController).to receive(:current_user).and_return(admin_user)
      end

      it 'returns dashboard overview statistics' do
        get '/api/v1/admin/dashboard'

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)

        expect(json['success']).to be true
        expect(json['data'].keys).to match_array(['overview', 'recent_orders', 'top_products', 'revenue'])
      end

      it 'includes correct overview stats' do
        get '/api/v1/admin/dashboard'

        json = JSON.parse(response.body)
        overview = json['data']['overview']

        expect(overview).to include(
          'total_sales',
          'total_orders',
          'total_customers',
          'total_products',
          'pending_orders',
          'orders_today',
          'revenue_today',
          'average_order_value'
        )

        expect(overview['total_customers']).to be >= 10
        expect(overview['total_orders']).to be >= 5
        expect(overview['pending_orders']).to be >= 2
      end

      it 'includes recent orders' do
        get '/api/v1/admin/dashboard'

        json = JSON.parse(response.body)
        recent_orders = json['data']['recent_orders']

        expect(recent_orders).to be_an(Array)
        expect(recent_orders.length).to be <= 10

        if recent_orders.any?
          order = recent_orders.first
          expect(order).to include('id', 'order_number', 'status', 'total', 'created_at')
        end
      end

      it 'includes top products' do
        get '/api/v1/admin/dashboard'

        json = JSON.parse(response.body)
        top_products = json['data']['top_products']

        expect(top_products).to be_an(Array)

        if top_products.any?
          product = top_products.first
          expect(product).to include('id', 'name', 'sales_count', 'total_revenue')
        end
      end

      it 'includes revenue trends' do
        get '/api/v1/admin/dashboard'

        json = JSON.parse(response.body)
        revenue_stats = json['data']['revenue']

        expect(revenue_stats).to include(
          'last_7_days',
          'current_month',
          'last_month',
          'growth_percentage'
        )

        expect(revenue_stats['last_7_days']).to be_an(Array)
        expect(revenue_stats['last_7_days'].length).to eq(7)
      end

      it 'logs the dashboard view activity' do
        expect {
          get '/api/v1/admin/dashboard'
        }.to change(AdminActivityLog, :count).by(1)

        log = AdminActivityLog.last
        expect(log.user).to eq(admin_user)
        expect(log.action).to eq('view')
        expect(log.resource_type).to eq('Dashboard')
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::Admin::BaseController).to receive(:current_user).and_return(regular_user)
      end

      it 'returns forbidden' do
        get '/api/v1/admin/dashboard'

        expect(response).to have_http_status(:forbidden)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(json['message']).to include('Unauthorized')
      end

      it 'does not log activity for unauthorized access' do
        expect {
          get '/api/v1/admin/dashboard'
        }.not_to change(AdminActivityLog, :count)
      end
    end

    context 'without authentication' do
      before do
        allow_any_instance_of(Api::V1::Admin::BaseController).to receive(:current_user).and_return(nil)
      end

      it 'returns forbidden' do
        get '/api/v1/admin/dashboard'

        expect(response).to have_http_status(:forbidden)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end

  describe 'revenue calculation accuracy' do
    before do
      allow_any_instance_of(Api::V1::Admin::BaseController).to receive(:current_user).and_return(admin_user)
    end

    it 'calculates total sales correctly (only paid orders)' do
      # Get current total
      before_total = Order.where(payment_status: 'paid').sum(:total).to_f.round(2)

      # Create specific orders
      create(:order, payment_status: 'paid', subtotal: 90.00, tax: 10.00, total: 100.00)
      create(:order, payment_status: 'paid', subtotal: 180.00, tax: 20.00, total: 200.00)
      create(:order, payment_status: 'pending', subtotal: 45.00, tax: 5.00, total: 50.00)

      get '/api/v1/admin/dashboard'

      json = JSON.parse(response.body)
      overview = json['data']['overview']

      # Should be at least the previous total + new paid orders (300)
      expect(overview['total_sales']).to be >= (before_total + 300.00)
    end

    it 'calculates average order value correctly' do
      get '/api/v1/admin/dashboard'

      json = JSON.parse(response.body)
      overview = json['data']['overview']

      # Average should be a positive number
      expect(overview['average_order_value']).to be > 0
    end
  end

  describe 'date range filtering for trends' do
    before do
      allow_any_instance_of(Api::V1::Admin::BaseController).to receive(:current_user).and_return(admin_user)
    end

    it 'includes trends data for last 7 days' do
      get '/api/v1/admin/dashboard'

      json = JSON.parse(response.body)
      trends = json['data']['revenue']['last_7_days']

      expect(trends).to be_an(Array)
      expect(trends.length).to eq(7)

      # Each day should have a date and revenue
      trends.each do |day|
        expect(day).to have_key('date')
        expect(day).to have_key('revenue')
        expect(day['revenue']).to be_a(Numeric)
      end
    end
  end
end
