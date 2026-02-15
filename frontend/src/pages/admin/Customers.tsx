import React, { useState, useEffect } from 'react';
import { Eye, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { adminService, type AdminCustomer } from '../../services/adminService';

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
  payment_status?: string;
}

const Customers: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load customers from API
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getCustomers();
      if (response.success) {
        // Transform API data to match component interface
        const transformedCustomers = await Promise.all(
          response.data.customers.map(async (c: AdminCustomer) => {
            // Fetch full customer details to get orders
            try {
              const detailResponse = await adminService.getCustomer(c.id);
              const customerDetail = detailResponse.data;

              return {
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                role: 'customer',
                total_orders: c.total_orders,
                total_spent: `₹${c.total_spent.toLocaleString()}`,
                created_at: new Date(c.created_at).toLocaleDateString('en-IN'),
                orders: (customerDetail.orders || []).map((order: any) => ({
                  id: order.id,
                  order_number: order.order_number,
                  total: `₹${order.total.toLocaleString()}`,
                  status: order.status,
                  created_at: new Date(order.created_at).toLocaleDateString('en-IN'),
                  payment_status: order.payment_status,
                })),
              };
            } catch {
              // If detail fetch fails, use basic data
              return {
                id: c.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                role: 'customer',
                total_orders: c.total_orders,
                total_spent: `₹${c.total_spent.toLocaleString()}`,
                created_at: new Date(c.created_at).toLocaleDateString('en-IN'),
                orders: [],
              };
            }
          })
        );
        setCustomers(transformedCustomers);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };


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
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading customers...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          searchable
          searchPlaceholder="Search customers..."
          emptyMessage="No customers found"
        />
      )}

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
