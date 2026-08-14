require 'net/http'

# Fast2SMS integration — https://docs.fast2sms.com
class SmsService
  BASE_URL = 'https://www.fast2sms.com/dev/bulkV2'

  def self.send(phone:, message:)
    api_key = ENV['FAST2SMS_API_KEY']

    unless api_key.present?
      Rails.logger.warn('SmsService: FAST2SMS_API_KEY not set')
      return false
    end

    phone = phone.to_s.gsub(/\D/, '').last(10)

    uri = URI(BASE_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 10

    request = Net::HTTP::Get.new(uri)
    request['authorization'] = api_key
    request['Content-Type'] = 'application/json'

    uri.query = URI.encode_www_form(
      authorization: api_key,
      message: message,
      language: 'english',
      route: 'q',
      numbers: phone
    )

    response = http.request(Net::HTTP::Get.new(uri))
    body = JSON.parse(response.body) rescue {}

    if body['return'] == true
      true
    else
      Rails.logger.error("SmsService: #{body['message'] || response.body.truncate(200)}")
      false
    end
  rescue => e
    Rails.logger.error("SmsService: #{e.message}")
    false
  end

  # Convenience wrappers for order events
  def self.order_confirmed(order)
    phone = order.shipping_address&.dig('phone').presence || order.user&.phone
    return unless phone
    send(phone: phone, message: "Your TalkieToys order ##{order.order_number} is confirmed! Total: ₹#{order.total}. Track at talkietoys.com/orders/#{order.id}")
  end

  def self.order_shipped(order)
    phone = order.shipping_address&.dig('phone').presence || order.user&.phone
    return unless phone
    awb = order.shipment&.awb_code.presence || 'N/A'
    send(phone: phone, message: "Your TalkieToys order ##{order.order_number} has been shipped! AWB: #{awb}. Track at talkietoys.com/orders/#{order.id}")
  end

  def self.order_delivered(order)
    phone = order.shipping_address&.dig('phone').presence || order.user&.phone
    return unless phone
    send(phone: phone, message: "Your TalkieToys order ##{order.order_number} has been delivered! We hope your little one loves it. Rate us at talkietoys.com")
  end
end
