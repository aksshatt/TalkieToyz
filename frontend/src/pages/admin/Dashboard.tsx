import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  threshold: number;
}

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data - replace with actual API calls
  const stats = {
    totalSales: '₹1,24,567',
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: 42,
    trends: {
      sales: { value: 12.5, isPositive: true },
      orders: { value: 8.3, isPositive: true },
      customers: { value: -2.4, isPositive: false },
      products: { value: 5.1, isPositive: true },
    },
  };

  const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 32 },
    { name: 'Thu', sales: 4500, orders: 28 },
    { name: 'Fri', sales: 6000, orders: 38 },
    { name: 'Sat', sales: 8000, orders: 52 },
    { name: 'Sun', sales: 7000, orders: 45 },
  ];

  const recentOrders: Order[] = [
    {
      id: 1,
      order_number: 'ORD-001',
      customer_name: 'John Doe',
      total: '₹2,450',
      status: 'pending',
      created_at: '2025-12-26',
    },
    {
      id: 2,
      order_number: 'ORD-002',
      customer_name: 'Jane Smith',
      total: '₹1,890',
      status: 'processing',
      created_at: '2025-12-26',
    },
    {
      id: 3,
      order_number: 'ORD-003',
      customer_name: 'Bob Johnson',
      total: '₹3,200',
      status: 'shipped',
      created_at: '2025-12-25',
    },
    {
      id: 4,
      order_number: 'ORD-004',
      customer_name: 'Alice Williams',
      total: '₹1,550',
      status: 'delivered',
      created_at: '2025-12-25',
    },
    {
      id: 5,
      order_number: 'ORD-005',
      customer_name: 'Charlie Brown',
      total: '₹2,100',
      status: 'pending',
      created_at: '2025-12-24',
    },
  ];

  const lowStockProducts: LowStockProduct[] = [
    { id: 1, name: 'ABC Learning Blocks', stock: 5, threshold: 10 },
    { id: 2, name: 'Alphabet Puzzle Set', stock: 3, threshold: 10 },
    { id: 3, name: 'Counting Bears Kit', stock: 7, threshold: 15 },
  ];

  const orderColumns: Column<Order>[] = [
    { key: 'order_number', label: 'Order #', sortable: true },
    { key: 'customer_name', label: 'Customer', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (order) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            order.status === 'delivered'
              ? 'bg-green-100 text-green-700'
              : order.status === 'shipped'
              ? 'bg-blue-100 text-blue-700'
              : order.status === 'processing'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-warmgray-100 text-warmgray-700'
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      ),
    },
    { key: 'created_at', label: 'Date', sortable: true },
  ];

  const lowStockColumns: Column<LowStockProduct>[] = [
    { key: 'name', label: 'Product Name' },
    {
      key: 'stock',
      label: 'Stock',
      render: (product) => (
        <span className="font-bold text-coral">{product.stock} units</span>
      ),
    },
    { key: 'threshold', label: 'Threshold' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-warmgray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Sales"
          value={stats.totalSales}
          icon={DollarSign}
          trend={stats.trends.sales}
          iconColor="text-teal"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          trend={stats.trends.orders}
          iconColor="text-coral"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={stats.trends.customers}
          iconColor="text-sunshine"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={stats.trends.products}
          iconColor="text-sky"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="card-talkie bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
              Sales Overview
            </h2>
            <div className="flex space-x-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    timeRange === range
                      ? 'bg-teal text-white'
                      : 'text-warmgray-600 hover:bg-warmgray-100'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis
                dataKey="name"
                stroke="#78716C"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#78716C" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid #E7E5E4',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#26C6DA"
                strokeWidth={3}
                dot={{ fill: '#26C6DA', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="card-talkie bg-white">
          <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-6">
            Orders Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis
                dataKey="name"
                stroke="#78716C"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#78716C" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '2px solid #E7E5E4',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="#FF6F61" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card-talkie bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
                Recent Orders
              </h2>
              <button className="text-sm font-semibold text-teal hover:text-teal-dark transition-colors">
                View All
              </button>
            </div>
            <DataTable columns={orderColumns} data={recentOrders} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-1">
          <div className="card-talkie bg-white">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-6 w-6 text-coral" />
              <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800">
                Low Stock Alerts
              </h2>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-coral-light/20 border-2 border-coral-light rounded-xl"
                >
                  <p className="font-bold text-warmgray-800 mb-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-warmgray-600">
                    Only <span className="font-bold text-coral">{product.stock}</span> units
                    left (threshold: {product.threshold})
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-coral text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
              Restock Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
