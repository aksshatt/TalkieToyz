require 'rails_helper'

RSpec.describe RazorpayService do
  describe '.verify_payment_signature' do
    let(:secret) { 'test_webhook_secret' }
    let(:order_id) { 'order_abc123' }
    let(:payment_id) { 'pay_xyz789' }
    let(:valid_signature) do
      OpenSSL::HMAC.hexdigest('sha256', secret, "#{order_id}|#{payment_id}")
    end

    context 'with valid signature' do
      it 'returns true' do
        allow(Razorpay::Utility).to receive(:verify_payment_signature).and_return(true)

        result = described_class.verify_payment_signature(
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id,
          razorpay_signature: valid_signature
        )

        expect(result).to be true
      end
    end

    context 'with invalid signature' do
      it 'returns false' do
        allow(Razorpay::Utility).to receive(:verify_payment_signature)
          .and_raise(Razorpay::Error.new('Signature mismatch'))

        result = described_class.verify_payment_signature(
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id,
          razorpay_signature: 'bad_signature'
        )

        expect(result).to be false
      end
    end
  end

  describe '.fetch_payment' do
    let(:payment_id) { 'pay_xyz789' }

    context 'when payment exists' do
      it 'returns the payment object' do
        fake_payment = double('Razorpay::Payment', id: payment_id, amount: 11500)
        allow(Razorpay::Payment).to receive(:fetch).with(payment_id).and_return(fake_payment)

        result = described_class.fetch_payment(payment_id)
        expect(result).to eq(fake_payment)
      end
    end

    context 'when Razorpay raises an error' do
      it 'returns nil' do
        allow(Razorpay::Payment).to receive(:fetch).and_raise(Razorpay::Error.new('Not found'))

        result = described_class.fetch_payment(payment_id)
        expect(result).to be_nil
      end
    end
  end

  describe '.create_refund' do
    let(:payment_id) { 'pay_xyz789' }
    let(:amount) { 115.0 }

    context 'when refund succeeds' do
      it 'calls refund with amount in paise' do
        fake_payment = double('Razorpay::Payment')
        fake_refund  = double('Razorpay::Refund', id: 'rfnd_001')

        allow(Razorpay::Payment).to receive(:fetch).with(payment_id).and_return(fake_payment)
        expect(fake_payment).to receive(:refund).with(amount: 11500).and_return(fake_refund)

        result = described_class.create_refund(payment_id, amount)
        expect(result).to eq(fake_refund)
      end
    end

    context 'when Razorpay raises an error' do
      it 'returns nil' do
        allow(Razorpay::Payment).to receive(:fetch).and_raise(Razorpay::Error.new('Payment not found'))

        result = described_class.create_refund(payment_id, amount)
        expect(result).to be_nil
      end
    end
  end
end
