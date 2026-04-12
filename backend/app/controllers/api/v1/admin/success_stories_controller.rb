module Api
  module V1
    module Admin
      class SuccessStoriesController < BaseController
        before_action :set_story, only: [:show, :update, :destroy, :approve, :reject, :feature]

        # GET /api/v1/admin/success_stories
        def index
          @stories = SuccessStory.includes(:user, :product).order(created_at: :desc)

          @stories = @stories.where(approved: params[:approved] == 'true') if params[:approved].present?
          @stories = @stories.where(featured: true) if params[:featured] == 'true'

          if params[:q].present?
            @stories = @stories.joins(:user).where(
              'success_stories.child_name ILIKE ? OR users.name ILIKE ?',
              "%#{params[:q]}%", "%#{params[:q]}%"
            )
          end

          @stories = @stories.page(params[:page] || 1).per(params[:per_page] || 20)

          render_success(
            {
              success_stories: @stories.map { |s| serialize_story(s) },
              meta: pagination_meta(@stories)
            },
            'Success stories retrieved'
          )
        end

        # GET /api/v1/admin/success_stories/:id
        def show
          render_success(serialize_story(@story), 'Success story retrieved')
        end

        # POST /api/v1/admin/success_stories/:id/approve
        def approve
          if @story.update(approved: true)
            log_activity('approve_success_story', 'SuccessStory', @story.id)
            render_success(serialize_story(@story), 'Story approved successfully')
          else
            render_error('Failed to approve story', @story.errors.full_messages)
          end
        end

        # POST /api/v1/admin/success_stories/:id/reject
        def reject
          if @story.update(approved: false)
            log_activity('reject_success_story', 'SuccessStory', @story.id)
            render_success(serialize_story(@story), 'Story rejected')
          else
            render_error('Failed to reject story', @story.errors.full_messages)
          end
        end

        # POST /api/v1/admin/success_stories/:id/feature
        def feature
          new_featured = !@story.featured
          if @story.update(featured: new_featured)
            log_activity('feature_success_story', 'SuccessStory', @story.id, { featured: new_featured })
            render_success(serialize_story(@story), new_featured ? 'Story featured' : 'Story unfeatured')
          else
            render_error('Failed to update story', @story.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/success_stories/:id
        def update
          if @story.update(story_params)
            render_success(serialize_story(@story), 'Story updated successfully')
          else
            render_error('Failed to update story', @story.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/success_stories/:id
        def destroy
          if @story.destroy
            log_activity('delete_success_story', 'SuccessStory', @story.id)
            render_success(nil, 'Story deleted')
          else
            render_error('Failed to delete story', @story.errors.full_messages)
          end
        end

        private

        def set_story
          @story = SuccessStory.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Story not found', nil, status: :not_found)
        end

        def story_params
          params.require(:success_story).permit(
            :child_name, :age_months, :speech_goal, :before_text, :after_text, :approved, :featured
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
            approved: story.approved,
            featured: story.featured,
            created_at: story.created_at.iso8601,
            user: { id: story.user.id, name: story.user.name, email: story.user.email },
            product: story.product ? { id: story.product.id, name: story.product.name, slug: story.product.slug } : nil
          }
        end
      end
    end
  end
end
