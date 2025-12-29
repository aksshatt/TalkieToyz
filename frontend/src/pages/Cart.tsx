import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice';
import Layout from '../components/layout/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import type { Coupon } from '../types/order';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, isUpdating } = useAppSelector((state) => state.cart);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const couponForm = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Please enter a coupon code'),
    }),
    onSubmit: async (values) => {
      if (!cart) return;

      setValidatingCoupon(true);
      try {
        const response = await orderService.validateCoupon({
          code: values.code,
          order_amount: parseFloat(cart.subtotal),
        });

        if (response.data.valid && response.data.coupon) {
          setAppliedCoupon(response.data.coupon);
          setCouponDiscount(response.data.discount || 0);
          toast.success(response.data.message || 'Coupon applied successfully!');
          couponForm.resetForm();
        } else {
          toast.error(response.data.message || 'Invalid coupon code');
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to validate coupon'
        );
      } finally {
        setValidatingCoupon(false);
      }
    },
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, data: { quantity: newQuantity } }));
  };

  const handleRemoveItem = (itemId: number) => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeFromCart(itemId));
      // Remove coupon if cart becomes empty
      if (cart?.cart_items.length === 1) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    }
  };

  const handleClearCart = () => {
    if (
      window.confirm('Are you sure you want to clear your entire cart?')
    ) {
      dispatch(clearCart());
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.success('Coupon removed');
  };

  const calculateFinalTotal = () => {
    if (!cart) return 0;
    const total = parseFloat(cart.total);
    return total - couponDiscount;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-white rounded-lg mb-8 w-1/4"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-white rounded-2xl"
                    ></div>
                  ))}
                </div>
                <div className="h-96 bg-white rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-playful">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-4xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Let's fill it with some awesome toys!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
              >
                <ShoppingBag className="h-6 w-6" />
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <span className="text-4xl sm:text-5xl">🛒</span>
              <span className="break-words">Shopping Cart</span>
            </h1>
            <button
              onClick={handleClearCart}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 px-3 sm:px-4 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Clear Cart</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cart_items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-playful"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.product.image_urls[0]?.url ||
                          '/placeholder-product.png'
                        }
                        alt={item.product.name}
                        className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="text-lg sm:text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors block mb-2 line-clamp-2"
                      >
                        {item.product.name}
                      </Link>

                      {item.product_variant && (
                        <p className="text-sm text-gray-600 mb-2">
                          Variant: {item.product_variant.name}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4 text-purple-600" />
                          </button>
                          <span className="text-lg font-bold w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={isUpdating}
                            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4 text-purple-600" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex-1 sm:text-right">
                          <p className="text-sm text-gray-600">
                            ₹ {parseFloat(item.item_price).toFixed(2)} each
                          </p>
                          <p className="text-xl font-bold text-purple-600">
                            ₹ {parseFloat(item.total_price).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-center"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-playful lg:sticky lg:top-24">
                <h2 className="text-xl sm:text-2xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                {/* Coupon Section */}
                <div className="mb-6">
                  {appliedCoupon ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-bold text-green-700">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-green-600">
                            Discount: ₹{couponDiscount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="p-1 hover:bg-green-100 rounded-full"
                      >
                        <X className="h-5 w-5 text-green-600" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={couponForm.handleSubmit}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Have a coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="code"
                          value={couponForm.values.code}
                          onChange={couponForm.handleChange}
                          onBlur={couponForm.handleBlur}
                          placeholder="Enter code"
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={validatingCoupon}
                          className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {validatingCoupon ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                      {couponForm.touched.code && couponForm.errors.code && (
                        <p className="text-red-600 text-sm mt-1">
                          {couponForm.errors.code}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹{parseFloat(cart.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">
                      ₹{parseFloat(cart.tax_amount).toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -₹{couponDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg sm:text-xl font-bold text-gray-800">
                    Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-[var(--font-family-fun)] font-bold text-purple-600">
                    ₹ {calculateFinalTotal().toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() =>
                    navigate('/checkout', {
                      state: {
                        couponCode: appliedCoupon?.code,
                        discount: couponDiscount,
                      },
                    })
                  }
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all text-sm sm:text-base"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center text-purple-600 font-semibold mt-4 hover:text-purple-700 transition-colors text-sm sm:text-base"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
