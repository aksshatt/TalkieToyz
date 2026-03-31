import { useState } from 'react';
import { Send, User, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ author_name: '', author_email: '', comment_text: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-soft border border-warmgray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-light/30 to-sky-light/20 px-6 py-4 border-b border-warmgray-100">
        <h3 className="font-[var(--font-family-fun)] font-bold text-lg text-warmgray-900 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-teal" />
          Leave a Comment
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 bg-teal-light/30 border-l-4 border-teal p-4 rounded-xl"
          >
            <p className="font-semibold text-teal-dark text-sm">Comment submitted!</p>
            <p className="text-warmgray-600 text-xs mt-0.5">It will appear after review.</p>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Name *
              </label>
              <input
                type="text" required value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 bg-warmgray-50 focus:bg-white transition-all text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email *
              </label>
              <input
                type="email" required value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 bg-warmgray-50 focus:bg-white transition-all text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-warmgray-700 mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" /> Comment *
            </label>
            <textarea
              required rows={4} value={formData.comment_text}
              onChange={(e) => setFormData({ ...formData, comment_text: e.target.value })}
              className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 bg-warmgray-50 focus:bg-white transition-all resize-none text-sm"
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-warmgray-400">Your comment will be reviewed before being published.</p>
            <motion.button
              type="submit" disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.03, y: isSubmitting ? 0 : -1 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.96 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-6 py-3 rounded-xl shadow-soft hover:shadow-soft-md transition-shadow disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Post Comment
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default BlogCommentForm;
