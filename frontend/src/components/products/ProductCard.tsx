import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import type { ProductSummary } from '../../types/product';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: ProductSummary;
}

const categoryColors = [
  'bg-teal-gradient',
  'bg-coral-gradient',
  'bg-sunshine-gradient',
  'bg-sky-gradient',
  'bg-playful-gradient',
];

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addingRef = useRef(false);
  const img = product.image_urls?.[0];
  const imageUrl = img?.thumbnail_url || img?.url || '/placeholder-product.png';
  const srcSet = img?.thumbnail_url && img?.medium_url
    ? `${img.thumbnail_url} 300w, ${img.medium_url} 600w${img.large_url ? `, ${img.large_url} 1200w` : ''}`
    : undefined;

  const categoryColor = product.category
    ? categoryColors[product.category.id % categoryColors.length]
    : categoryColors[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addingRef.current || isAddingToCart) return;
    addingRef.current = true;
    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1400);
    } catch {
      // handled in slice
    } finally {
      setIsAddingToCart(false);
      addingRef.current = false;
    }
  };

  return (
    <motion.div
      className="card-talkie-hover overflow-hidden group relative bg-white"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(0,0,0,0.14)' }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Image area */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden bg-gradient-to-br from-cream-light via-teal-light/20 to-coral-light/20">
        <motion.div
          className="w-full h-48"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <img
            src={imageUrl}
            srcSet={srcSet}
            sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover"
            onError={(e) => { e.currentTarget.src = '/placeholder-product.png'; }}
          />
        </motion.div>

        {/* Quick-view button */}
        <motion.div
          className="absolute inset-0 bg-warmgray-900/20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: isHovered ? 1 : 0.7, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1.5 text-sm font-semibold text-warmgray-800 shadow-soft-lg"
          >
            <Eye className="w-4 h-4" />
            Quick View
          </motion.div>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <AnimatePresence>
            {product.featured && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-sunshine-gradient text-warmgray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-soft flex items-center gap-1"
              >
                Featured
              </motion.span>
            )}
            {product.on_sale && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="bg-coral-gradient text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-soft flex items-center gap-1"
              >
                {product.discount_percentage}% OFF
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Low stock badge */}
        {product.in_stock && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 bg-warmgray-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full"
          >
            Only {product.stock_quantity} left!
          </motion.div>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-warmgray-800/70 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-warmgray-700 text-white px-5 py-3 rounded-full font-bold text-lg shadow-soft-lg">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-lg mb-1.5 line-clamp-2 hover:text-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-warmgray-500 mb-3 line-clamp-2">{product.description}</p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {product.category && (
            <span className={`${categoryColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-soft`}>
              {product.category.name}
            </span>
          )}
          {product.min_age != null && product.max_age != null && (
            <span className="bg-sky-gradient text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-soft">
              {product.min_age}–{product.max_age} yrs
            </span>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.average_rating) ? 'text-sunshine fill-sunshine' : 'text-warmgray-200 fill-warmgray-200'}`} />
            ))}
          </div>
          <span className="text-xs font-semibold text-warmgray-500">({product.review_count ?? 0})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xl font-[var(--font-family-fun)] font-bold text-teal">
              ₹{parseFloat(product.price).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-warmgray-400 line-through ml-1.5">
                ₹{parseFloat(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>

          <motion.button
            disabled={!product.in_stock || isAddingToCart}
            onClick={handleAddToCart}
            whileHover={{ scale: product.in_stock ? 1.1 : 1 }}
            whileTap={{ scale: product.in_stock ? 0.92 : 1 }}
            className={`relative p-3 rounded-full transition-all overflow-hidden ${
              product.in_stock && !isAddingToCart
                ? 'bg-teal-gradient text-white shadow-soft hover:shadow-soft-md'
                : 'bg-warmgray-200 text-warmgray-400 cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              {addedFeedback ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center text-sm"
                >
                  ✓
                </motion.span>
              ) : isAddingToCart ? (
                <motion.div key="spin" className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <ShoppingCart className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
            {addedFeedback && <span className="w-6 h-6 block opacity-0" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
