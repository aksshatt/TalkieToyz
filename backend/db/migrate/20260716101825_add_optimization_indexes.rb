class AddOptimizationIndexes < ActiveRecord::Migration[7.1]
  disable_ddl_transaction!

  def up
    enable_extension 'pg_trgm' unless extension_enabled?('pg_trgm')

    execute "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops)"
    execute "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_name_trgm ON users USING gin (name gin_trgm_ops)"

    unless index_exists?(:messages, [:conversation_id, :created_at])
      add_index :messages, [:conversation_id, :created_at], name: 'idx_messages_conversation_created'
    end

    unless index_exists?(:loyalty_points, [:user_id, :redeemed])
      add_index :loyalty_points, [:user_id, :redeemed], name: 'idx_loyalty_points_user_redeemed'
    end
  end

  def down
    execute "DROP INDEX CONCURRENTLY IF EXISTS idx_products_name_trgm"
    execute "DROP INDEX CONCURRENTLY IF EXISTS idx_users_name_trgm"
    remove_index :messages, name: 'idx_messages_conversation_created' rescue nil
    remove_index :loyalty_points, name: 'idx_loyalty_points_user_redeemed' rescue nil
  end
end
