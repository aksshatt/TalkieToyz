import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import type { ProductSummary } from '../../types/product';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';

interface ProductCardProps {
  product: ProductSummary;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addingRef = useRef(false);
  const imageUrl = product.image_urls?.[0]?.thumbnail_url || product.image_urls?.[0]?.url || '/placeholder-product.png';

  const categoryColors = [
    'bg-teal-gradient',
    'bg-coral-gradient',
    'bg-sunshine-gradient',
    'bg-sky-gradient',
    'bg-playful-gradient',
  ];

  const categoryColor = product.category
    ? categoryColors[product.category.id % categoryColors.length]
    : categoryColors[0]; // Default to first color if no category

  return (
    <div className="card-talkie-hover overflow-hidden animate-slide-in">
      <Link to={`/products/${product.slug}`}>
        <div className="relative overflow-hidden bg-gradient-to-br from-cream-light via-teal-light/30 to-coral-light/30">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-product.png';
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-sunshine-gradient text-warmgray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-soft animate-bounce-gentle flex items-center gap-1">
                 Featured!
              </span>
            )}
            {product.on_sale && (
              <span className="bg-coral-gradient text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-soft animate-wiggle-soft flex items-center gap-1">
                 {product.discount_percentage}% OFF
              </span>
            )}
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 bg-warmgray-800 bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-warmgray-700 text-white px-5 py-3 rounded-pill font-bold text-lg shadow-soft-lg">
                 Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900 text-lg mb-2 line-clamp-2 hover:text-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-warmgray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Category and Age Range */}
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold">
          {product.category && (
            <span className={`${categoryColor} text-white px-3 py-1.5 rounded-pill shadow-soft`}>
              {product.category.name}
            </span>
          )}
          <span className="bg-sky-gradient text-white px-3 py-1.5 rounded-pill shadow-soft">
             {product.min_age}-{product.max_age} yrs
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.average_rating)
                    ? 'text-sunshine fill-sunshine'
                    : 'text-warmgray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-warmgray-700">
            ({product.review_count})
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-[var(--font-family-fun)] font-bold text-teal">
                ₹ {parseFloat(product.price).toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="text-sm text-warmgray-500 line-through">
                  ₹ {parseFloat(product.compare_at_price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            disabled={!product.in_stock || isAddingToCart}
            className={`p-3 rounded-full transition-all ${
              product.in_stock && !isAddingToCart
                ? 'bg-teal-gradient text-white hover-lift shadow-soft hover:shadow-soft-md'
                : 'bg-warmgray-300 text-warmgray-500 cursor-not-allowed'
            }`}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              // Prevent double-clicks
              if (addingRef.current || isAddingToCart) {
                return;
              }

              addingRef.current = true;
              setIsAddingToCart(true);

              try {
                await dispatch(
                  addToCart({
                    product_id: product.id,
                    quantity: 1,
                  })
                ).unwrap();
              } catch (error) {
                // Error already handled in slice
              } finally {
                setIsAddingToCart(false);
                addingRef.current = false;
              }
            }}
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
