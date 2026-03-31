import { useState, useEffect } from 'react';
import { BookOpen, Search, Rss } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogPostCard from '../components/blog/BlogPostCard';
import NewsletterSignup from '../components/blog/NewsletterSignup';
import { blogService } from '../services/blogService';
import type { BlogPostSummary } from '../types/blog';
import Layout from '../components/layout/Layout';

const CATEGORIES = [
  { key: 'all', label: 'All Posts' },
  { key: 'therapy_tips', label: 'Therapy Tips' },
  { key: 'product_guides', label: 'Product Guides' },
  { key: 'milestones', label: 'Milestones' },
  { key: 'parent_resources', label: 'For Parents' },
  { key: 'expert_insights', label: 'Expert Insights' },
  { key: 'success_stories', label: 'Success Stories' },
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

  const handleNewsletterSubmit = async (data: any) => {
    await blogService.subscribeNewsletter(data);
  };

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = filtered.find((p) => p.featured) || filtered[0];
  const restPosts = filtered.filter((p) => p.id !== featuredPost?.id);

  return (
    <Layout>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        {/* Animated blobs */}
        <motion.div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', right: '-5%' }}
        />
        <motion.div className="absolute w-64 h-64 rounded-full bg-coral/20 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', left: '-5%' }}
        />

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-5 border border-white/30"
          >
            <Rss className="w-4 h-4" /> Expert Insights & Tips
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-[var(--font-family-fun)] font-bold mb-4 drop-shadow-lg"
          >
            Learning Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-8"
          >
            Expert tips, developmental guides, and inspiring stories for your child's speech journey.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
            />
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10">
            <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z" fill="white" fillOpacity="0.08"/>
            <path d="M0 60 C360 20 1080 20 1440 60 L1440 60 L0 60 Z" fill="white" fillOpacity="0.06"/>
            <path d="M0 60 L1440 60 L1440 60 C900 30 540 30 0 60 Z" fill="white" fillOpacity="1" className="fill-[#FFFEF7]"/>
          </svg>
        </div>
      </section>

      <div className="min-h-screen bg-cream-light">
        <div className="max-w-7xl mx-auto px-4 py-10">

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8"
          >
            {CATEGORIES.map(({ key, label }) => (
              <motion.button
                key={key}
                onClick={() => setActiveCategory(key)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeCategory === key
                    ? 'bg-gradient-to-r from-teal to-teal-dark text-white shadow-soft-md'
                    : 'bg-white text-warmgray-600 hover:text-teal hover:bg-teal-light/20 border border-warmgray-200'
                }`}
              >
                {label}
                {activeCategory === key && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1.5 inline-flex items-center justify-center bg-white/30 text-white text-xs rounded-full w-4 h-4"
                  >
                    {filtered.length}
                  </motion.span>
                )}
              </motion.button>
            ))}
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
              className="text-center py-20"
            >
              <BookOpen className="w-16 h-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-500 text-lg font-medium">No posts found.</p>
              <button onClick={() => { setActiveCategory('all'); setSearch(''); }}
                className="mt-4 text-teal font-semibold hover:underline">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Featured post */}
                {featuredPost && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xs font-bold text-teal uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-teal inline-block" /> Top Story
                    </p>
                    <BlogPostCard post={featuredPost} featured />
                  </motion.div>
                )}

                {/* Rest of posts */}
                {restPosts.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-warmgray-400 uppercase tracking-wider mt-6 mb-3 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-warmgray-300 inline-block" /> More Articles
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {restPosts.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: i * 0.07 }}
                        >
                          <BlogPostCard post={post} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <NewsletterSignup onSubmit={handleNewsletterSubmit} />
                </motion.div>

                {/* Quick category nav */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
                >
                  <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-4">Browse by Topic</h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter(c => c.key !== 'all').map(({ key, label }) => {
                      const count = posts.filter(p => p.category === key).length;
                      if (!count) return null;
                      return (
                        <button key={key} onClick={() => setActiveCategory(key)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                            activeCategory === key ? 'bg-teal-light/30 text-teal' : 'hover:bg-warmgray-50 text-warmgray-600'
                          }`}>
                          <span>{label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === key ? 'bg-teal text-white' : 'bg-warmgray-100 text-warmgray-500'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogList;
