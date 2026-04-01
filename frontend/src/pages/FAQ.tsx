import { useState, useEffect } from 'react';
import { Search, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import FaqAccordion from '../components/faq/FaqAccordion';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { faqService } from '../services/faqService';
import toast from 'react-hot-toast';
import type { Faq, FaqCategory } from '../types/faq';

const FAQ = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadCategories(); loadFaqs(); }, []);
  useEffect(() => { loadFaqs(); }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await faqService.getCategories();
      if (response.success) setCategories(response.data);
    } catch (error) { console.error('Failed to load FAQ categories:', error); }
  };

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await faqService.getFaqs({
        category: selectedCategory || undefined,
        q: searchQuery || undefined,
      });
      if (response.success) setFaqs(response.data);
    } catch (error) { toast.error('Failed to load FAQs'); }
    finally { setIsLoading(false); }
  };

  return (
    <Layout>
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about TalkieToys speech therapy toys, orders, shipping, and how our products support child development."
        url="/faq"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sunshine-dark via-sunshine to-coral py-20 px-4">
        <motion.div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }} />
        <motion.div className="absolute w-64 h-64 rounded-full bg-teal/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -18, 0], y: [0, 24, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }} />

        {[HelpCircle, MessageCircle, Sparkles].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/15 pointer-events-none"
            style={{ top: `${15 + i * 28}%`, left: `${6 + i * 28}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}>
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            Frequently Asked <span className="text-teal-light">Questions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-white/85 max-w-xl mx-auto mb-8">
            Find answers to common questions about our products, shipping, and services.
          </motion.p>

          {/* Search bar in hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmgray-400" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm text-warmgray-800 placeholder-warmgray-400 focus:outline-none focus:ring-4 focus:ring-white/40 shadow-soft-xl text-base font-medium"
            />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fafaf9" />
          </svg>
        </div>
      </div>

      <div className="bg-warmgray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4">

          {/* Category Filter Pills */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                selectedCategory === ''
                  ? 'bg-sunshine-gradient text-white shadow-soft'
                  : 'bg-white text-warmgray-700 border-2 border-warmgray-200 hover:border-sunshine'
              }`}
            >
              All ({categories.reduce((sum, cat) => sum + cat.count, 0)})
            </button>
            {categories.map((category, i) => (
              <motion.button key={category.value}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  selectedCategory === category.value
                    ? 'bg-sunshine-gradient text-white shadow-soft'
                    : 'bg-white text-warmgray-700 border-2 border-warmgray-200 hover:border-sunshine'
                }`}
              >
                {category.label} ({category.count})
              </motion.button>
            ))}
          </motion.div>

          {/* FAQs List */}
          {isLoading ? (
            <LoadingSkeleton count={5} height={80} />
          ) : faqs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-soft p-12 text-center">
              <HelpCircle className="h-16 w-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-xl text-warmgray-600 font-semibold mb-2">No FAQs found</p>
              <p className="text-warmgray-400">Try a different search term or category.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={selectedCategory + searchQuery}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-3">
                {faqs.map((faq, i) => (
                  <motion.div key={faq.id}
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <FaqAccordion faq={faq} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Still Have Questions CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 relative overflow-hidden bg-gradient-to-br from-coral-light/30 via-white to-sunshine-light/20 rounded-3xl p-8 md:p-10 border border-coral/10 shadow-soft text-center">
            <motion.div className="absolute w-40 h-40 rounded-full bg-coral/10 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ top: '-20%', right: '10%' }} />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-coral-gradient rounded-2xl mb-4 shadow-soft">
                <MessageCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">
                Still have questions?
              </h3>
              <p className="text-warmgray-600 mb-6 max-w-md mx-auto">
                Can't find the answer you're looking for? Our friendly team is here to help.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-coral to-coral-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-shadow">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
