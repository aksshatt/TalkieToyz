module Api
  module V1
    module Admin
      class ResourcesController < BaseController
        before_action :authenticate_admin!
        before_action :set_resource, only: [:show, :update, :destroy]

        # GET /api/v1/admin/resources
        def index
          @resources = Resource.includes(:resource_category, file_attachment: :blob)

          # Apply filters (admin can see all including deleted)
          @resources = @resources.active if params[:active] == 'true'
          @resources = @resources.by_category(params[:category_id]) if params[:category_id].present?
          @resources = @resources.by_type(params[:resource_type]) if params[:resource_type].present?

          # Apply search
          @resources = @resources.search(params[:q]) if params[:q].present?

          # Apply sorting
          @resources = @resources.recent

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min

          @resources = @resources.page(page).per(per_page)

          render_success(
            ActiveModelSerializers::SerializableResource.new(
              @resources,
              each_serializer: ResourceSerializer
            ).as_json,
            'Resources retrieved successfully',
            meta: pagination_meta(@resources)
          )
        end

        # GET /api/v1/admin/resources/:id
        def show
          render_success(
            ResourceSerializer.new(@resource).as_json,
            'Resource retrieved successfully'
          )
        end

        # POST /api/v1/admin/resources
        def create
          @resource = Resource.new(resource_params)

          if @resource.save
            attach_file if params[:file].present?

            render_success(
              ResourceSerializer.new(@resource.reload).as_json,
              'Resource created successfully',
              status: :created
            )
          else
            render_error('Failed to create resource', @resource.errors.full_messages)
          end
        end

        # PATCH /api/v1/admin/resources/:id
        def update
          if @resource.update(resource_params)
            attach_file if params[:file].present?

            render_success(
              ResourceSerializer.new(@resource.reload).as_json,
              'Resource updated successfully'
            )
          else
            render_error('Failed to update resource', @resource.errors.full_messages)
          end
        end

        # DELETE /api/v1/admin/resources/:id
        def destroy
          if @resource.soft_delete
            render_success(nil, 'Resource deleted successfully')
          else
            render_error('Failed to delete resource', @resource.errors.full_messages)
          end
        end

        private

        def set_resource
          @resource = Resource.find_by!(slug: params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Resource not found', nil, status: :not_found)
        end

        def resource_params
          params.require(:resource).permit(
            :title,
            :slug,
            :description,
            :resource_type,
            :resource_category_id,
            :premium,
            :active,
            tags: [],
            metadata: {}
          )
        end

        def attach_file
          @resource.file.attach(params[:file])
        end

        def authenticate_admin!
          render_error('Unauthorized', nil, status: :forbidden) unless current_user&.admin?
        end
      end
    end
  end
end
