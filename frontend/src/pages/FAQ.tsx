import { useState, useEffect } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
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

  useEffect(() => {
    loadCategories();
    loadFaqs();
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await faqService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load FAQ categories:', error);
    }
  };

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await faqService.getFaqs({
        category: selectedCategory || undefined,
        q: searchQuery || undefined,
      });

      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-warmgray-50">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-teal-light/30 rounded-full mb-4">
              <HelpCircle className="h-12 w-12 text-teal" />
            </div>
            <h1 className="text-5xl font-[var(--font-family-fun)] font-bold mb-4">
              <span className="text-teal">Frequently Asked</span>{' '}
              <span className="text-coral">Questions</span>
            </h1>
            <p className="text-xl text-warmgray-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and services.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmgray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="input-talkie pl-12"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-pill font-semibold transition-all ${
                  selectedCategory === ''
                    ? 'bg-teal-gradient text-white shadow-soft'
                    : 'bg-white text-warmgray-700 border-2 border-warmgray-200 hover:border-teal'
                }`}
              >
                All ({categories.reduce((sum, cat) => sum + cat.count, 0)})
              </button>
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-pill font-semibold transition-all ${
                    selectedCategory === category.value
                      ? 'bg-teal-gradient text-white shadow-soft'
                      : 'bg-white text-warmgray-700 border-2 border-warmgray-200 hover:border-teal'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* FAQs List */}
          {isLoading ? (
            <LoadingSkeleton count={5} height={80} />
          ) : faqs.length === 0 ? (
            <div className="card-talkie text-center py-12">
              <HelpCircle className="h-16 w-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-xl text-warmgray-600">
                No FAQs found matching your search.
              </p>
              <p className="text-warmgray-500 mt-2">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div>
              {faqs.map((faq) => (
                <FaqAccordion key={faq.id} faq={faq} />
              ))}
            </div>
          )}

          {/* Still Have Questions */}
          <div className="card-talkie bg-coral-light/20 mt-12 text-center">
            <h3 className="text-2xl font-bold text-warmgray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-warmgray-700 mb-6">
              Can't find the answer you're looking for? Please contact our friendly team.
            </p>
            <a href="/contact" className="btn-primary inline-block">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
