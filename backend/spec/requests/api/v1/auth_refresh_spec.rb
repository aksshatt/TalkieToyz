require 'rails_helper'

RSpec.describe 'Auth Refresh Token', type: :request do
  let(:user) { create(:user, approval_status: 'approved') }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base }

  def generate_refresh_token(user, expires_at: 7.days.from_now)
    payload = {
      user_id: user.id,
      email:   user.email,
      type:    'refresh',
      exp:     expires_at.to_i
    }
    raw = JWT.encode(payload, jwt_secret, 'HS256')
    RefreshToken.store!(user: user, raw_token: raw, expires_at: expires_at)
    raw
  end

  def generate_access_token(user)
    payload = {
      user_id: user.id,
      email:   user.email,
      role:    user.role,
      type:    'access',
      exp:     24.hours.from_now.to_i
    }
    JWT.encode(payload, jwt_secret, 'HS256')
  end

  describe 'POST /api/v1/auth/refresh' do
    context 'valid refresh token' do
      it 'returns new access and refresh tokens' do
        raw = generate_refresh_token(user)
        post '/api/v1/auth/refresh', params: { refresh_token: raw }

        expect(response).to have_http_status(:ok)
        body = JSON.parse(response.body)
        expect(body.dig('data', 'access_token')).to be_present
        expect(body.dig('data', 'refresh_token')).to be_present
      end

      it 'rotates the token (old token no longer valid)' do
        raw = generate_refresh_token(user)
        post '/api/v1/auth/refresh', params: { refresh_token: raw }

        # Second use of same token must fail
        post '/api/v1/auth/refresh', params: { refresh_token: raw }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'missing refresh token' do
      it 'returns 422' do
        post '/api/v1/auth/refresh', params: {}
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'expired refresh token' do
      it 'returns 401' do
        raw = generate_refresh_token(user, expires_at: 1.day.ago)
        post '/api/v1/auth/refresh', params: { refresh_token: raw }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'tampered/invalid JWT' do
      it 'returns 401' do
        post '/api/v1/auth/refresh', params: { refresh_token: 'not.a.jwt' }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'access token passed as refresh token' do
      it 'returns 401 (wrong type)' do
        access = generate_access_token(user)
        # Store it as if it's a refresh token so JWT decodes fine but type check fails
        post '/api/v1/auth/refresh', params: { refresh_token: access }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/auth/logout' do
    it 'revokes the refresh token so it cannot be used again' do
      raw        = generate_refresh_token(user)
      access_tok = generate_access_token(user)

      delete '/api/v1/auth/logout',
             params: { refresh_token: raw },
             headers: { 'Authorization' => "Bearer #{access_tok}" }

      expect(response).to have_http_status(:ok)

      post '/api/v1/auth/refresh', params: { refresh_token: raw }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'Password reset revokes all refresh tokens' do
    it 'invalidates existing sessions after password reset' do
      raw = generate_refresh_token(user)

      # Simulate password reset revocation directly (controller calls RevocationAllFor!)
      RefreshToken.revoke_all_for!(user)

      post '/api/v1/auth/refresh', params: { refresh_token: raw }
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
