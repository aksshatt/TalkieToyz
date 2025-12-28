export interface ReviewUser {
  id: number;
  name: string;
  email: string;
}

export interface ReviewPhoto {
  url: string;
  thumbnail_url: string;
  filename: string;
}

export interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  has_photos: boolean;
  photo_urls: ReviewPhoto[];
  admin_response?: string;
  admin_responded_at?: string;
  user: ReviewUser;
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  message: string;
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
    average_rating: number;
    total_reviews: number;
    rating_breakdown: Array<{
      rating: number;
      count: number;
    }>;
  };
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  photos?: File[];
}

export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  with_photos?: boolean;
  sort?: 'most_helpful' | 'highest_rated' | 'lowest_rated' | 'recent';
  page?: number;
  per_page?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}
