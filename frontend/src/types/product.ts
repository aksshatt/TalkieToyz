export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface SpeechGoal {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock_quantity: number;
  specifications: Record<string, any>;
  active: boolean;
  in_stock: boolean;
}

export interface ImageUrl {
  url: string;
  thumbnail_url?: string;
  filename: string;
  content_type: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: string;
  compare_at_price?: string;
  stock_quantity: number;
  sku: string;
  min_age: number;
  max_age: number;
  specifications: Record<string, any>;
  image_urls: ImageUrl[];
  featured: boolean;
  view_count: number;
  in_stock: boolean;
  on_sale: boolean;
  discount_percentage: number;
  average_rating: number;
  review_count: number;
  category: Category;
  speech_goals: SpeechGoal[];
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price?: string;
  stock_quantity: number;
  min_age: number;
  max_age: number;
  image_urls: ImageUrl[];
  featured: boolean;
  in_stock: boolean;
  on_sale: boolean;
  discount_percentage: number;
  average_rating: number;
  review_count: number;
  category: Category;
  speech_goals: SpeechGoal[];
}

export interface ProductFilters {
  category_id?: number;
  age?: number;
  min_price?: number;
  max_price?: number;
  speech_goal_ids?: string;
  featured?: boolean;
  in_stock?: boolean;
  q?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'name';
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface ProductsResponse {
  success: boolean;
  data: ProductSummary[];
  message: string;
  meta: PaginationMeta;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
  message: string;
}
