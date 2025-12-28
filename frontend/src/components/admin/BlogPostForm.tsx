import { useState } from 'react';
import type { BlogPostFormData, BlogPostCategory, BlogPostStatus } from '../../types/blog';
import TiptapEditor from './TiptapEditor';

interface BlogPostFormProps {
  initialData?: Partial<BlogPostFormData>;
  onSubmit: (data: BlogPostFormData) => void;
  onCancel?: () => void;
}

const BlogPostForm = ({ initialData, onSubmit, onCancel }: BlogPostFormProps) => {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || 'therapy_tips',
    status: initialData?.status || 'draft',
    featured_image_url: initialData?.featured_image_url || '',
    tags: initialData?.tags || [],
    allow_comments: initialData?.allow_comments ?? true,
    featured: initialData?.featured ?? false,
  });

  const [newTag, setNewTag] = useState('');

  const categories: { value: BlogPostCategory; label: string }[] = [
    { value: 'therapy_tips', label: 'Therapy Tips' },
    { value: 'product_guides', label: 'Product Guides' },
    { value: 'milestones', label: 'Milestones' },
    { value: 'parent_resources', label: 'Parent Resources' },
    { value: 'expert_insights', label: 'Expert Insights' },
    { value: 'success_stories', label: 'Success Stories' },
  ];

  const statuses: { value: BlogPostStatus; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogPostCategory })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">Status *</label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPostStatus })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Excerpt</label>
        <textarea
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Content *</label>
        <TiptapEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Featured Image URL</label>
        <input
          type="url"
          value={formData.featured_image_url}
          onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="Add a tag..."
          />
          <button type="button" onClick={addTag} className="btn-secondary-talkie">
            Add
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="bg-teal-light px-3 py-1 rounded-pill text-sm flex items-center gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) })}
                  className="text-coral"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-teal"
          />
          <span className="text-sm font-semibold text-warmgray-700">Featured Post</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allow_comments}
            onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
            className="w-4 h-4 text-teal"
          />
          <span className="text-sm font-semibold text-warmgray-700">Allow Comments</span>
        </label>
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary-talkie flex-1">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary-talkie flex-1">
          Save Blog Post
        </button>
      </div>
    </form>
  );
};

export default BlogPostForm;
