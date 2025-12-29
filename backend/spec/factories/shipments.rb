FactoryBot.define do
  factory :shipment do
    order { nil }
    shiprocket_order_id { "MyString" }
    shiprocket_shipment_id { "MyString" }
    awb_code { "MyString" }
    courier_name { "MyString" }
    courier_id { 1 }
    status { "MyString" }
    pickup_scheduled_date { "2025-12-29 13:42:42" }
    delivered_date { "2025-12-29 13:42:42" }
    tracking_url { "MyString" }
    label_url { "MyString" }
    manifest_url { "MyString" }
    shipment_details { "" }
  end
end
