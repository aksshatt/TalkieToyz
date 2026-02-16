class RemoveOldFlatCategories < ActiveRecord::Migration[7.1]
  OLD_SLUGS = %w[
    articulation-toys
    language-development
    social-communication
    fluency-tools
    oral-motor-skills
    sensory-integration
  ].freeze

  def up
    # Reassign any products from old categories to nil before removing
    old_ids = Category.where(slug: OLD_SLUGS).pluck(:id)
    Product.where(category_id: old_ids).update_all(category_id: nil) if old_ids.any?

    # Remove old flat categories
    deleted = Category.where(slug: OLD_SLUGS).delete_all
    puts "Removed #{deleted} old flat categories"
  end

  def down
    # Old categories can be re-created via seeds if needed
  end
end
