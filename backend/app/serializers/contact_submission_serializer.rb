class ContactSubmissionSerializer < ApplicationSerializer
  attributes :id, :name, :email, :phone, :subject, :message,
             :status, :admin_notes, :responded_at, :created_at, :updated_at
end
