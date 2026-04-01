import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed';

const RecentlyViewed = () => {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="py-10 bg-white border-t border-warmgray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warmgray-400" />
            <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800">Recently Viewed</h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-teal font-semibold text-sm hover:text-teal-dark transition-colors">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((product, i) => {
            const imageUrl = product.image_urls?.[0]?.thumbnail_url || product.image_urls?.[0]?.url || '/placeholder-product.png';
            return (
              <motion.div key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="flex-shrink-0 w-36 sm:w-44"
              >
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="rounded-xl overflow-hidden mb-2 bg-warmgray-50">
                    <motion.img src={imageUrl} alt={product.name}
                      className="w-full h-32 sm:h-36 object-cover"
                      whileHover={{ scale: 1.07 }} transition={{ duration: 0.35 }}
                    />
                  </div>
                  <p className="text-xs font-semibold text-warmgray-700 line-clamp-2 leading-tight mb-1">{product.name}</p>
                  <p className="text-sm font-bold text-teal">₹{parseFloat(product.price).toFixed(2)}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
