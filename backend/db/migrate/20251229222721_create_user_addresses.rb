class CreateUserAddresses < ActiveRecord::Migration[7.1]
  def change
    create_table :user_addresses do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.string :phone, null: false
      t.string :address_line_1, null: false
      t.string :address_line_2
      t.string :city, null: false
      t.string :state, null: false
      t.string :postal_code, null: false
      t.string :country, null: false, default: 'India'
      t.boolean :is_default, default: false

      t.timestamps
    end

    add_index :user_addresses, [:user_id, :is_default]
  end
end
