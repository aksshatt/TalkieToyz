import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, X, RefreshCw, ChevronDown, Truck, ExternalLink, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import orderService from '../services/orderService';
import type { Order, OrderStatus, OrderItem } from '../types/order';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const statusColors: Record<
  OrderStatus,
  { bg: string; text: string; badge: string }
> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: '⏳' },
  confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', badge: '✅' },
  processing: { bg: 'bg-purple-100', text: 'text-purple-800', badge: '📦' },
  shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', badge: '🚚' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800', badge: '' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', badge: '❌' },
  refunded: { bg: 'bg-gray-100', text: 'text-gray-800', badge: '💰' },
};

const OrderHistory = () => {
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(
    new Set()
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () =>
      orderService.getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        per_page: 50,
      }),
  });

  const orders = data?.data?.orders || [];

  const toggleOrderExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.order_items) {
        await dispatch(
          addToCart({
            product_id: item.product.id,
            quantity: item.quantity,
            product_variant_id: item.product_variant?.id,
          })
        ).unwrap();
      }
      toast.success('Items added to cart!');
    } catch (error) {
      toast.error('Failed to add items to cart');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (
      window.confirm(
        'Are you sure you want to cancel this order? This action cannot be undone.'
      )
    ) {
      try {
        await orderService.cancelOrder(orderId);
        toast.success('Order cancelled successfully');
        refetch();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to cancel order'
        );
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-12 bg-white rounded-lg mb-8 w-1/4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-white rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-playful">
              <p className="text-6xl mb-4">😕</p>
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'Failed to load orders'}
              </p>
              <button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Package className="h-10 w-10 text-purple-600" />
              My Orders
            </h1>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as OrderStatus | 'all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-purple-500 text-white shadow-playful'
                      : 'bg-white text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-playful text-center">
              <p className="text-6xl mb-4">📦</p>
              <h2 className="text-3xl font-[var(--font-family-fun)] font-bold text-gray-800 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600 mb-6">
                {statusFilter === 'all'
                  ? "You haven't placed any orders yet"
                  : `No ${statusFilter} orders found`}
              </p>
              <Link
                to="/products"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl shadow-playful hover:shadow-playful-hover transform hover:scale-105 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => {
                const isExpanded = expandedOrders.has(order.id);
                const statusStyle = statusColors[order.status as OrderStatus];

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-playful overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b-2 border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on{' '}
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <span>{statusStyle.badge}</span>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div>
                            <span className="text-gray-600">Items: </span>
                            <span className="font-semibold">
                              {order.order_items.length}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Total: </span>
                            <span className="font-bold text-purple-600 text-lg">
                              ₹{parseFloat(order.total).toFixed(2)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Payment: </span>
                            <span className="font-semibold">
                              {order.payment_method === 'razorpay'
                                ? 'Online'
                                : 'COD'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleOrderExpand(order.id)}
                          className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-semibold"
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="p-6 bg-gray-50">
                        {/* Order Items */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-800 mb-3">
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.order_items.map((item: OrderItem) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 bg-white rounded-lg p-4"
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
                                  <Link
                                    to={`/products/${item.product.slug}`}
                                    className="font-semibold text-gray-800 hover:text-purple-600 transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                  {item.product_variant && (
                                    <p className="text-sm text-gray-600">
                                      Variant: {item.product_variant.name}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} × ₹
                                    {parseFloat(item.unit_price).toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-bold text-purple-600">
                                  ₹{parseFloat(item.total_price).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-800 mb-3">
                            Shipping Address
                          </h4>
                          <div className="bg-white rounded-lg p-4 text-sm">
                            <p className="font-semibold">
                              {order.shipping_address.name}
                            </p>
                            <p>{order.shipping_address.phone}</p>
                            <p>{order.shipping_address.address_line_1}</p>
                            {order.shipping_address.address_line_2 && (
                              <p>{order.shipping_address.address_line_2}</p>
                            )}
                            <p>
                              {order.shipping_address.city},{' '}
                              {order.shipping_address.state} -{' '}
                              {order.shipping_address.postal_code}
                            </p>
                            <p>{order.shipping_address.country}</p>
                          </div>
                        </div>

                        {/* Tracking & Shipment Info */}
                        {(order.tracking_url || order.tracking_number || order.shipment) && (
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                              <Truck className="h-5 w-5 text-purple-600" />
                              Tracking & Shipment
                            </h4>
                            <div className="bg-white rounded-lg p-4 space-y-3">
                              {order.tracking_url ? (
                                <a
                                  href={order.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Track Your Order
                                </a>
                              ) : order.tracking_number ? (
                                <div className="flex items-center gap-2 text-sm">
                                  <Eye className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Tracking:</span>
                                  <span className="font-mono font-semibold">{order.tracking_number}</span>
                                </div>
                              ) : null}

                              {order.shipment && (
                                <>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Truck className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Courier:</span>
                                    <span className="font-semibold">{order.shipment.courier_name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-semibold">{order.shipment.status}</span>
                                  </div>
                                </>
                              )}

                              {order.estimated_delivery && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-600">Estimated Delivery:</span>
                                  <span className="font-semibold">{order.estimated_delivery}</span>
                                </div>
                              )}

                              {order.shipped_at && (
                                <div className="text-sm text-gray-600">
                                  Shipped on {new Date(order.shipped_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </div>
                              )}

                              {order.delivered_at && (
                                <div className="text-sm text-green-600 font-semibold">
                                  ✓ Delivered on {new Date(order.delivered_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Refund Info */}
                        {order.refund_status && order.refund_status !== 'no_refund' && (
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-800 mb-3">
                              Refund Information
                            </h4>
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  order.refund_status === 'refund_completed'
                                    ? 'bg-green-100 text-green-800'
                                    : order.refund_status === 'refund_failed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.refund_status.replace('refund_', '').replace('_', ' ').charAt(0).toUpperCase() + order.refund_status.replace('refund_', '').replace('_', ' ').slice(1)}
                                </span>
                              </div>
                              {order.refund_amount && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">Amount:</span>
                                  <span className="font-bold text-green-600">₹{parseFloat(order.refund_amount).toFixed(2)}</span>
                                </div>
                              )}
                              {order.refunded_at && (
                                <div className="text-sm text-gray-600">
                                  Processed on {new Date(order.refunded_at).toLocaleDateString('en-IN')}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="mb-6">
                          <h4 className="font-bold text-gray-800 mb-3">
                            Price Details
                          </h4>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>
                                ₹{parseFloat(order.subtotal).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>₹{parseFloat(order.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>
                                ₹{parseFloat(order.shipping_cost).toFixed(2)}
                              </span>
                            </div>
                            {parseFloat(order.discount) > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>
                                  -₹{parseFloat(order.discount).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <div className="border-t-2 border-gray-100 pt-2 flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-purple-600">
                                ₹{parseFloat(order.total).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Reorder
                          </button>

                          {(order.status === 'pending' ||
                            order.status === 'confirmed') && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
