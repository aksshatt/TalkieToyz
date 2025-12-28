class ReviewSerializer < ApplicationSerializer
  attributes :id, :rating, :title, :comment, :verified_purchase, :helpful_count,
             :created_at, :has_photos, :photo_urls, :admin_response, :admin_responded_at

  belongs_to :user
  belongs_to :product

  def has_photos
    object.photos.attached?
  end

  def photo_urls
    return [] unless object.photos.attached?

    object.photos.map do |photo|
      if photo.representable?
        {
          url: Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true),
          thumbnail_url: Rails.application.routes.url_helpers.rails_representation_url(
            photo.variant(resize_to_limit: [200, 200]),
            only_path: true
          ),
          filename: photo.filename.to_s
        }
      else
        {
          url: Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true),
          filename: photo.filename.to_s
        }
      end
    end
  end

  def verified_purchase
    object.verified_purchase?
  end
end
