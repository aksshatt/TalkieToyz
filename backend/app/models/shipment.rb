class Shipment < ApplicationRecord
  belongs_to :order

  # Validations
  validates :order_id, presence: true, uniqueness: true
  validates :shiprocket_order_id, presence: true
  validates :shiprocket_shipment_id, presence: true

  # Scopes
  scope :pending, -> { where(status: ['Pending', 'New']) }
  scope :shipped, -> { where(status: ['Shipped', 'In Transit']) }
  scope :delivered, -> { where(status: 'Delivered') }
  scope :recent, -> { order(created_at: :desc) }

  # Status mapping from Shiprocket to Order status
  SHIPROCKET_STATUS_MAPPING = {
    'Pickup Scheduled' => 'processing',
    'Shipped' => 'shipped',
    'In Transit' => 'shipped',
    'Out For Delivery' => 'shipped',
    'Delivered' => 'delivered',
    'RTO Initiated' => 'cancelled',
    'RTO Delivered' => 'cancelled',
    'Canceled' => 'cancelled'
  }.freeze

  # Update order status based on shipment status
  def sync_order_status
    mapped_status = SHIPROCKET_STATUS_MAPPING[status]
    if mapped_status && order.status != mapped_status
      order.update(status: mapped_status)

      # Update tracking number if changed
      order.update(tracking_number: awb_code) if awb_code.present? && order.tracking_number != awb_code

      # Mark as shipped if status is shipped
      order.mark_as_shipped(awb_code) if mapped_status == 'shipped' && !order.shipped_at

      # Mark as delivered if status is delivered
      order.mark_as_delivered if mapped_status == 'delivered' && !order.delivered_at
    end
  end

  # Refresh tracking information from Shiprocket
  def refresh_tracking
    return unless awb_code.present?

    tracking_data = ShiprocketService.track_shipment(awb_code)

    if tracking_data
      update(
        status: tracking_data.dig('tracking_data', 'shipment_status'),
        shipment_details: tracking_data
      )
      sync_order_status
    end
  end

  # Generate shipping label
  def generate_label
    return label_url if label_url.present?

    if shiprocket_shipment_id.present?
      new_label_url = ShiprocketService.generate_label([shiprocket_shipment_id])
      update(label_url: new_label_url) if new_label_url
      new_label_url
    end
  end

  # Cancel shipment
  def cancel
    return false unless awb_code.present?

    result = ShiprocketService.cancel_shipment([awb_code])

    if result
      update(status: 'Canceled')
      order.update(status: 'cancelled')
    end

    result
  end

  # Check if shipment is in transit
  def in_transit?
    ['Shipped', 'In Transit', 'Out For Delivery'].include?(status)
  end

  # Check if delivered
  def delivered?
    status == 'Delivered'
  end

  # Check if cancelled/RTO
  def cancelled?
    status&.include?('Cancel') || status&.include?('RTO')
  end
end
