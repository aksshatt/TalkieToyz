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
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="hover:text-teal transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/products" className="hover:text-teal transition-colors">
                Products
              </Link>
            </li>
            {product.category && (
              <>
                <li>/</li>
                <li>
                  <Link
                    to={`/products?category=${product.category.slug}`}
                    className="hover:text-teal transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="bg-gray-50 p-8">
              <ImageGallery images={product.image_urls} productName={product.name} />
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 mb-3">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      Featured Product
                    </span>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  {product.category && (
                    <Link
                      to={`/products?category=${product.category.slug}`}
                      className="inline-flex items-center text-sm text-teal hover:text-teal-dark font-medium"
                    >
                      {product.category.name}
                    </Link>
                  )}
                </div>
                <button className="p-2.5 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all">
                  <Heart className="h-5 w-5 text-gray-400 hover:text-pink-500" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.average_rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {product.average_rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">
                  ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{parseFloat(product.compare_at_price).toFixed(2)}
                      </span>
                      <span className="inline-flex items-center bg-red-50 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-md border border-red-200">
                        Save {product.discount_percentage}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                {product.category && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
                    <p className="font-semibold text-gray-900 mt-1">{product.category.name}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Age Range</span>
                  <p className="font-semibold text-gray-900 mt-1">
                    {product.min_age}-{product.max_age} years
                  </p>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.in_stock ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200 w-fit">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">In Stock</span>
                    <span className="text-xs text-green-600">({product.stock_quantity} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-md border border-red-200 w-fit">
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.in_stock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 w-fit border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="text-base font-semibold min-w-[3rem] text-center text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock_quantity}
                      className="p-3 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                disabled={!product.in_stock || isAddingToCart}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all mb-4 ${
                  product.in_stock && !isAddingToCart
                    ? 'bg-teal text-white hover:bg-teal-dark shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                <ShoppingCart className="h-5 w-5" />
                {isAddingToCart ? 'Adding...' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6 space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center">
                    <Truck className="h-4 w-4 text-teal" />
                  </div>
                  <span>Free shipping on orders over ₹2000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 text-teal" />
                  </div>
                  <span>30-day hassle-free returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-teal" />
                  </div>
                  <span>Quality guaranteed</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Share:</span>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="p-2 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-gray-400 hover:text-green-600" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Share2 className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-teal text-teal bg-teal/5'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.long_description || product.description}
                </p>

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <>
                    <h4 className="text-xl font-bold text-gray-900 mt-8 mb-4">Specifications</h4>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                          <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {key.replace(/_/g, ' ')}
                          </dt>
                          <dd className="text-sm text-gray-900 font-semibold">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
              </div>
            )}

            {activeTab === 'speech-goals' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Speech & Language Goals</h3>
                {product.speech_goals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.speech_goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="border border-gray-200 rounded-lg p-5 hover:border-teal hover:bg-teal/5 transition-all"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 text-base">
                          {goal.name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specific speech goals listed for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'usage-tips' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Usage Tips</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                      <span className="text-teal font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Begin with simple activities and gradually increase complexity as the child becomes more comfortable with the toy.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                      <span className="text-teal font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Engagement Tips</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Use the toy during regular playtime to make speech practice feel natural and fun.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center">
                      <span className="text-teal font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Consistent daily practice for 15-20 minutes yields the best results.
                      </p>
                    </div>
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
