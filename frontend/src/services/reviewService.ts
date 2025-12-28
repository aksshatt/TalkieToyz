import axios from '../config/axios';
import type {
  ReviewsResponse,
  ReviewFormData,
  ReviewFilters,
  ApiResponse,
} from '../types/review';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (
    productSlug: string,
    filters: ReviewFilters = {}
  ): Promise<ReviewsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(
      `/products/${productSlug}/reviews?${params.toString()}`
    );
    return response.data;
  },

  // Create review
  createReview: async (
    productSlug: string,
    reviewData: ReviewFormData
  ): Promise<ApiResponse> => {
    const formData = new FormData();

    formData.append('review[rating]', String(reviewData.rating));
    formData.append('review[title]', reviewData.title);
    formData.append('review[comment]', reviewData.comment);

    if (reviewData.photos && reviewData.photos.length > 0) {
      reviewData.photos.forEach((photo) => {
        formData.append('photos[]', photo);
      });
    }

    const response = await axios.post(
      `/products/${productSlug}/reviews`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // Update review
  updateReview: async (
    reviewId: number,
    reviewData: Partial<ReviewFormData>
  ): Promise<ApiResponse> => {
    const formData = new FormData();

    if (reviewData.title) formData.append('title', reviewData.title);
    if (reviewData.comment) formData.append('comment', reviewData.comment);

    if (reviewData.photos && reviewData.photos.length > 0) {
      reviewData.photos.forEach((photo) => {
        formData.append('photos[]', photo);
      });
    }

    const response = await axios.patch(`/reviews/${reviewId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId: number): Promise<ApiResponse> => {
    const response = await axios.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (reviewId: number): Promise<ApiResponse> => {
    const response = await axios.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Unmark review as helpful
  unmarkHelpful: async (reviewId: number): Promise<ApiResponse> => {
    const response = await axios.delete(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Admin endpoints
  admin: {
    getReviews: async (filters: any = {}): Promise<ReviewsResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await axios.get(`/admin/reviews?${params.toString()}`);
      return response.data;
    },

    getReview: async (reviewId: number): Promise<ApiResponse> => {
      const response = await axios.get(`/admin/reviews/${reviewId}`);
      return response.data;
    },

    approveReview: async (reviewId: number): Promise<ApiResponse> => {
      const response = await axios.post(`/admin/reviews/${reviewId}/approve`);
      return response.data;
    },

    rejectReview: async (reviewId: number): Promise<ApiResponse> => {
      const response = await axios.post(`/admin/reviews/${reviewId}/reject`);
      return response.data;
    },

    addResponse: async (
      reviewId: number,
      responseText: string
    ): Promise<ApiResponse> => {
      const response = await axios.post(
        `/admin/reviews/${reviewId}/add_response`,
        { response: responseText }
      );
      return response.data;
    },

    deleteReview: async (reviewId: number): Promise<ApiResponse> => {
      const response = await axios.delete(`/admin/reviews/${reviewId}`);
      return response.data;
    },

    getStatistics: async (): Promise<ApiResponse> => {
      const response = await axios.get('/admin/reviews/statistics');
      return response.data;
    },
  },
};
