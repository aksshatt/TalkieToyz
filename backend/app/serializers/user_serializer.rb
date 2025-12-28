class UserSerializer < ApplicationSerializer
  attributes :id, :name, :email, :role, :created_at
end
