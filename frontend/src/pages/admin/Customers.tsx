import React, { useState } from 'react';
import { Eye, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  total_orders: number;
  total_spent: string;
  created_at: string;
  orders: CustomerOrder[];
}

interface CustomerOrder {
  id: number;
  order_number: string;
  total: string;
  status: string;
  created_at: string;
}

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data - replace with actual API calls
  const customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      role: 'customer',
      total_orders: 5,
      total_spent: '₹12,450',
      created_at: '2025-01-15',
      orders: [
        {
          id: 1,
          order_number: 'ORD-001',
          total: '₹2,450',
          status: 'delivered',
          created_at: '2025-12-26',
        },
        {
          id: 2,
          order_number: 'ORD-010',
          total: '₹3,200',
          status: 'delivered',
          created_at: '2025-12-20',
        },
        {
          id: 3,
          order_number: 'ORD-025',
          total: '₹1,800',
          status: 'delivered',
          created_at: '2025-12-15',
        },
        {
          id: 4,
          order_number: 'ORD-042',
          total: '₹2,500',
          status: 'delivered',
          created_at: '2025-12-10',
        },
        {
          id: 5,
          order_number: 'ORD-058',
          total: '₹2,500',
          status: 'shipped',
          created_at: '2025-12-05',
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '9876543211',
      role: 'customer',
      total_orders: 3,
      total_spent: '₹8,750',
      created_at: '2025-02-20',
      orders: [
        {
          id: 1,
          order_number: 'ORD-002',
          total: '₹1,890',
          status: 'processing',
          created_at: '2025-12-26',
        },
        {
          id: 2,
          order_number: 'ORD-015',
          total: '₹3,560',
          status: 'delivered',
          created_at: '2025-12-18',
        },
        {
          id: 3,
          order_number: 'ORD-032',
          total: '₹3,300',
          status: 'delivered',
          created_at: '2025-12-12',
        },
      ],
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '9876543212',
      role: 'customer',
      total_orders: 8,
      total_spent: '₹25,600',
      created_at: '2024-11-10',
      orders: [
        {
          id: 1,
          order_number: 'ORD-003',
          total: '₹3,200',
          status: 'shipped',
          created_at: '2025-12-25',
        },
      ],
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '9876543213',
      role: 'customer',
      total_orders: 2,
      total_spent: '₹4,850',
      created_at: '2025-03-05',
      orders: [
        {
          id: 1,
          order_number: 'ORD-004',
          total: '₹1,550',
          status: 'delivered',
          created_at: '2025-12-25',
        },
        {
          id: 2,
          order_number: 'ORD-028',
          total: '₹3,300',
          status: 'delivered',
          created_at: '2025-12-14',
        },
      ],
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'customer',
      total_orders: 1,
      total_spent: '₹2,100',
      created_at: '2025-04-12',
      orders: [
        {
          id: 1,
          order_number: 'ORD-005',
          total: '₹2,100',
          status: 'cancelled',
          created_at: '2025-12-24',
        },
      ],
    },
  ];

  const columns: Column<Customer>[] = [
    { key: 'name', label: 'Customer Name', sortable: true },
    {
      key: 'email',
      label: 'Contact',
      render: (customer) => (
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-warmgray-400" />
            <span className="text-sm">{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center space-x-2 mt-1">
              <Phone className="h-4 w-4 text-warmgray-400" />
              <span className="text-sm">{customer.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'total_orders',
      label: 'Total Orders',
      sortable: true,
      render: (customer) => (
        <span className="font-semibold text-warmgray-800">
          {customer.total_orders}
        </span>
      ),
    },
    {
      key: 'total_spent',
      label: 'Total Spent',
      sortable: true,
      render: (customer) => (
        <span className="font-bold text-teal">{customer.total_spent}</span>
      ),
    },
    { key: 'created_at', label: 'Joined Date', sortable: true },
    {
      key: 'id',
      label: 'Actions',
      render: (customer) => (
        <button
          onClick={() => handleViewDetails(customer)}
          className="p-2 hover:bg-teal-light/30 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4 text-teal" />
        </button>
      ),
    },
  ];

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
          Customers
        </h1>
        <p className="text-warmgray-600">
          View and manage customer information and order history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-talkie bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-warmgray-600 mb-1">
                Total Customers
              </p>
              <p className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
                {customers.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-teal-light/30">
              <ShoppingBag className="h-8 w-8 text-teal" />
            </div>
          </div>
        </div>

        <div className="card-talkie bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-warmgray-600 mb-1">
                Active Customers
              </p>
              <p className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
                {customers.filter((c) => c.total_orders > 0).length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-coral-light/30">
              <Mail className="h-8 w-8 text-coral" />
            </div>
          </div>
        </div>

        <div className="card-talkie bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-warmgray-600 mb-1">
                Average Orders
              </p>
              <p className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
                {(
                  customers.reduce((sum, c) => sum + c.total_orders, 0) /
                  customers.length
                ).toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-sunshine-light/30">
              <ShoppingBag className="h-8 w-8 text-sunshine" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchable
        searchPlaceholder="Search customers..."
        emptyMessage="No customers found"
      />

      {/* Customer Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCustomer(null);
        }}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Full Name
                </p>
                <p className="font-bold text-warmgray-800 text-lg">
                  {selectedCustomer.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Member Since
                </p>
                <p className="font-bold text-warmgray-800">
                  {selectedCustomer.created_at}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Email Address
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-warmgray-400" />
                  <p className="text-warmgray-800">{selectedCustomer.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Phone Number
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-warmgray-400" />
                  <p className="text-warmgray-800">
                    {selectedCustomer.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase Stats */}
            <div className="grid grid-cols-2 gap-4 border-t-2 border-warmgray-100 pt-6">
              <div className="p-4 bg-teal-light/20 rounded-xl">
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-teal">
                  {selectedCustomer.total_orders}
                </p>
              </div>
              <div className="p-4 bg-coral-light/20 rounded-xl">
                <p className="text-sm font-semibold text-warmgray-600 mb-1">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-coral">
                  {selectedCustomer.total_spent}
                </p>
              </div>
            </div>

            {/* Order History */}
            <div className="border-t-2 border-warmgray-100 pt-6">
              <h3 className="text-lg font-bold text-warmgray-800 mb-4">
                Order History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedCustomer.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-warmgray-50 rounded-xl hover:bg-warmgray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <p className="font-bold text-warmgray-800">
                          {order.order_number}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-warmgray-600 mt-1">
                        {order.created_at}
                      </p>
                    </div>
                    <p className="font-bold text-teal text-lg">{order.total}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 border-t-2 border-warmgray-100 pt-6">
              <button className="flex items-center space-x-2 px-6 py-3 border-2 border-teal text-teal font-bold rounded-xl hover:bg-teal-light/30 transition-colors">
                <Mail className="h-5 w-5" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
