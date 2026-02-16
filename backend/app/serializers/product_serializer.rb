class ProductSerializer < ApplicationSerializer
  attributes :id, :name, :description, :long_description, :price, :compare_at_price,
             :stock_quantity, :sku, :slug, :min_age, :max_age, :specifications,
             :images, :featured, :view_count, :in_stock, :on_sale, :discount_percentage,
             :average_rating, :review_count

  belongs_to :category, serializer: CategorySerializer
  has_many :speech_goals, serializer: SpeechGoalSerializer

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
    object.reviews.approved.count
  end

  def images
    return [] unless object.images.attached?

    object.images.filter_map do |image|
      {
        id: image.id,
        url: Rails.application.routes.url_helpers.rails_blob_url(image, host: ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com'))
      }
    rescue => e
      Rails.logger.error("Failed to generate image URL for image #{image.id}: #{e.message}")
      nil
    end
  end
end
