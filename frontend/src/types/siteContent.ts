// Site Content (CMS) Types

export interface SiteContent {
  id: number;
  key: string;
  page: string;
  content_type: 'text' | 'textarea' | 'html' | 'image' | 'url' | 'json';
  value: string;
  label: string;
  description: string;
  active: boolean;
  display_order: number;
  metadata: Record<string, any>;
  parsed_value?: any;
  created_at: string;
  updated_at: string;
}

export interface SiteContentKeys {
  [key: string]: string;
}

export interface SiteContentsResponse {
  success: boolean;
  message: string;
  data: SiteContent[];
}

export interface SiteContentKeysResponse {
  success: boolean;
  message: string;
  data: SiteContentKeys;
}

export interface SiteContentResponse {
  success: boolean;
  message: string;
  data: SiteContent;
}

export interface SiteContentCreateData {
  key: string;
  page: string;
  content_type: string;
  value: string;
  label?: string;
  description?: string;
  active?: boolean;
  display_order?: number;
  metadata?: Record<string, any>;
}

export interface SiteContentUpdateData {
  value?: string;
  label?: string;
  description?: string;
  active?: boolean;
  display_order?: number;
  content_type?: string;
  metadata?: Record<string, any>;
}

export interface SiteContentPagesResponse {
  success: boolean;
  message: string;
  data: Array<{
    page: string;
    count: number;
    active_count: number;
  }>;
}

export type PageType = 'home' | 'about' | 'contact' | 'faq' | 'header' | 'footer';

export type ContentType = 'text' | 'textarea' | 'html' | 'image' | 'url' | 'json';
