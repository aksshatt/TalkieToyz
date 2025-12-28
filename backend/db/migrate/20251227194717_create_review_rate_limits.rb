class CreateReviewRateLimits < ActiveRecord::Migration[7.1]
  def change
    create_table :review_rate_limits do |t|
      t.references :user, null: false, foreign_key: true
      t.date :review_date, null: false
      t.integer :count, default: 0, null: false

      t.timestamps
    end

    add_index :review_rate_limits, [:user_id, :review_date], unique: true
  end
end
