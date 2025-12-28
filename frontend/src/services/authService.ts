import axiosInstance from '../config/axios';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'customer' | 'therapist';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'therapist' | 'admin';
  phone?: string;
  bio?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const authService = {
  /**
   * Register a new user
   */
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await axiosInstance.delete('/auth/logout');
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<{ success: boolean; data: User }> => {
    const response = await axiosInstance.patch('/auth/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.patch('/auth/password', data);
    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/password/reset', { email });
    return response.data;
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post('/auth/password/reset/confirm', {
      reset_token: token,
      password,
      password_confirmation: passwordConfirmation,
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

export default authService;
