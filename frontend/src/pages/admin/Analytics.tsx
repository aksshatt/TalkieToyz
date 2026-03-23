import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import api from '../../config/axios';
import toast from 'react-hot-toast';

interface RevenuePoint { date: string; revenue: number; orders: number }
interface PopularProduct { product_id: number; product_name: string; total_sold: number; revenue: number }
interface CategorySale { category_id: number; name: string; total_revenue: number; total_units_sold: number }

interface AnalyticsData {
  revenue_trends: RevenuePoint[];
  popular_products: PopularProduct[];
  sales_by_category: CategorySale[];
  conversion_metrics: { total_orders: number; paid_orders: number; conversion_rate: number };
  customer_demographics: { total_customers: number; new_customers_30d: number };
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/analytics?period=${period}`);
      setData(res.data.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data?.revenue_trends?.reduce((sum, d) => sum + Number(d.revenue), 0) || 0;
  const totalOrders = data?.conversion_metrics?.total_orders || 0;
  const totalCustomers = data?.customer_demographics?.total_customers || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-talkie">Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal text-sm"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-teal-light rounded-xl">
                <DollarSign className="h-6 w-6 text-teal" />
              </div>
              <div>
                <p className="text-sm text-warmgray-500">Revenue</p>
                <p className="text-2xl font-bold text-warmgray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-sunshine-light rounded-xl">
                <ShoppingBag className="h-6 w-6 text-sunshine" />
              </div>
              <div>
                <p className="text-sm text-warmgray-500">Orders</p>
                <p className="text-2xl font-bold text-warmgray-900">{totalOrders}</p>
              </div>
            </div>
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-coral-light rounded-xl">
                <Users className="h-6 w-6 text-coral" />
              </div>
              <div>
                <p className="text-sm text-warmgray-500">Customers</p>
                <p className="text-2xl font-bold text-warmgray-900">{totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Products */}
            <div className="card-talkie p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-teal" />
                <h2 className="font-bold text-warmgray-900">Popular Products</h2>
              </div>
              {data?.popular_products?.length === 0 ? (
                <p className="text-warmgray-500 text-sm">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {data?.popular_products?.slice(0, 5).map((p, i) => (
                    <div key={p.product_id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-light text-teal text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-warmgray-800 truncate">{p.product_name}</p>
                        <p className="text-xs text-warmgray-500">{p.total_sold} sold</p>
                      </div>
                      <span className="text-sm font-semibold text-teal">₹{Number(p.revenue).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sales by Category */}
            <div className="card-talkie p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-sunshine" />
                <h2 className="font-bold text-warmgray-900">Sales by Category</h2>
              </div>
              {data?.sales_by_category?.length === 0 ? (
                <p className="text-warmgray-500 text-sm">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {data?.sales_by_category?.slice(0, 5).map((c) => (
                    <div key={c.category_id} className="flex items-center justify-between">
                      <span className="text-sm text-warmgray-700">{c.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-warmgray-900">₹{Number(c.total_revenue).toLocaleString()}</p>
                        <p className="text-xs text-warmgray-500">{c.total_units_sold} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="card-talkie p-6">
            <h2 className="font-bold text-warmgray-900 mb-4">Revenue Trends</h2>
            {data?.revenue_trends?.length === 0 ? (
              <p className="text-warmgray-500 text-sm">No revenue data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-warmgray-500 border-b border-warmgray-200">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Orders</th>
                      <th className="pb-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.revenue_trends?.slice(-10).reverse().map((row) => (
                      <tr key={row.date} className="border-b border-warmgray-100">
                        <td className="py-2 text-warmgray-600">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="py-2">{row.orders}</td>
                        <td className="py-2 font-medium text-teal">₹{Number(row.revenue).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
