class CreateShipmentJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: :polynomially_longer, attempts: 3

  def perform(order_id)
    order = Order.find(order_id)

    return if order.shipment.present?
    return unless order.can_create_shipment?

    prior_status = order.status
    result = order.create_shiprocket_shipment

    if result[:success]
      Rails.logger.info("CreateShipmentJob: shipment created for order #{order.order_number}")
    else
      Rails.logger.error("CreateShipmentJob: failed for order #{order.order_number}: #{result[:error]}")
      # Revert to prior status so order isn't stuck in processing without shipment
      order.update_columns(status: Order.statuses[prior_status]) if prior_status.present?
    end
  rescue ActiveRecord::RecordNotFound
    # Order deleted — nothing to do
  end
end
