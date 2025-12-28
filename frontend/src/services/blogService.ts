import axios from '../config/axios';
import type {
  BlogPostsResponse,
  BlogPostResponse,
  BlogPostFilters,
  BlogPostFormData,
  CommentFormData,
  ResourcesResponse,
  ResourceResponse,
  ResourceFilters,
  ResourceFormData,
  ResourceCategoriesResponse,
  NewsletterSubscription,
  ApiResponse,
} from '../types/blog';

export const blogService = {
  // Blog Posts
  getBlogPosts: async (filters: BlogPostFilters = {}): Promise<BlogPostsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/blog_posts?${params.toString()}`);
    return response.data;
  },

  getBlogPost: async (slug: string): Promise<BlogPostResponse> => {
    const response = await axios.get(`/blog_posts/${slug}`);
    return response.data;
  },

  addComment: async (slug: string, comment: CommentFormData): Promise<ApiResponse> => {
    const response = await axios.post(`/blog_posts/${slug}/add_comment`, comment);
    return response.data;
  },

  // Resources
  getResources: async (filters: ResourceFilters = {}): Promise<ResourcesResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await axios.get(`/resources?${params.toString()}`);
    return response.data;
  },

  getResource: async (slug: string): Promise<ResourceResponse> => {
    const response = await axios.get(`/resources/${slug}`);
    return response.data;
  },

  downloadResource: async (slug: string): Promise<void> => {
    // This will trigger a redirect to the file download
    window.location.href = `${axios.defaults.baseURL}/resources/${slug}/download`;
  },

  getResourceCategories: async (): Promise<ResourceCategoriesResponse> => {
    const response = await axios.get('/resource_categories');
    return response.data;
  },

  // Newsletter
  subscribeNewsletter: async (subscription: NewsletterSubscription): Promise<ApiResponse> => {
    const response = await axios.post('/newsletter_subscriptions', subscription);
    return response.data;
  },

  confirmNewsletter: async (token: string): Promise<ApiResponse> => {
    const response = await axios.get(`/newsletter_subscriptions/confirm/${token}`);
    return response.data;
  },

  unsubscribeNewsletter: async (token: string): Promise<ApiResponse> => {
    const response = await axios.delete(`/newsletter_subscriptions/unsubscribe/${token}`);
    return response.data;
  },

  // Admin Blog Posts
  admin: {
    getBlogPosts: async (filters: BlogPostFilters = {}): Promise<BlogPostsResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await axios.get(`/admin/blog_posts?${params.toString()}`);
      return response.data;
    },

    getBlogPost: async (slug: string): Promise<BlogPostResponse> => {
      const response = await axios.get(`/admin/blog_posts/${slug}`);
      return response.data;
    },

    createBlogPost: async (data: BlogPostFormData): Promise<BlogPostResponse> => {
      const response = await axios.post('/admin/blog_posts', { blog_post: data });
      return response.data;
    },

    updateBlogPost: async (slug: string, data: BlogPostFormData): Promise<BlogPostResponse> => {
      const response = await axios.patch(`/admin/blog_posts/${slug}`, { blog_post: data });
      return response.data;
    },

    deleteBlogPost: async (slug: string): Promise<ApiResponse> => {
      const response = await axios.delete(`/admin/blog_posts/${slug}`);
      return response.data;
    },

    approveComment: async (slug: string, commentId: string): Promise<ApiResponse> => {
      const response = await axios.post(`/admin/blog_posts/${slug}/approve_comment`, {
        comment_id: commentId,
      });
      return response.data;
    },

    // Admin Resources
    getResources: async (filters: ResourceFilters = {}): Promise<ResourcesResponse> => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await axios.get(`/admin/resources?${params.toString()}`);
      return response.data;
    },

    getResource: async (slug: string): Promise<ResourceResponse> => {
      const response = await axios.get(`/admin/resources/${slug}`);
      return response.data;
    },

    createResource: async (data: ResourceFormData): Promise<ResourceResponse> => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'tags' || key === 'metadata') {
            formData.append(`resource[${key}]`, JSON.stringify(value));
          } else if (key === 'file' && value instanceof File) {
            formData.append('file', value);
          } else {
            formData.append(`resource[${key}]`, String(value));
          }
        }
      });

      const response = await axios.post('/admin/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    updateResource: async (slug: string, data: ResourceFormData): Promise<ResourceResponse> => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'file') {
          if (key === 'tags' || key === 'metadata') {
            formData.append(`resource[${key}]`, JSON.stringify(value));
          } else {
            formData.append(`resource[${key}]`, String(value));
          }
        }
      });

      if (data.file instanceof File) {
        formData.append('file', data.file);
      }

      const response = await axios.patch(`/admin/resources/${slug}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },

    deleteResource: async (slug: string): Promise<ApiResponse> => {
      const response = await axios.delete(`/admin/resources/${slug}`);
      return response.data;
    },
  },
};
