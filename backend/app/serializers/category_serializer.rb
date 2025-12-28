class CategorySerializer < ApplicationSerializer
  attributes :id, :name, :description, :slug, :position, :image_url, :product_count

  def product_count
    object.products.active.count
  end
end
