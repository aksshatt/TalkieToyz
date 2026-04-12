module Api
  module V1
    module Admin
      class ProductQuestionsController < BaseController
        before_action :set_question, only: [:show, :destroy, :approve, :reject, :answer]

        # GET /api/v1/admin/product_questions
        def index
          @questions = ProductQuestion.includes(:product, :user, :answered_by).order(created_at: :desc)

          @questions = @questions.where(approved: params[:approved] == 'true') if params[:approved].present?
          @questions = @questions.where(product_id: params[:product_id]) if params[:product_id].present?

          if params[:answered].present?
            @questions = params[:answered] == 'true' ? @questions.answered : @questions.unanswered
          end

          if params[:q].present?
            @questions = @questions.joins(:user).where(
              'product_questions.question ILIKE ? OR users.name ILIKE ?',
              "%#{params[:q]}%", "%#{params[:q]}%"
            )
          end

          @questions = @questions.page(params[:page] || 1).per(params[:per_page] || 20)

          render_success(
            {
              product_questions: @questions.map { |q| serialize_question(q) },
              meta: pagination_meta(@questions)
            },
            'Questions retrieved'
          )
        end

        # GET /api/v1/admin/product_questions/:id
        def show
          render_success(serialize_question(@question), 'Question retrieved')
        end

        # POST /api/v1/admin/product_questions/:id/approve
        def approve
          if @question.update(approved: true)
            log_activity('approve_product_question', 'ProductQuestion', @question.id)
            render_success(serialize_question(@question), 'Question approved')
          else
            render_error('Failed to approve question', @question.errors.full_messages)
          end
        end

        # POST /api/v1/admin/product_questions/:id/reject
        def reject
          if @question.destroy
            log_activity('reject_product_question', 'ProductQuestion', @question.id)
            render_success(nil, 'Question rejected and removed')
          else
            render_error('Failed to reject question', @question.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/product_questions/:id/answer
        def answer
          unless params[:answer].present?
            return render_error('Answer text is required', nil, status: :unprocessable_entity)
          end

          if @question.update(
            answer: params[:answer],
            answered_by: current_user,
            answered_at: Time.current,
            approved: true
          )
            log_activity('answer_product_question', 'ProductQuestion', @question.id)
            render_success(serialize_question(@question), 'Answer posted successfully')
          else
            render_error('Failed to post answer', @question.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/product_questions/:id
        def destroy
          if @question.destroy
            log_activity('delete_product_question', 'ProductQuestion', @question.id)
            render_success(nil, 'Question deleted')
          else
            render_error('Failed to delete question', @question.errors.full_messages)
          end
        end

        private

        def set_question
          @question = ProductQuestion.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Question not found', nil, status: :not_found)
        end

        def serialize_question(q)
          {
            id: q.id,
            question: q.question,
            answer: q.answer,
            approved: q.approved,
            answered: q.answered?,
            answered_at: q.answered_at&.iso8601,
            created_at: q.created_at.iso8601,
            product: { id: q.product.id, name: q.product.name, slug: q.product.slug },
            user: { id: q.user.id, name: q.user.name, email: q.user.email },
            answered_by: q.answered_by ? { id: q.answered_by.id, name: q.answered_by.name } : nil
          }
        end
      end
    end
  end
end
