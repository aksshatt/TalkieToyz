import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { ProductSummary } from '../../types/product';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface Props {
  product: ProductSummary | null;
  onClose: () => void;
}

const QuickAddModal = ({ product, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const img = product.image_urls?.[0]?.medium_url || product.image_urls?.[0]?.url || '/placeholder-product.png';
  const max = product.stock_quantity || 99;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: qty })).unwrap();
      toast.success(`${product.name} added to cart`);
      onClose();
    } catch {
      // handled in slice
    } finally {
      setAdding(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-warmgray-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-soft-xl overflow-hidden"
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-soft hover:bg-white flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-warmgray-700" />
            </button>
            <div className="aspect-video bg-cream-light overflow-hidden">
              <img src={img} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-extrabold text-xl text-warmgray-900 mb-1 line-clamp-2">{product.name}</h3>
            {product.category && (
              <p className="text-xs text-warmgray-500 mb-3">{product.category.name}</p>
            )}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-2xl font-extrabold text-teal">₹{product.price}</span>
              {product.on_sale && product.compare_at_price && (
                <span className="text-sm line-through text-warmgray-400">₹{product.compare_at_price}</span>
              )}
            </div>

            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-bold text-warmgray-700">Quantity</span>
              <div className="inline-flex items-center border-2 border-warmgray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="p-2.5 hover:bg-warmgray-50 disabled:opacity-30"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-bold text-warmgray-900 min-w-[2.5rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(max, q + 1))}
                  disabled={qty >= max}
                  className="p-2.5 hover:bg-warmgray-50 disabled:opacity-30"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!product.in_stock || adding}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-extrabold transition-all ${
                  product.in_stock && !adding
                    ? 'bg-teal-gradient text-white shadow-soft-md hover:shadow-soft-lg'
                    : 'bg-warmgray-200 text-warmgray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding...' : product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1 px-5 py-3.5 rounded-full font-bold border-2 border-warmgray-300 text-warmgray-700 hover:border-teal hover:text-teal transition-all"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickAddModal;
