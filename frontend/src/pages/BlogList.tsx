import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Rss, Sparkles, TrendingUp, Clock, ArrowRight, Filter, X } from 'lucide-react';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import BlogPostCard from '../components/blog/BlogPostCard';
import { blogService } from '../services/blogService';
import type { BlogPostSummary } from '../types/blog';
import Layout from '../components/layout/Layout';

const CATEGORIES = [
  { key: 'all', label: 'All Posts', emoji: '📚' },
  { key: 'therapy_tips', label: 'Therapy Tips', emoji: '💬' },
  { key: 'product_guides', label: 'Product Guides', emoji: '🎯' },
  { key: 'milestones', label: 'Milestones', emoji: '🌟' },
  { key: 'parent_resources', label: 'For Parents', emoji: '👨‍👩‍👧' },
  { key: 'expert_insights', label: 'Expert Insights', emoji: '🔬' },
  { key: 'success_stories', label: 'Success Stories', emoji: '🏆' },
];

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogPosts();
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt?.toLowerCase().includes(q) ?? false);
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, search]);

  const featuredPost = filtered.find((p) => p.featured) || filtered[0];
  const restPosts = filtered.filter((p) => p.id !== featuredPost?.id);
  const recentPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 5),
    [posts]
  );

  return (
    <Layout>
      <SEO
        title="Learning Hub - Speech Therapy Tips & Resources"
        description="Expert articles on speech therapy, child development milestones, and how to support your child's communication journey through play."
        url="/blog"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', right: '-8%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-coral/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', left: '-5%' }}
        />
        {[BookOpen, Sparkles, TrendingUp].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none hidden md:block"
            style={{ top: `${18 + i * 20}%`, left: `${6 + i * 30}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-5 border border-white/25"
          >
            <Rss className="w-4 h-4 text-sunshine" /> Expert Insights & Tips
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
          >
            Learning <span className="text-sunshine">Hub</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            Tips, milestone guides, and inspiring stories to support every step of your child's speech journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-warmgray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles, topics, milestones..."
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white text-warmgray-800 placeholder-warmgray-400 shadow-soft-xl focus:outline-none focus:ring-4 focus:ring-white/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-700 p-1 rounded-full hover:bg-warmgray-100"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/80 text-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> {posts.length} articles
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Updated weekly
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Expert-reviewed
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      <div className="min-h-screen bg-cream-light">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3 text-warmgray-600 text-sm font-semibold">
              <Filter className="w-4 h-4" />
              <span>Browse by category</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(({ key, label, emoji }) => {
                const count = key === 'all' ? posts.length : posts.filter((p) => p.category === key).length;
                const active = activeCategory === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border-2 ${
                      active
                        ? 'bg-gradient-to-r from-teal to-teal-dark text-white border-teal shadow-soft-md'
                        : 'bg-white text-warmgray-700 border-warmgray-200 hover:border-teal/40 hover:text-teal'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{label}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full min-w-[22px] ${
                        active ? 'bg-white/25 text-white' : 'bg-warmgray-100 text-warmgray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="h-44 bg-warmgray-200 animate-shimmer" />
                  <div className="p-5 bg-white space-y-3">
                    <div className="h-4 bg-warmgray-200 rounded animate-shimmer w-3/4" />
                    <div className="h-3 bg-warmgray-200 rounded animate-shimmer" />
                    <div className="h-3 bg-warmgray-200 rounded animate-shimmer w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-soft border border-warmgray-100"
            >
              <BookOpen className="w-16 h-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-700 text-lg font-bold mb-1">No articles found</p>
              <p className="text-warmgray-500 text-sm mb-4">Try a different search or category.</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearch('');
                }}
                className="inline-flex items-center gap-1.5 text-teal font-semibold hover:underline"
              >
                Clear filters <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {featuredPost && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xs font-bold text-teal uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-teal inline-block" />
                      <Sparkles className="w-3.5 h-3.5" /> Top Story
                    </p>
                    <BlogPostCard post={featuredPost} featured />
                  </motion.div>
                )}

                {restPosts.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-warmgray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-warmgray-300 inline-block" /> More Articles
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <AnimatePresence mode="popLayout">
                        {restPosts.map((post, i) => (
                          <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                          >
                            <BlogPostCard post={post} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Recent posts */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
                >
                  <h3 className="font-extrabold text-warmgray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal" /> Recent Articles
                  </h3>
                  <div className="space-y-3">
                    {recentPosts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.slug}`}
                        className="flex gap-3 group rounded-xl p-2 -m-2 hover:bg-cream-light/60 transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-warmgray-100">
                          {p.featured_image_url ? (
                            <img
                              src={p.featured_image_url}
                              alt={p.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-teal-light/30 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-teal" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-warmgray-900 line-clamp-2 group-hover:text-teal transition-colors">
                            {p.title}
                          </p>
                          <p className="text-xs text-warmgray-500 mt-0.5">
                            {new Date(p.published_at).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Quick category nav */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
                >
                  <h3 className="font-extrabold text-warmgray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-teal" /> Browse by Topic
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter((c) => c.key !== 'all').map(({ key, label, emoji }) => {
                      const count = posts.filter((p) => p.category === key).length;
                      if (!count) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveCategory(key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                            activeCategory === key
                              ? 'bg-teal-light/40 text-teal'
                              : 'hover:bg-warmgray-50 text-warmgray-700'
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span>{emoji}</span> {label}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              activeCategory === key ? 'bg-teal text-white' : 'bg-warmgray-100 text-warmgray-500'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* CTA card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="relative bg-gradient-to-br from-teal to-teal-dark text-white rounded-2xl p-6 shadow-soft-md overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <Sparkles className="w-8 h-8 text-sunshine mb-3" />
                  <h3 className="font-extrabold text-lg mb-1">Need personal guidance?</h3>
                  <p className="text-sm text-white/85 mb-4">
                    Book a session with our certified experts for advice tailored to your child.
                  </p>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-1.5 bg-white text-teal font-extrabold px-4 py-2 rounded-full shadow-soft hover:shadow-soft-md transition-all"
                  >
                    Book a Session <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogList;
