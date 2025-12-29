export interface Address {
  id: number;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  country: string;
  post_office_name: string;
  region: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
