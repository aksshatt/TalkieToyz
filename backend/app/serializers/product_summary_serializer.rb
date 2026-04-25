class ProductSummarySerializer < ApplicationSerializer
  attributes :id, :name, :description, :price, :compare_at_price, :slug,
             :image_urls, :in_stock, :on_sale, :discount_percentage, :average_rating, :stock_quantity,
             :category, :min_age, :max_age

  def category
    return nil unless object.category
    {
      id: object.category.id,
      name: object.category.name,
      slug: object.category.slug
    }
  end

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

  def image_urls
    return [] unless object.images.attached?

    host = ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com')
    helpers = Rails.application.routes.url_helpers
    object.images.limit(2).filter_map do |image|
      result = { url: helpers.rails_blob_url(image, host: host) }
      if image.representable?
        result[:thumbnail_url] = helpers.rails_representation_url(image.variant(resize_to_limit: [300, 300]), host: host)
        result[:medium_url]    = helpers.rails_representation_url(image.variant(resize_to_limit: [600, 600]), host: host)
        result[:large_url]     = helpers.rails_representation_url(image.variant(resize_to_limit: [1200, 1200]), host: host)
      end
      result
    rescue => e
      Rails.logger.error("Failed to generate image URL: #{e.message}")
      nil
    end
  end
end
