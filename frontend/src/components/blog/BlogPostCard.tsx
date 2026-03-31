import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageCircle, User, ArrowRight } from 'lucide-react';
import type { BlogPostSummary } from '../../types/blog';
import { motion } from 'framer-motion';

interface BlogPostCardProps {
  post: BlogPostSummary;
  featured?: boolean;
}

const categoryGradients: Record<string, string> = {
  therapy_tips: 'from-teal to-teal-dark',
  product_guides: 'from-coral to-coral-dark',
  milestones: 'from-sunshine to-sunshine-dark',
  parent_resources: 'from-sky to-sky-dark',
  expert_insights: 'from-purple-400 to-purple-600',
  success_stories: 'from-green-400 to-green-600',
};

const BlogPostCard = ({ post, featured = false }: BlogPostCardProps) => {
  const gradient = categoryGradients[post.category] || 'from-teal to-teal-dark';

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`} className="block group">
        <motion.div
          className="relative rounded-3xl overflow-hidden bg-white shadow-soft-lg border border-warmgray-100"
          whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.13)' }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          {/* Image */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            {post.featured_image_url ? (
              <motion.img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-80`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/80 via-warmgray-900/20 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className={`bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-soft`}>
                {post.category_display_name}
              </span>
              {post.featured && (
                <span className="bg-sunshine text-warmgray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-soft">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900 mb-2 line-clamp-2 group-hover:text-teal transition-colors">
              {post.title}
            </h3>
            <p className="text-warmgray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-warmgray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author.name}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time_minutes} min read</span>
              </div>
              <motion.span
                className={`inline-flex items-center gap-1 text-sm font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                whileHover={{ x: 4 }}
              >
                Read more <ArrowRight className="w-4 h-4 text-teal" />
              </motion.span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="block group">
      <motion.div
        className="relative rounded-2xl overflow-hidden bg-white shadow-soft border border-warmgray-100 flex flex-col h-full"
        whileHover={{ y: -5, boxShadow: '0 16px 32px rgba(0,0,0,0.12)' }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          {post.featured_image_url ? (
            <motion.img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.45 }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className={`absolute top-3 left-3 bg-gradient-to-r ${gradient} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-soft`}>
            {post.category_display_name}
          </span>
          {/* Read time badge */}
          <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {post.reading_time_minutes} min
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-[var(--font-family-fun)] font-bold text-lg text-warmgray-900 mb-2 line-clamp-2 group-hover:text-teal transition-colors">
            {post.title}
          </h3>
          <p className="text-xs text-warmgray-500 mb-3 line-clamp-2 flex-1">{post.excerpt}</p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-warmgray-100 text-warmgray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-warmgray-400 pt-3 border-t border-warmgray-100">
            <div className="flex items-center gap-2">
              {/* Author avatar */}
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold`}>
                {post.author.name.charAt(0)}
              </div>
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post.comment_count}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogPostCard;
