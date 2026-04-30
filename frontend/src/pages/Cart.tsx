import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import Layout from '../components/layout/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import type { Coupon } from '../types/order';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, isUpdating } = useAppSelector((state) => state.cart);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const couponForm = useFormik({
    initialValues: { code: '' },
    validationSchema: Yup.object({ code: Yup.string().required('Please enter a coupon code') }),
    onSubmit: async (values) => {
      if (!cart) return;
      setValidatingCoupon(true);
      try {
        const response = await orderService.validateCoupon({ code: values.code, order_amount: parseFloat(cart.subtotal) });
        if (response.data.valid && response.data.coupon) {
          setAppliedCoupon(response.data.coupon);
          setCouponDiscount(response.data.discount || 0);
          toast.success(response.data.message || 'Coupon applied!');
          couponForm.resetForm();
        } else { toast.error(response.data.message || 'Invalid coupon code'); }
      } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to validate coupon'); }
      finally { setValidatingCoupon(false); }
    },
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, data: { quantity: newQuantity } }));
    if (appliedCoupon) { setAppliedCoupon(null); setCouponDiscount(0); toast('Re-apply your coupon after updating cart', { icon: '🏷️' }); }
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId));
    if (appliedCoupon) { setAppliedCoupon(null); setCouponDiscount(0); }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear your entire cart?')) {
      dispatch(clearCart()); setAppliedCoupon(null); setCouponDiscount(0);
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponDiscount(0); toast.success('Coupon removed'); };
  const calculateFinalTotal = () => (!cart ? 0 : parseFloat(cart.total) - couponDiscount);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-8">
          <div className="max-w-7xl mx-auto px-4 animate-pulse">
            <div className="h-10 bg-white rounded-xl mb-6 w-1/4" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl shadow-soft" />)}
              </div>
              <div className="h-96 bg-white rounded-2xl shadow-soft" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-20 px-4 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-soft p-14 text-center max-w-md w-full">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-teal-light/30 rounded-full mb-6">
              <ShoppingCart className="h-10 w-10 text-teal" />
            </motion.div>
            <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-3">Your cart is empty</h2>
            <p className="text-warmgray-500 mb-8">Add some amazing toys to get started!</p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-soft-lg">
                <ShoppingBag className="h-5 w-5" /> Browse Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero strip */}
      <div className="bg-gradient-to-r from-teal-dark via-teal to-sky px-4 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-[var(--font-family-fun)] font-bold">Shopping Cart</h1>
            <p className="text-white/75 text-sm mt-1">{cart.cart_items.length} item{cart.cart_items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <motion.button onClick={handleClearCart} disabled={isUpdating} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 text-white border border-white/30 rounded-xl hover:bg-white/25 transition-colors text-sm font-semibold backdrop-blur-sm">
            <Trash2 className="h-4 w-4" /> Clear Cart
          </motion.button>
        </div>
      </div>

      <div className="bg-cream-light min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.cart_items.map((item, i) => (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl shadow-soft p-4 sm:p-5 border border-warmgray-100">
                    <div className="flex gap-4">
                      <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                        <motion.img src={item.product.image_urls[0]?.url || '/placeholder-product.png'} alt={item.product.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                          whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.slug}`}
                          className="font-[var(--font-family-fun)] font-bold text-warmgray-900 hover:text-teal transition-colors block mb-1 line-clamp-2">
                          {item.product.name}
                        </Link>
                        {item.product_variant && <p className="text-xs text-warmgray-500 mb-2">Variant: {item.product_variant.name}</p>}

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 bg-warmgray-50 rounded-xl p-1">
                            <motion.button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1} whileTap={{ scale: 0.85 }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-soft text-teal hover:bg-teal hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                              <Minus className="h-3.5 w-3.5" />
                            </motion.button>
                            <span className="font-bold w-8 text-center text-warmgray-900 text-sm">{item.quantity}</span>
                            <motion.button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isUpdating} whileTap={{ scale: 0.85 }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-soft text-teal hover:bg-teal hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                              <Plus className="h-3.5 w-3.5" />
                            </motion.button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-warmgray-400">₹{(parseFloat(item.item_price) || 0).toFixed(2)} each</p>
                            <p className="font-[var(--font-family-fun)] font-bold text-teal text-lg">₹{(parseFloat(item.total_price) || 0).toFixed(2)}</p>
                          </div>

                          <motion.button onClick={() => handleRemoveItem(item.id)} disabled={isUpdating} whileTap={{ scale: 0.85 }}
                            className="p-2 text-coral hover:bg-coral-light/20 rounded-xl transition-colors disabled:opacity-40">
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-soft p-5 lg:sticky lg:top-24 border border-warmgray-100">
                <h2 className="font-[var(--font-family-fun)] text-xl font-bold text-warmgray-900 mb-5">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-5">
                  {appliedCoupon ? (
                    <div className="bg-teal-light/20 border-2 border-teal/30 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-teal flex-shrink-0" />
                        <div>
                          <p className="font-bold text-teal-dark text-sm">{appliedCoupon.code}</p>
                          <p className="text-xs text-teal">-₹{couponDiscount.toFixed(2)} off</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="p-1 hover:bg-teal-light/40 rounded-full text-teal">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={couponForm.handleSubmit}>
                      <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Have a coupon?</label>
                      <div className="flex gap-2">
                        <input type="text" name="code" value={couponForm.values.code} onChange={couponForm.handleChange}
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 bg-warmgray-50 focus:bg-white transition-all text-sm" />
                        <motion.button type="submit" disabled={validatingCoupon} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2.5 bg-teal-gradient text-white font-bold rounded-xl text-sm disabled:opacity-50">
                          {validatingCoupon ? '...' : 'Apply'}
                        </motion.button>
                      </div>
                      {couponForm.touched.code && couponForm.errors.code && (
                        <p className="text-coral-dark text-xs mt-1">{couponForm.errors.code}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5 mb-5 pb-5 border-b-2 border-warmgray-100 text-sm">
                  <div className="flex justify-between text-warmgray-600">
                    <span>Subtotal</span><span className="font-semibold">₹{parseFloat(cart.subtotal).toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-teal font-semibold">
                      <span>Discount</span><span>-₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-5">
                  <span className="font-bold text-warmgray-900">Total</span>
                  <span className="font-[var(--font-family-fun)] text-2xl font-bold text-teal">₹{calculateFinalTotal().toFixed(2)}</span>
                </div>

                <motion.button onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code, discount: couponDiscount } })}
                  whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-teal to-teal-dark text-white font-bold py-4 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-shadow flex items-center justify-center gap-2 mb-3">
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </motion.button>

                <Link to="/products" className="block text-center text-teal font-semibold text-sm hover:text-teal-dark transition-colors">
                  ← Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
