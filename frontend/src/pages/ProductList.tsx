import { useState } from 'react';
import { Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import FilterSidebar from '../components/products/FilterSidebar';
import SearchBar from '../components/products/SearchBar';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import type { ProductFilters } from '../types/product';
import Layout from '../components/layout/Layout';

const ProductList = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 12,
    sort: 'newest'
  });

  const { data, isLoading, error } = useProducts(filters);

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error loading products
            </h2>
            <p className="text-gray-600">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
      {/* Header */}
      <div className="bg-fun-gradient shadow-playful sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold text-white mb-4 flex items-center gap-3 animate-bounce-slow">
            <span className="text-5xl"></span>
            Our Awesome Toys!
          </h1>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              onSearch={handleSearchChange}
              placeholder="Search for speech therapy toys..."
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-playful hover:shadow-playful-hover transition-all transform hover:scale-105 font-semibold"
            >
              <SlidersHorizontal className="h-5 w-5 text-purple-600" />
              <span className="text-purple-600">Filters 🔍</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-white rounded-full p-1.5 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-full transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value as ProductFilters['sort'])}
              className="px-5 py-3 border-2 border-purple-300 rounded-full focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none font-semibold text-gray-700 bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="newest">✨ Newest First</option>
              <option value="popular">🌟 Most Popular</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💎 Price: High to Low</option>
              <option value="name">🔤 Name: A to Z</option>
            </select>

            {/* Results Count */}
            {meta && (
              <span className="hidden md:block text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full shadow-md">
                 {meta.total_count} toys found!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="bg-white w-80 max-w-full h-full overflow-y-auto">
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
              <div className="text-center py-16 bg-white rounded-3xl shadow-playful">
                <div className="text-8xl mb-6 animate-bounce-slow">😢</div>
                <h3 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-900 mb-3">
                  Oops! No Toys Found
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Try different filters or search words!
                </p>
                <button
                  onClick={() => setFilters({ page: 1, per_page: 12, sort: 'newest' })}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-4 rounded-full shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
                >
                  🔄 Reset Filters
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
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePageChange(meta.current_page - 1)}
                      disabled={meta.current_page === 1}
                      className="p-3 rounded-full bg-white shadow-playful hover:shadow-playful-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6 text-purple-600" />
                    </button>

                    <div className="flex items-center gap-2">
                      {[...Array(meta.total_pages)].map((_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === meta.current_page;
                        const showPage =
                          page === 1 ||
                          page === meta.total_pages ||
                          Math.abs(page - meta.current_page) <= 1;

                        if (!showPage) {
                          if (page === meta.current_page - 2 || page === meta.current_page + 2) {
                            return <span key={page} className="px-2 text-2xl">...</span>;
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-5 py-3 rounded-full font-bold transition-all transform hover:scale-110 ${
                              isCurrentPage
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-playful'
                                : 'bg-white shadow-md hover:shadow-lg text-purple-600'
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
                      className="p-3 rounded-full bg-white shadow-playful hover:shadow-playful-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6 text-purple-600" />
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
