require 'rails_helper'

RSpec.describe Product, type: :model do
  describe 'associations' do
    it { should belong_to(:category).optional }
    it { should have_many(:product_speech_goals).dependent(:destroy) }
    it { should have_many(:speech_goals).through(:product_speech_goals) }
    it { should have_many(:product_variants).dependent(:destroy) }
    it { should have_many(:cart_items).dependent(:destroy) }
    it { should have_many(:order_items).dependent(:destroy) }
    it { should have_many(:reviews).dependent(:destroy) }
  end

  describe 'validations' do
    subject { build(:product) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:price) }
    it { should validate_uniqueness_of(:slug) }
    it { should validate_numericality_of(:price).is_greater_than(0) }
    it { should validate_numericality_of(:stock_quantity).is_greater_than_or_equal_to(0) }
  end

  describe 'callbacks' do
    it 'generates slug before validation' do
      product = build(:product, name: 'Test Product', slug: nil)
      product.valid?
      expect(product.slug).to eq('test-product')
    end

    it 'generates SKU before validation' do
      product = build(:product, sku: nil)
      product.valid?
      expect(product.sku).to match(/^TOY-[A-Z0-9]{8}$/)
    end
  end

  describe 'scopes' do
    let!(:active_product) { create(:product) }
    let!(:inactive_product) { create(:product, active: false) }
    let!(:deleted_product) { create(:product, deleted_at: Time.current) }
    let!(:featured_product) { create(:product, :featured) }
    let!(:out_of_stock_product) { create(:product, :out_of_stock) }

    describe '.active' do
      it 'returns only active and non-deleted products' do
        expect(Product.active).to include(active_product, featured_product)
        expect(Product.active).not_to include(inactive_product, deleted_product)
      end
    end

    describe '.featured' do
      it 'returns only featured products' do
        expect(Product.featured).to include(featured_product)
        expect(Product.featured).not_to include(active_product)
      end
    end

    describe '.in_stock' do
      it 'returns products with stock' do
        expect(Product.in_stock).to include(active_product)
        expect(Product.in_stock).not_to include(out_of_stock_product)
      end
    end

    describe '.by_category' do
      let(:category) { create(:category) }
      let!(:category_product) { create(:product, category: category) }

      it 'returns products in specific category' do
        expect(Product.by_category(category.id)).to include(category_product)
        expect(Product.by_category(category.id)).not_to include(active_product)
      end
    end

    describe '.by_age_range' do
      let!(:kids_product) { create(:product, min_age: 3, max_age: 6) }
      let!(:teens_product) { create(:product, min_age: 10, max_age: 15) }

      it 'returns products suitable for age' do
        expect(Product.by_age_range(5)).to include(kids_product)
        expect(Product.by_age_range(5)).not_to include(teens_product)
      end
    end

    describe '.by_price_range' do
      let!(:cheap_product) { create(:product, price: 10) }
      let!(:expensive_product) { create(:product, price: 100) }

      it 'returns products in price range' do
        expect(Product.by_price_range(15, 50)).to include(active_product)
        expect(Product.by_price_range(15, 50)).not_to include(cheap_product, expensive_product)
      end
    end
  end

  describe 'methods' do
    describe '#in_stock?' do
      it 'returns true when stock quantity is positive' do
        product = build(:product, stock_quantity: 10)
        expect(product.in_stock?).to be true
      end

      it 'returns false when stock quantity is zero' do
        product = build(:product, stock_quantity: 0)
        expect(product.in_stock?).to be false
      end
    end

    describe '#on_sale?' do
      it 'returns true when compare_at_price is higher than price' do
        product = build(:product, :on_sale)
        expect(product.on_sale?).to be true
      end

      it 'returns false when compare_at_price is not set' do
        product = build(:product)
        expect(product.on_sale?).to be false
      end
    end

    describe '#discount_percentage' do
      it 'calculates discount percentage' do
        product = build(:product, price: 29.99, compare_at_price: 39.99)
        expect(product.discount_percentage).to eq(25)
      end

      it 'returns 0 when not on sale' do
        product = build(:product)
        expect(product.discount_percentage).to eq(0)
      end
    end

    describe '#soft_delete' do
      it 'sets deleted_at and deactivates product' do
        product = create(:product)
        product.soft_delete

        expect(product.deleted_at).not_to be_nil
        expect(product.active).to be false
      end
    end

    describe '#average_rating' do
      let(:product) { create(:product) }

      it 'calculates average rating from reviews' do
        create(:review, product: product, rating: 4)
        create(:review, product: product, rating: 5)

        expect(product.average_rating).to eq(4.5)
      end

      it 'returns 0 when no reviews' do
        expect(product.average_rating).to eq(0.0)
      end
    end
  end

  describe 'full-text search' do
    let!(:flashcards) { create(:product, name: 'Vocabulary Flashcards', description: 'Learn words') }
    let!(:board_game) { create(:product, name: 'Sound Board Game', description: 'Practice sounds') }

    it 'searches by name' do
      results = Product.search('flashcards')
      expect(results).to include(flashcards)
      expect(results).not_to include(board_game)
    end

    it 'searches by description' do
      results = Product.search('sounds')
      expect(results).to include(board_game)
      expect(results).not_to include(flashcards)
    end

    it 'is case-insensitive' do
      results = Product.search('FLASHCARDS')
      expect(results).to include(flashcards)
    end
  end
end
