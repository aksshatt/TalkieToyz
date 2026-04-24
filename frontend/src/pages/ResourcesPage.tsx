import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import {
  FolderOpen,
  BookOpen,
  Download,
  Sparkles,
  Star,
  Search,
  X,
  Filter,
  TrendingUp,
  ArrowRight,
  FileText,
  Zap,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceCard from '../components/resources/ResourceCard';
import { blogService } from '../services/blogService';
import type { Resource, ResourceCategory } from '../types/blog';

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadResources();
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const response = await blogService.getResourceCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await blogService.getResources({ category_id: selectedCategoryId });
      setResources(response.data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (slug: string) => {
    blogService.downloadResource(slug);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return resources;
    const q = search.toLowerCase();
    return resources.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [resources, search]);

  const totalDownloads = useMemo(
    () => resources.reduce((sum, r) => sum + (r.download_count || 0), 0),
    [resources]
  );
  const popularResources = useMemo(
    () => [...resources].sort((a, b) => (b.download_count || 0) - (a.download_count || 0)).slice(0, 4),
    [resources]
  );

  return (
    <Layout>
      <SEO
        title="Free Speech Therapy Resources"
        description="Download free guides, worksheets, and activity sheets created by speech therapists to support your child's communication development at home."
        url="/resources"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-dark via-sky to-teal py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', left: '-8%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', right: '-5%' }}
        />
        {[FolderOpen, BookOpen, Download, Sparkles, Star].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none hidden md:block"
            style={{ top: `${10 + i * 16}%`, left: `${4 + i * 20}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full mb-5 border border-white/25"
          >
            <Zap className="w-4 h-4 text-sunshine" />
            <span className="text-sm font-semibold">100% Free Downloads</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
          >
            Resource <span className="text-sunshine">Library</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            Worksheets, guides, and activity sheets crafted by certified speech therapists — free to download anytime.
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
              placeholder="Search worksheets, guides, activities..."
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
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/85 text-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> {resources.length} resources
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="w-4 h-4" /> {totalDownloads.toLocaleString()} downloads
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-sunshine fill-sunshine" /> Expert-curated
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="bg-cream-light min-h-screen py-12">
        <div className="container-talkie">
          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3 text-warmgray-600 text-sm font-semibold">
              <Filter className="w-4 h-4" />
              <span>Browse by category</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategoryId(undefined)}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-all ${
                  !selectedCategoryId
                    ? 'bg-gradient-to-r from-sky to-sky-dark text-white border-sky shadow-soft-md'
                    : 'bg-white text-warmgray-700 border-warmgray-200 hover:border-sky/40 hover:text-sky'
                }`}
              >
                📁 All Resources
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${!selectedCategoryId ? 'bg-white/25 text-white' : 'bg-warmgray-100 text-warmgray-500'}`}>
                  {resources.length}
                </span>
              </motion.button>
              {categories.map((cat) => {
                const active = selectedCategoryId === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-all ${
                      active
                        ? 'bg-gradient-to-r from-sky to-sky-dark text-white border-sky shadow-soft-md'
                        : 'bg-white text-warmgray-700 border-warmgray-200 hover:border-sky/40 hover:text-sky'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Main grid */}
            <div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft border border-warmgray-100">
                      <div className="h-40 bg-warmgray-200 animate-shimmer" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-warmgray-200 rounded animate-shimmer w-3/4" />
                        <div className="h-3 bg-warmgray-200 rounded animate-shimmer" />
                        <div className="h-9 bg-warmgray-200 rounded-full animate-shimmer w-32" />
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
                  <FolderOpen className="w-16 h-16 text-warmgray-300 mx-auto mb-4" />
                  <p className="text-warmgray-700 text-lg font-bold mb-1">No resources found</p>
                  <p className="text-warmgray-500 text-sm mb-4">
                    {search ? 'Try a different search term.' : 'Try another category.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedCategoryId(undefined);
                    }}
                    className="inline-flex items-center gap-1.5 text-sky font-semibold hover:underline"
                  >
                    Clear filters <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((resource, i) => (
                      <motion.div
                        key={resource.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: Math.min((i % 6) * 0.05, 0.25), duration: 0.4 }}
                      >
                        <ResourceCard resource={resource} onDownload={handleDownload} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Popular resources */}
              {popularResources.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
                >
                  <h3 className="font-extrabold text-warmgray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky" /> Most Downloaded
                  </h3>
                  <div className="space-y-3">
                    {popularResources.map((r, i) => (
                      <button
                        key={r.id}
                        onClick={() => handleDownload(r.slug)}
                        className="w-full text-left flex gap-3 group rounded-xl p-2 -m-2 hover:bg-cream-light/60 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-sky-light/40 flex items-center justify-center flex-shrink-0 font-extrabold text-sky text-sm">
                          {i + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-warmgray-900 line-clamp-2 group-hover:text-sky transition-colors">
                            {r.title}
                          </p>
                          <p className="text-xs text-warmgray-500 mt-0.5 inline-flex items-center gap-1">
                            <Download className="w-3 h-3" /> {r.download_count || 0} downloads
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Info card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
              >
                <h3 className="font-extrabold text-warmgray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky" /> Why our resources?
                </h3>
                <ul className="space-y-2.5 text-sm text-warmgray-700">
                  {[
                    'Built by RCI-certified therapists',
                    'Age-appropriate & goal-aligned',
                    'Print-ready PDFs',
                    'Updated regularly',
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-sunshine fill-sunshine shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="relative bg-gradient-to-br from-coral to-coral-dark text-white rounded-2xl p-6 shadow-soft-md overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <Sparkles className="w-8 h-8 text-sunshine mb-3" />
                <h3 className="font-extrabold text-lg mb-1">Need more help?</h3>
                <p className="text-sm text-white/85 mb-4">
                  Book a 1:1 session with our speech therapists for personalised support.
                </p>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-1.5 bg-white text-coral font-extrabold px-4 py-2 rounded-full shadow-soft hover:shadow-soft-md transition-all"
                >
                  Book a Session <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
