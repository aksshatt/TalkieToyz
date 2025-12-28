import { useState } from 'react';
import type { CommentFormData } from '../../types/blog';

interface BlogCommentFormProps {
  onSubmit: (comment: CommentFormData) => Promise<void>;
}

const BlogCommentForm = ({ onSubmit }: BlogCommentFormProps) => {
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    comment_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ author_name: '', author_email: '', comment_text: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-talkie p-6">
      <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-4">
        Leave a Comment
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-warmgray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-warmgray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.author_email}
              onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
              className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">
            Comment *
          </label>
          <textarea
            required
            rows={4}
            value={formData.comment_text}
            onChange={(e) => setFormData({ ...formData, comment_text: e.target.value })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="Share your thoughts..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary-talkie"
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </button>

        <p className="text-xs text-warmgray-500">
          Your comment will be reviewed before being published.
        </p>
      </div>
    </form>
  );
};

export default BlogCommentForm;
