module Api
  module V1
    class AddressesController < BaseController
      before_action :set_address, only: [:show, :update, :destroy, :set_default]

      # GET /api/v1/addresses
      def index
        @addresses = current_user.user_addresses.order(is_default: :desc, created_at: :desc)

        render_success(
          @addresses.map { |address| UserAddressSerializer.new(address).as_json },
          'Addresses retrieved successfully'
        )
      end

      # GET /api/v1/addresses/:id
      def show
        render_success(
          UserAddressSerializer.new(@address).as_json,
          'Address retrieved successfully'
        )
      end

      # POST /api/v1/addresses
      def create
        @address = current_user.user_addresses.build(address_params)

        # If this is the first address, make it default
        @address.is_default = true if current_user.user_addresses.empty?

        if @address.save
          render_success(
            UserAddressSerializer.new(@address).as_json,
            'Address created successfully',
            status: :created
          )
        else
          render_error('Failed to create address', @address.errors.full_messages)
        end
      end

      # PATCH /api/v1/addresses/:id
      def update
        if @address.update(address_params)
          render_success(
            UserAddressSerializer.new(@address).as_json,
            'Address updated successfully'
          )
        else
          render_error('Failed to update address', @address.errors.full_messages)
        end
      end

      # DELETE /api/v1/addresses/:id
      def destroy
        was_default = @address.is_default?

        @address.destroy

        # If deleted address was default, set another one as default
        if was_default
          first_address = current_user.user_addresses.first
          first_address&.update(is_default: true)
        end

        render_success(nil, 'Address deleted successfully')
      end

      # POST /api/v1/addresses/:id/set_default
      def set_default
        if @address.update(is_default: true)
          render_success(
            UserAddressSerializer.new(@address).as_json,
            'Default address updated successfully'
          )
        else
          render_error('Failed to set default address', @address.errors.full_messages)
        end
      end

      # GET /api/v1/addresses/pincode/:pincode
      def pincode_lookup
        pincode = params[:pincode]

        unless pincode =~ /\A\d{6}\z/
          return render_error('Invalid PIN code', ['PIN code must be 6 digits'], status: :bad_request)
        end

        result = PincodeService.lookup(pincode)

        if result[:success]
          render_success(result[:data], 'PIN code details retrieved successfully')
        else
          render_error('PIN code not found', [result[:error]], status: :not_found)
        end
      end

      private

      def set_address
        @address = current_user.user_addresses.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render_error('Address not found', nil, status: :not_found)
      end

      def address_params
        params.require(:address).permit(
          :name,
          :phone,
          :address_line_1,
          :address_line_2,
          :city,
          :state,
          :postal_code,
          :country,
          :is_default
        )
      end
    end
  end
end
