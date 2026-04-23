module Api
  module V1
    class BundlesController < BaseController

      # GET /api/v1/bundles
      def index
        @bundles = Bundle.active.includes(products: [:category, :speech_goals, images_attachments: :blob])
        @bundles = @bundles.featured if params[:featured] == 'true'
        @bundles = @bundles.where(speech_goal: params[:speech_goal]) if params[:speech_goal].present?
        @bundles = @bundles.order(created_at: :desc)

        render_success(@bundles.map { |b| serialize_bundle(b) }, 'Bundles retrieved')
      end

      # GET /api/v1/bundles/:id
      def show
        @bundle = Bundle.active.find_by!(slug: params[:id])
        render_success(serialize_bundle(@bundle, detailed: true), 'Bundle retrieved')
      rescue ActiveRecord::RecordNotFound
        render_error('Bundle not found', nil, status: :not_found)
      end

      # POST /api/v1/bundles (admin only)
      def create
        authenticate_admin!
        @bundle = Bundle.new(bundle_params)

        if @bundle.save
          set_bundle_products
          render_success(serialize_bundle(@bundle.reload), 'Bundle created', status: :created)
        else
          render_error('Failed to create bundle', @bundle.errors.full_messages)
        end
      end

      # PATCH /api/v1/bundles/:id (admin only)
      def update
        authenticate_admin!
        @bundle = Bundle.find_by!(slug: params[:id])

        if @bundle.update(bundle_params)
          set_bundle_products if params[:product_ids].present?
          render_success(serialize_bundle(@bundle.reload), 'Bundle updated')
        else
          render_error('Failed to update bundle', @bundle.errors.full_messages)
        end
      end

      private

      def bundle_params
        params.require(:bundle).permit(:name, :description, :speech_goal, :discount_percent, :active, :featured, :min_products, :max_products)
      end

      def set_bundle_products
        product_ids = (params[:product_ids] || []).map(&:to_i).reject(&:zero?)
        found_ids = Product.where(id: product_ids).pluck(:id)
        missing = product_ids - found_ids
        if missing.any?
          raise ActiveRecord::Rollback.new("Invalid product IDs: #{missing.join(', ')}")
        end
        @bundle.bundle_items.destroy_all
        product_ids.each_with_index do |pid, idx|
          @bundle.bundle_items.create!(product_id: pid, position: idx)
        end
      end

      def authenticate_admin!
        render_error('Unauthorized', nil, status: :forbidden) unless current_user&.admin?
      end

      def serialize_bundle(bundle, detailed: false)
        {
          id: bundle.id,
          name: bundle.name,
          slug: bundle.slug,
          description: bundle.description,
          speech_goal: bundle.speech_goal,
          discount_percent: bundle.discount_percent,
          featured: bundle.featured,
          original_price: bundle.original_price,
          discounted_price: bundle.discounted_price,
          savings: bundle.savings,
          min_products: bundle.min_products,
          max_products: bundle.max_products,
          product_count: bundle.products.count,
          products: bundle.products.map do |p|
            {
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              stock_quantity: p.stock_quantity,
              image_url: p.images.attached? ? Rails.application.routes.url_helpers.rails_blob_url(p.images.first, host: ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com')) : nil
            }
          end
        }
      end
    end
  end
end
