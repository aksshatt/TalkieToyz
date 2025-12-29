import axios from '../config/axios';
import { Address, AddressFormData, PincodeData, ApiResponse } from '../types/address';

export const addressService = {
  // Get all addresses for current user
  async getAddresses(): Promise<Address[]> {
    const response = await axios.get<ApiResponse<Address[]>>('/addresses');
    return response.data.data;
  },

  // Get single address by ID
  async getAddress(id: number): Promise<Address> {
    const response = await axios.get<ApiResponse<Address>>(`/addresses/${id}`);
    return response.data.data;
  },

  // Create new address
  async createAddress(addressData: AddressFormData): Promise<Address> {
    const response = await axios.post<ApiResponse<Address>>('/addresses', {
      address: addressData
    });
    return response.data.data;
  },

  // Update existing address
  async updateAddress(id: number, addressData: AddressFormData): Promise<Address> {
    const response = await axios.patch<ApiResponse<Address>>(`/addresses/${id}`, {
      address: addressData
    });
    return response.data.data;
  },

  // Delete address
  async deleteAddress(id: number): Promise<void> {
    await axios.delete(`/addresses/${id}`);
  },

  // Set address as default
  async setDefault(id: number): Promise<Address> {
    const response = await axios.post<ApiResponse<Address>>(`/addresses/${id}/set_default`);
    return response.data.data;
  },

  // Lookup PIN code details
  async lookupPincode(pincode: string): Promise<PincodeData> {
    const response = await axios.get<ApiResponse<PincodeData>>(`/addresses/pincode/${pincode}`);
    return response.data.data;
  }
};
