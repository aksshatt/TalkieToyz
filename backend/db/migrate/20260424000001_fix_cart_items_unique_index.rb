class FixCartItemsUniqueIndex < ActiveRecord::Migration[7.1]
  def change
    # The previous unique index on (cart_id, product_id) blocked a cart from
    # holding two variants of the same product. Replace it with partial
    # indexes that let variants coexist while still preventing duplicate rows.
    if index_exists?(:cart_items, [:cart_id, :product_id], name: 'index_cart_items_on_cart_id_and_product_id')
      remove_index :cart_items, name: 'index_cart_items_on_cart_id_and_product_id'
    end

    add_index :cart_items,
              [:cart_id, :product_id],
              unique: true,
              where: 'product_variant_id IS NULL',
              name: 'index_cart_items_on_cart_product_no_variant'

    add_index :cart_items,
              [:cart_id, :product_id, :product_variant_id],
              unique: true,
              where: 'product_variant_id IS NOT NULL',
              name: 'index_cart_items_on_cart_product_variant'
  end
end
