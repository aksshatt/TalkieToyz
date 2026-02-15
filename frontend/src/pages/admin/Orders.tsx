import React, { useState, useEffect } from 'react';
import { Eye, Printer, Filter, Download } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { adminService, type AdminOrder } from '../../services/adminService';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: Address;
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  total: string;
}

interface Address {
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
}

const Orders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from API
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (response.success) {
        // Transform API data to match component interface
        const transformedOrders = await Promise.all(
          response.data.orders.map(async (o: AdminOrder) => {
            // Fetch full order details to get items
            const detailResponse = await adminService.getOrder(o.id);
            const orderDetail = detailResponse.data;

            return {
              id: o.id,
              order_number: o.order_number,
              customer_name: o.customer_name,
              customer_email: o.customer_email,
              total: `₹${o.total.toLocaleString()}`,
              status: o.status as any,
              payment_method: o.payment_method || 'N/A',
              created_at: new Date(o.created_at).toLocaleDateString('en-IN'),
              items: (orderDetail.items || []).map((item: any) => ({
                id: item.id,
                product_name: item.product_name || item.item_name || 'Unknown',
                quantity: item.quantity,
                price: `₹${(item.price || item.unit_price || 0).toLocaleString()}`,
                total: `₹${(item.total || item.total_price || 0).toLocaleString()}`,
              })),
              shipping_address: orderDetail.shipping_address,
            };
          })
        );
        setOrders(transformedOrders);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-warmgray-100 text-warmgray-700';
    }
  };

  const columns: Column<Order>[] = [
    { key: 'order_number', label: 'Order #', sortable: true },
    { key: 'customer_name', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      ),
    },
    { key: 'payment_method', label: 'Payment', sortable: true },
    { key: 'created_at', label: 'Date', sortable: true },
    {
      key: 'id',
      label: 'Actions',
      render: (order) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewDetails(order)}
            className="p-2 hover:bg-teal-light/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-teal" />
          </button>
          <button
            onClick={() => handlePrintInvoice(order)}
            className="p-2 hover:bg-sky-light/30 rounded-lg transition-colors"
            title="Print Invoice"
          >
            <Printer className="h-4 w-4 text-sky" />
          </button>
        </div>
      ),
    },
  ];

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handlePrintInvoice = (order: Order) => {
    toast.success(`Printing invoice for ${order.order_number}`);
  };

  const handleUpdateStatus = async (newStatus: Order['status']) => {
    if (selectedOrder) {
      try {
        const response = await adminService.updateOrderStatus(selectedOrder.id, newStatus);
        if (response.success) {
          toast.success(`Order status updated to ${newStatus}`);
          setSelectedOrder({ ...selectedOrder, status: newStatus });
          loadOrders(); // Reload orders to reflect changes
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update order status');
      }
    }
  };

  // Orders are already filtered by status in the API call
  // Additional client-side filtering can be added here if needed
  const filteredOrders = orders;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
            Orders
          </h1>
          <p className="text-warmgray-600">Manage and track all customer orders</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift">
          <Download className="h-5 w-5" />
          <span>Export Orders</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card-talkie bg-white">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-warmgray-600" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-warmgray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border-2 border-warmgray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading orders...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          searchable
          searchPlaceholder="Search orders..."
          emptyMessage="No orders found"
        />
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Order ${selectedOrder?.order_number || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Customer
                </p>
                <p className="font-bold text-warmgray-800">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-sm text-warmgray-600">
                  {selectedOrder.customer_email}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Order Date
                </p>
                <p className="font-bold text-warmgray-800">
                  {selectedOrder.created_at}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Payment Method
                </p>
                <p className="font-bold text-warmgray-800">
                  {selectedOrder.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Total Amount
                </p>
                <p className="font-bold text-teal text-2xl">
                  {selectedOrder.total}
                </p>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="border-t-2 border-warmgray-100 pt-6">
              <p className="text-sm font-semibold text-warmgray-600 mb-3">
                Update Order Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        selectedOrder.status === status
                          ? getStatusColor(status)
                          : 'bg-warmgray-100 text-warmgray-700 hover:bg-warmgray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t-2 border-warmgray-100 pt-6">
              <h3 className="text-lg font-bold text-warmgray-800 mb-4">
                Order Items
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-warmgray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-warmgray-800">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-warmgray-600">
                        Quantity: {item.quantity} × {item.price}
                      </p>
                    </div>
                    <p className="font-bold text-warmgray-800">{item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shipping_address && (
              <div className="border-t-2 border-warmgray-100 pt-6">
                <h3 className="text-lg font-bold text-warmgray-800 mb-4">
                  Shipping Address
                </h3>
                <div className="p-4 bg-warmgray-50 rounded-lg">
                  <p className="font-semibold text-warmgray-800">
                    {selectedOrder.shipping_address.name}
                  </p>
                  <p className="text-sm text-warmgray-600">
                    {selectedOrder.shipping_address.phone}
                  </p>
                  <p className="text-sm text-warmgray-600 mt-2">
                    {selectedOrder.shipping_address.address_line_1}
                  </p>
                  {selectedOrder.shipping_address.address_line_2 && (
                    <p className="text-sm text-warmgray-600">
                      {selectedOrder.shipping_address.address_line_2}
                    </p>
                  )}
                  <p className="text-sm text-warmgray-600">
                    {selectedOrder.shipping_address.city},{' '}
                    {selectedOrder.shipping_address.state} -{' '}
                    {selectedOrder.shipping_address.postal_code}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 border-t-2 border-warmgray-100 pt-6">
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-teal text-teal font-bold rounded-xl hover:bg-teal-light/30 transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
