module Api
  module V1
    class FaqsController < BaseController
      # GET /api/v1/faqs
      def index
        @faqs = Faq.active

        # Filter by category
        @faqs = @faqs.by_category(params[:category]) if params[:category].present?

        # Search
        @faqs = @faqs.search(params[:q]) if params[:q].present?

        # Order
        @faqs = @faqs.ordered

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @faqs,
            each_serializer: FaqSerializer
          ).as_json,
          'FAQs retrieved successfully'
        )
      end

      # GET /api/v1/faqs/:id
      def show
        @faq = Faq.active.find(params[:id])
        @faq.increment_view_count

        render_success(
          FaqSerializer.new(@faq).as_json,
          'FAQ retrieved successfully'
        )
      rescue ActiveRecord::RecordNotFound
        render_error('FAQ not found', nil, status: :not_found)
      end

      # GET /api/v1/faqs/categories
      def categories
        # Cache categories for 1 hour
        categories_data = Rails.cache.fetch('faq_categories', expires_in: 1.hour) do
          Faq.categories.keys.map do |key|
            {
              value: key.to_s,
              label: key.to_s.titleize,
              count: Faq.active.by_category(key.to_s).count
            }
          end
        end

        render_success(categories_data, 'FAQ categories retrieved successfully')
      end
    end
  end
end
