class AppointmentSerializer < ApplicationSerializer
  attributes :id, :name, :email, :phone, :message, :preferred_language,
             :status, :user_id, :user_name, :created_at, :updated_at

  def user_name
    object.user&.name
  end
end
