module Api
  module V1
    class ServicesController < BaseController
      def index
        services = Service.active.ordered
        render_success(services.map { |s| serialize(s) }, 'Services retrieved')
      end

      def show
        service = Service.active.find_by!(slug: params[:id])
        render_success(serialize(service), 'Service retrieved')
      rescue ActiveRecord::RecordNotFound
        render_error('Service not found', nil, status: :not_found)
      end

      private

      def serialize(s)
        {
          id: s.id,
          name: s.name,
          slug: s.slug,
          description: s.description,
          price: s.price.to_f.round(2),
          duration_minutes: s.duration_minutes,
          image_url: s.image_url,
          icon: s.icon,
          display_order: s.display_order
        }
      end
    end
  end
end
