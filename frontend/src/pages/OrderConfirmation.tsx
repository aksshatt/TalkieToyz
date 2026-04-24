import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import orderService from '../services/orderService';

const CONFETTI_COLORS = ['#4DD0E1', '#FF85C0', '#FFD54F', '#4FC3F7', '#FF69B4', '#26C6DA', '#FFC107'];

const ConfettiBurst = () => {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.6,
    duration: 1.4 + Math.random() * 1,
    rotate: Math.random() * 360,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ left: p.left, width: p.size, height: p.size, background: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawOrderId = location.state?.orderId;
  const parsedOrderId = typeof rawOrderId === 'number' ? rawOrderId : parseInt(String(rawOrderId ?? ''), 10);
  const orderId = Number.isFinite(parsedOrderId) && parsedOrderId > 0 ? parsedOrderId : null;
  const [showConfetti, setShowConfetti] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
    }
  }, [orderId, navigate]);

  useEffect(() => {
    if (orderId) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(t);
    }
  }, [orderId]);

  const order = data?.data;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">Could not load order details.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AnimatePresence>{showConfetti && <ConfettiBurst />}</AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-teal-light/20 via-white to-coral-light/20 py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-teal-light/40 rounded-full mb-6 relative"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CheckCircle className="h-16 w-16 text-teal" />
              {[1,2].map(r => (
                <motion.div key={r} className="absolute inset-0 rounded-full border-2 border-teal/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5 + r * 0.3, opacity: 0 }}
                  transition={{ duration: 1.5, delay: r * 0.3, repeat: Infinity }}
                />
              ))}
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-xl text-warmgray-600">
              Thank you for your purchase!
            </p>
          </motion.div>

          {/* Order Details Card */}
          <div className="bg-white rounded-3xl p-8 shadow-playful mb-6">
            {/* Order Number */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-3xl font-bold text-purple-600">
                #{order.order_number}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Order Date:{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Payment Status */}
            <div className="mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-700 font-semibold mb-1">
                  {order.payment_method === 'razorpay'
                    ? '💳 Payment Successful'
                    : '💵 Cash on Delivery'}
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{parseFloat(order.total).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Items
              </h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={
                        item.product.image_urls[0]?.url ||
                        '/placeholder-product.png'
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.product.name}
                      </p>
                      {item.product_variant && (
                        <p className="text-sm text-gray-600">
                          Variant: {item.product_variant.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-purple-600">
                      ₹{parseFloat(item.total_price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3">
                Delivery Address
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold">{order.shipping_address.name}</p>
                <p className="text-sm text-gray-700">
                  {order.shipping_address.phone}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {order.shipping_address.address_line_1}
                </p>
                {order.shipping_address.address_line_2 && (
                  <p className="text-sm text-gray-700">
                    {order.shipping_address.address_line_2}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  {order.shipping_address.city},{' '}
                  {order.shipping_address.state} -{' '}
                  {order.shipping_address.postal_code}
                </p>
                <p className="text-sm text-gray-700">
                  {order.shipping_address.country}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{parseFloat(order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{parseFloat(order.shipping_cost).toFixed(2)}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-purple-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span className="text-purple-600">
                    ₹{parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-white rounded-3xl p-8 shadow-playful mb-6">
            <h2 className="text-2xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-4">
              What happens next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Order Confirmation Email
                  </p>
                  <p className="text-sm text-gray-600">
                    We've sent you an email with your order details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    Order Processing
                  </p>
                  <p className="text-sm text-gray-600">
                    We'll prepare your items for shipment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Shipping</p>
                  <p className="text-sm text-gray-600">
                    You'll receive tracking information once shipped
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Delivery</p>
                  <p className="text-sm text-gray-600">
                    Enjoy your new TalkieToys!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/orders"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
            >
              <Package className="h-5 w-5" />
              View Order Details
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all border-2 border-purple-200"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
