module ApiResponse
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError do |e|
      render_internal_server_error(e)
    end
  end

  private

  def render_success(data = nil, message = nil, status: :ok, meta: nil)
    response = {
      success: true,
      message: message,
      data: data,
    }
    response[:meta] = meta if meta.present?

    render json: response, status: status
  end

  def render_error(message, errors = nil, status: :unprocessable_entity)
    render json: {
      success: false,
      message: message,
      errors: errors,
    }, status: status
  end

  def render_internal_server_error(exception)
    Rails.logger.error("Internal Server Error: #{exception.message}")
    Rails.logger.error(exception.backtrace.join("\n"))

    if Rails.env.production?
      render_error('An unexpected error occurred', nil, status: :internal_server_error)
    else
      render_error(
        'Internal Server Error',
        {
          message: exception.message,
          backtrace: exception.backtrace.first(10),
        },
        status: :internal_server_error
      )
    end
  end

  def pagination_meta(collection)
    return nil unless collection.respond_to?(:current_page)

    {
      current_page: collection.current_page,
      next_page: collection.next_page,
      prev_page: collection.prev_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
    }
  end
end
