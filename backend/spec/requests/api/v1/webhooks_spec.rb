require 'rails_helper'

RSpec.describe 'Webhooks', type: :request do
  let(:webhook_secret) { 'test_webhook_secret' }

  def razorpay_signature(body)
    OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), webhook_secret, body)
  end

  def post_razorpay(payload, sig: nil)
    body = payload.to_json
    sig ||= razorpay_signature(body)
    post '/api/v1/webhooks/razorpay',
         params: body,
         headers: {
           'Content-Type'        => 'application/json',
           'X-Razorpay-Signature' => sig
         }
  end

  before do
    stub_const('ENV', ENV.to_hash.merge('RAZORPAY_WEBHOOK_SECRET' => webhook_secret))
  end

  describe 'POST /api/v1/webhooks/razorpay' do
    context 'invalid signature' do
      it 'returns 401' do
        post_razorpay({ event: 'payment.captured' }, sig: 'bad_sig')
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'payment.captured event' do
      let(:order) { create(:order, payment_intent_id: 'order_rzp_001', status: :pending) }

      let(:payload) do
        {
          event: 'payment.captured',
          payload: {
            payment: {
              entity: {
                id: 'pay_cap001',
                order_id: order.payment_intent_id,
                amount: (order.total.to_f * 100).round
              }
            }
          }
        }
      end

      it 'returns 200' do
        post_razorpay(payload)
        expect(response).to have_http_status(:ok)
      end

      it 'marks order as confirmed with paid status' do
        post_razorpay(payload)
        order.reload
        expect(order.payment_status).to eq('paid')
        expect(order.status).to eq('confirmed')
      end

      it 'stores payment details on order' do
        post_razorpay(payload)
        expect(order.reload.payment_details['razorpay_payment_id']).to eq('pay_cap001')
      end
    end

    context 'payment.failed event' do
      let(:product) { create(:product, stock_quantity: 5) }
      let(:order)   { create(:order, payment_intent_id: 'order_rzp_002', status: :pending) }
      let!(:item)   { create(:order_item, order: order, product: product, quantity: 1) }

      let(:payload) do
        {
          event: 'payment.failed',
          payload: {
            payment: {
              entity: {
                order_id: order.payment_intent_id,
                error_description: 'Insufficient funds'
              }
            }
          }
        }
      end

      it 'returns 200' do
        post_razorpay(payload)
        expect(response).to have_http_status(:ok)
      end

      it 'marks order payment as failed and cancels it' do
        post_razorpay(payload)
        order.reload
        expect(order.payment_status).to eq('failed')
        expect(order.status).to eq('cancelled')
      end

      it 'restores stock' do
        expect { post_razorpay(payload) }
          .to change { product.reload.stock_quantity }.from(5).to(6)
      end
    end

    context 'refund.created event' do
      let(:order) do
        create(:order, :confirmed,
               payment_details: { 'razorpay_payment_id' => 'pay_paid001' },
               refund_status: :no_refund)
      end

      let(:payload) do
        {
          event: 'refund.created',
          payload: {
            refund: {
              entity: {
                id: 'rfnd_001',
                payment_id: 'pay_paid001'
              }
            }
          }
        }
      end

      it 'sets refund_status to refund_processing' do
        post_razorpay(payload)
        expect(order.reload.refund_status).to eq('refund_processing')
      end
    end

    context 'refund.processed event' do
      let(:order) do
        create(:order, :confirmed,
               payment_details: { 'razorpay_payment_id' => 'pay_paid002' },
               refund_status: :refund_processing)
      end

      let(:payload) do
        {
          event: 'refund.processed',
          payload: {
            refund: {
              entity: {
                payment_id: 'pay_paid002',
                amount: 11500
              }
            }
          }
        }
      end

      it 'marks refund as completed and stores amount' do
        post_razorpay(payload)
        order.reload
        expect(order.refund_status).to eq('refund_completed')
        expect(order.refund_amount.to_f).to eq(115.0)
      end

      it 'enqueues refund email' do
        expect { post_razorpay(payload) }
          .to have_enqueued_mail(OrderMailer, :refund_processed)
      end
    end

    context 'unknown event' do
      it 'returns 200 and ignores' do
        post_razorpay({ event: 'subscription.activated', payload: {} })
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'POST /api/v1/webhooks/shipping (Shiprocket)' do
    let(:token) { 'shiprocket_secret_token' }

    before do
      stub_const('ENV', ENV.to_hash.merge('SHIPROCKET_WEBHOOK_TOKEN' => token))
    end

    def post_shiprocket(payload, api_key: token)
      post '/api/v1/webhooks/shipping',
           params: payload.to_json,
           headers: {
             'Content-Type' => 'application/json',
             'x-api-key'    => api_key
           }
    end

    context 'invalid token' do
      it 'returns 401' do
        post_shiprocket({ awb: 'AWB001' }, api_key: 'wrong_token')
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ping / no AWB' do
      it 'returns 200' do
        post_shiprocket({})
        expect(response).to have_http_status(:ok)
      end
    end

    context 'valid AWB with known shipment' do
      let(:order)    { create(:order, :confirmed) }
      let!(:shipment) { create(:shipment, order: order, awb_code: 'AWB12345', status: 'Pending') }

      before do
        allow_any_instance_of(Shipment).to receive(:sync_order_status)
      end

      it 'updates shipment status' do
        expect_any_instance_of(Shipment).to receive(:sync_order_status)
        post_shiprocket({ awb: 'AWB12345', current_status: 'Shipped' })
      end

      it 'enqueues shipped email when status is Shipped' do
        order.update_columns(shipped_at: nil)
        expect { post_shiprocket({ awb: 'AWB12345', current_status: 'Shipped' }) }
          .to have_enqueued_mail(OrderMailer, :order_shipped)
      end

      it 'enqueues delivered email when status is Delivered' do
        order.update_columns(delivered_at: nil)
        expect { post_shiprocket({ awb: 'AWB12345', current_status: 'Delivered' }) }
          .to have_enqueued_mail(OrderMailer, :order_delivered)
      end

      it 'returns 200' do
        post_shiprocket({ awb: 'AWB12345', current_status: 'Shipped' })
        expect(response).to have_http_status(:ok)
      end
    end

    context 'unknown AWB' do
      it 'returns 200 and logs warning' do
        post_shiprocket({ awb: 'UNKNOWN999', current_status: 'Shipped' })
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
