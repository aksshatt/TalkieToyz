class PincodeService
  class << self
    # Lookup city and state from Indian PIN code
    def lookup(pincode)
      # Using India Post API (free, no authentication required)
      response = HTTParty.get("https://api.postalpincode.in/pincode/#{pincode}")

      if response.success? && response.parsed_response.is_a?(Array)
        data = response.parsed_response.first

        if data && data['Status'] == 'Success' && data['PostOffice']&.any?
          post_office = data['PostOffice'].first

          {
            success: true,
            data: {
              pincode: pincode,
              city: post_office['District'],
              state: post_office['State'],
              country: post_office['Country'] || 'India',
              post_office_name: post_office['Name'],
              region: post_office['Region']
            }
          }
        else
          {
            success: false,
            error: 'PIN code not found or invalid'
          }
        end
      else
        {
          success: false,
          error: 'Failed to fetch PIN code details'
        }
      end
    rescue => e
      Rails.logger.error("Pincode lookup error: #{e.message}")
      {
        success: false,
        error: 'Service temporarily unavailable'
      }
    end
  end
end
