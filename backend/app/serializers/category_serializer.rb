class CategorySerializer < ApplicationSerializer
  attributes :id, :name, :description, :slug, :position, :image_url, :parent_id, :product_count
  has_many :subcategories, serializer: CategorySerializer

  def product_count
    if object.subcategories.any?
      subcategory_ids = object.subcategories.pluck(:id)
      Product.active.where(category_id: [object.id, *subcategory_ids]).count
    else
      object.products.active.count
    end
  end
end
