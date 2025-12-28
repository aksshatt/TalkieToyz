export type BlogPostStatus = 'draft' | 'published' | 'archived';

export type BlogPostCategory =
  | 'therapy_tips'
  | 'product_guides'
  | 'milestones'
  | 'parent_resources'
  | 'expert_insights'
  | 'success_stories';

export interface Author {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  author_name: string;
  author_email: string;
  comment_text: string;
  created_at: string;
  approved: boolean;
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  category: BlogPostCategory;
  category_display_name: string;
  tags: string[];
  status: BlogPostStatus;
  status_display_name: string;
  published_at: string;
  view_count: number;
  reading_time_minutes: number;
  featured: boolean;
  comment_count: number;
  author: Author;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  featured_image_url: string;
  category: BlogPostCategory;
  category_display_name: string;
  tags: string[];
  status: BlogPostStatus;
  status_display_name: string;
  published_at: string;
  view_count: number;
  reading_time_minutes: number;
  featured: boolean;
  allow_comments: boolean;
  approved_comments: BlogComment[];
  seo_metadata: Record<string, any>;
  author: Author;
  created_at: string;
  updated_at: string;
}

export interface BlogPostFormData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  category: BlogPostCategory;
  status: BlogPostStatus;
  published_at?: string;
  reading_time_minutes?: number;
  allow_comments?: boolean;
  featured?: boolean;
  tags?: string[];
  seo_metadata?: Record<string, any>;
}

export interface CommentFormData {
  author_name: string;
  author_email: string;
  comment_text: string;
}

export interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  active: boolean;
  resources_count: number;
  created_at: string;
  updated_at: string;
}

export type ResourceType =
  | 'pdf'
  | 'worksheet'
  | 'guide'
  | 'checklist'
  | 'template'
  | 'infographic'
  | 'video'
  | 'audio';

export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string;
  resource_type: ResourceType;
  resource_type_display_name: string;
  file_size_bytes: number;
  file_size_display: string;
  file_format: string;
  download_count: number;
  tags: string[];
  metadata: Record<string, any>;
  premium: boolean;
  active: boolean;
  file_url: string;
  resource_category: ResourceCategory;
  created_at: string;
  updated_at: string;
}

export interface ResourceFormData {
  title: string;
  slug?: string;
  description?: string;
  resource_type: ResourceType;
  resource_category_id: number;
  premium?: boolean;
  active?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
  file?: File;
}

export interface NewsletterSubscription {
  email: string;
  name?: string;
  preferences?: Record<string, any>;
}

export interface BlogPostFilters {
  category?: BlogPostCategory;
  author_id?: number;
  featured?: boolean;
  status?: BlogPostStatus;
  q?: string;
  sort?: 'popular' | 'oldest' | 'recent';
  page?: number;
  per_page?: number;
}

export interface ResourceFilters {
  category_id?: number;
  resource_type?: ResourceType;
  premium?: boolean;
  free?: boolean;
  q?: string;
  sort?: 'popular' | 'name' | 'recent';
  page?: number;
  per_page?: number;
}

export interface BlogPostsResponse {
  success: boolean;
  data: BlogPostSummary[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
  message: string;
}

export interface ResourcesResponse {
  success: boolean;
  data: Resource[];
  message: string;
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ResourceResponse {
  success: boolean;
  data: Resource;
  message: string;
}

export interface ResourceCategoriesResponse {
  success: boolean;
  data: ResourceCategory[];
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
