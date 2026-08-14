class SendWhatsappNotificationJob < ApplicationJob
  queue_as :mailers

  retry_on StandardError, wait: 30.seconds, attempts: 3

  def perform(order_id, event)
    order = Order.includes(:shipment, :user).find(order_id)
    prefs = order.user.notification_preferences

    case event.to_sym
    when :confirmed
      WhatsappService.order_confirmed(order) if prefs['whatsapp']
      SmsService.order_confirmed(order) if prefs['sms']
    when :shipped
      WhatsappService.order_shipped(order) if prefs['whatsapp']
      SmsService.order_shipped(order) if prefs['sms']
    when :delivered
      WhatsappService.order_delivered(order) if prefs['whatsapp']
      SmsService.order_delivered(order) if prefs['sms']
    when :cancelled
      WhatsappService.order_cancelled(order) if prefs['whatsapp']
    else
      Rails.logger.warn("SendWhatsappNotificationJob: unknown event '#{event}' for order #{order_id}")
    end
  rescue ActiveRecord::RecordNotFound
    # Order deleted — nothing to do
  end
end
