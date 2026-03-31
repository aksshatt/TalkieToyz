import { useState, useEffect, useRef } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Tag, MessageCircle, Share2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BlogPostContent from '../components/blog/BlogPostContent';
import BlogCommentList from '../components/blog/BlogCommentList';
import BlogCommentForm from '../components/blog/BlogCommentForm';
import SocialShareButtons from '../components/blog/SocialShareButtons';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types/blog';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogPost(slug!);
      setPost(response.data);
    } catch (err) {
      console.error('Failed to load post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (comment: any) => {
    try {
      await blogService.addComment(slug!, comment);
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent mx-auto mb-4" />
            <p className="text-warmgray-500 font-medium">Loading article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-warmgray-700 mb-4">Post not found</p>
            <Link to="/blog" className="text-teal hover:underline font-semibold">Back to Blog</Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Author initials for avatar
  const initials = post.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const authorColors = ['from-teal to-sky', 'from-coral to-sunshine', 'from-purple-400 to-pink-400', 'from-sky to-teal'];
  const authorColor = authorColors[post.author.name.charCodeAt(0) % authorColors.length];

  return (
    <Layout>
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        {post.featured_image_url ? (
          /* Image hero */
          <div className="relative h-[420px] md:h-[520px]">
            <motion.img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ y: heroY }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/90 via-warmgray-900/40 to-transparent" />

            {/* Back button */}
            <div className="absolute top-6 left-4 md:left-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Link to="/blog"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition-all text-sm border border-white/30">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </motion.div>
            </div>

            {/* Title overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 md:p-10"
              style={{ opacity: heroOpacity }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="max-w-4xl mx-auto">
                {post.category && (
                  <span className="inline-block bg-teal text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                    {post.category.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-family-fun)] font-bold text-white leading-tight mb-4 drop-shadow-lg">
                  {post.title}
                </h1>
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                  </div>
                  <span className="text-white/40">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span className="text-white/40">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* No-image hero: gradient banner */
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-16 px-4">
            <motion.div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ x: [0, 25, 0], y: [0, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-15%', left: '-5%' }} />
            <motion.div className="absolute w-56 h-56 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
              animate={{ x: [0, -15, 0], y: [0, 22, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{ bottom: '-15%', right: '8%' }} />

            {/* Back button */}
            <div className="relative z-10 max-w-4xl mx-auto mb-6">
              <Link to="/blog"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition-all text-sm border border-white/30">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-white">
              {post.category && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                  {post.category.name}
                </motion.span>
              )}
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-[var(--font-family-fun)] font-bold leading-tight mb-5">
                {post.title}
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1.5"><User className="h-4 w-4" /><span>{post.author.name}</span></div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /><span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /><span>{post.reading_time_minutes} min read</span></div>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0 36C240 12 480 0 720 0C960 0 1200 12 1440 36H0Z" fill="#fdf8f0" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-cream-light min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Article Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-3xl shadow-soft-xl overflow-hidden mb-8"
          >
            {/* Author + Share bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-b border-warmgray-100 bg-warmgray-50/50">
              {/* Author pill */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${authorColor} flex items-center justify-center text-white font-bold text-sm shadow-soft flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-warmgray-800 text-sm">{post.author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-warmgray-500">
                    <span>{new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4 text-warmgray-400 mr-1" />
                <SocialShareButtons url={window.location.href} title={post.title} />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 md:px-10 py-8">
              <BlogPostContent content={post.content_html} />
            </div>

            {/* Tags footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="px-8 py-5 border-t border-warmgray-100 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-warmgray-400" />
                {post.tags.map((tag: string, i: number) => (
                  <motion.span key={i} whileHover={{ scale: 1.05 }}
                    className="bg-teal-light/30 text-teal-dark text-xs font-semibold px-3 py-1 rounded-full border border-teal/20">
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          {post.allow_comments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Comment count header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-gradient rounded-xl shadow-soft">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">
                  Discussion
                </h2>
                {post.approved_comments.length > 0 && (
                  <span className="bg-teal-light/40 text-teal-dark text-sm font-bold px-3 py-1 rounded-full">
                    {post.approved_comments.length}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <BlogCommentList comments={post.approved_comments} />
              </div>
              <BlogCommentForm onSubmit={handleCommentSubmit} />
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
