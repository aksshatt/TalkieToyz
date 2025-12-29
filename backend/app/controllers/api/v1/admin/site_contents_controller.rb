module Api
  module V1
    module Admin
      class SiteContentsController < BaseController
        before_action :set_site_content, only: [:show, :update, :destroy]

        # GET /api/v1/admin/site_contents
        def index
          @contents = SiteContent.all

          # Filter by page if provided
          @contents = @contents.by_page(params[:filter_page]) if params[:filter_page].present?

          # Search by key or label if query provided
          if params[:query].present?
            @contents = @contents.where(
              'key ILIKE :query OR label ILIKE :query OR description ILIKE :query',
              query: "%#{params[:query]}%"
            )
          end

          # Order
          @contents = @contents.ordered

          # Pagination
          page = params[:page] || 1
          per_page = [params[:per_page]&.to_i || 20, 100].min
          @contents = @contents.page(page).per(per_page)

          render_success(
            {
              contents: ActiveModelSerializers::SerializableResource.new(
                @contents,
                each_serializer: SiteContentSerializer
              ).as_json,
              pagination: pagination_meta(@contents)
            },
            'Site contents retrieved successfully'
          )
        end

        # GET /api/v1/admin/site_contents/:id
        def show
          render_success(
            SiteContentSerializer.new(@site_content).as_json,
            'Site content retrieved successfully'
          )
        end

        # POST /api/v1/admin/site_contents
        def create
          @site_content = SiteContent.new(site_content_params)

          if @site_content.save
            log_activity('create', 'SiteContent', @site_content.id, { key: @site_content.key, page: @site_content.page })

            render_success(
              SiteContentSerializer.new(@site_content).as_json,
              'Site content created successfully',
              status: :created
            )
          else
            render_error(
              'Failed to create site content',
              @site_content.errors.full_messages,
              status: :unprocessable_entity
            )
          end
        end

        # PATCH/PUT /api/v1/admin/site_contents/:id
        def update
          if @site_content.update(site_content_params)
            log_activity('update', 'SiteContent', @site_content.id, { key: @site_content.key })

            render_success(
              SiteContentSerializer.new(@site_content).as_json,
              'Site content updated successfully'
            )
          else
            render_error(
              'Failed to update site content',
              @site_content.errors.full_messages,
              status: :unprocessable_entity
            )
          end
        end

        # DELETE /api/v1/admin/site_contents/:id
        def destroy
          key = @site_content.key
          page = @site_content.page
          content_id = @site_content.id

          if @site_content.destroy
            log_activity('delete', 'SiteContent', content_id, { key: key, page: page })

            render_success(
              { id: params[:id] },
              'Site content deleted successfully'
            )
          else
            render_error('Failed to delete site content', nil, status: :unprocessable_entity)
          end
        end

        # GET /api/v1/admin/site_contents/pages
        # Returns list of available pages with content counts
        def pages
          pages_data = SiteContent.group(:page).count.map do |page, count|
            {
              page: page,
              count: count,
              active_count: SiteContent.active.by_page(page).count
            }
          end

          render_success(pages_data, 'Pages retrieved successfully')
        end

        private

        def set_site_content
          @site_content = SiteContent.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Site content not found', :not_found)
        end

        def site_content_params
          params.require(:site_content).permit(
            :key,
            :page,
            :content_type,
            :value,
            :label,
            :description,
            :active,
            :display_order,
            metadata: {}
          )
        end
      end
    end
  end
end
