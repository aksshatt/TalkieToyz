import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { wishlistService } from '../services/wishlistService';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wishlistService.getWishlist()
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({ product_id: item.product_id, quantity: 1 }));
    toast.success('Added to cart!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-7 w-7 text-coral fill-coral" />
            <h1 className="heading-talkie">My Wishlist</h1>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="card-talkie p-12 text-center">
              <Heart className="h-16 w-16 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-600 mb-4">Your wishlist is empty.</p>
              <button onClick={() => navigate('/products')} className="btn-primary-talkie">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="card-talkie p-4">
                  <img
                    src={item.product?.image_url || '/placeholder-product.png'}
                    alt={item.product?.name}
                    className="w-full h-48 object-cover rounded-xl mb-3 cursor-pointer"
                    onClick={() => navigate(`/products/${item.product?.slug}`)}
                  />
                  <h3
                    className="font-semibold text-warmgray-800 mb-1 cursor-pointer hover:text-teal"
                    onClick={() => navigate(`/products/${item.product?.slug}`)}
                  >
                    {item.product?.name}
                  </h3>
                  <p className="text-teal font-bold mb-3">₹{item.product?.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-teal-gradient text-white text-sm font-semibold rounded-lg"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="p-2 hover:bg-coral-light/30 rounded-lg text-coral"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;
