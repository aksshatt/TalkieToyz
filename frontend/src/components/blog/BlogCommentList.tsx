import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogComment } from '../../types/blog';

interface BlogCommentListProps {
  comments: BlogComment[];
}

const AVATAR_GRADIENTS = [
  'from-teal to-sky',
  'from-coral to-sunshine',
  'from-purple-400 to-pink-400',
  'from-sky to-teal',
  'from-sunshine to-coral',
];

const BlogCommentList = ({ comments }: BlogCommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-warmgray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-warmgray-100 rounded-full mb-4">
          <MessageCircle className="h-7 w-7 text-warmgray-300" />
        </div>
        <p className="text-warmgray-600 font-medium">No comments yet.</p>
        <p className="text-warmgray-400 text-sm mt-1">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, i) => {
        const initials = comment.author_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
        const gradient = AVATAR_GRADIENTS[comment.author_name.charCodeAt(0) % AVATAR_GRADIENTS.length];

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="bg-white rounded-2xl shadow-soft border border-warmgray-100 p-5"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-soft`}>
                {initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-warmgray-900 text-sm">{comment.author_name}</span>
                  <span className="text-xs text-warmgray-400 bg-warmgray-100 px-2 py-0.5 rounded-full">
                    {new Date(comment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-warmgray-700 text-sm leading-relaxed">{comment.comment_text}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BlogCommentList;
