class AddProductVariantToCartItems < ActiveRecord::Migration[7.1]
  def change
    add_reference :cart_items, :product_variant, null: false, foreign_key: true
  end
end
