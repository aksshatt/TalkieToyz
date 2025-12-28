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

    object.images.limit(1).map do |image|
      if image.representable?
        {
          url: Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true),
          thumbnail_url: Rails.application.routes.url_helpers.rails_representation_url(
            image.variant(resize_to_limit: [300, 300]),
            only_path: true
          )
        }
      else
        {
          url: Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
        }
      end
    end
  end
end
