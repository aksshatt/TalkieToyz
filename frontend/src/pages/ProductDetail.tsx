import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import ImageGallery from '../components/products/ImageGallery';
import RelatedProductsCarousel from '../components/products/RelatedProductsCarousel';
import { ProductDetailSkeleton } from '../components/common/LoadingSkeleton';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import Layout from '../components/layout/Layout';
import ReviewsSection from '../components/reviews/ReviewsSection';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'speech-goals' | 'usage-tips' | 'reviews'>('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data, isLoading, error } = useProduct(slug || '');
  const { data: relatedData } = useRelatedProducts(slug || '');

  const product = data?.data;
  const relatedProducts = relatedData?.data || [];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min((product?.stock_quantity || 1), prev + delta)));
  };

  const handleShare = (platform: 'whatsapp' | 'facebook') => {
    const url = window.location.href;
    const text = `Check out ${product?.name}!`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductDetailSkeleton />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="h-5 w-5" />
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'speech-goals', label: 'Speech Goals' },
    { id: 'usage-tips', label: 'Usage Tips' },
    { id: 'reviews', label: `Reviews (${product.review_count})` },
  ] as const;

  return (
    <Layout>
      <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            {product.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Info Section */}
        <div className="bg-white rounded-3xl shadow-playful p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={product.image_urls} productName={product.name} />
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-[var(--font-family-fun)] font-bold text-gray-900 mb-3 leading-tight">
                    {product.name}
                  </h1>
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-md animate-bounce-slow">
                       Featured!
                    </span>
                  )}
                </div>
                <button className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 transition-all transform hover:scale-110 active:scale-95">
                  <Heart className="h-7 w-7 text-pink-500 hover:fill-pink-500" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.average_rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-5xl font-[var(--font-family-fun)] font-bold text-purple-600">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{parseFloat(product.compare_at_price).toFixed(2)}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md animate-wiggle">
                         Save {product.discount_percentage}%!
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {/* Category and Age Range */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.category && (
                  <div>
                    <span className="text-sm text-gray-600">Category</span>
                    <p className="font-medium text-gray-900">{product.category.name}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Age Range</span>
                  <p className="font-medium text-gray-900">
                    {product.min_age}-{product.max_age} years
                  </p>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.in_stock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">In Stock ({product.stock_quantity} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.in_stock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="text-xl font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                disabled={!product.in_stock || isAddingToCart}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full font-[var(--font-family-fun)] font-bold text-xl transition-all mb-4 transform ${
                  product.in_stock && !isAddingToCart
                    ? 'bg-fun-gradient text-white hover:scale-105 shadow-playful hover:shadow-playful-hover'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={async () => {
                  setIsAddingToCart(true);
                  try {
                    await dispatch(
                      addToCart({
                        product_id: product.id,
                        quantity: quantity,
                      })
                    ).unwrap();
                    setQuantity(1);
                  } catch (error) {
                    // Error already handled in slice
                  } finally {
                    setIsAddingToCart(false);
                  }
                }}
              >
                <ShoppingCart className="h-7 w-7" />
                {product.in_stock ? '🛒 Add to Cart!' : ' Sold Out'}
              </button>

              {/* Share Buttons */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Share:</span>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-green-600" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-blue-600" />
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <RefreshCw className="h-5 w-5 text-gray-400" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span>1-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-playful p-8 mb-8">
          {/* Tab Headers */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-[var(--font-family-fun)] font-bold rounded-full transition-all whitespace-nowrap transform hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-playful'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.long_description || product.description}
                </p>

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold mt-6 mb-3">Specifications</h4>
                    <dl className="grid grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-2">
                          <dt className="text-sm text-gray-600 capitalize">
                            {key.replace(/_/g, ' ')}
                          </dt>
                          <dd className="text-gray-900 font-medium">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </div>
            )}

            {activeTab === 'speech-goals' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Speech & Language Goals</h3>
                {product.speech_goals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.speech_goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {goal.name}
                        </h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specific speech goals listed for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'usage-tips' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Usage Tips</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="text-gray-700">
                      <strong>Getting Started:</strong> Begin with simple activities and gradually increase complexity as the child becomes more comfortable with the toy.
                    </p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="text-gray-700">
                      <strong>Engagement Tips:</strong> Use the toy during regular playtime to make speech practice feel natural and fun.
                    </p>
                  </div>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                    <p className="text-gray-700">
                      <strong>Best Practices:</strong> Consistent daily practice for 15-20 minutes yields the best results.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewsSection
                productSlug={product.slug}
                canUserReview={true}
                hasVerifiedPurchase={false}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProductsCarousel products={relatedProducts} />
        )}
      </div>
    </div>
    </Layout>
  );
};

export default ProductDetail;
