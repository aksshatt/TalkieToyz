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
        // Filter only top-level categories (parent_id is null)
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

  // Icon mapping for different domains
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

  // Color mapping for different domains
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
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-4">
            Developmental Domains
          </h2>
          <p className="text-lg text-warmgray-600 max-w-3xl mx-auto">
            Our toys are carefully categorized by developmental areas to help you choose the perfect match for your child's growth journey
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const colors = getColorForDomain(index);
            const hasSubcategories = category.subcategories && category.subcategories.length > 0;
            const isExpanded = expandedDomain === category.id;

            return (
              <div key={category.id} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Main Domain Card */}
                <div
                  className={`card-talkie-hover transition-all duration-300 ${
                    isExpanded ? `border-l-4 ${colors.borderColor}` : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <Link
                        to={`/products?category=${category.slug}`}
                        className={`flex-shrink-0 w-16 h-16 rounded-full ${colors.bgColor} flex items-center justify-center shadow-soft hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={colors.color}>{getIconForDomain(category.slug)}</div>
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
                            <button
                              onClick={() => toggleDomain(category.id)}
                              className="flex-shrink-0 p-1 hover:bg-warmgray-100 rounded-lg transition-colors"
                              aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                            >
                              {isExpanded ? (
                                <ChevronUp className={`w-5 h-5 ${colors.color}`} />
                              ) : (
                                <ChevronDown className={`w-5 h-5 ${colors.color}`} />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-warmgray-600 leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Subcategories - Expandable */}
                    {isExpanded && hasSubcategories && (
                      <div className="mt-4 pt-4 border-t border-warmgray-200 space-y-2 animate-slide-in">
                        {category.subcategories?.map((subcat) => (
                          <Link
                            key={subcat.id}
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-coral transition-colors text-lg"
          >
            Explore All Products
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentalDomains;
