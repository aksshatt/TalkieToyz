# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_12_28_043652) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "label"
    t.string "full_name", null: false
    t.string "phone", null: false
    t.string "address_line_1", null: false
    t.string "address_line_2"
    t.string "city", null: false
    t.string "state_province", null: false
    t.string "postal_code", null: false
    t.string "country", default: "US", null: false
    t.boolean "is_default", default: false
    t.boolean "is_billing", default: false
    t.boolean "is_shipping", default: true
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_addresses_on_deleted_at"
    t.index ["user_id", "is_default"], name: "index_addresses_on_user_id_and_is_default"
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "admin_activity_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "action", null: false
    t.string "resource_type"
    t.integer "resource_id"
    t.jsonb "details", default: {}
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["action"], name: "index_admin_activity_logs_on_action"
    t.index ["created_at"], name: "index_admin_activity_logs_on_created_at"
    t.index ["resource_type", "resource_id"], name: "index_admin_activity_logs_on_resource_type_and_resource_id"
    t.index ["resource_type"], name: "index_admin_activity_logs_on_resource_type"
    t.index ["user_id"], name: "index_admin_activity_logs_on_user_id"
  end

  create_table "assessment_results", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "assessment_id", null: false
    t.string "child_name"
    t.integer "child_age_months"
    t.jsonb "answers", default: {}, null: false
    t.jsonb "scores", default: {}
    t.integer "total_score", default: 0
    t.jsonb "recommendations", default: {}
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answers"], name: "index_assessment_results_on_answers", using: :gin
    t.index ["assessment_id"], name: "index_assessment_results_on_assessment_id"
    t.index ["completed_at"], name: "index_assessment_results_on_completed_at"
    t.index ["user_id", "assessment_id", "created_at"], name: "index_assessment_results_on_user_assessment_created"
    t.index ["user_id", "created_at"], name: "index_assessment_results_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_assessment_results_on_user_id"
  end

  create_table "assessments", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "slug", null: false
    t.integer "min_age"
    t.integer "max_age"
    t.jsonb "questions", default: [], null: false
    t.jsonb "scoring_rules", default: {}
    t.jsonb "recommendations", default: {}
    t.boolean "active", default: true
    t.integer "version", default: 1
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_assessments_on_active"
    t.index ["deleted_at"], name: "index_assessments_on_deleted_at"
    t.index ["max_age"], name: "index_assessments_on_max_age"
    t.index ["min_age"], name: "index_assessments_on_min_age"
    t.index ["questions"], name: "index_assessments_on_questions", using: :gin
    t.index ["slug"], name: "index_assessments_on_slug", unique: true
  end

  create_table "blog_posts", force: :cascade do |t|
    t.bigint "author_id", null: false
    t.string "title", null: false
    t.string "slug", null: false
    t.text "excerpt"
    t.string "featured_image_url"
    t.string "category", null: false
    t.jsonb "tags", default: []
    t.integer "status", default: 0, null: false
    t.datetime "published_at"
    t.integer "view_count", default: 0
    t.integer "reading_time_minutes"
    t.jsonb "comments", default: []
    t.boolean "allow_comments", default: true
    t.boolean "featured", default: false
    t.jsonb "seo_metadata", default: {}
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_blog_posts_on_author_id"
    t.index ["category"], name: "index_blog_posts_on_category"
    t.index ["deleted_at"], name: "index_blog_posts_on_deleted_at"
    t.index ["featured", "status", "published_at"], name: "index_blog_posts_on_featured_status_published"
    t.index ["featured"], name: "index_blog_posts_on_featured"
    t.index ["published_at"], name: "index_blog_posts_on_published_at"
    t.index ["slug"], name: "index_blog_posts_on_slug", unique: true
    t.index ["status", "published_at", "deleted_at"], name: "index_blog_posts_on_status_published_deleted"
    t.index ["status", "published_at"], name: "index_blog_posts_on_status_and_published_at"
    t.index ["status"], name: "index_blog_posts_on_status"
    t.index ["tags"], name: "index_blog_posts_on_tags", using: :gin
  end

  create_table "cart_items", force: :cascade do |t|
    t.bigint "cart_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "product_variant_id"
    t.index ["cart_id", "product_id"], name: "index_cart_items_on_cart_id_and_product_id", unique: true
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
    t.index ["product_variant_id"], name: "index_cart_items_on_product_variant_id"
  end

  create_table "carts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["metadata"], name: "index_carts_on_metadata", using: :gin
    t.index ["user_id"], name: "index_carts_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "slug", null: false
    t.integer "position", default: 0
    t.boolean "active", default: true
    t.string "image_url"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_categories_on_active"
    t.index ["deleted_at"], name: "index_categories_on_deleted_at"
    t.index ["position"], name: "index_categories_on_position"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "contact_submissions", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone"
    t.string "subject", null: false
    t.text "message", null: false
    t.string "status", default: "pending"
    t.bigint "user_id"
    t.text "admin_notes"
    t.datetime "responded_at"
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_contact_submissions_on_created_at"
    t.index ["email"], name: "index_contact_submissions_on_email"
    t.index ["status", "created_at"], name: "index_contact_submissions_on_status_created"
    t.index ["status"], name: "index_contact_submissions_on_status"
    t.index ["user_id"], name: "index_contact_submissions_on_user_id"
  end

  create_table "coupons", force: :cascade do |t|
    t.string "code", null: false
    t.string "discount_type", null: false
    t.decimal "discount_value", precision: 10, scale: 2, null: false
    t.decimal "min_order_amount", precision: 10, scale: 2, default: "0.0"
    t.decimal "max_discount_amount", precision: 10, scale: 2
    t.datetime "valid_from"
    t.datetime "valid_until"
    t.integer "usage_limit", default: 0
    t.integer "usage_count", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_coupons_on_active"
    t.index ["code"], name: "index_coupons_on_code", unique: true
    t.index ["valid_until"], name: "index_coupons_on_valid_until"
  end

  create_table "faqs", force: :cascade do |t|
    t.string "question", null: false
    t.text "answer", null: false
    t.string "category", null: false
    t.integer "display_order", default: 0
    t.boolean "active", default: true
    t.integer "view_count", default: 0
    t.jsonb "metadata", default: {}
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active", "deleted_at", "category"], name: "index_faqs_on_active_deleted_at_category"
    t.index ["active", "deleted_at", "display_order", "created_at"], name: "index_faqs_on_active_deleted_order_created"
    t.index ["active"], name: "index_faqs_on_active"
    t.index ["category"], name: "index_faqs_on_category"
    t.index ["deleted_at"], name: "index_faqs_on_deleted_at"
    t.index ["display_order"], name: "index_faqs_on_display_order"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti", unique: true
  end

  create_table "milestones", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "category", null: false
    t.integer "age_months_min", null: false
    t.integer "age_months_max", null: false
    t.integer "position", default: 0
    t.jsonb "indicators", default: []
    t.jsonb "tips", default: []
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["age_months_max"], name: "index_milestones_on_age_months_max"
    t.index ["age_months_min", "age_months_max"], name: "index_milestones_on_age_months_min_and_age_months_max"
    t.index ["age_months_min"], name: "index_milestones_on_age_months_min"
    t.index ["category"], name: "index_milestones_on_category"
    t.index ["position"], name: "index_milestones_on_position"
  end

  create_table "newsletter_subscriptions", force: :cascade do |t|
    t.string "email", null: false
    t.string "name"
    t.string "status", default: "pending", null: false
    t.string "subscription_token"
    t.datetime "confirmed_at"
    t.datetime "unsubscribed_at"
    t.jsonb "preferences", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_newsletter_subscriptions_on_email", unique: true
    t.index ["status"], name: "index_newsletter_subscriptions_on_status"
    t.index ["subscription_token"], name: "index_newsletter_subscriptions_on_subscription_token", unique: true
  end

  create_table "order_items", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.integer "quantity", null: false
    t.decimal "unit_price", precision: 10, scale: 2, null: false
    t.decimal "total_price", precision: 10, scale: 2, null: false
    t.jsonb "product_snapshot", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "product_variant_id"
    t.index ["order_id", "product_id"], name: "index_order_items_on_order_id_and_product_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
    t.index ["product_snapshot"], name: "index_order_items_on_product_snapshot", using: :gin
    t.index ["product_variant_id"], name: "index_order_items_on_product_variant_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "order_number", null: false
    t.integer "status", default: 0, null: false
    t.decimal "subtotal", precision: 10, scale: 2, null: false
    t.decimal "tax", precision: 10, scale: 2, default: "0.0"
    t.decimal "shipping_cost", precision: 10, scale: 2, default: "0.0"
    t.decimal "discount", precision: 10, scale: 2, default: "0.0"
    t.decimal "total", precision: 10, scale: 2, null: false
    t.jsonb "shipping_address", default: {}
    t.jsonb "billing_address", default: {}
    t.string "tracking_number"
    t.datetime "shipped_at"
    t.datetime "delivered_at"
    t.string "payment_method"
    t.string "payment_status"
    t.string "payment_intent_id"
    t.jsonb "payment_details", default: {}
    t.text "notes"
    t.text "customer_notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "coupon_id"
    t.index ["billing_address"], name: "index_orders_on_billing_address", using: :gin
    t.index ["coupon_id"], name: "index_orders_on_coupon_id"
    t.index ["created_at"], name: "index_orders_on_created_at"
    t.index ["order_number"], name: "index_orders_on_order_number", unique: true
    t.index ["payment_status"], name: "index_orders_on_payment_status"
    t.index ["shipping_address"], name: "index_orders_on_shipping_address", using: :gin
    t.index ["status"], name: "index_orders_on_status"
    t.index ["user_id", "created_at"], name: "index_orders_on_user_created"
    t.index ["user_id", "status", "created_at"], name: "index_orders_on_user_status_created"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "product_speech_goals", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.bigint "speech_goal_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "speech_goal_id"], name: "index_product_speech_goals_unique", unique: true
    t.index ["product_id"], name: "index_product_speech_goals_on_product_id"
    t.index ["speech_goal_id"], name: "index_product_speech_goals_on_speech_goal_id"
  end

  create_table "product_variants", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.string "name", null: false
    t.string "sku", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "stock_quantity", default: 0, null: false
    t.jsonb "specifications", default: {}
    t.boolean "active", default: true, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_product_variants_on_active"
    t.index ["deleted_at"], name: "index_product_variants_on_deleted_at"
    t.index ["product_id"], name: "index_product_variants_on_product_id"
    t.index ["sku"], name: "index_product_variants_on_sku", unique: true
    t.index ["specifications"], name: "index_product_variants_on_specifications", using: :gin
  end

  create_table "products", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.text "long_description"
    t.decimal "price", precision: 10, scale: 2, null: false
    t.decimal "compare_at_price", precision: 10, scale: 2
    t.integer "stock_quantity", default: 0, null: false
    t.string "sku"
    t.string "slug", null: false
    t.bigint "category_id"
    t.integer "min_age"
    t.integer "max_age"
    t.jsonb "specifications", default: {}
    t.jsonb "images", default: []
    t.boolean "active", default: true
    t.boolean "featured", default: false
    t.integer "view_count", default: 0
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active", "deleted_at", "category_id", "created_at"], name: "index_products_on_active_deleted_category_created"
    t.index ["active", "deleted_at", "created_at"], name: "index_products_on_active_deleted_created"
    t.index ["active"], name: "index_products_on_active"
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["deleted_at"], name: "index_products_on_deleted_at"
    t.index ["featured"], name: "index_products_on_featured"
    t.index ["images"], name: "index_products_on_images", using: :gin
    t.index ["max_age"], name: "index_products_on_max_age"
    t.index ["min_age"], name: "index_products_on_min_age"
    t.index ["price"], name: "index_products_on_price"
    t.index ["sku"], name: "index_products_on_sku", unique: true
    t.index ["slug"], name: "index_products_on_slug", unique: true
    t.index ["specifications"], name: "index_products_on_specifications", using: :gin
  end

  create_table "progress_logs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "child_name", null: false
    t.integer "child_age_months", null: false
    t.date "log_date", null: false
    t.string "category", null: false
    t.text "notes"
    t.jsonb "metrics", default: {}
    t.jsonb "achievements", default: []
    t.bigint "milestone_id"
    t.bigint "product_id"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_progress_logs_on_category"
    t.index ["child_name"], name: "index_progress_logs_on_child_name"
    t.index ["deleted_at"], name: "index_progress_logs_on_deleted_at"
    t.index ["log_date"], name: "index_progress_logs_on_log_date"
    t.index ["metrics"], name: "index_progress_logs_on_metrics", using: :gin
    t.index ["milestone_id"], name: "index_progress_logs_on_milestone_id"
    t.index ["product_id"], name: "index_progress_logs_on_product_id"
    t.index ["user_id", "child_name", "log_date"], name: "index_progress_logs_on_user_id_and_child_name_and_log_date"
    t.index ["user_id"], name: "index_progress_logs_on_user_id"
  end

  create_table "resource_categories", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "icon"
    t.string "color"
    t.integer "position", default: 0
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_resource_categories_on_active"
    t.index ["position"], name: "index_resource_categories_on_position"
    t.index ["slug"], name: "index_resource_categories_on_slug", unique: true
  end

  create_table "resources", force: :cascade do |t|
    t.bigint "resource_category_id", null: false
    t.string "title", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "resource_type", null: false
    t.integer "file_size_bytes"
    t.string "file_format"
    t.integer "download_count", default: 0
    t.jsonb "tags", default: []
    t.jsonb "metadata", default: {}
    t.boolean "premium", default: false
    t.boolean "active", default: true
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_resources_on_active"
    t.index ["deleted_at"], name: "index_resources_on_deleted_at"
    t.index ["premium"], name: "index_resources_on_premium"
    t.index ["resource_category_id"], name: "index_resources_on_resource_category_id"
    t.index ["resource_type"], name: "index_resources_on_resource_type"
    t.index ["slug"], name: "index_resources_on_slug", unique: true
    t.index ["tags"], name: "index_resources_on_tags", using: :gin
  end

  create_table "review_helpful_votes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "review_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["review_id"], name: "index_review_helpful_votes_on_review_id"
    t.index ["user_id", "review_id"], name: "index_review_helpful_votes_on_user_id_and_review_id", unique: true
    t.index ["user_id"], name: "index_review_helpful_votes_on_user_id"
  end

  create_table "review_rate_limits", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "review_date", null: false
    t.integer "count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "review_date"], name: "index_review_rate_limits_on_user_id_and_review_date", unique: true
    t.index ["user_id"], name: "index_review_rate_limits_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "product_id", null: false
    t.integer "rating", null: false
    t.string "title"
    t.text "comment"
    t.boolean "verified_purchase", default: false
    t.boolean "approved", default: false
    t.integer "helpful_count", default: 0
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "admin_response"
    t.bigint "admin_responder_id"
    t.datetime "admin_responded_at"
    t.index ["admin_responded_at"], name: "index_reviews_on_admin_responded_at"
    t.index ["admin_responder_id"], name: "index_reviews_on_admin_responder_id"
    t.index ["approved"], name: "index_reviews_on_approved"
    t.index ["created_at"], name: "index_reviews_on_created_at"
    t.index ["deleted_at"], name: "index_reviews_on_deleted_at"
    t.index ["product_id", "approved", "created_at"], name: "index_reviews_on_product_approved_created"
    t.index ["product_id"], name: "index_reviews_on_product_id"
    t.index ["rating"], name: "index_reviews_on_rating"
    t.index ["user_id", "product_id"], name: "index_reviews_on_user_id_and_product_id", unique: true
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "site_contents", force: :cascade do |t|
    t.string "key", null: false
    t.string "content_type", default: "text", null: false
    t.text "value"
    t.string "page", null: false
    t.jsonb "metadata", default: {}
    t.boolean "active", default: true
    t.integer "display_order", default: 0
    t.string "label"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_site_contents_on_active"
    t.index ["display_order"], name: "index_site_contents_on_display_order"
    t.index ["page", "key"], name: "index_site_contents_on_page_and_key", unique: true
    t.index ["page"], name: "index_site_contents_on_page"
  end

  create_table "speech_goals", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "slug", null: false
    t.string "color", default: "#3B82F6"
    t.string "icon", default: "target"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_speech_goals_on_active"
    t.index ["slug"], name: "index_speech_goals_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "name", null: false
    t.string "phone"
    t.integer "role", default: 0, null: false
    t.text "bio"
    t.string "avatar_url"
    t.jsonb "preferences", default: {}
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["deleted_at"], name: "index_users_on_deleted_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "users"
  add_foreign_key "admin_activity_logs", "users"
  add_foreign_key "assessment_results", "assessments"
  add_foreign_key "assessment_results", "users"
  add_foreign_key "blog_posts", "users", column: "author_id"
  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "product_variants"
  add_foreign_key "cart_items", "products"
  add_foreign_key "carts", "users"
  add_foreign_key "contact_submissions", "users"
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "product_variants"
  add_foreign_key "order_items", "products"
  add_foreign_key "orders", "coupons"
  add_foreign_key "orders", "users"
  add_foreign_key "product_speech_goals", "products"
  add_foreign_key "product_speech_goals", "speech_goals"
  add_foreign_key "product_variants", "products"
  add_foreign_key "products", "categories"
  add_foreign_key "progress_logs", "milestones"
  add_foreign_key "progress_logs", "products"
  add_foreign_key "progress_logs", "users"
  add_foreign_key "resources", "resource_categories"
  add_foreign_key "review_helpful_votes", "reviews"
  add_foreign_key "review_helpful_votes", "users"
  add_foreign_key "review_rate_limits", "users"
  add_foreign_key "reviews", "products"
  add_foreign_key "reviews", "users"
  add_foreign_key "reviews", "users", column: "admin_responder_id"
end
