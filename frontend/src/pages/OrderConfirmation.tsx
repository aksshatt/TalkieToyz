import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import orderService from '../services/orderService';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const { data, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
    }
  }, [orderId, navigate]);

  const order = data?.data;

  if (isLoading || !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce-slow">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-2">
              Order Placed Successfully! 
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase!
            </p>
          </div>

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
