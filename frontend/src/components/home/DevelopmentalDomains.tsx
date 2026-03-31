import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Hand,
  Brain,
  Heart,
  Lightbulb,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import type { Category } from '../../types/product';

const DevelopmentalDomains = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDomain, setExpandedDomain] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getCategories();
        const topLevelCategories = response.data.filter((cat: Category) => cat.parent_id === null);
        setCategories(topLevelCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getIconForDomain = (slug: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'physical-domain': <Activity className="w-8 h-8" />,
      'cognitive-domain': <Brain className="w-8 h-8" />,
      'speech-language-domain': <MessageCircle className="w-8 h-8" />,
      'social-emotional-domain': <Heart className="w-8 h-8" />,
      'adaptive-domain': <Lightbulb className="w-8 h-8" />,
      'sensory-integration-domain': <Eye className="w-8 h-8" />,
    };
    return iconMap[slug] || <Hand className="w-8 h-8" />;
  };

  const getColorForDomain = (index: number) => {
    const colors = [
      { color: 'text-teal', bgColor: 'bg-teal-light/30', borderColor: 'border-teal' },
      { color: 'text-coral', bgColor: 'bg-coral-light/30', borderColor: 'border-coral' },
      { color: 'text-purple-500', bgColor: 'bg-purple-100', borderColor: 'border-purple-500' },
      { color: 'text-pink-500', bgColor: 'bg-pink-100', borderColor: 'border-pink-500' },
      { color: 'text-sunshine', bgColor: 'bg-sunshine-light/30', borderColor: 'border-sunshine' },
      { color: 'text-sky', bgColor: 'bg-sky-light/30', borderColor: 'border-sky' },
    ];
    return colors[index % colors.length];
  };

  const toggleDomain = (categoryId: number) => {
    setExpandedDomain(expandedDomain === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-4">
              Developmental Domains
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-talkie animate-pulse h-48"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-4">
            Developmental Domains
          </h2>
          <p className="text-lg text-warmgray-600 max-w-3xl mx-auto">
            Our toys are carefully categorized by developmental areas to help you choose the perfect match for your child's growth journey
          </p>
        </motion.div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const colors = getColorForDomain(index);
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            const isExpanded = expandedDomain === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
              >
                {/* Main Domain Card */}
                <motion.div
                  className={`card-talkie-hover transition-colors duration-300 ${
                    isExpanded ? `border-l-4 ${colors.borderColor}` : ''
                  }`}
                  whileHover={{ y: -6, boxShadow: '0 12px 28px rgba(0,0,0,0.13)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <Link
                        to={`/products?category=${category.slug}`}
                        className={`flex-shrink-0 w-16 h-16 rounded-full ${colors.bgColor} flex items-center justify-center shadow-soft`}
                      >
                        <motion.div
                          className={colors.color}
                          whileHover={{ scale: 1.2, rotate: 8 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        >
                          {getIconForDomain(category.slug)}
                        </motion.div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/products?category=${category.slug}`}
                            className="flex-1"
                          >
                            <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-xl mb-2 hover:text-teal transition-colors">
                              {category.name}
                            </h3>
                          </Link>
                          {hasSubcategories && (
                            <motion.button
                              onClick={() => toggleDomain(category.id)}
                              className="flex-shrink-0 p-1 hover:bg-warmgray-100 rounded-lg transition-colors"
                              aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                              whileTap={{ scale: 0.88 }}
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                {isExpanded ? (
                                  <ChevronUp className={`w-5 h-5 ${colors.color}`} />
                                ) : (
                                  <ChevronDown className={`w-5 h-5 ${colors.color}`} />
                                )}
                              </motion.div>
                            </motion.button>
                          )}
                        </div>
                        <p className="text-sm text-warmgray-600 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Subcategories - Animated expand/collapse */}
                    <AnimatePresence>
                      {isExpanded && hasSubcategories && (
                        <motion.div
                          className="mt-4 pt-4 border-t border-warmgray-200 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {category.subcategories?.map((subcat, si) => (
                            <motion.div
                              key={subcat.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: si * 0.05 }}
                            >
                              <Link
                                to={`/products?category=${subcat.slug}`}
                                className={`block p-3 rounded-lg hover:${colors.bgColor} transition-all group`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-warmgray-700 font-medium group-hover:text-warmgray-900">
                                    {subcat.name}
                                  </span>
                                  <svg
                                    className={`w-4 h-4 ${colors.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-teal font-semibold hover:text-coral transition-colors text-lg"
            >
              Explore All Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevelopmentalDomains;
