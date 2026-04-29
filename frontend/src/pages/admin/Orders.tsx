import React, { useState, useEffect } from 'react';
import { Eye, Printer, Filter, Download, Truck, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
  payment_status?: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: Address;
  shipment?: {
    id: number;
    awb_code?: string;
    courier_name?: string;
    tracking_url?: string;
    label_url?: string;
    status?: string;
  } | null;
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
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PER_PAGE = 25;

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    loadOrders();
  }, [statusFilter, dateFilter, page, searchTerm]);

  const getDateRange = () => {
    const now = new Date();
    if (dateFilter === 'today') {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      return { date_from: start.toISOString(), date_to: now.toISOString() };
    }
    if (dateFilter === 'week') {
      const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0, 0, 0, 0);
      return { date_from: start.toISOString(), date_to: now.toISOString() };
    }
    if (dateFilter === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { date_from: start.toISOString(), date_to: now.toISOString() };
    }
    return {};
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getOrders({
        page,
        per_page: PER_PAGE,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
        ...getDateRange(),
      });
      if (response.success) {
        if (response.data.meta) {
          setTotalPages(response.data.meta.total_pages || 1);
          setTotalCount(response.data.meta.total_count || response.data.orders.length);
        }
        // Use list data directly — detail is fetched on-demand when opening the modal
        const transformedOrders = response.data.orders.map((o: AdminOrder) => ({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          customer_email: o.customer_email,
          total: `₹${o.total.toLocaleString()}`,
          status: o.status as any,
          payment_method: o.payment_method || 'N/A',
          payment_status: o.payment_status,
          created_at: new Date(o.created_at).toLocaleDateString('en-IN'),
          items: [],
          shipping_address: o.shipping_address,
          shipment: (o as any).shipment || null,
        }));
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

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
    // Fetch full details (items + address) on demand
    if (order.items.length === 0) {
      try {
        const detailResponse = await adminService.getOrder(order.id);
        const d = detailResponse.data;
        const items: OrderItem[] = (d.items || []).map((item: any) => ({
          id: item.id,
          product_name: item.product_name || item.item_name || 'Unknown',
          quantity: item.quantity,
          price: `₹${(item.price || item.unit_price || 0).toLocaleString()}`,
          total: `₹${(item.total || item.total_price || 0).toLocaleString()}`,
        }));
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                items,
                shipping_address: d.shipping_address,
                payment_status: (d as any).payment_status ?? prev.payment_status,
                shipment: (d as any).shipment ?? prev.shipment ?? null,
              }
            : prev
        );
      } catch {
        // silently fail — order info already shown
      }
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const addr = order.shipping_address;
    const addrStr = addr
      ? `${addr.name}<br/>${addr.phone}<br/>${addr.address_line_1}${addr.address_line_2 ? ', ' + addr.address_line_2 : ''}<br/>${addr.city}, ${addr.state} – ${addr.postal_code}`
      : '—';

    const itemsHtml = order.items.length > 0
      ? order.items.map((item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.product_name}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.price}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.total}</td>
          </tr>`).join('')
      : `<tr><td colspan="4" style="padding:8px;text-align:center;color:#aaa">No item details available</td></tr>`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice – ${order.order_number}</title>
  <style>
    body{font-family:Arial,sans-serif;color:#333;max-width:700px;margin:40px auto;padding:0 20px}
    h1{color:#0d9488}table{width:100%;border-collapse:collapse}
    th{background:#f0fdf4;text-align:left;padding:10px 8px;font-size:13px}
    @media print{button{display:none}}
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px">
    <div><h1 style="margin:0">TalkieToys</h1><p style="margin:4px 0;color:#666;font-size:13px">Invoice</p></div>
    <div style="text-align:right">
      <p style="margin:0;font-size:18px;font-weight:bold">#${order.order_number}</p>
      <p style="margin:4px 0;color:#666;font-size:13px">Date: ${order.created_at}</p>
      <p style="margin:4px 0;font-size:13px">Payment: ${order.payment_method}</p>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
    <div><strong>Billed To:</strong><br/>${order.customer_name}<br/>${order.customer_email}</div>
    <div><strong>Ship To:</strong><br/>${addrStr}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th><th style="text-align:center">Qty</th>
        <th style="text-align:right">Price</th><th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold;font-size:16px">Grand Total</td>
        <td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:16px;color:#0d9488">${order.total}</td>
      </tr>
    </tfoot>
  </table>

  <p style="margin-top:48px;text-align:center;color:#aaa;font-size:12px">Thank you for shopping with TalkieToys!</p>
  <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#0d9488;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Print Invoice</button>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=800,height=700');
    if (win) {
      win.document.write(html);
      win.document.close();
      // Auto-print after a short delay so styles load
      setTimeout(() => win.print(), 400);
    }
  };

  const handleExportOrders = async () => {
    try {
      const blob = await adminService.exportOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        ...getDateRange(),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Orders exported!');
    } catch {
      toast.error('Failed to export orders');
    }
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

  const canCreateShipment = (o: Order | null): boolean => {
    if (!o) return false;
    if (o.shipment) return false;
    const blocked = ['cancelled', 'refunded', 'delivered', 'shipped'];
    return !blocked.includes(o.status);
  };

  const handleCreateShipment = async () => {
    if (!selectedOrder) return;
    const t = toast.loading('Creating shipment in Shiprocket...');
    try {
      const res = await adminService.createShipment(selectedOrder.id);
      if (res.success) {
        toast.success(`Shipment created${res.data?.shipment?.awb_code ? ` (AWB ${res.data.shipment.awb_code})` : ''}`, { id: t });
        setSelectedOrder({
          ...selectedOrder,
          shipment: res.data?.shipment || null,
          status: (res.data?.order?.status || 'processing') as Order['status'],
        });
        loadOrders();
      } else {
        toast.error(res.message || 'Failed to create shipment', { id: t });
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.[0] || 'Failed to create shipment';
      toast.error(msg, { id: t });
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
        <button onClick={handleExportOrders} className="flex items-center space-x-2 px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift">
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
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

      {/* Search */}
      <div className="card-talkie bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warmgray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-12 pr-4 py-3 border-2 border-warmgray-200 rounded-lg focus:outline-none focus:border-teal transition-colors"
          />
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          <p className="mt-4 text-warmgray-600">Loading orders...</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filteredOrders}
            emptyMessage="No orders found"
          />

          {totalCount > 0 && (
            <div className="flex items-center justify-between bg-white rounded-xl border-2 border-warmgray-200 px-4 py-3">
              <span className="text-sm text-warmgray-600">
                Showing {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, totalCount)} of {totalCount}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 border-2 border-warmgray-200 rounded-lg hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-warmgray-700 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 border-2 border-warmgray-200 rounded-lg hover:bg-warmgray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
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

            {/* Shipment Info */}
            <div className="border-t-2 border-warmgray-100 pt-6">
              <h3 className="text-lg font-bold text-warmgray-800 mb-4">Shipment</h3>
              {selectedOrder.shipment ? (
                <div className="p-4 bg-warmgray-50 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="font-semibold text-warmgray-700">AWB:</span>{' '}
                    <span className="font-mono">{selectedOrder.shipment.awb_code || '—'}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-warmgray-700">Courier:</span>{' '}
                    {selectedOrder.shipment.courier_name || '—'}
                  </p>
                  <p>
                    <span className="font-semibold text-warmgray-700">Status:</span>{' '}
                    {selectedOrder.shipment.status || '—'}
                  </p>
                  {selectedOrder.shipment.tracking_url && (
                    <a
                      href={selectedOrder.shipment.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal underline"
                    >
                      Track shipment
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-warmgray-600">
                    No shipment yet.
                    {!canCreateShipment(selectedOrder) && (
                      <span className="block mt-1 text-xs text-warmgray-500">
                        Order is {selectedOrder.status} — cannot create shipment.
                      </span>
                    )}
                  </p>
                  <button
                    onClick={handleCreateShipment}
                    disabled={!canCreateShipment(selectedOrder)}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  >
                    <Truck className="h-5 w-5" />
                    <span>Create Shipment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 border-t-2 border-warmgray-100 pt-6">
              {!selectedOrder.shipment && (
                <button
                  onClick={handleCreateShipment}
                  disabled={!canCreateShipment(selectedOrder)}
                  className="flex items-center space-x-2 px-6 py-3 bg-teal-gradient text-white font-bold rounded-xl shadow-soft hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                  title={
                    canCreateShipment(selectedOrder)
                      ? 'Push order to Shiprocket'
                      : 'Order not eligible for shipment'
                  }
                >
                  <Truck className="h-5 w-5" />
                  <span>Create Shipment</span>
                </button>
              )}
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
