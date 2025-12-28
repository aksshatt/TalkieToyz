import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageCircle, User } from 'lucide-react';
import type { BlogPostSummary } from '../../types/blog';

interface BlogPostCardProps {
  post: BlogPostSummary;
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`}>
      <div className="card-talkie-hover overflow-hidden animate-slide-in h-full flex flex-col">
        {post.featured_image_url && (
          <div className="relative overflow-hidden h-48 bg-warmgray-100">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.featured && (
              <span className="absolute top-3 left-3 bg-sunshine-gradient text-warmgray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-soft">
                ⭐ Featured
              </span>
            )}
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-teal-gradient text-white text-xs font-bold px-3 py-1 rounded-pill shadow-soft">
              {post.category_display_name}
            </span>
            {post.tags && post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-warmgray-100 text-warmgray-700 text-xs font-semibold px-2 py-1 rounded-pill">
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-2 line-clamp-2 hover:text-teal transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-warmgray-600 mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-warmgray-500 pt-4 border-t border-warmgray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time_minutes} min
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {post.comment_count}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
