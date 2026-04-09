class CreateLoyaltyPoints < ActiveRecord::Migration[7.1]
  def change
    create_table :loyalty_points do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :points, null: false
      t.string :source, null: false  # purchase, review, assessment, referral, redemption
      t.string :reference_type
      t.bigint :reference_id
      t.string :description
      t.boolean :redeemed, default: false

      t.timestamps
    end

    add_index :loyalty_points, [:reference_type, :reference_id]

    add_column :users, :loyalty_points_total, :integer, default: 0, null: false
  end
end
