module Api
  module V1
    class SuccessStoriesController < BaseController
      before_action :authenticate_user!, only: [:create]

      # GET /api/v1/success_stories
      def index
        @stories = SuccessStory.approved.includes(:user, :product)

        @stories = @stories.where(product_id: params[:product_id]) if params[:product_id].present?
        @stories = @stories.featured if params[:featured] == 'true'
        @stories = @stories.order(created_at: :desc).page(params[:page] || 1).per(10)

        render_success(
          @stories.map { |s| serialize_story(s) },
          'Success stories retrieved',
          meta: pagination_meta(@stories)
        )
      end

      # POST /api/v1/success_stories
      def create
        @story = current_user.success_stories.build(story_params)

        if @story.save
          render_success(serialize_story(@story), 'Story submitted for review', status: :created)
        else
          render_error('Failed to submit story', @story.errors.full_messages)
        end
      end

      private

      def story_params
        params.require(:success_story).permit(
          :child_name, :age_months, :speech_goal, :before_text, :after_text, :product_id
        )
      end

      def serialize_story(story)
        {
          id: story.id,
          child_name: story.child_name,
          age_months: story.age_months,
          speech_goal: story.speech_goal,
          before_text: story.before_text,
          after_text: story.after_text,
          featured: story.featured,
          created_at: story.created_at,
          user: { id: story.user.id, name: story.user.name },
          product: story.product ? { id: story.product.id, name: story.product.name, slug: story.product.slug } : nil
        }
      end
    end
  end
end
