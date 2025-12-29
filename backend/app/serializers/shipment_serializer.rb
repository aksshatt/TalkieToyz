class ShipmentSerializer < ActiveModel::Serializer
  attributes :id, :order_id, :shiprocket_order_id, :shiprocket_shipment_id,
             :awb_code, :courier_name, :courier_id, :status,
             :pickup_scheduled_date, :delivered_date,
             :tracking_url, :label_url, :manifest_url,
             :estimated_delivery, :in_transit, :delivered, :cancelled,
             :created_at, :updated_at

  # Computed attributes
  def estimated_delivery
    # Parse from shipment_details if available
    object.shipment_details&.dig('edd')
  end

  def in_transit
    object.in_transit?
  end

  def delivered
    object.delivered?
  end

  def cancelled
    object.cancelled?
  end
end
