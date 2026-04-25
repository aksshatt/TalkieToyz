class AddReviewCacheToProducts < ActiveRecord::Migration[7.1]
  def up
    add_column :products, :reviews_count, :integer, default: 0, null: false unless column_exists?(:products, :reviews_count)
    add_column :products, :cached_average_rating, :decimal, precision: 3, scale: 2, default: 0, null: false unless column_exists?(:products, :cached_average_rating)

    say_with_time 'Backfilling product review caches' do
      execute <<~SQL
        UPDATE products p
        SET reviews_count = COALESCE(r.cnt, 0),
            cached_average_rating = COALESCE(r.avg, 0)
        FROM (
          SELECT product_id, COUNT(*) AS cnt, AVG(rating)::numeric(3,2) AS avg
          FROM reviews
          WHERE approved = true
          GROUP BY product_id
        ) r
        WHERE p.id = r.product_id
      SQL
    end
  end

  def down
    remove_column :products, :reviews_count if column_exists?(:products, :reviews_count)
    remove_column :products, :cached_average_rating if column_exists?(:products, :cached_average_rating)
  end
end
