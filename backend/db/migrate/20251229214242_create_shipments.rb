class CreateShipments < ActiveRecord::Migration[7.1]
  def change
    create_table :shipments do |t|
      t.references :order, null: false, foreign_key: true, index: { unique: true }
      t.string :shiprocket_order_id, index: true
      t.string :shiprocket_shipment_id, index: true
      t.string :awb_code
      t.string :courier_name
      t.integer :courier_id
      t.string :status, index: true
      t.datetime :pickup_scheduled_date
      t.datetime :delivered_date
      t.string :tracking_url
      t.string :label_url
      t.string :manifest_url
      t.jsonb :shipment_details, default: {}

      t.timestamps
    end

    add_index :shipments, :awb_code, unique: true, where: "awb_code IS NOT NULL"
  end
end
