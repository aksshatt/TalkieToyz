class AppointmentSerializer < ApplicationSerializer
  attributes :id, :name, :email, :phone, :message, :preferred_language,
             :status, :user_id, :user_name, :service_id, :service_name,
             :service_price, :preferred_date, :child_name, :child_age,
             :created_at, :updated_at

  def user_name
    object.user&.name
  end

  def service_name
    object.service&.name
  end

  def service_price
    object.service&.price&.to_f&.round(2)
  end
end
