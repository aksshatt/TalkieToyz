import api from '../config/axios';
import type {
  SiteContent,
  SiteContentKeys,
  SiteContentsResponse,
  SiteContentKeysResponse,
  SiteContentResponse,
  SiteContentCreateData,
  SiteContentUpdateData,
  SiteContentPagesResponse,
  PageType
} from '../types/siteContent';

export const siteContentService = {
  // ==================== Public API ====================

  /**
   * Get all active content for a page
   * @param page - Page name (home, about, contact, etc.)
   * @returns Array of site contents
   */
  getPageContent: async (page: PageType): Promise<SiteContent[]> => {
    const response = await api.get<SiteContentsResponse>(`/site_contents/${page}`);
    return response.data.data;
  },

  /**
   * Get content as key-value pairs for easy consumption
   * @param page - Page name (home, about, contact, etc.)
   * @returns Object with content keys and values
   */
  getPageContentKeys: async (page: PageType): Promise<SiteContentKeys> => {
    const response = await api.get<SiteContentKeysResponse>(`/site_contents/${page}/keys`);
    return response.data.data;
  },

  // ==================== Admin API ====================

  /**
   * Get all site contents with optional filtering
   * @param params - Query parameters (page, query, per_page)
   * @returns Paginated site contents
   */
  getAllContent: async (params?: {
    page?: string;
    query?: string;
    per_page?: number;
  }) => {
    const response = await api.get('/admin/site_contents', { params });
    return response.data;
  },

  /**
   * Get a single site content by ID
   * @param id - Content ID
   * @returns Site content
   */
  getContent: async (id: number): Promise<SiteContent> => {
    const response = await api.get<SiteContentResponse>(`/admin/site_contents/${id}`);
    return response.data.data;
  },

  /**
   * Create new site content
   * @param data - Content data
   * @returns Created site content
   */
  createContent: async (data: SiteContentCreateData): Promise<SiteContent> => {
    const response = await api.post<SiteContentResponse>('/admin/site_contents', {
      site_content: data
    });
    return response.data.data;
  },

  /**
   * Update site content
   * @param id - Content ID
   * @param data - Update data
   * @returns Updated site content
   */
  updateContent: async (id: number, data: SiteContentUpdateData): Promise<SiteContent> => {
    const response = await api.patch<SiteContentResponse>(`/admin/site_contents/${id}`, {
      site_content: data
    });
    return response.data.data;
  },

  /**
   * Delete site content
   * @param id - Content ID
   * @returns Success response
   */
  deleteContent: async (id: number) => {
    const response = await api.delete(`/admin/site_contents/${id}`);
    return response.data;
  },

  /**
   * Get list of pages with content counts
   * @returns Array of pages with counts
   */
  getPages: async () => {
    const response = await api.get<SiteContentPagesResponse>('/admin/site_contents/pages');
    return response.data.data;
  }
};
