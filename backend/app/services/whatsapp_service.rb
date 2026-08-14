require 'net/http'

class WhatsappService
  BASE_URL = 'https://graph.facebook.com/v19.0'

  # Send a pre-approved WhatsApp Business template message.
  # phone_number: E.164 without '+', e.g. "919876543210"
  # template_name: approved template name in Meta Business Manager
  # components: array of component hashes (header/body parameter values)
  def self.send_template(phone_number:, template_name:, components: [])
    phone_number_id = ENV['WHATSAPP_PHONE_NUMBER_ID']
    access_token    = ENV['WHATSAPP_ACCESS_TOKEN']

    unless phone_number_id.present? && access_token.present?
      Rails.logger.warn('WhatsappService: WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN not set')
      return false
    end

    payload = {
      messaging_product: 'whatsapp',
      to: phone_number.to_s.gsub(/\D/, ''),
      type: 'template',
      template: {
        name: template_name,
        language: { code: 'en' },
        components: components
      }
    }

    uri = URI("#{BASE_URL}/#{phone_number_id}/messages")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 10

    request = Net::HTTP::Post.new(uri)
    request['Authorization'] = "Bearer #{access_token}"
    request['Content-Type']  = 'application/json'
    request.body = payload.to_json

    response = http.request(request)

    if response.code.to_i == 200
      true
    else
      Rails.logger.error("WhatsappService: API error #{response.code} – #{response.body.truncate(200)}")
      false
    end
  rescue => e
    Rails.logger.error("WhatsappService: #{e.message}")
    false
  end

  # Convenience wrappers — each maps to a Meta-approved template.
  # Template parameter order must match what was approved in Meta Business Manager.

  def self.order_confirmed(order)
    phone = extract_phone(order)
    return unless phone

    send_template(
      phone_number: phone,
      template_name: 'order_confirmed',
      components: [body_params(
        order.order_number,
        order.total.to_f.round(2).to_s
      )]
    )
  end

  def self.order_shipped(order)
    phone = extract_phone(order)
    return unless phone

    awb   = order.shipment&.awb_code.presence || 'N/A'
    courier = order.shipment&.courier_name.presence || 'our courier partner'

    send_template(
      phone_number: phone,
      template_name: 'order_shipped',
      components: [body_params(order.order_number, courier, awb)]
    )
  end

  def self.order_delivered(order)
    phone = extract_phone(order)
    return unless phone

    send_template(
      phone_number: phone,
      template_name: 'order_delivered',
      components: [body_params(order.order_number)]
    )
  end

  def self.order_cancelled(order)
    phone = extract_phone(order)
    return unless phone

    send_template(
      phone_number: phone,
      template_name: 'order_cancelled',
      components: [body_params(order.order_number)]
    )
  end

  private

  def self.extract_phone(order)
    phone = order.shipping_address&.dig('phone').presence ||
            order.user&.phone.presence
    unless phone
      Rails.logger.warn("WhatsappService: no phone for order #{order.id}")
      return nil
    end
    # Normalise to Indian E.164 without '+'
    phone = phone.to_s.gsub(/\D/, '')
    phone = "91#{phone}" if phone.length == 10
    phone
  end

  def self.body_params(*values)
    {
      type: 'body',
      parameters: values.map { |v| { type: 'text', text: v.to_s } }
    }
  end
end
