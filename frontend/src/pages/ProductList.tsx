import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
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

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const categoryIdParam = searchParams.get('category_id');

    if (categorySlug && categories.length > 0) {
      // Find category by slug
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setFilters(prev => ({
          ...prev,
          category_id: category.id,
          page: 1
        }));
      }
    } else if (categoryIdParam) {
      // Handle direct category_id parameter
      setFilters(prev => ({
        ...prev,
        category_id: parseInt(categoryIdParam),
        page: 1
      }));
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
      <div className="min-h-screen bg-cream-light">
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
