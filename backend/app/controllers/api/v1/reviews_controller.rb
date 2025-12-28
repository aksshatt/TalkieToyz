module Api
  module V1
    class ReviewsController < BaseController
      before_action :authenticate_user!, except: [:index]
      before_action :set_product, only: [:index, :create]
      before_action :set_review, only: [:update, :destroy, :mark_helpful, :unmark_helpful]
      before_action :check_rate_limit, only: [:create]

      # GET /api/v1/products/:product_id/reviews
      def index
        @reviews = @product.reviews.approved.includes(:user, photos_attachments: :blob)

        # Apply filters
        @reviews = apply_filters(@reviews)

        # Apply sorting
        @reviews = apply_sorting(@reviews)

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 10, 50].min

        @reviews = @reviews.page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @reviews,
            each_serializer: ReviewSerializer
          ).as_json,
          'Reviews retrieved successfully',
          meta: pagination_meta(@reviews).merge(
            average_rating: @product.average_rating,
            total_reviews: @product.reviews.approved.count,
            rating_breakdown: rating_breakdown
          )
        )
      end

      # POST /api/v1/products/:product_id/reviews
      def create
        # Check if already reviewed
        if current_user.reviews.exists?(product: @product)
          return render_error('You have already reviewed this product', nil, status: :unprocessable_entity)
        end

        # Check profanity
        if ProfanityFilter.contains_profanity?(review_params[:comment])
          return render_error('Review contains inappropriate content', ['Please remove profanity from your review'], status: :unprocessable_entity)
        end

        @review = @product.reviews.build(review_params)
        @review.user = current_user
        @review.verified_purchase = @review.verified_purchase?
        @review.approved = false # Admin approval required

        if @review.save
          attach_photos if params[:photos].present?
          ReviewRateLimit.increment_for(current_user)

          render_success(
            ReviewSerializer.new(@review).as_json,
            'Review submitted successfully and is pending approval',
            status: :created
          )
        else
          render_error('Failed to create review', @review.errors.full_messages)
        end
      end

      # PATCH /api/v1/reviews/:id
      def update
        unless @review.user_id == current_user.id
          return render_error('Unauthorized', nil, status: :forbidden)
        end

        # Check profanity
        if params[:comment] && ProfanityFilter.contains_profanity?(params[:comment])
          return render_error('Review contains inappropriate content', ['Please remove profanity from your review'], status: :unprocessable_entity)
        end

        if @review.update(review_update_params)
          attach_photos if params[:photos].present?
          @review.update(approved: false) # Re-require approval after edit

          render_success(
            ReviewSerializer.new(@review).as_json,
            'Review updated successfully and is pending re-approval'
          )
        else
          render_error('Failed to update review', @review.errors.full_messages)
        end
      end

      # DELETE /api/v1/reviews/:id
      def destroy
        unless @review.user_id == current_user.id
          return render_error('Unauthorized', nil, status: :forbidden)
        end

        if @review.soft_delete
          render_success(nil, 'Review deleted successfully')
        else
          render_error('Failed to delete review', @review.errors.full_messages)
        end
      end

      # POST /api/v1/reviews/:id/helpful
      def mark_helpful
        if @review.mark_helpful_by(current_user)
          render_success({ helpful_count: @review.helpful_count }, 'Review marked as helpful')
        else
          render_error('You have already marked this review as helpful', nil, status: :unprocessable_entity)
        end
      end

      # DELETE /api/v1/reviews/:id/helpful
      def unmark_helpful
        if @review.unmark_helpful_by(current_user)
          render_success({ helpful_count: @review.helpful_count }, 'Review unmarked as helpful')
        else
          render_error('You have not marked this review as helpful', nil, status: :unprocessable_entity)
        end
      end

      private

      def set_product
        @product = Product.active.find_by!(slug: params[:product_id])
      rescue ActiveRecord::RecordNotFound
        render_error('Product not found', nil, status: :not_found)
      end

      def set_review
        @review = Review.approved.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Review not found', nil, status: :not_found)
      end

      def check_rate_limit
        unless ReviewRateLimit.can_review?(current_user)
          render_error('Rate limit exceeded', ['You can only submit 5 reviews per day'], status: :too_many_requests)
        end
      end

      def review_params
        params.require(:review).permit(:rating, :title, :comment)
      end

      def review_update_params
        params.permit(:title, :comment)
      end

      def attach_photos
        photos_array = params[:photos].is_a?(Array) ? params[:photos] : [params[:photos]]
        photos_array.first(3).each do |photo|
          @review.photos.attach(photo)
        end
      end

      def apply_filters(reviews)
        reviews = reviews.by_rating(params[:rating]) if params[:rating].present?
        reviews = reviews.verified if params[:verified] == 'true'
        reviews = reviews.with_photos if params[:with_photos] == 'true'
        reviews
      end

      def apply_sorting(reviews)
        case params[:sort]
        when 'most_helpful'
          reviews.most_helpful
        when 'highest_rated'
          reviews.highest_rated
        when 'lowest_rated'
          reviews.lowest_rated
        when 'recent'
          reviews.recent
        else
          reviews.recent
        end
      end

      def rating_breakdown
        (1..5).map do |rating|
          {
            rating: rating,
            count: @product.reviews.approved.by_rating(rating).count
          }
        end
      end
    end
  end
end
