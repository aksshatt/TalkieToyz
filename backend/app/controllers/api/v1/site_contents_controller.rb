module Api
  module V1
    class SiteContentsController < BaseController
      # GET /api/v1/site_contents/:page
      # Returns all active content for a specific page
      def show
        @contents = SiteContent.active.by_page(params[:page]).ordered

        render_success(
          ActiveModelSerializers::SerializableResource.new(
            @contents,
            each_serializer: SiteContentSerializer
          ).as_json,
          'Content retrieved successfully'
        )
      rescue StandardError => e
        render_error('Failed to retrieve content', :internal_server_error, { error: e.message })
      end

      # GET /api/v1/site_contents/:page/keys
      # Returns content as key-value pairs for easy frontend consumption
      def keys
        contents = SiteContent.get_page_contents(params[:page])
        render_success(contents, 'Content retrieved successfully')
      rescue StandardError => e
        render_error('Failed to retrieve content', :internal_server_error, { error: e.message })
      end
    end
  end
end
