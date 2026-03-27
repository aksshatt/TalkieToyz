class AddPerformanceIndexes < ActiveRecord::Migration[7.1]
  def change
    # Orders
    add_index :orders, :user_id, if_not_exists: true
    add_index :orders, :status, if_not_exists: true
    add_index :orders, :payment_status, if_not_exists: true
    add_index :orders, :created_at, if_not_exists: true

    # Order Items
    add_index :order_items, :order_id, if_not_exists: true
    add_index :order_items, :product_id, if_not_exists: true

    # Reviews
    add_index :reviews, :product_id, if_not_exists: true
    add_index :reviews, :user_id, if_not_exists: true
    add_index :reviews, [:product_id, :approved], if_not_exists: true

    # Assessment Results
    add_index :assessment_results, :user_id, if_not_exists: true
    add_index :assessment_results, :assessment_id, if_not_exists: true
    add_index :assessment_results, :completed_at, if_not_exists: true

    # Appointments
    add_index :appointments, :status, if_not_exists: true
    add_index :appointments, :created_at, if_not_exists: true

    # Blog Posts
    add_index :blog_posts, :status, if_not_exists: true
    add_index :blog_posts, :published_at, if_not_exists: true
  end
end
