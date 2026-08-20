module Api
  module V1
    class FestivalThemeController < BaseController
      def current
        festival = FestivalThemeService.today
        if festival
          render json: { success: true, data: festival }
        else
          render json: { success: true, data: nil }
        end
      end
    end
  end
end
