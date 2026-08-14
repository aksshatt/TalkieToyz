require 'rails_helper'

RSpec.describe 'Cart', type: :request do
  let(:user)    { create(:user) }
  let(:product) { create(:product, stock_quantity: 10, price: 99.0) }
  let(:headers) { auth_headers(user) }

  def add_item(qty = 1)
    post '/api/v1/cart/items',
      params: { product_id: product.id, quantity: qty }.to_json,
      headers: headers
  end

  describe 'GET /api/v1/cart' do
    it 'returns empty cart for new user' do
      get '/api/v1/cart', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items']).to eq([])
    end

    it 'returns empty cart for unauthenticated user (guest cart)' do
      get '/api/v1/cart'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /api/v1/cart/items' do
    it 'adds item to cart' do
      add_item(2)
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items'].length).to eq(1)
      expect(json['data']['cart_items'].first['quantity']).to eq(2)
    end

    it 'increments quantity when same product added again' do
      add_item(1)
      add_item(2)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items'].first['quantity']).to eq(3)
    end

    it 'rejects quantity below 1' do
      post '/api/v1/cart/items',
        params: { product_id: product.id, quantity: 0 }.to_json,
        headers: headers
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'rejects unknown product' do
      post '/api/v1/cart/items',
        params: { product_id: 999999, quantity: 1 }.to_json,
        headers: headers
      expect(response).to have_http_status(:not_found).or have_http_status(:unprocessable_entity)
    end
  end

  describe 'PATCH /api/v1/cart/items/:id' do
    let!(:cart_item) do
      add_item(1)
      JSON.parse(response.body)['data']['cart_items'].first
    end

    it 'updates quantity' do
      patch "/api/v1/cart/items/#{cart_item['id']}",
        params: { quantity: 5 }.to_json,
        headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items'].first['quantity']).to eq(5)
    end

    it 'returns 401 without token' do
      patch "/api/v1/cart/items/#{cart_item['id']}", params: { quantity: 2 }.to_json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /api/v1/cart/items/:id' do
    let!(:cart_item) do
      add_item(1)
      JSON.parse(response.body)['data']['cart_items'].first
    end

    it 'removes item from cart' do
      delete "/api/v1/cart/items/#{cart_item['id']}", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items']).to eq([])
    end
  end

  describe 'DELETE /api/v1/cart/clear' do
    it 'clears all items' do
      add_item(2)
      delete '/api/v1/cart/clear', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['cart_items']).to eq([])
    end
  end
end
