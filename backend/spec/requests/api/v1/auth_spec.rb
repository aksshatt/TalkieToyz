require 'rails_helper'

RSpec.describe 'Auth', type: :request do
  let(:password) { 'password123' }
  let(:user) { create(:user, password: password, password_confirmation: password) }

  describe 'POST /api/v1/auth/signup' do
    let(:valid_params) do
      {
        email: 'new@example.com',
        password: password,
        password_confirmation: password,
        name: 'New User',
        phone: '9876543210'
      }
    end

    it 'creates a user and returns tokens' do
      post '/api/v1/auth/signup', params: valid_params
      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['data']).to include('access_token', 'user')
    end

    it 'rejects duplicate email' do
      create(:user, email: valid_params[:email])
      post '/api/v1/auth/signup', params: valid_params
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'rejects mismatched passwords' do
      post '/api/v1/auth/signup', params: valid_params.merge(password_confirmation: 'wrong')
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'rejects missing required fields' do
      post '/api/v1/auth/signup', params: { email: 'x@example.com' }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'POST /api/v1/auth/login' do
    it 'returns tokens for valid credentials' do
      post '/api/v1/auth/login', params: { email: user.email, password: password }
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']).to include('access_token', 'refresh_token', 'user')
    end

    it 'rejects wrong password' do
      post '/api/v1/auth/login', params: { email: user.email, password: 'wrong' }
      expect(response).to have_http_status(:unauthorized)
    end

    it 'rejects unknown email' do
      post '/api/v1/auth/login', params: { email: 'nobody@example.com', password: password }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/v1/auth/me' do
    it 'returns current user when authenticated' do
      get '/api/v1/auth/me', headers: auth_headers(user)
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']['user']['email']).to eq(user.email)
    end

    it 'returns 401 without token' do
      get '/api/v1/auth/me'
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns 401 with invalid token' do
      get '/api/v1/auth/me', headers: { 'Authorization' => 'Bearer invalid.token.here' }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'DELETE /api/v1/auth/logout' do
    it 'succeeds when authenticated' do
      delete '/api/v1/auth/logout', headers: auth_headers(user)
      expect(response).to have_http_status(:ok)
    end

    it 'succeeds without token (idempotent logout)' do
      delete '/api/v1/auth/logout'
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'PATCH /api/v1/auth/profile' do
    it 'updates name and phone' do
      headers = auth_headers(user).except('Content-Type')
      patch '/api/v1/auth/profile',
        params: { name: 'Updated Name', phone: '9999999999' },
        headers: headers
      expect(response).to have_http_status(:ok)
      expect(user.reload.name).to eq('Updated Name')
    end

    it 'returns 401 without token' do
      patch '/api/v1/auth/profile', params: { name: 'X' }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
