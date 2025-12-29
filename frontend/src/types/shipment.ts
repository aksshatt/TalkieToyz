export interface Shipment {
  id: number;
  order_id: number;
  shiprocket_order_id: string;
  shiprocket_shipment_id: string;
  awb_code: string;
  courier_name: string;
  courier_id: number;
  status: string;
  pickup_scheduled_date?: string;
  delivered_date?: string;
  tracking_url?: string;
  label_url?: string;
  manifest_url?: string;
  estimated_delivery?: string;
  in_transit: boolean;
  delivered: boolean;
  cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingRate {
  courier_id: number;
  courier_name: string;
  rate: number;
  estimated_delivery_days: string;
  cod_available: boolean;
  mode: string;
  description: string;
  rating?: number;
  is_surface: boolean;
  is_air: boolean;
}

export interface ShippingRateRequest {
  postal_code: string;
  weight_kg?: number;
  dimensions?: {
    length?: number;
    breadth?: number;
    height?: number;
  };
  payment_method?: string;
}

export interface ShippingRateResponse {
  rates: ShippingRate[];
  destination: {
    postal_code: string;
    weight_kg: number;
  };
}
