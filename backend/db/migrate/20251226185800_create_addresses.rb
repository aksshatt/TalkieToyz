# frozen_string_literal: true

class CreateAddresses < ActiveRecord::Migration[7.1]
  def change
    create_table :addresses do |t|
      t.references :user, null: false, foreign_key: true
      t.string :label
      t.string :full_name, null: false
      t.string :phone, null: false
      t.string :address_line_1, null: false
      t.string :address_line_2
      t.string :city, null: false
      t.string :state_province, null: false
      t.string :postal_code, null: false
      t.string :country, null: false, default: 'US'
      t.boolean :is_default, default: false
      t.boolean :is_billing, default: false
      t.boolean :is_shipping, default: true
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :addresses, [:user_id, :is_default]
    add_index :addresses, :deleted_at
  end
end
