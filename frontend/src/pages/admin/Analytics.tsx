import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
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

// Shared Highcharts theme colours
const TEAL = '#2d9c92';
const CORAL = '#e8705a';
const SUNSHINE = '#ffc844';
const SKY = '#4ba8d4';
const PURPLE = '#a78bfa';
const CHART_COLORS = [TEAL, CORAL, SUNSHINE, SKY, PURPLE];

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');

  useEffect(() => { loadAnalytics(); }, [period]);

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
  const newCustomers = data?.customer_demographics?.new_customers_30d || 0;

  // --- Chart options ---

  const revenueTrendOptions: Highcharts.Options = {
    chart: { type: 'areaspline', height: 280, style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', margin: [16, 16, 48, 64] },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: true, align: 'right', verticalAlign: 'top', itemStyle: { fontWeight: '600', fontSize: '12px' } },
    xAxis: {
      categories: (data?.revenue_trends || []).map(d =>
        new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      ),
      lineColor: '#f0ede8', tickColor: 'transparent',
      labels: { style: { color: '#9e9c98', fontSize: '11px' } },
    },
    yAxis: [
      {
        title: { text: undefined },
        labels: { style: { color: '#9e9c98', fontSize: '11px' }, formatter() { return `₹${(this.value as number / 1000).toFixed(0)}k`; } },
        gridLineColor: '#f0ede8',
      },
      {
        title: { text: undefined },
        opposite: true,
        labels: { style: { color: '#9e9c98', fontSize: '11px' } },
        gridLineWidth: 0,
      },
    ],
    tooltip: {
      shared: true, borderRadius: 12, shadow: false,
      backgroundColor: '#fff', borderColor: '#f0ede8',
      style: { fontSize: '12px' },
      formatter() {
        let s = `<b>${this.x}</b><br/>`;
        this.points?.forEach(p => {
          const val = p.series.name === 'Revenue' ? `₹${Number(p.y).toLocaleString('en-IN')}` : String(p.y);
          s += `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${val}</b><br/>`;
        });
        return s;
      },
    },
    plotOptions: { areaspline: { fillOpacity: 0.12, lineWidth: 2.5, marker: { enabled: false } } },
    series: [
      {
        type: 'areaspline',
        name: 'Revenue',
        yAxis: 0,
        color: TEAL,
        data: (data?.revenue_trends || []).map(d => Number(d.revenue)),
      },
      {
        type: 'areaspline',
        name: 'Orders',
        yAxis: 1,
        color: CORAL,
        data: (data?.revenue_trends || []).map(d => d.orders),
      },
    ],
  };

  const topProductsOptions: Highcharts.Options = {
    chart: { type: 'bar', height: 240, style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', margin: [8, 16, 8, 0] },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    xAxis: {
      categories: (data?.popular_products || []).slice(0, 5).map(p =>
        p.product_name.length > 20 ? p.product_name.slice(0, 20) + '…' : p.product_name
      ),
      lineColor: 'transparent', tickColor: 'transparent',
      labels: { style: { color: '#6b6963', fontSize: '11px' } },
    },
    yAxis: {
      title: { text: undefined },
      labels: { style: { color: '#9e9c98', fontSize: '11px' } },
      gridLineColor: '#f0ede8',
    },
    tooltip: {
      borderRadius: 10, shadow: false, backgroundColor: '#fff', borderColor: '#f0ede8',
      style: { fontSize: '12px' },
      formatter() { return `<b>${this.x}</b><br/>Units sold: <b>${this.y}</b>`; },
    },
    plotOptions: { bar: { borderRadius: 6, colorByPoint: true, colors: CHART_COLORS } },
    series: [{ type: 'bar', name: 'Units Sold', data: (data?.popular_products || []).slice(0, 5).map(p => p.total_sold) }],
  };

  const categoryPieOptions: Highcharts.Options = {
    chart: { type: 'pie', height: 240, style: { fontFamily: 'inherit' }, backgroundColor: 'transparent', margin: [8, 8, 8, 8] },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      borderRadius: 10, shadow: false, backgroundColor: '#fff', borderColor: '#f0ede8',
      style: { fontSize: '12px' },
      formatter() {
        return `<b>${this.point.name}</b><br/>₹${Number(this.y).toLocaleString('en-IN')}<br/>${this.point.options.custom?.units ?? 0} units`;
      },
    },
    plotOptions: {
      pie: {
        innerSize: '55%', borderWidth: 2, borderColor: '#fff',
        dataLabels: { enabled: false },
        showInLegend: true,
      },
    },
    legend: { align: 'right', verticalAlign: 'middle', layout: 'vertical', itemStyle: { fontWeight: '600', fontSize: '11px', color: '#6b6963' } },
    series: [{
      type: 'pie',
      name: 'Revenue',
      colors: CHART_COLORS,
      data: (data?.sales_by_category || []).map(c => ({
        name: c.name,
        y: Number(c.total_revenue),
        custom: { units: c.total_units_sold },
      })),
    }],
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-teal-light rounded-xl"><DollarSign className="h-6 w-6 text-teal" /></div>
              <div>
                <p className="text-sm text-warmgray-500">Revenue</p>
                <p className="text-2xl font-bold text-warmgray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-sunshine-light rounded-xl"><ShoppingBag className="h-6 w-6 text-sunshine" /></div>
              <div>
                <p className="text-sm text-warmgray-500">Orders</p>
                <p className="text-2xl font-bold text-warmgray-900">{totalOrders}</p>
              </div>
            </div>
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-coral-light rounded-xl"><Users className="h-6 w-6 text-coral" /></div>
              <div>
                <p className="text-sm text-warmgray-500">Customers</p>
                <p className="text-2xl font-bold text-warmgray-900">{totalCustomers}</p>
              </div>
            </div>
            <div className="card-talkie p-6 flex items-center gap-4">
              <div className="p-3 bg-sky-light rounded-xl"><TrendingUp className="h-6 w-6 text-sky" /></div>
              <div>
                <p className="text-sm text-warmgray-500">New (30d)</p>
                <p className="text-2xl font-bold text-warmgray-900">{newCustomers}</p>
              </div>
            </div>
          </div>

          {/* Revenue + Orders Trend */}
          <div className="card-talkie p-6">
            <h2 className="font-bold text-warmgray-900 mb-4">Revenue & Orders Over Time</h2>
            {(data?.revenue_trends?.length ?? 0) === 0 ? (
              <p className="text-warmgray-500 text-sm">No revenue data yet</p>
            ) : (
              <HighchartsReact highcharts={Highcharts} options={revenueTrendOptions} />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Products */}
            <div className="card-talkie p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-teal" />
                <h2 className="font-bold text-warmgray-900">Top Products (Units Sold)</h2>
              </div>
              {(data?.popular_products?.length ?? 0) === 0 ? (
                <p className="text-warmgray-500 text-sm">No sales data yet</p>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={topProductsOptions} />
              )}
            </div>

            {/* Sales by Category */}
            <div className="card-talkie p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-sunshine" />
                <h2 className="font-bold text-warmgray-900">Revenue by Category</h2>
              </div>
              {(data?.sales_by_category?.length ?? 0) === 0 ? (
                <p className="text-warmgray-500 text-sm">No sales data yet</p>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={categoryPieOptions} />
              )}
            </div>
          </div>

          {/* Conversion Metrics */}
          {data?.conversion_metrics && (
            <div className="card-talkie p-6">
              <h2 className="font-bold text-warmgray-900 mb-4">Conversion Metrics</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-teal/5 rounded-xl">
                  <p className="text-2xl font-bold text-teal">{data.conversion_metrics.total_orders}</p>
                  <p className="text-xs text-warmgray-500 mt-1">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-sunshine/5 rounded-xl">
                  <p className="text-2xl font-bold text-sunshine">{data.conversion_metrics.paid_orders}</p>
                  <p className="text-xs text-warmgray-500 mt-1">Paid Orders</p>
                </div>
                <div className="text-center p-4 bg-coral/5 rounded-xl">
                  <p className="text-2xl font-bold text-coral">{(data.conversion_metrics.conversion_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-warmgray-500 mt-1">Conversion Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
