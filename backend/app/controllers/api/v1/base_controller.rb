module Api
  module V1
    class BaseController < ApplicationController
      def current_user
        return @current_user if defined?(@current_user)

        token = extract_bearer_token
        return @current_user = nil unless token

        begin
          secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base
          payload = JWT.decode(token, secret, true, algorithms: ['HS256']).first

          # Access tokens must carry type=='access' (or be a legacy token without
          # a type field, for backward compatibility with sessions issued before
          # the field was added). Explicit non-access types (e.g. 'refresh') are
          # rejected so refresh tokens cannot be swapped in as bearer credentials.
          token_type = payload['type']
          return @current_user = nil if token_type.present? && token_type != 'access'

          @current_user = User.find_by(id: payload['user_id'])
        rescue JWT::DecodeError, JWT::ExpiredSignature
          @current_user = nil
        end
      end

      def authenticate_user!
        unless current_user
          render json: { success: false, message: 'Authentication required. Please log in.' }, status: :unauthorized
        end
      end

      private

      def extract_bearer_token
        auth_header = request.headers['Authorization']
        return nil unless auth_header&.start_with?('Bearer ')
        auth_header.split(' ', 2).last
      end

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
