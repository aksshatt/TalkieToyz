module Api
  module V1
    module Admin
      class ReviewsController < Admin::BaseController
        before_action :set_review, only: [:show, :approve, :reject, :add_response, :destroy]

        # GET /api/v1/admin/reviews
        def index
          @reviews = Review.includes(:user, :product, photos_attachments: :blob)

          # Filters
          @reviews = @reviews.where(approved: false, deleted_at: nil) if params[:pending] == 'true'
          @reviews = @reviews.where(approved: true) if params[:approved] == 'true'
          @reviews = @reviews.by_rating(params[:rating]) if params[:rating].present?
          @reviews = @reviews.where(product_id: params[:product_id]) if params[:product_id].present?

          # Search by comment or user name
          if params[:q].present?
            @reviews = @reviews.joins(:user).where(
              'reviews.comment ILIKE ? OR users.name ILIKE ?',
              "%#{params[:q]}%", "%#{params[:q]}%"
            )
          end

          # Sorting
          @reviews = @reviews.order(created_at: :desc)

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @reviews = @reviews.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @reviews,
              each_serializer: ReviewSerializer
            ).as_json,
            'Reviews retrieved successfully',
            meta: pagination_meta(@reviews)
          )
        end

        # GET /api/v1/admin/reviews/:id
        def show
          render_success(
            ReviewSerializer.new(@review).as_json,
            'Review retrieved successfully'
          )
        end

        # POST /api/v1/admin/reviews/:id/approve
        def approve
          if @review.approve!
            log_activity('approve_review', 'Review', @review.id)
            render_success(ReviewSerializer.new(@review).as_json, 'Review approved successfully')
          else
            render_error('Failed to approve review', @review.errors.full_messages)
          end
        end

        # POST /api/v1/admin/reviews/:id/reject
        def reject
          if @review.soft_delete
            log_activity('reject_review', 'Review', @review.id)
            render_success(nil, 'Review rejected successfully')
          else
            render_error('Failed to reject review', @review.errors.full_messages)
          end
        end

        # POST /api/v1/admin/reviews/:id/add_response
        def add_response
          unless params[:response].present?
            return render_error('Response text is required', nil, status: :unprocessable_entity)
          end

          if @review.add_admin_response(params[:response], current_user)
            log_activity('add_review_response', 'Review', @review.id, { response: params[:response] })
            render_success(ReviewSerializer.new(@review).as_json, 'Admin response added successfully')
          else
            render_error('Failed to add response', @review.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/reviews/:id
        def destroy
          if @review.destroy
            log_activity('delete_review', 'Review', @review.id)
            render_success(nil, 'Review deleted permanently')
          else
            render_error('Failed to delete review', @review.errors.full_messages)
          end
        end

        # GET /api/v1/admin/reviews/statistics
        def statistics
          stats = {
            total_reviews: Review.count,
            pending_reviews: Review.where(approved: false, deleted_at: nil).count,
            approved_reviews: Review.approved.count,
            average_rating: Review.approved.average(:rating).to_f.round(2),
            reviews_with_photos: Review.joins(:photos_attachments).distinct.count,
            verified_purchase_reviews: Review.verified.count
          }

          render_success(stats, 'Statistics retrieved successfully')
        end

        private

        def set_review
          @review = Review.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Review not found', nil, status: :not_found)
        end
      end
    end
  end
end
