import { useState, useEffect } from 'react';
import { Ticket, Copy, CheckCircle, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number | null;
  max_discount_amount: number | null;
  usage_limit: number;
  usage_count: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
}

export default function CouponGenerator() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [generated, setGenerated] = useState<Coupon[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [count, setCount] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState(1);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCoupons({ per_page: 100, q: search || undefined });
      setCoupons(res.data.coupons);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (discountValue <= 0) { toast.error('Discount value must be greater than 0'); return; }
    setSubmitting(true);
    try {
      const res = await adminService.bulkGenerateCoupons({
        count,
        prefix: prefix || undefined,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_amount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
        max_discount_amount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
        usage_limit: usageLimit,
        // Backend stores these as datetime. Treat valid_from as start-of-day
        // and valid_until as end-of-day so date-only inputs behave as users
        // expect (a coupon dated Dec 31 is valid all of Dec 31).
        valid_from: validFrom ? `${validFrom}T00:00:00` : undefined,
        valid_until: validUntil ? `${validUntil}T23:59:59` : undefined,
      });
      setGenerated(res.data.generated);
      toast.success(`${res.data.total_generated} coupon(s) generated!`);
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to generate coupons');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied: ${code}`);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generated.map(c => c.code).join('\n'));
    toast.success(`Copied ${generated.length} codes`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      toast.success('Coupon deleted');
      load();
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await adminService.toggleCoupon(id);
      toast.success(res.message);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: res.data.active } : c));
    } catch {
      toast.error('Failed to update coupon');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Ticket className="h-7 w-7 text-teal" />
          <div>
            <h1 className="text-3xl font-bold text-warmgray-800">Coupon Generator</h1>
            <p className="text-warmgray-600 text-sm">Create and manage discount coupons</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setGenerated([]); }}
          className="px-5 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <Ticket className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Generate Coupons'}
        </button>
      </div>

      {/* Generator Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-warmgray-200 p-6">
          <h2 className="text-lg font-bold text-warmgray-800 mb-4">Bulk Coupon Generator</h2>
          <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Number of Coupons</label>
              <input type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Code Prefix (optional)</label>
              <input type="text" value={prefix} onChange={e => setPrefix(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER" maxLength={8}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Discount Type</label>
              <select value={discountType} onChange={e => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">
                Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input type="number" min={0.01} step={0.01} value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Min Order Amount (₹, optional)</label>
              <input type="number" min={0} step={0.01} value={minOrderAmount} onChange={e => setMinOrderAmount(e.target.value)}
                placeholder="No minimum"
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            {discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Max Discount Cap (₹, optional)</label>
                <input type="number" min={0} step={0.01} value={maxDiscountAmount} onChange={e => setMaxDiscountAmount(e.target.value)}
                  placeholder="No cap"
                  className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Usage Limit per Coupon</label>
              <input type="number" min={1} value={usageLimit} onChange={e => setUsageLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Valid From (optional)</label>
              <input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Valid Until (optional)</label>
              <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors">
                {submitting ? 'Generating…' : `Generate ${count} Coupon${count > 1 ? 's' : ''}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Generated Codes Preview */}
      {generated.length > 0 && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-green-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> {generated.length} Coupon{generated.length > 1 ? 's' : ''} Generated
            </h2>
            <button onClick={handleCopyAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
              <Copy className="h-3.5 w-3.5" /> Copy All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {generated.map(c => (
              <button key={c.id} onClick={() => handleCopy(c.code)}
                className="flex items-center justify-between px-3 py-2 bg-white border border-green-200 rounded-lg text-sm font-mono font-semibold text-green-800 hover:bg-green-100 transition-colors">
                {c.code}
                <Copy className="h-3 w-3 ml-1 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Existing Coupons */}
      <div className="bg-white rounded-xl border border-warmgray-200">
        <div className="p-4 border-b border-warmgray-100 flex items-center gap-3">
          <h2 className="text-base font-bold text-warmgray-800 flex-1">All Coupons ({coupons.length})</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warmgray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search codes…"
                className="pl-9 pr-3 py-1.5 border border-warmgray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <button type="submit" className="px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition-colors">Search</button>
          </form>
        </div>

        {loading ? (
          <div className="py-12 text-center text-warmgray-400">Loading…</div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-warmgray-400">No coupons found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-warmgray-50 border-b border-warmgray-100">
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Discount</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Usage</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Valid Until</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-warmgray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-50">
                {coupons.map(c => (
                  <tr key={c.id} className="hover:bg-warmgray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-warmgray-800">{c.code}</span>
                        <button onClick={() => handleCopy(c.code)} className="text-warmgray-400 hover:text-teal-500 transition-colors">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warmgray-700">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      {c.min_order_amount && <span className="text-xs text-warmgray-400 ml-1">(min ₹{c.min_order_amount})</span>}
                    </td>
                    <td className="px-4 py-3 text-warmgray-600">
                      {c.usage_count} / {c.usage_limit === 0 ? '∞' : c.usage_limit}
                    </td>
                    <td className="px-4 py-3 text-warmgray-500 text-xs">
                      {c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? 'bg-green-100 text-green-700' : 'bg-warmgray-100 text-warmgray-500'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleToggle(c.id)} title={c.active ? 'Deactivate' : 'Activate'}
                          className="p-1.5 rounded-lg hover:bg-warmgray-100 transition-colors text-warmgray-500 hover:text-teal-600">
                          {c.active ? <ToggleRight className="h-4 w-4 text-teal-500" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button onClick={() => handleDelete(c.id)} title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-warmgray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
