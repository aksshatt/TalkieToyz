module Api
  module V1
    class BlogPostsController < BaseController
      before_action :set_blog_post, only: [:show, :add_comment]

      # GET /api/v1/blog_posts
      def index
        @posts = BlogPost.active.published

        # Apply filters
        @posts = @posts.by_category(params[:category]) if params[:category].present?
        @posts = @posts.featured if params[:featured] == 'true'
        @posts = @posts.by_author(params[:author_id]) if params[:author_id].present?

        # Apply search
        @posts = @posts.search(params[:q]) if params[:q].present?

        # Apply sorting
        @posts = case params[:sort]
                 when 'popular'
                   @posts.popular
                 when 'oldest'
                   @posts.order(published_at: :asc)
                 else
                   @posts.recent
                 end

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @posts = @posts.includes(:author, :rich_text_content).page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @posts,
            each_serializer: BlogPostSummarySerializer
          ).as_json,
          'Blog posts retrieved successfully',
          meta: pagination_meta(@posts)
        )
      end

      # GET /api/v1/blog_posts/:id
      def show
        # Increment view count
        @post.increment_view_count

        render_success(
          BlogPostDetailSerializer.new(@post).as_json,
          'Blog post retrieved successfully'
        )
      end

      # POST /api/v1/blog_posts/:id/add_comment
      def add_comment
        unless @post.allow_comments?
          return render_error('Comments are not allowed on this post', nil, status: :forbidden)
        end

        unless params[:author_name].present? && params[:author_email].present? && params[:comment_text].present?
          return render_error('Missing required fields', ['author_name, author_email, and comment_text are required'], status: :unprocessable_entity)
        end

        if @post.add_comment(
          author_name: params[:author_name],
          author_email: params[:author_email],
          comment_text: params[:comment_text]
        )
          render_success(
            nil,
            'Comment submitted successfully and is pending approval'
          )
        else
          render_error('Failed to add comment', @post.errors.full_messages)
        end
      end

      private

      def set_blog_post
        @post = BlogPost.active.published.find_by!(slug: params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Blog post not found', nil, status: :not_found)
      end
    end
  end
end
