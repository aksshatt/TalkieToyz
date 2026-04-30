import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, X, RefreshCw, ChevronDown, Truck, ExternalLink, Calendar, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import orderService from '../services/orderService';
import type { Order, OrderStatus, OrderItem } from '../types/order';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending:    { bg: 'bg-sunshine-light/60', text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Pending' },
  confirmed:  { bg: 'bg-sky-light/60',     text: 'text-sky-700',    dot: 'bg-sky',         label: 'Confirmed' },
  processing: { bg: 'bg-purple-50',         text: 'text-purple-700', dot: 'bg-purple-400',  label: 'Processing' },
  shipped:    { bg: 'bg-blue-50',           text: 'text-blue-700',   dot: 'bg-blue-500',    label: 'Shipped' },
  delivered:  { bg: 'bg-teal-light/40',    text: 'text-teal-dark',  dot: 'bg-teal',        label: 'Delivered' },
  cancelled:  { bg: 'bg-coral-light/40',   text: 'text-coral-dark', dot: 'bg-coral',       label: 'Cancelled' },
  refunded:   { bg: 'bg-warmgray-100',     text: 'text-warmgray-600', dot: 'bg-warmgray-400', label: 'Refunded' },
};

const ALL_STATUSES: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderHistory = () => {
  const dispatch = useAppDispatch();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => orderService.getOrders({ status: statusFilter === 'all' ? undefined : statusFilter, per_page: 50 }),
  });

  const orders = data?.data?.orders || [];

  const toggleOrderExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) newExpanded.delete(orderId); else newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  const handleReorder = async (order: Order) => {
    try {
      for (const item of order.order_items) {
        await dispatch(addToCart({ product_id: item.product.id, quantity: item.quantity, product_variant_id: item.product_variant?.id, silent: true })).unwrap();
      }
      toast.success('Items added to cart!');
    } catch { toast.error('Failed to add items to cart'); }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Cancel this order? This cannot be undone.')) return;
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled');
      refetch();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to cancel order'); }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-8">
          <div className="max-w-5xl mx-auto px-4 animate-pulse space-y-4">
            <div className="h-10 bg-white rounded-2xl w-1/3" />
            {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl shadow-soft" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-16 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-12 shadow-soft text-center max-w-sm">
            <X className="h-14 w-14 mx-auto mb-4 text-coral" />
            <h2 className="text-xl font-bold text-warmgray-800 mb-2">Something went wrong</h2>
            <p className="text-warmgray-500 mb-6 text-sm">{error instanceof Error ? error.message : 'Failed to load orders'}</p>
            <button onClick={() => refetch()} className="bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-6 py-3 rounded-xl">Try Again</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero strip */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-14 px-4">
        <motion.div className="absolute w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 25, 0], y: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', right: '10%' }} />
        <div className="relative z-10 max-w-5xl mx-auto text-white flex items-center gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl font-[var(--font-family-fun)] font-bold">My Orders</h1>
            <p className="text-white/75 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 36C240 12 480 0 720 0C960 0 1200 12 1440 36H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-light min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Status filter pills */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 flex-wrap mb-6">
            {ALL_STATUSES.map(status => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border-2 ${
                  statusFilter === status
                    ? 'bg-teal-gradient text-white border-transparent shadow-soft'
                    : 'bg-white text-warmgray-600 border-warmgray-200 hover:border-teal'
                }`}>
                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </motion.div>

          {orders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-14 shadow-soft text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-warmgray-300" />
              <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">No orders found</h2>
              <p className="text-warmgray-500 mb-7">{statusFilter === 'all' ? "You haven't placed any orders yet" : `No ${statusFilter} orders`}</p>
              <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark text-white font-bold px-6 py-3 rounded-2xl shadow-soft">
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order, i: number) => {
                const isExpanded = expandedOrders.has(order.id);
                const st = STATUS_STYLES[order.status as OrderStatus] || STATUS_STYLES.pending;
                return (
                  <motion.div key={order.id} layout
                    initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl shadow-soft border border-warmgray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-warmgray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900">Order #{order.order_number}</h3>
                          <p className="text-xs text-warmgray-400 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-warmgray-500">{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</span>
                          <span className="font-[var(--font-family-fun)] font-bold text-teal text-lg">₹{parseFloat(order.total).toFixed(2)}</span>
                          <span className="text-xs bg-warmgray-100 text-warmgray-600 px-2 py-0.5 rounded-full font-medium">
                            {order.payment_method === 'razorpay' ? 'Online' : 'COD'}
                          </span>
                        </div>
                        <motion.button onClick={() => toggleOrderExpand(order.id)} whileTap={{ scale: 0.94 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-teal hover:bg-teal-light/20 rounded-xl transition-colors text-sm font-semibold">
                          {isExpanded ? 'Hide' : 'Details'}
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                          className="overflow-hidden bg-warmgray-50/50">
                          <div className="p-5 space-y-5">
                            {/* Items */}
                            <div>
                              <h4 className="font-bold text-warmgray-800 text-sm mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.order_items.map((item: OrderItem) => (
                                  <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-soft">
                                    <img src={item.product.image_urls[0]?.url || '/placeholder-product.png'} alt={item.product.name}
                                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <Link to={`/products/${item.product.slug}`} className="font-semibold text-warmgray-800 hover:text-teal transition-colors text-sm line-clamp-1">
                                        {item.product.name}
                                      </Link>
                                      <p className="text-xs text-warmgray-400">Qty: {item.quantity} × ₹{parseFloat(item.unit_price).toFixed(2)}</p>
                                    </div>
                                    <p className="font-bold text-teal text-sm">₹{parseFloat(item.total_price).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-bold text-warmgray-800 text-sm mb-2">Delivery Address</h4>
                              <div className="bg-white rounded-xl p-4 shadow-soft text-sm text-warmgray-600 leading-relaxed">
                                <p className="font-semibold text-warmgray-800">{order.shipping_address.name}</p>
                                <p>{order.shipping_address.phone}</p>
                                <p>{order.shipping_address.address_line_1}{order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ''}</p>
                                <p>{order.shipping_address.city}, {order.shipping_address.state} – {order.shipping_address.postal_code}</p>
                              </div>
                            </div>

                            {/* Tracking */}
                            {(order.tracking_url || order.tracking_number || order.shipment) && (
                              <div>
                                <h4 className="font-bold text-warmgray-800 text-sm mb-2 flex items-center gap-1.5">
                                  <Truck className="h-4 w-4 text-teal" /> Tracking
                                </h4>
                                <div className="bg-white rounded-xl p-4 shadow-soft space-y-2 text-sm">
                                  {order.tracking_url ? (
                                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-teal font-semibold hover:text-teal-dark">
                                      <ExternalLink className="h-4 w-4" /> Track Your Order
                                    </a>
                                  ) : order.tracking_number ? (
                                    <p className="flex items-center gap-2 text-warmgray-600">
                                      <Eye className="h-4 w-4" /> <span className="font-mono font-semibold">{order.tracking_number}</span>
                                    </p>
                                  ) : null}
                                  {order.shipment && (
                                    <p className="text-warmgray-600"><span className="font-semibold">{order.shipment.courier_name}</span> · {order.shipment.status}</p>
                                  )}
                                  {order.estimated_delivery && (
                                    <p className="flex items-center gap-1.5 text-warmgray-600">
                                      <Calendar className="h-3.5 w-3.5" /> Est. delivery: <span className="font-semibold">{order.estimated_delivery}</span>
                                    </p>
                                  )}
                                  {order.delivered_at && (
                                    <p className="text-teal font-semibold">Delivered on {new Date(order.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Price summary */}
                            <div>
                              <h4 className="font-bold text-warmgray-800 text-sm mb-2">Price Details</h4>
                              <div className="bg-white rounded-xl p-4 shadow-soft text-sm space-y-1.5">
                                <div className="flex justify-between text-warmgray-600"><span>Subtotal</span><span>₹{parseFloat(order.subtotal).toFixed(2)}</span></div>
                                <div className="flex justify-between text-warmgray-600"><span>Shipping</span><span>₹{parseFloat(order.shipping_cost).toFixed(2)}</span></div>
                                {parseFloat(order.discount) > 0 && (
                                  <div className="flex justify-between text-teal font-semibold"><span>Discount</span><span>-₹{parseFloat(order.discount).toFixed(2)}</span></div>
                                )}
                                <div className="border-t-2 border-warmgray-100 pt-2 flex justify-between font-bold">
                                  <span>Total</span><span className="text-teal text-lg">₹{parseFloat(order.total).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                              <Link to={`/orders/${order.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal to-teal-dark text-white font-semibold rounded-xl text-sm shadow-soft">
                                <Truck className="h-4 w-4" />
                                {order.status === 'shipped' || order.status === 'delivered' ? 'Track Order' : 'View Details'}
                              </Link>
                              <motion.button onClick={() => handleReorder(order)} whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-teal-light/30 text-teal-dark font-semibold rounded-xl text-sm hover:bg-teal-light/50 transition-colors">
                                <RefreshCw className="h-4 w-4" /> Reorder
                              </motion.button>
                              {(order.status === 'pending' || order.status === 'confirmed') && (
                                <motion.button onClick={() => handleCancelOrder(order.id)} whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-coral-light/30 text-coral-dark font-semibold rounded-xl text-sm hover:bg-coral-light/50 transition-colors">
                                  <X className="h-4 w-4" /> Cancel
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
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
