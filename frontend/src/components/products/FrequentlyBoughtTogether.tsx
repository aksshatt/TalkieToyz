import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import axios from '../../config/axios';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface FrequentlyBoughtTogetherProps {
  productSlug: string;
  currentProductName: string;
}

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ productSlug, currentProductName }) => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery({
    queryKey: ['frequently_bought_together', productSlug],
    queryFn: async () => {
      const response = await axios.get(`/products/${productSlug}/frequently_bought_together`);
      return response.data;
    },
  });

  const products = data?.data || [];

  if (isLoading || products.length === 0) return null;

  return (
    <div className="mt-10 bg-amber-50 rounded-2xl p-6 border border-amber-100">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Frequently Bought Together</h2>
      <p className="text-sm text-gray-500 mb-5">Parents who bought <span className="font-medium">{currentProductName}</span> also got:</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
            <Link to={`/products/${product.slug}`}>
              {product.image_urls?.[0] ? (
                <img src={product.image_urls[0].url} alt={product.name} className="w-full h-28 object-cover" />
              ) : (
                <div className="w-full h-28 bg-gray-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </Link>
            <div className="p-3">
              <Link to={`/products/${product.slug}`} className="text-xs font-medium text-gray-900 line-clamp-2 hover:text-indigo-600">
                {product.name}
              </Link>
              <p className="text-indigo-600 font-bold text-sm mt-1">₹{product.price}</p>
              <button
                onClick={() => dispatch(addToCart({ product_id: product.id, quantity: 1 }))}
                className="mt-2 w-full flex items-center justify-center gap-1 bg-indigo-600 text-white text-xs py-1.5 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
