module Api
  module V1
    class SuggestionsController < BaseController
      def create
        suggestion = Suggestion.new(suggestion_params)
        suggestion.name ||= current_user&.name if defined?(current_user) && current_user
        suggestion.email ||= current_user&.email if defined?(current_user) && current_user

        if suggestion.save
          render_success({ id: suggestion.id }, 'Thanks for sharing your suggestion!', status: :created)
        else
          render_error('Failed to submit suggestion', suggestion.errors.full_messages)
        end
      end

      private

      def suggestion_params
        params.require(:suggestion).permit(:message, :name, :email)
      end
    end
  end
end
