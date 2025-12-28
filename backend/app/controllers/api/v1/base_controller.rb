module Api
  module V1
    class BaseController < ApplicationController
      # Authentication will be added with JWT in the next phase
      # before_action :authenticate_user!

      # Temporary current_user stub for development
      def current_user
        if defined?(User)
          @current_user ||= User.first
          # Ensure user has a cart
          if @current_user && !@current_user.cart
            Cart.create(user: @current_user)
          end
          @current_user
        end
      end

      def authenticate_user!
        # TODO: Implement JWT authentication
        # For now, allow all requests
        true
      end

      private

      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          next_page: collection.next_page,
          prev_page: collection.prev_page,
          total_pages: collection.total_pages,
          total_count: collection.total_count
        }
      end
    end
  end
end
