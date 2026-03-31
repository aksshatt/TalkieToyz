class WhatsappService
  include HTTParty

  BASE_URL = 'https://graph.facebook.com/v19.0'.freeze

  def self.send_appointment_notification(appointment)
    new.send_appointment_notification(appointment)
  end

  def send_appointment_notification(appointment)
    phone_number_id = ENV['WHATSAPP_PHONE_NUMBER_ID']
    access_token    = ENV['WHATSAPP_ACCESS_TOKEN']
    to_number       = ENV['THERAPIST_WHATSAPP_NUMBER']

    return log_missing_config unless phone_number_id && access_token && to_number

    message = build_appointment_message(appointment)

    response = self.class.post(
      "#{BASE_URL}/#{phone_number_id}/messages",
      headers: {
        'Authorization' => "Bearer #{access_token}",
        'Content-Type'  => 'application/json'
      },
      body: {
        messaging_product: 'whatsapp',
        to: to_number,
        type: 'text',
        text: { body: message }
      }.to_json
    )

    if response.success?
      Rails.logger.info "[WhatsApp] Appointment notification sent to #{to_number}"
    else
      Rails.logger.error "[WhatsApp] Failed to send notification: #{response.code} – #{response.body}"
    end

    response
  rescue StandardError => e
    Rails.logger.error "[WhatsApp] Error sending notification: #{e.message}"
    nil
  end

  private

  def build_appointment_message(appointment)
    lang = appointment.preferred_language.present? ? appointment.preferred_language : 'Not specified'
    msg  = appointment.message.present? ? appointment.message : 'No message'

    <<~MSG.strip
      🗓️ *New Appointment Request – TalkieToyz*

      *Name:* #{appointment.name}
      *Phone:* #{appointment.phone}
      *Email:* #{appointment.email}
      *Language:* #{lang}
      *Message:* #{msg}

      *Time:* #{appointment.created_at.strftime('%d %b %Y, %I:%M %p')}

      Please follow up with the client at your earliest convenience.
    MSG
  end

  def log_missing_config
    Rails.logger.warn '[WhatsApp] Skipping notification – WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, or THERAPIST_WHATSAPP_NUMBER not set'
    nil
  end
end
