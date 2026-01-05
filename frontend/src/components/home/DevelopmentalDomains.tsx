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
  Users,
} from 'lucide-react';
import { productService } from '../../services/productService';
import type { Category } from '../../types/product';

const DevelopmentalDomains = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    return iconMap[slug] || <Users className="w-8 h-8" />;
  };

  // Color mapping for different domains
  const getColorForDomain = (index: number) => {
    const colors = [
      { color: 'text-teal', bgColor: 'bg-teal-light/30' },
      { color: 'text-coral', bgColor: 'bg-coral-light/30' },
      { color: 'text-purple-500', bgColor: 'bg-purple-100' },
      { color: 'text-pink-500', bgColor: 'bg-pink-100' },
      { color: 'text-sunshine', bgColor: 'bg-sunshine-light/30' },
      { color: 'text-sky', bgColor: 'bg-sky-light/30' },
    ];
    return colors[index % colors.length];
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            const colors = getColorForDomain(index);
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-talkie-hover text-center p-6 h-full flex flex-col items-center">
                  {/* Circular Icon */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${colors.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-soft`}
                  >
                    <div className={colors.color}>{getIconForDomain(category.slug)}</div>
                  </div>

                  {/* Title */}
                  <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-lg mb-2 group-hover:text-teal transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-warmgray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/domains"
            className="inline-flex items-center gap-2 text-teal font-semibold hover:text-coral transition-colors text-lg"
          >
            Explore All Domains
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
