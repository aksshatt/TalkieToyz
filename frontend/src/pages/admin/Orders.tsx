import React, { useState } from 'react';
import { Eye, Printer, Filter, Download } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';

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
  shipping_address: Address;
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

  // Mock data - replace with actual API calls
  const orders: Order[] = [
    {
      id: 1,
      order_number: 'ORD-001',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      total: '₹2,450',
      status: 'pending',
      payment_method: 'Razorpay',
      created_at: '2025-12-26',
      items: [
        {
          id: 1,
          product_name: 'ABC Learning Blocks',
          quantity: 1,
          price: '₹1,299',
          total: '₹1,299',
        },
        {
          id: 2,
          product_name: 'Musical Xylophone',
          quantity: 1,
          price: '₹1,199',
          total: '₹1,199',
        },
      ],
      shipping_address: {
        name: 'John Doe',
        phone: '9876543210',
        address_line_1: '123 Main Street',
        address_line_2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
      },
    },
    {
      id: 2,
      order_number: 'ORD-002',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      total: '₹1,890',
      status: 'processing',
      payment_method: 'COD',
      created_at: '2025-12-26',
      items: [
        {
          id: 1,
          product_name: 'Alphabet Puzzle Set',
          quantity: 2,
          price: '₹899',
          total: '₹1,798',
        },
      ],
      shipping_address: {
        name: 'Jane Smith',
        phone: '9876543211',
        address_line_1: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        postal_code: '110001',
      },
    },
    {
      id: 3,
      order_number: 'ORD-003',
      customer_name: 'Bob Johnson',
      customer_email: 'bob@example.com',
      total: '₹3,200',
      status: 'shipped',
      payment_method: 'Razorpay',
      created_at: '2025-12-25',
      items: [
        {
          id: 1,
          product_name: 'Counting Bears Kit',
          quantity: 2,
          price: '₹1,499',
          total: '₹2,998',
        },
      ],
      shipping_address: {
        name: 'Bob Johnson',
        phone: '9876543212',
        address_line_1: '789 Lake Road',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '560001',
      },
    },
    {
      id: 4,
      order_number: 'ORD-004',
      customer_name: 'Alice Williams',
      customer_email: 'alice@example.com',
      total: '₹1,550',
      status: 'delivered',
      payment_method: 'Razorpay',
      created_at: '2025-12-25',
      items: [
        {
          id: 1,
          product_name: 'Musical Xylophone',
          quantity: 1,
          price: '₹1,199',
          total: '₹1,199',
        },
      ],
      shipping_address: {
        name: 'Alice Williams',
        phone: '9876543213',
        address_line_1: '321 Hill Street',
        city: 'Pune',
        state: 'Maharashtra',
        postal_code: '411001',
      },
    },
    {
      id: 5,
      order_number: 'ORD-005',
      customer_name: 'Charlie Brown',
      customer_email: 'charlie@example.com',
      total: '₹2,100',
      status: 'cancelled',
      payment_method: 'COD',
      created_at: '2025-12-24',
      items: [
        {
          id: 1,
          product_name: 'ABC Learning Blocks',
          quantity: 1,
          price: '₹1,299',
          total: '₹1,299',
        },
      ],
      shipping_address: {
        name: 'Charlie Brown',
        phone: '9876543214',
        address_line_1: '555 River Drive',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postal_code: '600001',
      },
    },
  ];

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

  const handleUpdateStatus = (newStatus: Order['status']) => {
    if (selectedOrder) {
      toast.success(`Order status updated to ${newStatus}`);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (dateFilter === 'today') {
      return order.created_at === '2025-12-26';
    }
    if (dateFilter === 'week') {
      return true; // Implement date logic
    }
    return true;
  });

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
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchable
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found"
      />

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
