class ProductDetailSerializer < ApplicationSerializer
  attributes :id, :name, :description, :long_description, :price, :compare_at_price,
             :stock_quantity, :sku, :slug, :min_age, :max_age, :specifications,
             :image_urls, :featured, :view_count, :in_stock, :on_sale, :discount_percentage,
             :average_rating, :review_count, :created_at, :updated_at

  belongs_to :category, serializer: CategorySerializer
  has_many :speech_goals, serializer: SpeechGoalSerializer
  has_many :variants, serializer: ProductVariantSerializer

  def in_stock
    object.in_stock?
  end

  def on_sale
    object.on_sale?
  end

  def discount_percentage
    object.discount_percentage
  end

  def average_rating
    object.average_rating
  end

  def review_count
    object.reviews.count
  end

  def image_urls
    return [] unless object.images.attached?

    host = ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com')
    object.images.filter_map do |image|
      result = {
        url: Rails.application.routes.url_helpers.rails_blob_url(image, host: host),
        filename: image.filename.to_s,
        content_type: image.content_type
      }
      if image.representable?
        result[:thumbnail_url] = Rails.application.routes.url_helpers.rails_representation_url(
          image.variant(resize_to_limit: [300, 300]), host: host
        )
      end
      result
    rescue => e
      Rails.logger.error("Failed to generate image URL: #{e.message}")
      nil
    end
  end

  def variants
    object.product_variants.active
  end
end
