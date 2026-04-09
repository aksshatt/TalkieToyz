import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Star, ChevronRight, Tag, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { bundlesService, Bundle } from '../services/bundlesService';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const SPEECH_GOAL_FILTERS = ['All', 'Articulation', 'Vocabulary', 'Fluency', 'Social Communication'];

const BundleCard: React.FC<{ bundle: Bundle }> = ({ bundle }) => {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAddAllToCart = () => {
    bundle.products.forEach(p => dispatch(addToCart({ product_id: p.id, quantity: 1 })));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Bundle Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 opacity-80" />
              <span className="text-xs font-medium opacity-80">Speech Kit</span>
            </div>
            <h3 className="text-lg font-bold">{bundle.name}</h3>
            {bundle.speech_goal && (
              <span className="inline-block mt-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">{bundle.speech_goal}</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75 line-through">₹{bundle.original_price}</p>
            <p className="text-2xl font-bold">₹{bundle.discounted_price}</p>
            <span className="inline-block text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full mt-1">
              Save {bundle.discount_percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Products in Bundle */}
      <div className="p-4">
        {bundle.description && (
          <p className="text-sm text-gray-500 mb-4">{bundle.description}</p>
        )}

        <div className="space-y-2 mb-4">
          {bundle.products.map((product, idx) => (
            <div key={product.id} className="flex items-center gap-3 py-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 hover:text-indigo-600 line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-500">₹{product.price}</p>
              </div>
              {product.stock_quantity > 0 ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <span className="text-xs text-red-400">OOS</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">You save</p>
            <p className="font-bold text-green-600">₹{bundle.savings}</p>
          </div>
          <button
            onClick={handleAddAllToCart}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              added
                ? 'bg-green-100 text-green-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {added ? (
              <><CheckCircle className="w-4 h-4" /> Added!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> Add Kit to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BundleBuilderPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['bundles'],
    queryFn: () => bundlesService.getBundles(),
  });

  const allBundles: Bundle[] = data?.data || [];
  const bundles = selectedGoal === 'All' ? allBundles : allBundles.filter(b => b.speech_goal === selectedGoal);

  return (
    <Layout>
      <SEO url="/speech-kits" />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Tag className="w-4 h-4" /> Curated Speech Kits
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Speech Kits</h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Expertly curated bundles designed by our speech therapists — get everything your child needs at a discounted price.
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {SPEECH_GOAL_FILTERS.map(goal => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedGoal === goal
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-400'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-72" />)}
            </div>
          ) : bundles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 mb-1">No Speech Kits Yet</h3>
              <p className="text-sm text-gray-400 mb-4">Our therapist team is curating bundles for you. Check back soon!</p>
              <Link to="/products" className="text-indigo-600 font-medium text-sm hover:underline">
                Browse all products <ChevronRight className="inline w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bundles.map(bundle => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BundleBuilderPage;
