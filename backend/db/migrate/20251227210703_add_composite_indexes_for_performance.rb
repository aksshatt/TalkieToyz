class AddCompositeIndexesForPerformance < ActiveRecord::Migration[7.1]
  def change
    # FAQ optimizations
    # Optimizes: WHERE active = ? AND deleted_at IS NULL AND category = ?
    add_index :faqs, [:active, :deleted_at, :category],
              name: 'index_faqs_on_active_deleted_at_category'

    # Optimizes: WHERE active = ? AND deleted_at IS NULL ORDER BY display_order, created_at
    add_index :faqs, [:active, :deleted_at, :display_order, :created_at],
              name: 'index_faqs_on_active_deleted_order_created'

    # Product optimizations
    # Optimizes common product listing queries
    add_index :products, [:active, :deleted_at, :created_at],
              name: 'index_products_on_active_deleted_created'

    add_index :products, [:active, :deleted_at, :category_id, :created_at],
              name: 'index_products_on_active_deleted_category_created'

    # Order optimizations
    # Optimizes: WHERE user_id = ? ORDER BY created_at DESC
    add_index :orders, [:user_id, :created_at],
              name: 'index_orders_on_user_created'

    add_index :orders, [:user_id, :status, :created_at],
              name: 'index_orders_on_user_status_created'

    # Review optimizations
    # Optimizes: WHERE product_id = ? AND approved = true
    add_index :reviews, [:product_id, :approved, :created_at],
              name: 'index_reviews_on_product_approved_created'

    # Contact submission optimizations
    add_index :contact_submissions, [:status, :created_at],
              name: 'index_contact_submissions_on_status_created'

    # Blog post optimizations
    add_index :blog_posts, [:status, :published_at, :deleted_at],
              name: 'index_blog_posts_on_status_published_deleted'

    add_index :blog_posts, [:featured, :status, :published_at],
              name: 'index_blog_posts_on_featured_status_published'

    # Assessment result optimizations
    add_index :assessment_results, [:user_id, :assessment_id, :created_at],
              name: 'index_assessment_results_on_user_assessment_created'
  end
end
