module Api
  module V1
    module Admin
      class BlogPostsController < BaseController
        before_action :authenticate_admin!
        before_action :set_blog_post, only: [:show, :update, :destroy, :approve_comment]

        # GET /api/v1/admin/blog_posts
        def index
          @posts = BlogPost.active

          # Apply filters (admin can see all statuses)
          @posts = @posts.by_status(params[:status]) if params[:status].present?
          @posts = @posts.by_category(params[:category]) if params[:category].present?
          @posts = @posts.by_author(params[:author_id]) if params[:author_id].present?

          # Apply search
          @posts = @posts.search(params[:q]) if params[:q].present?

          # Apply sorting
          @posts = @posts.recent

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @posts = @posts.includes(:author, :rich_text_content).page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @posts,
              each_serializer: BlogPostDetailSerializer
            ).as_json,
            'Blog posts retrieved successfully',
            meta: pagination_meta(@posts)
          )
        end

        # GET /api/v1/admin/blog_posts/:id
        def show
          render_success(
            BlogPostDetailSerializer.new(@post).as_json,
            'Blog post retrieved successfully'
          )
        end

        # POST /api/v1/admin/blog_posts
        def create
          @post = current_user.blog_posts.build(blog_post_params)

          if @post.save
            render_success(
              BlogPostDetailSerializer.new(@post).as_json,
              'Blog post created successfully',
              status: :created
            )
          else
            render_error('Failed to create blog post', @post.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/blog_posts/:id
        def update
          if @post.update(blog_post_params)
            render_success(
              BlogPostDetailSerializer.new(@post).as_json,
              'Blog post updated successfully'
            )
          else
            render_error('Failed to update blog post', @post.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/blog_posts/:id
        def destroy
          if @post.soft_delete
            render_success(nil, 'Blog post deleted successfully')
          else
            render_error('Failed to delete blog post', @post.errors.full_messages)
          end
        end

        # POST /api/v1/admin/blog_posts/:id/approve_comment
        def approve_comment
          comment_id = params[:comment_id]

          unless comment_id.present?
            return render_error('Comment ID is required', nil, status: :unprocessable_entity)
          end

          if @post.approve_comment(comment_id)
            render_success(nil, 'Comment approved successfully')
          else
            render_error('Failed to approve comment', ['Comment not found'])
          end
        end

        private

        def set_blog_post
          @post = BlogPost.active.find_by!(slug: params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Blog post not found', nil, status: :not_found)
        end

        def blog_post_params
          params.require(:blog_post).permit(
            :title,
            :slug,
            :excerpt,
            :content,
            :featured_image_url,
            :category,
            :status,
            :published_at,
            :reading_time_minutes,
            :allow_comments,
            :featured,
            tags: [],
            seo_metadata: {}
          )
        end

        def authenticate_admin!
          render_error('Unauthorized', nil, status: :forbidden) unless current_user&.admin?
        end
      end
    end
  end
end
