class AddShippingFieldsToProducts < ActiveRecord::Migration[7.1]
  def change
    add_column :products, :hsn_code, :string unless column_exists?(:products, :hsn_code)
    add_column :products, :weight_kg, :decimal, precision: 8, scale: 3 unless column_exists?(:products, :weight_kg)
    add_column :products, :dimensions_cm, :jsonb, default: {} unless column_exists?(:products, :dimensions_cm)

    add_index :products, :hsn_code unless index_exists?(:products, :hsn_code)
  end
end
