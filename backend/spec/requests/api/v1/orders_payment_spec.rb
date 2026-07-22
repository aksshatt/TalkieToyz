require 'rails_helper'

RSpec.describe 'POST /api/v1/orders/:id/payment/verify', type: :request do
  let(:user)  { create(:user) }
  let(:order) { create(:order, user: user, payment_intent_id: 'order_rzp_abc', total: 115.0) }
  let(:headers) { auth_headers(user) }

  let(:razorpay_order_id)   { 'order_rzp_abc' }
  let(:razorpay_payment_id) { 'pay_xyz789' }
  let(:razorpay_signature)  { 'valid_sig' }

  let(:base_params) do
    {
      razorpay_order_id:  razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature:  razorpay_signature
    }
  end

  let(:fake_payment) { double('Razorpay::Payment', amount: 11500) }

  def post_verify(params = base_params)
    post "/api/v1/orders/#{order.id}/payment/verify", params: params, headers: headers
  end

  before do
    allow(RazorpayService).to receive(:verify_payment_signature).and_return(true)
    allow(RazorpayService).to receive(:fetch_payment).and_return(fake_payment)
  end

  context 'happy path' do
    it 'returns 200 and confirms the order' do
      post_verify
      expect(response).to have_http_status(:ok)
      expect(order.reload.payment_status).to eq('paid')
      expect(order.reload.status).to eq('confirmed')
    end

    it 'clears the user cart' do
      cart = user.cart || create(:cart, user: user)
      allow_any_instance_of(Cart).to receive(:clear)
      post_verify
      expect(response).to have_http_status(:ok)
    end
  end

  context 'order not found' do
    it 'returns 404' do
      post "/api/v1/orders/99999999/payment/verify", params: base_params, headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end

  context 'order_id mismatch' do
    it 'returns 422 and marks payment failed' do
      post_verify(base_params.merge(razorpay_order_id: 'order_DIFFERENT'))
      expect(response).to have_http_status(:unprocessable_entity)
      expect(order.reload.payment_status).to eq('failed')
    end
  end

  context 'signature verification fails' do
    before { allow(RazorpayService).to receive(:verify_payment_signature).and_return(false) }

    it 'returns 422 and marks payment failed' do
      post_verify
      expect(response).to have_http_status(:unprocessable_entity)
      expect(order.reload.payment_status).to eq('failed')
    end
  end

  context 'amount mismatch' do
    let(:wrong_amount_payment) { double('Razorpay::Payment', amount: 5000) }

    before { allow(RazorpayService).to receive(:fetch_payment).and_return(wrong_amount_payment) }

    it 'returns 422 and marks payment failed' do
      post_verify
      expect(response).to have_http_status(:unprocessable_entity)
      expect(order.reload.payment_status).to eq('failed')
    end
  end

  context 'fetch_payment returns nil' do
    before { allow(RazorpayService).to receive(:fetch_payment).and_return(nil) }

    it 'returns 422' do
      post_verify
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  context 'unauthenticated request' do
    it 'returns 401' do
      post "/api/v1/orders/#{order.id}/payment/verify", params: base_params
      expect(response).to have_http_status(:unauthorized)
    end
  end

  def auth_headers(user)
    token = JWT.encode(
      { user_id: user.id, email: user.email, role: user.role, type: 'access', exp: 24.hours.from_now.to_i },
      ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base,
      'HS256'
    )
    { 'Authorization' => "Bearer #{token}" }
  end
end
