class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  include Pundit::Authorization

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActionController::ParameterMissing, with: :parameter_missing

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :email, :password, :password_confirmation, :current_password])
  end

  private

  def render_success(data = nil, message = nil, status: :ok, meta: nil)
    response = {
      success: true,
      message: message,
      data: data
    }
    response[:meta] = meta if meta.present?
    render json: response, status: status
  end

  def render_error(message, errors = nil, status: :unprocessable_entity)
    render json: {
      success: false,
      message: message,
      errors: errors
    }, status: status
  end

  def record_not_found(exception)
    render_error("Record not found: #{exception.message}", nil, status: :not_found)
  end

  def record_invalid(exception)
    render_error("Validation failed", exception.record.errors.full_messages, status: :unprocessable_entity)
  end

  def user_not_authorized
    render_error("You are not authorized to perform this action", nil, status: :forbidden)
  end

  def parameter_missing(exception)
    render_error("Missing parameter: #{exception.param}", nil, status: :bad_request)
  end
end
