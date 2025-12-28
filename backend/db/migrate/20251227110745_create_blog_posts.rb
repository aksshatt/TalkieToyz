class CreateBlogPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :blog_posts do |t|
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.string :slug, null: false
      t.text :excerpt
      t.string :featured_image_url
      t.string :category, null: false
      t.jsonb :tags, default: []
      t.integer :status, default: 0, null: false
      t.datetime :published_at
      t.integer :view_count, default: 0
      t.integer :reading_time_minutes
      t.jsonb :comments, default: []
      t.boolean :allow_comments, default: true
      t.boolean :featured, default: false
      t.jsonb :seo_metadata, default: {}
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :blog_posts, :slug, unique: true
    add_index :blog_posts, :category
    add_index :blog_posts, :status
    add_index :blog_posts, :published_at
    add_index :blog_posts, :featured
    add_index :blog_posts, :tags, using: :gin
    add_index :blog_posts, :deleted_at
    add_index :blog_posts, [:status, :published_at]
  end
end
