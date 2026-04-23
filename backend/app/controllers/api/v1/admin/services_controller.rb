module Api
  module V1
    module Admin
      class ServicesController < BaseController
        before_action :set_service, only: [:show, :update, :destroy]

        def index
          services = Service.ordered
          render_success(services.map { |s| serialize(s) }, 'Services retrieved')
        end

        def show
          render_success(serialize(@service), 'Service retrieved')
        end

        def create
          service = Service.new(service_params)
          if service.save
            log_activity('create', 'Service', service.id, { name: service.name })
            render_success(serialize(service), 'Service created', status: :created)
          else
            render_error('Failed to create service', service.errors.full_messages)
          end
        end

        def update
          if @service.update(service_params)
            log_activity('update', 'Service', @service.id, { name: @service.name })
            render_success(serialize(@service), 'Service updated')
          else
            render_error('Failed to update service', @service.errors.full_messages)
          end
        end

        def destroy
          @service.destroy
          log_activity('delete', 'Service', @service.id, { name: @service.name })
          render_success(nil, 'Service deleted')
        end

        private

        def set_service
          @service = Service.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render_error('Service not found', nil, status: :not_found)
        end

        def service_params
          params.require(:service).permit(
            :name, :slug, :description, :price, :duration_minutes,
            :display_order, :active, :image_url, :icon
          )
        end

        def serialize(s)
          {
            id: s.id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            price: s.price.to_f.round(2),
            duration_minutes: s.duration_minutes,
            display_order: s.display_order,
            active: s.active,
            image_url: s.image_url,
            icon: s.icon,
            created_at: s.created_at.iso8601,
            updated_at: s.updated_at.iso8601
          }
        end
      end
    end
  end
end
