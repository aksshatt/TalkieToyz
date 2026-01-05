import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import type { ProductSummary } from '../../types/product';
import { productService } from '../../services/productService';

const FeaturedCollections = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          featured: true,
          per_page: 8,
        });
        setFeaturedProducts(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-cream-light via-white to-teal-light/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-4">
              Featured Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-talkie animate-pulse">
                <div className="bg-warmgray-200 h-48 rounded-t-2xl"></div>
                <div className="p-5 space-y-3">
                  <div className="bg-warmgray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-warmgray-200 h-3 rounded w-full"></div>
                  <div className="bg-warmgray-200 h-3 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-cream-light via-white to-teal-light/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-warmgray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-cream-light via-white to-teal-light/20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-900 mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-warmgray-600 max-w-3xl mx-auto">
            Handpicked educational toys that parents and children love
          </p>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-10">
              <Link
                to="/products?featured=true"
                className="btn-primary text-lg px-8 py-4 inline-block"
              >
                View All Featured Toys
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-warmgray-600 text-lg mb-6">No featured products available at the moment.</p>
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-4 inline-block"
            >
              Browse All Toys
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
