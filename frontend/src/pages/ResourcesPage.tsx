import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FolderOpen, BookOpen, Download, Sparkles, Star } from 'lucide-react';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceCategoryFilter from '../components/resources/ResourceCategoryFilter';
import { blogService } from '../services/blogService';
import type { Resource, ResourceCategory } from '../types/blog';

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadResources(); }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const response = await blogService.getResourceCategories();
      setCategories(response.data);
    } catch (err) { console.error('Failed to load categories:', err); }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await blogService.getResources({ category_id: selectedCategoryId });
      setResources(response.data);
    } catch (err) { console.error('Failed to load resources:', err); }
    finally { setLoading(false); }
  };

  const handleDownload = (slug: string) => { blogService.downloadResource(slug); };

  return (
    <Layout>
      <SEO
        title="Free Speech Therapy Resources"
        description="Download free guides, worksheets, and activity sheets created by speech therapists to support your child's communication development at home."
        url="/resources"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-dark via-sky to-teal py-20 px-4">
        <motion.div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }} />
        <motion.div className="absolute w-64 h-64 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 24, 0] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }} />
        <motion.div className="absolute w-44 h-44 rounded-full bg-coral/15 blur-2xl pointer-events-none"
          animate={{ x: [0, 14, -10, 0], y: [0, -14, 10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '25%', right: '18%' }} />

        {[FolderOpen, BookOpen, Download, Sparkles, Star].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/12 pointer-events-none"
            style={{ top: `${12 + i * 18}%`, left: `${4 + i * 18}%` }}
            animate={{ y: [0, -11, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}>
            <Icon className="w-7 h-7" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <FolderOpen className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            Resource <span className="text-sunshine">Library</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-white/85 max-w-xl mx-auto">
            Download free worksheets, guides, and resources for speech development.
          </motion.p>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {[
              { icon: BookOpen, label: 'Free Resources' },
              { icon: Download, label: 'Instant Download' },
              { icon: Star, label: 'Expert Curated' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="bg-cream-light min-h-screen py-12">
        <div className="container-talkie">
          {/* Category Filter */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8">
            <ResourceCategoryFilter
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </motion.div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto" />
              <p className="text-warmgray-600 mt-4">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
              <FolderOpen className="w-16 h-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-600 font-semibold">No resources found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, i) => (
                <motion.div key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}>
                  <ResourceCard resource={resource} onDownload={handleDownload} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
