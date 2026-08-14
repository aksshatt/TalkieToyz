class SendWhatsappNotificationJob < ApplicationJob
  queue_as :mailers

  retry_on StandardError, wait: 30.seconds, attempts: 3

  def perform(order_id, event)
    order = Order.includes(:shipment, :user).find(order_id)

    case event.to_sym
    when :confirmed  then WhatsappService.order_confirmed(order)
    when :shipped    then WhatsappService.order_shipped(order)
    when :delivered  then WhatsappService.order_delivered(order)
    when :cancelled  then WhatsappService.order_cancelled(order)
    else
      Rails.logger.warn("SendWhatsappNotificationJob: unknown event '#{event}' for order #{order_id}")
    end
  rescue ActiveRecord::RecordNotFound
    # Order deleted — nothing to do
  end
end
