import { MessageCircle, User } from 'lucide-react';
import type { BlogComment } from '../../types/blog';

interface BlogCommentListProps {
  comments: BlogComment[];
}

const BlogCommentList = ({ comments }: BlogCommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="card-talkie p-8 text-center">
        <MessageCircle className="h-12 w-12 text-warmgray-300 mx-auto mb-3" />
        <p className="text-warmgray-600">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900 mb-4">
        Comments ({comments.length})
      </h3>

      {comments.map((comment) => (
        <div key={comment.id} className="card-talkie p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-gradient rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-warmgray-900">{comment.author_name}</span>
                <span className="text-xs text-warmgray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-warmgray-700">{comment.comment_text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogCommentList;
