require 'rails_helper'

RSpec.describe PaymentService do
  let(:user)  { create(:user) }
  let(:order) { create(:order, user: user, payment_method: 'razorpay', payment_intent_id: 'order_rzp_123') }

  describe '.create_razorpay_order' do
    context 'when payment method is razorpay' do
      let(:fake_rzp_order) { double('RazorpayOrder', id: 'order_rzp_123', amount: 10000) }

      before { allow(RazorpayService).to receive(:create_order).and_return(fake_rzp_order) }

      it 'returns success with razorpay order data' do
        result = described_class.create_razorpay_order(order)
        expect(result).to be_success
        expect(result.data[:razorpay_order_id]).to eq('order_rzp_123')
        expect(result.data[:amount]).to eq(10000)
      end
    end

    context 'when RazorpayService returns nil' do
      before { allow(RazorpayService).to receive(:create_order).and_return(nil) }

      it 'returns failure' do
        result = described_class.create_razorpay_order(order)
        expect(result).not_to be_success
        expect(result.error).to match(/failed/i)
      end
    end

    context 'when order is not razorpay' do
      let(:cod_order) { create(:order, user: user, payment_method: 'cod') }

      it 'returns failure' do
        result = described_class.create_razorpay_order(cod_order)
        expect(result).not_to be_success
      end
    end
  end

  describe '.verify_payment' do
    let(:fake_payment) { double('Payment', amount: (order.total.to_f * 100).round.to_i) }
    let(:valid_params) do
      {
        razorpay_order_id: 'order_rzp_123',
        razorpay_payment_id: 'pay_abc',
        razorpay_signature: 'sig_xyz'
      }
    end

    before do
      allow(RazorpayService).to receive(:verify_payment_signature).and_return(true)
      allow(RazorpayService).to receive(:fetch_payment).and_return(fake_payment)
    end

    it 'returns success and marks order paid' do
      result = described_class.verify_payment(order, **valid_params)
      expect(result).to be_success
      expect(order.reload.payment_status).to eq('paid')
      expect(order.reload.status).to eq('confirmed')
    end

    it 'stores payment details on order' do
      described_class.verify_payment(order, **valid_params)
      expect(order.reload.payment_details['razorpay_payment_id']).to eq('pay_abc')
    end

    context 'when order_id mismatches' do
      it 'returns failure and marks payment failed' do
        result = described_class.verify_payment(
          order,
          razorpay_order_id: 'order_DIFFERENT',
          razorpay_payment_id: 'pay_abc',
          razorpay_signature: 'sig_xyz'
        )
        expect(result).not_to be_success
        expect(order.reload.payment_status).to eq('failed')
      end
    end

    context 'when signature verification fails' do
      before { allow(RazorpayService).to receive(:verify_payment_signature).and_return(false) }

      it 'returns failure and marks payment failed' do
        result = described_class.verify_payment(order, **valid_params)
        expect(result).not_to be_success
        expect(order.reload.payment_status).to eq('failed')
      end
    end

    context 'when amount mismatches' do
      let(:fake_payment) { double('Payment', amount: 5000) }

      it 'returns failure and marks payment failed' do
        result = described_class.verify_payment(order, **valid_params)
        expect(result).not_to be_success
        expect(order.reload.payment_status).to eq('failed')
      end
    end

    context 'when fetch_payment returns nil' do
      before { allow(RazorpayService).to receive(:fetch_payment).and_return(nil) }

      it 'returns failure' do
        result = described_class.verify_payment(order, **valid_params)
        expect(result).not_to be_success
      end
    end
  end

  describe '.retry_payment' do
    let(:retryable_order) do
      create(:order, user: user, payment_method: 'razorpay', payment_status: 'failed', status: :cancelled)
    end

    context 'when order cannot retry' do
      it 'returns failure for non-razorpay order' do
        cod = create(:order, user: user, payment_method: 'cod')
        result = described_class.retry_payment(cod)
        expect(result).not_to be_success
      end

      it 'returns failure when order not in retryable state' do
        paid_order = create(:order, :confirmed, user: user, payment_method: 'razorpay')
        result = described_class.retry_payment(paid_order)
        expect(result).not_to be_success
      end
    end

    context 'when retry is valid' do
      let(:awaiting_order) do
        create(:order, user: user, payment_method: 'razorpay',
               payment_status: 'awaiting_payment', status: :pending)
      end
      let(:fake_rzp_order) { double('RazorpayOrder', id: 'order_new_rzp', amount: 11500) }

      before { allow(RazorpayService).to receive(:create_order).and_return(fake_rzp_order) }

      it 'returns success with new razorpay order data' do
        result = described_class.retry_payment(awaiting_order)
        expect(result).to be_success
        expect(result.data[:razorpay_order_id]).to eq('order_new_rzp')
      end
    end
  end
end
