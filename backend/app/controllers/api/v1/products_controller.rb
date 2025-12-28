module Api
  module V1
    class ProductsController < BaseController
      before_action :authenticate_admin!, only: [:create, :update, :destroy]
      before_action :set_product, only: [:show, :update, :destroy, :related]

      # GET /api/v1/products
      def index
        @products = Product.active
                          .includes(:category, :speech_goals, images_attachments: :blob)

        # Apply filters
        @products = apply_filters(@products)

        # Apply search
        @products = @products.search(params[:q]) if params[:q].present?

        # Apply sorting
        @products = apply_sorting(@products)

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @products = @products.page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @products,
            each_serializer: ProductSummarySerializer
          ).as_json,
          'Products retrieved successfully',
          meta: pagination_meta(@products)
        )
      end

      # GET /api/v1/products/:id
      def show
        # Increment view count
        @product.increment!(:view_count)

        render_success(
          ProductDetailSerializer.new(@product).as_json,
          'Product retrieved successfully'
        )
      end

      # GET /api/v1/products/:id/related
      def related
        @related = Product.active
                         .includes(:category, :speech_goals, images_attachments: :blob)
                         .where(category_id: @product.category_id)
                         .where.not(id: @product.id)
                         .limit(4)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @related,
            each_serializer: ProductSummarySerializer
          ).as_json,
          'Related products retrieved successfully'
        )
      end

      # POST /api/v1/products
      def create
        @product = Product.new(product_params)

        if @product.save
          attach_images if params[:images].present?
          create_variants if params[:variants].present?

          render_success(
            ProductDetailSerializer.new(@product.reload).as_json,
            'Product created successfully',
            status: :created
          )
        else
          render_error('Failed to create product', @product.errors.full_messages)
        end
      end

      # PATCH /api/v1/products/:id
      def update
        if @product.update(product_params)
          attach_images if params[:images].present?
          update_variants if params[:variants].present?

          render_success(
            ProductDetailSerializer.new(@product.reload).as_json,
            'Product updated successfully'
          )
        else
          render_error('Failed to update product', @product.errors.full_messages)
        end
      end

      # DELETE /api/v1/products/:id
      def destroy
        if @product.soft_delete
          render_success(nil, 'Product deleted successfully')
        else
          render_error('Failed to delete product', @product.errors.full_messages)
        end
      end

      private

      def set_product
        @product = Product.active.includes(:category, :speech_goals, :product_variants, images_attachments: :blob)
                         .find_by!(slug: params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Product not found', nil, status: :not_found)
      end

      def product_params
        params.require(:product).permit(
          :name, :description, :long_description, :price, :compare_at_price,
          :stock_quantity, :sku, :slug, :min_age, :max_age, :featured,
          :category_id, specifications: {}, speech_goal_ids: []
        )
      end

      def apply_filters(products)
        # Category filter
        products = products.by_category(params[:category_id]) if params[:category_id].present?

        # Age range filter
        products = products.by_age_range(params[:age]) if params[:age].present?

        # Price range filter
        if params[:min_price].present? && params[:max_price].present?
          products = products.by_price_range(params[:min_price], params[:max_price])
        end

        # Featured filter
        products = products.featured if params[:featured] == 'true'

        # In stock filter
        products = products.in_stock if params[:in_stock] == 'true'

        # Speech goals filter
        if params[:speech_goal_ids].present?
          goal_ids = params[:speech_goal_ids].split(',').map(&:to_i)
          products = products.by_speech_goals(goal_ids)
        end

        products
      end

      def apply_sorting(products)
        case params[:sort]
        when 'price_asc'
          products.order(price: :asc)
        when 'price_desc'
          products.order(price: :desc)
        when 'newest'
          products.order(created_at: :desc)
        when 'popular'
          products.order(view_count: :desc)
        when 'name'
          products.order(name: :asc)
        else
          products.order(created_at: :desc)
        end
      end

      def attach_images
        params[:images].each do |image|
          @product.images.attach(image)
        end
      end

      def create_variants
        params[:variants].each do |variant_params|
          @product.product_variants.create(
            name: variant_params[:name],
            sku: variant_params[:sku],
            price: variant_params[:price],
            stock_quantity: variant_params[:stock_quantity] || 0,
            specifications: variant_params[:specifications] || {}
          )
        end
      end

      def update_variants
        # Delete existing variants not in the update
        variant_ids = params[:variants].map { |v| v[:id] }.compact
        @product.product_variants.where.not(id: variant_ids).destroy_all

        params[:variants].each do |variant_params|
          if variant_params[:id].present?
            # Update existing variant
            variant = @product.product_variants.find(variant_params[:id])
            variant.update(
              name: variant_params[:name],
              sku: variant_params[:sku],
              price: variant_params[:price],
              stock_quantity: variant_params[:stock_quantity],
              specifications: variant_params[:specifications]
            )
          else
            # Create new variant
            @product.product_variants.create(
              name: variant_params[:name],
              sku: variant_params[:sku],
              price: variant_params[:price],
              stock_quantity: variant_params[:stock_quantity] || 0,
              specifications: variant_params[:specifications] || {}
            )
          end
        end
      end

      def authenticate_admin!
        render_error('Unauthorized', nil, status: :forbidden) unless current_user&.admin?
      end
    end
  end
end
