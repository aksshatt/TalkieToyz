module Api
  module V1
    module Therapist
      class MessageTemplatesController < BaseController
        # GET /api/v1/therapist/message_templates
        def index
          templates = MessageTemplate
            .accessible_to(current_user)
            .order(category: :asc, title: :asc)

          templates = templates.by_category(params[:category]) if params[:category].present?

          render json: {
            success: true,
            data: templates.map { |t| serialize(t) },
            categories: MessageTemplate::CATEGORIES
          }
        end

        # POST /api/v1/therapist/message_templates
        def create
          template = current_user.message_templates.build(template_params)
          if template.save
            render json: { success: true, data: serialize(template) }, status: :created
          else
            render json: { success: false, errors: template.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH /api/v1/therapist/message_templates/:id
        def update
          template = current_user.message_templates.find_by(id: params[:id])
          return render json: { success: false, message: 'Not found' }, status: :not_found unless template

          if template.update(template_params)
            render json: { success: true, data: serialize(template) }
          else
            render json: { success: false, errors: template.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/therapist/message_templates/:id
        def destroy
          template = current_user.message_templates.find_by(id: params[:id])
          return render json: { success: false, message: 'Not found' }, status: :not_found unless template

          template.destroy
          render json: { success: true }
        end

        private

        def template_params
          params.permit(:title, :content, :category, :shared)
        end

        def serialize(t)
          { id: t.id, title: t.title, content: t.content, category: t.category,
            shared: t.shared, created_by_id: t.created_by_id, created_at: t.created_at }
        end
      end
    end
  end
end
