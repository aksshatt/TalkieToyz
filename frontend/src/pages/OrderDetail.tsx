import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  RefreshCw,
  ExternalLink,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/layout/Layout';
import orderService from '../services/orderService';
import type { Order, OrderStatus, OrderItem } from '../types/order';
import toast from 'react-hot-toast';

const TRACKING_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const;

function getActiveStepIndex(order: Order): number {
  if (order.status === 'cancelled' || order.status === 'refunded') return -1;

  // Check shipment status for "Out for Delivery"
  const shipmentStatus = order.shipment?.status;
  if (order.status === 'delivered') return 5;
  if (shipmentStatus === 'Out For Delivery') return 4;
  if (order.status === 'shipped') return 3;
  if (order.status === 'processing') return 2;
  if (order.status === 'confirmed') return 1;
  return 0;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(Number(id)),
    enabled: !!id,
  });

  const order: Order | undefined = data?.data;

  const handleRefreshTracking = async () => {
    if (!order) return;
    setIsRefreshing(true);
    try {
      await orderService.refreshTracking(order.id);
      await refetch();
      toast.success('Tracking updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to refresh tracking');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-white rounded w-1/4" />
              <div className="h-48 bg-white rounded-lg" />
              <div className="h-32 bg-white rounded-lg" />
              <div className="h-64 bg-white rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200">
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'Could not load order details'}
              </p>
              <Link
                to="/orders"
                className="inline-block bg-purple-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-all"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const activeStepIndex = getActiveStepIndex(order);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  Order #{order.order_number}
                </h1>
                <p className="text-sm text-gray-600">
                  Placed on{' '}
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Payment:</span>
                <span className="font-semibold">
                  {order.payment_method === 'razorpay' ? 'Online' : 'COD'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : order.payment_status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold">{order.order_items.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-purple-600 text-lg">
                  ₹{parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-purple-600" />
                  Order Tracking
                </h2>
                {order.shipment && (
                  <button
                    onClick={handleRefreshTracking}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Tracking
                  </button>
                )}
              </div>

              {/* Timeline Steps */}
              <div className="relative">
                <div className="flex justify-between items-start">
                  {TRACKING_STEPS.map((step, index) => {
                    const isCompleted = index <= activeStepIndex;
                    const isCurrent = index === activeStepIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center flex-1 relative"
                      >
                        {/* Connector line */}
                        {index > 0 && (
                          <div
                            className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                              index <= activeStepIndex ? 'bg-purple-500' : 'bg-gray-200'
                            }`}
                          />
                        )}

                        {/* Step icon */}
                        <div className="relative z-10 mb-2">
                          {isCompleted ? (
                            <CheckCircle2
                              className={`h-8 w-8 ${
                                isCurrent
                                  ? 'text-purple-600'
                                  : 'text-green-500'
                              }`}
                            />
                          ) : (
                            <Circle className="h-8 w-8 text-gray-300" />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-xs text-center font-medium leading-tight ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipment Details */}
              {order.shipment && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {order.shipment.awb_code && (
                      <div>
                        <span className="text-gray-500">AWB Code</span>
                        <p className="font-mono font-semibold text-gray-900">
                          {order.shipment.awb_code}
                        </p>
                      </div>
                    )}
                    {order.shipment.courier_name && (
                      <div>
                        <span className="text-gray-500">Courier</span>
                        <p className="font-semibold text-gray-900">
                          {order.shipment.courier_name}
                        </p>
                      </div>
                    )}
                    {order.shipment.status && (
                      <div>
                        <span className="text-gray-500">Shipment Status</span>
                        <p className="font-semibold text-gray-900">
                          {order.shipment.status}
                        </p>
                      </div>
                    )}
                    {order.shipment.estimated_delivery && (
                      <div>
                        <span className="text-gray-500">Estimated Delivery</span>
                        <p className="font-semibold text-gray-900">
                          {order.shipment.estimated_delivery}
                        </p>
                      </div>
                    )}
                    {order.shipped_at && (
                      <div>
                        <span className="text-gray-500">Shipped On</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.shipped_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {order.delivered_at && (
                      <div>
                        <span className="text-gray-500">Delivered On</span>
                        <p className="font-semibold text-green-600">
                          {new Date(order.delivered_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Track on courier site button */}
                  {order.shipment.tracking_url && (
                    <a
                      href={order.shipment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Track on Courier Site
                    </a>
                  )}
                </div>
              )}

              {/* No shipment yet */}
              {!order.shipment && (
                <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Shipment details will appear once your order is dispatched.
                </div>
              )}
            </div>
          )}

          {/* Cancelled/Refunded Banner */}
          {isCancelled && (
            <div className={`rounded-lg p-4 mb-6 border ${
              order.status === 'cancelled'
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <XCircle className={`h-6 w-6 ${
                  order.status === 'cancelled' ? 'text-red-500' : 'text-gray-500'
                }`} />
                <div>
                  <p className="font-semibold text-gray-900">
                    Order {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
                  </p>
                  {order.cancelled_at && (
                    <p className="text-sm text-gray-600">
                      on {new Date(order.cancelled_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {order.cancelled_reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {order.cancelled_reason}
                    </p>
                  )}
                </div>
              </div>

              {/* Refund info */}
              {order.refund_status && order.refund_status !== 'no_refund' && (
                <div className="mt-3 pt-3 border-t border-red-100 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Refund Status:</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${
                      order.refund_status === 'refund_completed'
                        ? 'bg-green-100 text-green-800'
                        : order.refund_status === 'refund_failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.refund_status.replace('refund_', '').replace('_', ' ').replace(/^\w/, (c: string) => c.toUpperCase())}
                    </span>
                  </div>
                  {order.refund_amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Refund Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{parseFloat(order.refund_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item: OrderItem) => {
                const productName = item.product?.name || item.product_snapshot?.name || 'Product';
                const productSlug = item.product?.slug;
                const imageUrl = item.product?.image_urls?.[0]?.url || '/placeholder-product.png';

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {productSlug ? (
                        <Link
                          to={`/products/${productSlug}`}
                          className="font-semibold text-gray-800 hover:text-purple-600 transition-colors line-clamp-1"
                        >
                          {productName}
                        </Link>
                      ) : (
                        <span className="font-semibold text-gray-800 line-clamp-1">
                          {productName}
                        </span>
                      )}
                      {item.product_variant && (
                        <p className="text-sm text-gray-500">
                          Variant: {item.product_variant.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity} × ₹{parseFloat(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-purple-600 text-lg flex-shrink-0">
                      ₹{parseFloat(item.total_price).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-purple-600">
                  ₹{parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-gray-900">
                {order.shipping_address.name}
              </p>
              <p className="text-gray-600">{order.shipping_address.phone}</p>
              <p className="text-gray-600">{order.shipping_address.address_line_1}</p>
              {order.shipping_address.address_line_2 && (
                <p className="text-gray-600">{order.shipping_address.address_line_2}</p>
              )}
              <p className="text-gray-600">
                {order.shipping_address.city}, {order.shipping_address.state} -{' '}
                {order.shipping_address.postal_code}
              </p>
              <p className="text-gray-600">{order.shipping_address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    refunded: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default OrderDetail;
