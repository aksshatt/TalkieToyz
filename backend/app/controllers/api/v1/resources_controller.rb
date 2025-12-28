module Api
  module V1
    class ResourcesController < BaseController
      before_action :set_resource, only: [:show, :download]

      # GET /api/v1/resources
      def index
        @resources = Resource.active

        # Apply filters
        @resources = @resources.by_category(params[:category_id]) if params[:category_id].present?
        @resources = @resources.by_type(params[:resource_type]) if params[:resource_type].present?
        @resources = @resources.premium if params[:premium] == 'true'
        @resources = @resources.free if params[:free] == 'true'

        # Apply search
        @resources = @resources.search(params[:q]) if params[:q].present?

        # Apply sorting
        @resources = case params[:sort]
                     when 'popular'
                       @resources.popular
                     when 'name'
                       @resources.order(title: :asc)
                     else
                       @resources.recent
                     end

        # Pagination
        page = params[:page] || 1
        per_page = [params[:per_page]&.to_i || 20, 100].min

        @resources = @resources.includes(:resource_category, file_attachment: :blob).page(page).per(per_page)

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @resources,
            each_serializer: ResourceSerializer
          ).as_json,
          'Resources retrieved successfully',
          meta: pagination_meta(@resources)
        )
      end

      # GET /api/v1/resources/:id
      def show
        render_success(
          ResourceSerializer.new(@resource).as_json,
          'Resource retrieved successfully'
        )
      end

      # GET /api/v1/resources/:id/download
      def download
        unless @resource.file.attached?
          return render_error('File not found', nil, status: :not_found)
        end

        # Increment download count
        @resource.increment_download_count

        # Redirect to the file URL
        redirect_to rails_blob_url(@resource.file, disposition: 'attachment'), allow_other_host: true
      end

      # GET /api/v1/resource_categories
      def categories
        @categories = ResourceCategory.active.ordered

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @categories,
            each_serializer: ResourceCategorySerializer
          ).as_json,
          'Resource categories retrieved successfully'
        )
      end

      private

      def set_resource
        @resource = Resource.active.includes(:resource_category, file_attachment: :blob).find_by!(slug: params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Resource not found', nil, status: :not_found)
      end
    end
  end
end
