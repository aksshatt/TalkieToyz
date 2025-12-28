require 'rails_helper'

RSpec.describe 'Api::V1::Products', type: :request do
  let(:admin_user) { create(:user, role: :admin) }
  let(:regular_user) { create(:user, role: :customer) }
  let(:category) { create(:category) }
  let!(:products) { create_list(:product, 5, category: category) }

  describe 'GET /api/v1/products' do
    context 'without filters' do
      it 'returns all active products' do
        get '/api/v1/products'

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data'].length).to eq(5)
        expect(json['meta']).to include('current_page', 'total_pages', 'total_count')
      end
    end

    context 'with pagination' do
      it 'paginates results' do
        get '/api/v1/products', params: { page: 1, per_page: 2 }

        json = JSON.parse(response.body)
        expect(json['data'].length).to eq(2)
        expect(json['meta']['total_count']).to eq(5)
        expect(json['meta']['total_pages']).to eq(3)
      end
    end

    context 'with category filter' do
      let(:other_category) { create(:category) }
      let!(:other_product) { create(:product, category: other_category) }

      it 'filters by category' do
        get '/api/v1/products', params: { category_id: category.id }

        json = JSON.parse(response.body)
        expect(json['data'].length).to eq(5)
        category_ids = json['data'].map { |p| p.dig('category', 'id') }.compact
        expect(category_ids).to all(eq(category.id))
      end
    end

    context 'with age filter' do
      let!(:kids_product) { create(:product, min_age: 3, max_age: 6) }
      let!(:teens_product) { create(:product, min_age: 10, max_age: 15) }

      it 'filters by age range' do
        get '/api/v1/products', params: { age: 5 }

        json = JSON.parse(response.body)
        product_ids = json['data'].map { |p| p['id'] }
        expect(product_ids).to include(kids_product.id)
        expect(product_ids).not_to include(teens_product.id)
      end
    end

    context 'with price range filter' do
      let!(:cheap_product) { create(:product, price: 10.00) }
      let!(:expensive_product) { create(:product, price: 100.00) }

      it 'filters by price range' do
        get '/api/v1/products', params: { min_price: 15, max_price: 50 }

        json = JSON.parse(response.body)
        prices = json['data'].map { |p| p['price'].to_f }
        expect(prices).not_to include(10.00)
        expect(prices).not_to include(100.00)
      end
    end

    context 'with search query' do
      let!(:searchable_product) { create(:product, name: 'Amazing Flashcards') }

      it 'searches products by name' do
        get '/api/v1/products', params: { q: 'flashcards' }

        json = JSON.parse(response.body)
        product_names = json['data'].map { |p| p['name'] }
        expect(product_names).to include('Amazing Flashcards')
      end
    end

    context 'with sorting' do
      let!(:product_a) { create(:product, name: 'AAA Product', price: 50, created_at: 1.day.ago) }
      let!(:product_b) { create(:product, name: 'ZZZ Product', price: 10, created_at: Time.current) }

      it 'sorts by price ascending' do
        get '/api/v1/products', params: { sort: 'price_asc' }

        json = JSON.parse(response.body)
        first_price = json['data'].first['price'].to_f
        last_price = json['data'].last['price'].to_f
        expect(first_price).to be <= last_price
      end

      it 'sorts by price descending' do
        get '/api/v1/products', params: { sort: 'price_desc' }

        json = JSON.parse(response.body)
        first_price = json['data'].first['price'].to_f
        last_price = json['data'].last['price'].to_f
        expect(first_price).to be >= last_price
      end

      it 'sorts by newest' do
        get '/api/v1/products', params: { sort: 'newest' }

        json = JSON.parse(response.body)
        expect(json['data'].first['id']).to eq(product_b.id)
      end
    end

    context 'with featured filter' do
      let!(:featured_product) { create(:product, :featured) }

      it 'filters featured products' do
        get '/api/v1/products', params: { featured: 'true' }

        json = JSON.parse(response.body)
        product_ids = json['data'].map { |p| p['id'] }
        expect(product_ids).to include(featured_product.id)
      end
    end

    context 'with stock filter' do
      let!(:in_stock_product) { create(:product, stock_quantity: 10) }
      let!(:out_of_stock_product) { create(:product, :out_of_stock) }

      it 'filters in-stock products' do
        get '/api/v1/products', params: { in_stock: 'true' }

        json = JSON.parse(response.body)
        product_ids = json['data'].map { |p| p['id'] }
        expect(product_ids).to include(in_stock_product.id)
        expect(product_ids).not_to include(out_of_stock_product.id)
      end
    end
  end

  describe 'GET /api/v1/products/:id' do
    let(:product) { products.first }

    it 'returns product details' do
      get "/api/v1/products/#{product.slug}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['success']).to be true
      expect(json['data']['id']).to eq(product.id)
      expect(json['data']['name']).to eq(product.name)
    end

    it 'increments view count' do
      expect {
        get "/api/v1/products/#{product.slug}"
      }.to change { product.reload.view_count }.by(1)
    end

    it 'returns 404 for non-existent product' do
      get '/api/v1/products/non-existent-slug'

      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['success']).to be false
    end
  end

  describe 'GET /api/v1/products/:id/related' do
    let(:product) { products.first }
    let!(:related_products) { create_list(:product, 3, category: product.category) }
    let!(:unrelated_product) { create(:product, category: create(:category)) }

    it 'returns related products from same category' do
      get "/api/v1/products/#{product.slug}/related"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data'].length).to be <= 4
      expect(json['data'].map { |p| p['id'] }).not_to include(product.id)
    end
  end

  describe 'POST /api/v1/products' do
    let(:valid_attributes) do
      {
        product: {
          name: 'New Product',
          description: 'Short description',
          long_description: 'Long description',
          price: 29.99,
          stock_quantity: 50,
          category_id: category.id,
          min_age: 4,
          max_age: 8
        }
      }
    end

    context 'as admin user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(admin_user)
      end

      it 'creates a new product' do
        expect {
          post '/api/v1/products', params: valid_attributes
        }.to change(Product, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data']['name']).to eq('New Product')
      end

      it 'returns errors for invalid product' do
        post '/api/v1/products', params: { product: { name: '' } }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(json['errors']).to be_present
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(regular_user)
      end

      it 'returns forbidden' do
        post '/api/v1/products', params: valid_attributes

        expect(response).to have_http_status(:forbidden)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end

  describe 'PATCH /api/v1/products/:id' do
    let(:product) { products.first }
    let(:update_attributes) do
      {
        product: {
          name: 'Updated Product Name',
          price: 39.99
        }
      }
    end

    context 'as admin user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(admin_user)
      end

      it 'updates the product' do
        patch "/api/v1/products/#{product.slug}", params: update_attributes

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data']['name']).to eq('Updated Product Name')
        expect(product.reload.name).to eq('Updated Product Name')
      end

      it 'returns errors for invalid update' do
        patch "/api/v1/products/#{product.slug}", params: { product: { price: -10 } }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(regular_user)
      end

      it 'returns forbidden' do
        patch "/api/v1/products/#{product.slug}", params: update_attributes

        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /api/v1/products/:id' do
    let(:product) { products.first }

    context 'as admin user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(admin_user)
      end

      it 'soft deletes the product' do
        delete "/api/v1/products/#{product.slug}"

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(product.reload.deleted_at).not_to be_nil
        expect(product.reload.active).to be false
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::BaseController).to receive(:current_user).and_return(regular_user)
      end

      it 'returns forbidden' do
        delete "/api/v1/products/#{product.slug}"

        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
