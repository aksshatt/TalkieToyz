export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  category_display_name: string;
  display_order: number;
  active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface FaqCategory {
  value: string;
  label: string;
  count: number;
}

export interface FaqsResponse {
  success: boolean;
  message: string;
  data: Faq[];
  meta?: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
  };
}

export interface FaqResponse {
  success: boolean;
  message: string;
  data: Faq;
}

export interface FaqCategoriesResponse {
  success: boolean;
  message: string;
  data: FaqCategory[];
}
