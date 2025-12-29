class UserAddressSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :phone,
             :address_line_1,
             :address_line_2,
             :city,
             :state,
             :postal_code,
             :country,
             :is_default,
             :created_at,
             :updated_at
end
