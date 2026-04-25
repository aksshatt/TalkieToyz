import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingBag, Sparkles, Star } from 'lucide-react';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import SearchBar from '../components/products/SearchBar';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import type { ProductFilters } from '../types/product';
import Layout from '../components/layout/Layout';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 12,
    sort: 'newest'
  });

  const { data, isLoading, error } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Helper to find category by slug in hierarchical structure
  const findCategoryBySlug = (slug: string) => {
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }
      // Search in subcategories
      if (category.subcategories) {
        const found = category.subcategories.find(sub => sub.slug === slug);
        if (found) return found;
      }
    }
    return null;
  };

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const categoryIdParam = searchParams.get('category_id');

    if (categorySlug && categories.length > 0) {
      // Find category by slug (including subcategories)
      const category = findCategoryBySlug(categorySlug);
      if (category) {
        setFilters(prev => {
          if (prev.category_id === category.id) return prev;
          return { ...prev, category_id: category.id, page: 1 };
        });
      }
    } else if (categoryIdParam) {
      const parsedId = parseInt(categoryIdParam, 10);
      setFilters(prev => {
        if (prev.category_id === parsedId) return prev;
        return { ...prev, category_id: parsedId, page: 1 };
      });
    }
  }, [searchParams, categories]);

  const products = data?.data || [];
  const meta = data?.meta;

  const handleSearchChange = (query: string) => {
    setFilters({ ...filters, q: query, page: 1 });
  };

  const handleSortChange = (sort: ProductFilters['sort']) => {
    setFilters({ ...filters, sort, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center px-4">
          <div className="card-talkie text-center max-w-md">
            <h2 className="heading-talkie text-2xl mb-2">
              Error loading products
            </h2>
            <p className="text-warmgray-600">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Shop Speech Therapy Toys"
        description="Browse our collection of therapist-designed speech therapy toys for children. Filter by age, category, and price to find the perfect learning toy."
        url="/products"
      />
      <div className="min-h-screen bg-cream-light">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-16 px-4">
        <motion.div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }} />
        <motion.div className="absolute w-60 h-60 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -18, 0], y: [0, 25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-10%', right: '8%' }} />
        {[ShoppingBag, Sparkles, Star].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/15 pointer-events-none"
            style={{ top: `${20 + i * 25}%`, left: `${8 + i * 28}%` }}
            animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}>
            <Icon className="w-7 h-7" />
          </motion.div>
        ))}
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-5">
            <ShoppingBag className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-3">
            Our <span className="text-sunshine">Products</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-white/85 max-w-xl mx-auto">
            Discover therapeutic toys designed to nurture speech, communication, and development.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-teal-light/40 via-cream-light to-coral-light/30 border-b border-warmgray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="heading-talkie mb-4 text-3xl md:text-4xl">
            Products
          </h1>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              onSearch={handleSearchChange}
              placeholder="Search products..."
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-soft hover:shadow-soft-md transition-all font-semibold text-warmgray-700"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-white rounded-xl p-1 shadow-soft border border-warmgray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-teal-gradient text-white shadow-soft'
                    : 'text-warmgray-600 hover:text-warmgray-900 hover:bg-warmgray-50'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-teal-gradient text-white shadow-soft'
                    : 'text-warmgray-600 hover:text-warmgray-900 hover:bg-warmgray-50'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value as ProductFilters['sort'])}
              className="px-4 py-2.5 border-2 border-warmgray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none font-semibold text-warmgray-700 bg-white shadow-soft hover:shadow-soft-md transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Results Count */}
            {meta && (
              <span className="hidden md:block text-sm font-semibold text-warmgray-700 bg-white px-4 py-2 rounded-xl shadow-soft border border-warmgray-200">
                {meta.total_count} {meta.total_count === 1 ? 'product' : 'products'} found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {(() => {
        const chips: { label: string; onRemove: () => void }[] = [];
        if (filters.category_id) {
          const cat = categories.flatMap(c => [c, ...(c.subcategories || [])]).find(c => c.id === filters.category_id);
          chips.push({ label: `Category: ${cat?.name || filters.category_id}`, onRemove: () => setFilters({ ...filters, category_id: undefined, page: 1 }) });
        }
        if (filters.age) chips.push({ label: `Age: ${filters.age}+`, onRemove: () => setFilters({ ...filters, age: undefined, page: 1 }) });
        if (filters.min_price != null || filters.max_price != null) chips.push({ label: `Price: ₹${filters.min_price ?? 0}–₹${filters.max_price ?? '∞'}`, onRemove: () => setFilters({ ...filters, min_price: undefined, max_price: undefined, page: 1 }) });
        if (filters.in_stock) chips.push({ label: 'In Stock', onRemove: () => setFilters({ ...filters, in_stock: undefined, page: 1 }) });
        if (filters.featured) chips.push({ label: 'Featured', onRemove: () => setFilters({ ...filters, featured: undefined, page: 1 }) });
        if (filters.q) chips.push({ label: `Search: "${filters.q}"`, onRemove: () => setFilters({ ...filters, q: undefined, page: 1 }) });
        if (chips.length === 0) return null;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-warmgray-500 uppercase">Active:</span>
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 bg-teal-light/40 text-teal text-xs font-bold px-3 py-1.5 rounded-full hover:bg-teal-light/60"
                >
                  {chip.label}
                  <span className="text-teal/70">✕</span>
                </button>
              ))}
              <button
                onClick={() => setFilters({ page: 1, per_page: 12, sort: 'newest' })}
                className="text-xs font-bold text-coral hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        );
      })()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </aside>

          {/* Mobile Filters Sidebar */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-warmgray-900 bg-opacity-50 z-50 lg:hidden">
              <div className="bg-cream-light w-80 max-w-full h-full overflow-y-auto shadow-soft-xl">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={(newFilters) => {
                    setFilters(newFilters);
                    setShowMobileFilters(false);
                  }}
                  onClose={() => setShowMobileFilters(false)}
                  isMobile
                />
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <main className="flex-1">
            {isLoading ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 card-talkie">
                <div className="text-6xl mb-6 text-warmgray-400">
                  <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-[var(--font-family-fun)] text-xl font-bold text-warmgray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-sm text-warmgray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Please try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => setFilters({ page: 1, per_page: 12, sort: 'newest' })}
                  className="btn-primary px-6 py-2.5"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.total_pages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(meta.current_page - 1)}
                      disabled={meta.current_page === 1}
                      className="p-2 rounded-xl bg-white border-2 border-warmgray-300 shadow-soft hover:bg-warmgray-50 hover:shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-5 w-5 text-warmgray-600" />
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(meta.total_pages)].map((_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === meta.current_page;
                        const showPage =
                          page === 1 ||
                          page === meta.total_pages ||
                          Math.abs(page - meta.current_page) <= 1;

                        if (!showPage) {
                          if (page === meta.current_page - 2 || page === meta.current_page + 2) {
                            return <span key={page} className="px-2 text-warmgray-500">...</span>;
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`min-w-[2.5rem] px-3 py-2 rounded-xl font-semibold transition-all ${
                              isCurrentPage
                                ? 'bg-teal-gradient text-white shadow-soft'
                                : 'bg-white border-2 border-warmgray-300 text-warmgray-700 hover:bg-warmgray-50 hover:shadow-soft'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(meta.current_page + 1)}
                      disabled={meta.current_page === meta.total_pages}
                      className="p-2 rounded-xl bg-white border-2 border-warmgray-300 shadow-soft hover:bg-warmgray-50 hover:shadow-soft-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-5 w-5 text-warmgray-600" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ProductList;
