module Api
  module V1
    class ProductQuestionsController < BaseController
      before_action :authenticate_user!, only: [:create]
      before_action :set_product

      # GET /api/v1/products/:product_id/questions
      def index
        @questions = @product.product_questions.approved
                             .includes(:user, :answered_by)
                             .order(created_at: :desc)
                             .page(params[:page] || 1).per(10)

        render_success(
          @questions.map { |q| serialize_question(q) },
          'Questions retrieved',
          meta: pagination_meta(@questions)
        )
      end

      # POST /api/v1/products/:product_id/questions
      def create
        @question = @product.product_questions.build(
          user: current_user,
          question: params[:question]
        )

        if @question.save
          render_success(serialize_question(@question), 'Question submitted', status: :created)
        else
          render_error('Failed to submit question', @question.errors.full_messages)
        end
      end

      # PATCH /api/v1/products/:product_id/questions/:id/answer
      def answer
        authenticate_therapist_or_admin!
        @question = @product.product_questions.find(params[:id])

        if @question.update(answer: params[:answer], answered_by: current_user, answered_at: Time.current)
          render_success(serialize_question(@question), 'Answer posted')
        else
          render_error('Failed to post answer', @question.errors.full_messages)
        end
      end

      private

      def set_product
        @product = Product.active.find_by!(slug: params[:product_id])
      rescue ActiveRecord::RecordNotFound
        render_error('Product not found', nil, status: :not_found)
      end

      def authenticate_therapist_or_admin!
        unless current_user&.therapist? || current_user&.admin?
          render_error('Only therapists and admins can answer questions', nil, status: :forbidden)
        end
      end

      def serialize_question(q)
        {
          id: q.id,
          question: q.question,
          answer: q.answer,
          answered: q.answered?,
          answered_at: q.answered_at,
          created_at: q.created_at,
          user: { id: q.user.id, name: q.user.name },
          answered_by: q.answered_by ? { id: q.answered_by.id, name: q.answered_by.name, role: q.answered_by.role } : nil
        }
      end
    end
  end
end
