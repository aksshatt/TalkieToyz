require 'rails_helper'

RSpec.describe ProductVariant, type: :model do
  describe 'associations' do
    it { should belong_to(:product) }
  end

  describe 'validations' do
    subject { build(:product_variant) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:sku) }
    it { should validate_presence_of(:price) }
    it { should validate_uniqueness_of(:sku) }
    it { should validate_numericality_of(:price).is_greater_than(0) }
    it { should validate_numericality_of(:stock_quantity).only_integer.is_greater_than_or_equal_to(0) }
  end

  describe 'scopes' do
    let!(:active_variant) { create(:product_variant) }
    let!(:inactive_variant) { create(:product_variant, active: false) }
    let!(:deleted_variant) { create(:product_variant, deleted_at: Time.current) }
    let!(:out_of_stock_variant) { create(:product_variant, :out_of_stock) }

    describe '.active' do
      it 'returns only active and non-deleted variants' do
        expect(ProductVariant.active).to include(active_variant)
        expect(ProductVariant.active).not_to include(inactive_variant, deleted_variant)
      end
    end

    describe '.in_stock' do
      it 'returns variants with stock' do
        expect(ProductVariant.in_stock).to include(active_variant)
        expect(ProductVariant.in_stock).not_to include(out_of_stock_variant)
      end
    end
  end

  describe 'methods' do
    describe '#in_stock?' do
      it 'returns true when stock quantity is positive' do
        variant = build(:product_variant, stock_quantity: 10)
        expect(variant.in_stock?).to be true
      end

      it 'returns false when stock quantity is zero' do
        variant = build(:product_variant, stock_quantity: 0)
        expect(variant.in_stock?).to be false
      end
    end

    describe '#soft_delete' do
      it 'sets deleted_at and deactivates variant' do
        variant = create(:product_variant)
        variant.soft_delete

        expect(variant.deleted_at).not_to be_nil
        expect(variant.active).to be false
      end
    end
  end
end
