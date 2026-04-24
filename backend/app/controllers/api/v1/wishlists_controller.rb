module Api
  module V1
    class WishlistsController < BaseController
      before_action :authenticate_user!

      # GET /api/v1/wishlists
      def index
        @items = current_user.wishlists.includes(product: { images_attachments: :blob })
        render_success(
          @items.map { |w| wishlist_item_json(w) },
          'Wishlist retrieved successfully'
        )
      end

      # POST /api/v1/wishlists
      def create
        product = Product.active.find(params[:product_id])
        @item = current_user.wishlists.find_or_initialize_by(product: product)

        if !@item.new_record?
          # Idempotent: already wishlisted is not an error.
          render_success({ id: @item.id, product_id: product.id }, 'Already in wishlist')
        elsif @item.save
          render_success({ id: @item.id, product_id: product.id }, 'Added to wishlist', status: :created)
        else
          render_error('Failed to add to wishlist', @item.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Product not found', nil, status: :not_found)
      end

      # DELETE /api/v1/wishlists/:id  (id = product_id)
      def destroy
        @item = current_user.wishlists.find_by(product_id: params[:id])
        if @item&.destroy
          render_success(nil, 'Removed from wishlist')
        else
          render_error('Item not found in wishlist', nil, status: :not_found)
        end
      end

      # GET /api/v1/wishlists/:id/check  (id = product_id)
      def check
        wishlisted = current_user.wishlists.exists?(product_id: params[:id])
        render_success({ wishlisted: wishlisted }, 'Check complete')
      end

      private

      def wishlist_item_json(w)
        product = w.product
        image_url = nil
        if product.images.attached?
          begin
            image_url = Rails.application.routes.url_helpers.rails_blob_url(
              product.images.first,
              host: ENV.fetch('BACKEND_URL', 'https://talkietoys-backend.onrender.com')
            )
          rescue => e
            Rails.logger.error("Wishlist image URL error: #{e.message}")
          end
        end

        {
          id: w.id,
          product_id: w.product_id,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image_url: image_url
          },
          created_at: w.created_at
        }
      end
    end
  end
end
