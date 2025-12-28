module Api
  module V1
    module Admin
      class FaqsController < BaseController
        before_action :set_faq, only: [:show, :update, :destroy]

        # GET /api/v1/admin/faqs
        def index
          @faqs = Faq.where(deleted_at: nil)

          # Filters
          @faqs = @faqs.by_category(params[:category]) if params[:category].present?
          @faqs = @faqs.where(active: params[:active]) if params[:active].present?

          # Search
          @faqs = @faqs.search(params[:q]) if params[:q].present?

          # Order
          @faqs = @faqs.ordered

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @faqs = @faqs.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @faqs,
              each_serializer: FaqSerializer
            ).as_json,
            'FAQs retrieved successfully',
            meta: pagination_meta(@faqs)
          )
        end

        # GET /api/v1/admin/faqs/:id
        def show
          render_success(
            FaqSerializer.new(@faq).as_json,
            'FAQ retrieved successfully'
          )
        end

        # POST /api/v1/admin/faqs
        def create
          @faq = Faq.new(faq_params)

          if @faq.save
            log_activity('create', 'Faq', @faq.id, { question: @faq.question }) if respond_to?(:log_activity)

            render_success(
              FaqSerializer.new(@faq).as_json,
              'FAQ created successfully',
              status: :created
            )
          else
            render_error('Failed to create FAQ', @faq.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/faqs/:id
        def update
          if @faq.update(faq_params)
            log_activity('update', 'Faq', @faq.id, { question: @faq.question }) if respond_to?(:log_activity)

            render_success(
              FaqSerializer.new(@faq).as_json,
              'FAQ updated successfully'
            )
          else
            render_error('Failed to update FAQ', @faq.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/faqs/:id
        def destroy
          if @faq.soft_delete
            log_activity('delete', 'Faq', @faq.id, { question: @faq.question }) if respond_to?(:log_activity)

            render_success(nil, 'FAQ deleted successfully')
          else
            render_error('Failed to delete FAQ', @faq.errors.full_messages)
          end
        end

        private

        def set_faq
          @faq = Faq.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('FAQ not found', nil, status: :not_found)
        end

        def faq_params
          params.require(:faq).permit(
            :question,
            :answer,
            :category,
            :display_order,
            :active,
            metadata: {}
          )
        end
      end
    end
  end
end
