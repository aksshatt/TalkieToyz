class AddUniqueIndexToLoyaltyPoints < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def up
    execute <<~SQL
      CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_loyalty_points_unique_reference
      ON loyalty_points (user_id, source, reference_type, reference_id)
      WHERE reference_id IS NOT NULL
    SQL
  end

  def down
    execute "DROP INDEX CONCURRENTLY IF EXISTS idx_loyalty_points_unique_reference"
  end
end
