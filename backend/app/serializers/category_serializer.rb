class CategorySerializer < ApplicationSerializer
  attributes :id, :name, :description, :slug, :position, :image_url, :parent_id, :product_count
  has_many :subcategories, serializer: CategorySerializer

  def product_count
    object.products.active.count
  end
end
