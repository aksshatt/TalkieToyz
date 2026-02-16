import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import type { Column } from '../../components/admin/DataTable';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

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

interface Stats {
  totalSales: string;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesTrend: { value: number; isPositive: boolean };
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalSales: '₹0',
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    salesTrend: { value: 0, isPositive: true },
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        const data = response.data;

        // Set stats
        setStats({
          totalSales: `₹${data.overview.total_sales.toLocaleString()}`,
          totalOrders: data.overview.total_orders,
          totalCustomers: data.overview.total_customers,
          totalProducts: data.overview.total_products,
          salesTrend: {
            value: data.revenue.growth_percentage || 0,
            isPositive: (data.revenue.growth_percentage || 0) >= 0
          },
        });

        // Transform revenue data for charts
        if (data.revenue.last_7_days && data.revenue.last_7_days.length > 0) {
          const chartData = data.revenue.last_7_days.map((item: any) => ({
            name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            sales: item.revenue,
          }));
          setSalesData(chartData);
        } else {
          // Fallback to empty data
          setSalesData([]);
        }

        // Set recent orders
        if (data.recent_orders && data.recent_orders.length > 0) {
          const transformedOrders = data.recent_orders.map((order: any) => ({
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            total: `₹${order.total.toLocaleString()}`,
            status: order.status,
            created_at: new Date(order.created_at).toLocaleDateString('en-IN'),
          }));
          setRecentOrders(transformedOrders);
        }

        // Get low stock products
        const productsResponse = await adminService.getProducts({ low_stock: 10 });
        if (productsResponse.success) {
          const lowStock = productsResponse.data.products
            .filter((p: any) => p.stock_quantity < 10)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              stock: p.stock_quantity,
              threshold: 10,
            }));
          setLowStockProducts(lowStock);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
          trend={stats.salesTrend}
          iconColor="text-teal"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          iconColor="text-coral"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          iconColor="text-sunshine"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          iconColor="text-sky"
        />
      </div>

      {/* Sales Chart */}
      <div className="card-talkie bg-white">
        <h2 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-800 mb-6">
          Revenue (Last 7 Days)
        </h2>
        {salesData.length > 0 ? (
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
        ) : (
          <div className="h-[300px] flex items-center justify-center text-warmgray-500">
            <p>No sales data available</p>
          </div>
        )}
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
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
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
                ))
              ) : (
                <div className="p-4 text-center text-warmgray-600">
                  <p className="text-sm">No low stock items</p>
                </div>
              )}
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
