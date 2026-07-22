require 'rails_helper'

RSpec.describe Order, type: :model do
  describe '#payment_successful!' do
    let(:order) { create(:order, status: :pending, payment_status: 'awaiting_payment') }

    it 'marks payment as paid' do
      order.payment_successful!
      expect(order.reload.payment_status).to eq('paid')
    end

    it 'sets status to confirmed' do
      order.payment_successful!
      expect(order.reload.status).to eq('confirmed')
    end
  end

  describe '#payment_failed!' do
    context 'with a pending order with items' do
      let(:product) { create(:product, stock_quantity: 10) }
      let(:order)   { create(:order, status: :pending, payment_status: 'awaiting_payment') }
      let!(:item)   { create(:order_item, order: order, product: product, quantity: 2) }

      it 'marks payment as failed' do
        order.payment_failed!
        expect(order.reload.payment_status).to eq('failed')
      end

      it 'cancels the order' do
        order.payment_failed!
        expect(order.reload.status).to eq('cancelled')
      end

      it 'restores stock for each item' do
        expect { order.payment_failed! }
          .to change { product.reload.stock_quantity }.from(10).to(12)
      end
    end

    context 'when already failed and cancelled (idempotent)' do
      let(:product) { create(:product, stock_quantity: 10) }
      let(:order)   { create(:order, status: :cancelled, payment_status: 'failed') }
      let!(:item)   { create(:order_item, order: order, product: product, quantity: 2) }

      it 'does not restore stock a second time' do
        expect { order.payment_failed! }
          .not_to change { product.reload.stock_quantity }
      end
    end
  end

  describe '#can_refund?' do
    it 'returns true when paid and no refund in progress' do
      order = build(:order, :confirmed, refund_status: :no_refund)
      expect(order.can_refund?).to be true
    end

    it 'returns false when not paid' do
      order = build(:order, payment_status: 'awaiting_payment', refund_status: :no_refund)
      expect(order.can_refund?).to be false
    end

    it 'returns false when refund already completed' do
      order = build(:order, :confirmed, refund_status: :refund_completed)
      expect(order.can_refund?).to be false
    end

    it 'returns false when cancelled' do
      order = build(:order, :cancelled, payment_status: 'paid', refund_status: :no_refund)
      expect(order.can_refund?).to be false
    end
  end
end
