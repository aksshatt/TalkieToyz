import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Star, ChevronRight, Tag, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { bundlesService, Bundle } from '../services/bundlesService';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const SPEECH_GOAL_FILTERS = ['All', 'Articulation', 'Vocabulary', 'Fluency', 'Social Communication'];

const BUNDLE_GRADIENTS = [
  'from-teal-dark to-teal',
  'from-coral-dark to-coral',
  'from-sunshine to-sunshine-light',
  'from-sky-dark to-sky',
];

const BundleCard: React.FC<{ bundle: Bundle; index: number }> = ({ bundle, index }) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAddAllToCart = async () => {
    try {
      for (const p of bundle.products) {
        await dispatch(addToCart({ product_id: p.id, quantity: 1, silent: true })).unwrap();
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      setAdded(false);
    }
  };

  const gradient = BUNDLE_GRADIENTS[index % BUNDLE_GRADIENTS.length];

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="bg-white rounded-3xl shadow-soft overflow-hidden"
    >
      {/* Bundle Header */}
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Package className="w-4 h-4 opacity-80" />
              <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">Speech Kit</span>
            </div>
            <h3 className="text-lg font-[var(--font-family-fun)] font-bold">{bundle.name}</h3>
            {bundle.speech_goal && (
              <span className="inline-block mt-2 text-xs bg-white/25 px-3 py-1 rounded-full font-semibold">
                {bundle.speech_goal}
              </span>
            )}
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-xs opacity-75 line-through">₹{bundle.original_price}</p>
            <p className="text-2xl font-bold">₹{bundle.discounted_price}</p>
            <span className="inline-block text-xs bg-white/30 text-white font-bold px-2.5 py-0.5 rounded-full mt-1">
              Save {bundle.discount_percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Products in Bundle */}
      <div className="p-5">
        {bundle.description && (
          <p className="text-sm text-warmgray-500 mb-4 leading-relaxed">{bundle.description}</p>
        )}

        <div className="space-y-2.5 mb-5">
          {bundle.products.map((product, idx) => (
            <div key={product.id} className="flex items-center gap-3 py-1">
              <span className="w-5 h-5 rounded-full bg-teal-light text-teal text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-xl object-cover shadow-soft flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-cream-light flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-warmgray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.slug}`} className="text-sm font-semibold text-warmgray-800 hover:text-teal transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs text-warmgray-400">₹{product.price}</p>
              </div>
              {product.stock_quantity > 0 ? (
                <CheckCircle className="w-4 h-4 text-teal flex-shrink-0" />
              ) : (
                <span className="text-xs text-coral font-medium">OOS</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-warmgray-100">
          <div>
            <p className="text-xs text-warmgray-400">You save</p>
            <p className="font-bold text-teal">₹{bundle.savings}</p>
          </div>
          <motion.button
            onClick={handleAddAllToCart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-soft ${
              added
                ? 'bg-teal-light text-teal'
                : 'bg-teal-gradient text-white hover:shadow-soft-md'
            }`}
          >
            {added ? (
              <><CheckCircle className="w-4 h-4" /> Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add Kit to Cart</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const BundleBuilderPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn: () => bundlesService.getBundles(),
  });

  const allBundles: Bundle[] = data?.data || [];
  const bundles = selectedGoal === 'All' ? allBundles : allBundles.filter(b => b.speech_goal === selectedGoal);

  return (
    <Layout>
      <SEO url="/speech-kits" />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-16 px-4">
        <motion.div className="absolute w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 28, 0], y: [0, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-20%', left: '-5%' }} />
        <motion.div className="absolute w-56 h-56 rounded-full bg-sunshine/15 blur-3xl pointer-events-none"
          animate={{ x: [0, -16, 0], y: [0, 22, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-20%', right: '5%' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-5">
            <Tag className="w-4 h-4" /> Curated Speech Kits
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            Speech Kits
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-white/85 text-lg max-w-xl mx-auto">
            Expertly curated bundles designed by our speech therapists — get everything your child needs at a discounted price.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fafaf9" />
          </svg>
        </div>
      </div>

      <div className="bg-warmgray-50 min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="flex gap-2.5 flex-wrap justify-center mb-10">
            {SPEECH_GOAL_FILTERS.map(goal => (
              <motion.button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-soft ${
                  selectedGoal === goal
                    ? 'bg-teal-gradient text-white shadow-soft-md'
                    : 'bg-white border-2 border-warmgray-200 text-warmgray-600 hover:border-teal'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-3xl h-72" />)}
            </div>
          ) : bundles.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-warmgray-200 shadow-soft">
              <Package className="w-14 h-14 text-warmgray-300 mx-auto mb-4" />
              <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-700 mb-2">No Speech Kits Yet</h3>
              <p className="text-warmgray-400 mb-6">Our therapist team is curating bundles for you. Check back soon!</p>
              <Link to="/products" className="inline-flex items-center gap-2 text-teal font-bold hover:underline">
                Browse all products <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bundles.map((bundle, index) => (
                  <motion.div key={bundle.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.07 }}>
                    <BundleCard bundle={bundle} index={index} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BundleBuilderPage;
