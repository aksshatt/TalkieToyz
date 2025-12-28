module Api
  module V1
    class CategoriesController < BaseController
      # GET /api/v1/categories
      def index
        @categories = Category.active.by_position.includes(:products)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @categories,
            each_serializer: CategorySerializer
          ).as_json,
          'Categories retrieved successfully'
        )
      end

      # GET /api/v1/categories/:id
      def show
        @category = Category.active.find_by!(slug: params[:id])

        # Get products in this category with pagination
        page = params[:page] || 1
        per_page = params[:per_page] || 20

        @products = @category.products.active
                             .includes(:speech_goals)
                             .page(page)
                             .per(per_page)

        render_success(
          {
            category: CategorySerializer.new(@category).as_json,
            products: ActiveModelSerializers::SerializableResource.new(
              @products,
              each_serializer: ProductSummarySerializer
            ).as_json
          },
          'Category retrieved successfully',
          meta: pagination_meta(@products)
        )
      rescue ActiveRecord::RecordNotFound
        render_error('Category not found', nil, status: :not_found)
      end
    end
  end
end
