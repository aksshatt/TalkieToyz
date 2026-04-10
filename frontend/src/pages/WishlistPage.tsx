import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { wishlistService } from '../services/wishlistService';
import { Heart, ShoppingCart, Trash2, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    wishlistService.getWishlist()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    setRemovingId(productId);
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    } finally { setRemovingId(null); }
  };

  const handleAddToCart = async (item: any) => {
    setAddingId(item.product_id);
    try {
      await dispatch(addToCart({ product_id: item.product_id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
    finally { setAddingId(null); }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-coral-dark via-coral to-sunshine py-20 px-4">
        <motion.div className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-5%' }} />
        <motion.div className="absolute w-64 h-64 rounded-full bg-teal/15 blur-3xl pointer-events-none"
          animate={{ x: [0, -18, 0], y: [0, 26, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }} />

        {[Heart, Star, Sparkles].map((Icon, i) => (
          <motion.div key={i} className="absolute text-white/15 pointer-events-none"
            style={{ top: `${15 + i * 28}%`, left: `${8 + i * 28}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}>
            <Icon className="w-7 h-7" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Heart className="w-8 h-8 text-white fill-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4">
            My <span className="text-teal-light">Wishlist</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="text-lg text-white/85">
            {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} saved` : 'Your saved items'}
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-light min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-coral border-t-transparent mx-auto" />
              <p className="text-warmgray-500 mt-4">Loading wishlist...</p>
            </div>
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-soft p-14 text-center max-w-md mx-auto">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center justify-center w-20 h-20 bg-coral-light/30 rounded-full mb-5">
                <Heart className="h-10 w-10 text-coral" />
              </motion.div>
              <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">Your wishlist is empty</h2>
              <p className="text-warmgray-500 mb-7">Save items you love and come back to them anytime.</p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-coral to-coral-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-soft-lg">
                  <ShoppingCart className="h-5 w-5" />
                  Browse Products
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {items.map((item, i) => (
                  <motion.div key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -6, boxShadow: '0 16px 36px rgba(0,0,0,0.12)' }}
                    className="bg-white rounded-2xl overflow-hidden shadow-soft border border-warmgray-100"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/products/${item.product?.slug}`)}>
                      <motion.img
                        src={item.product?.image_url || item.product?.image_urls?.[0]?.url || '/placeholder-product.png'}
                        alt={item.product?.name}
                        className="w-full h-44 object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Remove button */}
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleRemove(item.product_id); }}
                        disabled={removingId === item.product_id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-coral hover:text-white transition-colors text-coral"
                      >
                        {removingId === item.product_id
                          ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="h-3.5 w-3.5" />
                        }
                      </motion.button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-warmgray-800 text-sm mb-1 line-clamp-2 cursor-pointer hover:text-teal transition-colors"
                        onClick={() => navigate(`/products/${item.product?.slug}`)}>
                        {item.product?.name}
                      </h3>
                      <p className="text-teal font-bold text-lg mb-3">₹{parseFloat(item.product?.price || '0').toFixed(2)}</p>
                      <motion.button
                        onClick={() => handleAddToCart(item)}
                        disabled={addingId === item.product_id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal to-teal-dark text-white text-sm font-bold rounded-xl shadow-soft hover:shadow-soft-md transition-shadow disabled:opacity-60"
                      >
                        {addingId === item.product_id
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <ShoppingCart className="h-4 w-4" />
                        }
                        {addingId === item.product_id ? 'Adding...' : 'Add to Cart'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
