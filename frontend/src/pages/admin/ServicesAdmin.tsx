import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, IndianRupee, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminServicesService, type ServiceItem } from '../../services/servicesService';

const ServicesAdmin: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const list = await adminServicesService.list();
      setServices(list);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (s: ServiceItem) => {
    try {
      await adminServicesService.update(s.id, { active: !s.active });
      toast.success(`Service ${!s.active ? 'activated' : 'deactivated'}`);
      load();
    } catch { toast.error('Failed to toggle'); }
  };

  const remove = async (s: ServiceItem) => {
    if (!confirm(`Delete service "${s.name}"?`)) return;
    try {
      await adminServicesService.destroy(s.id);
      toast.success('Service deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warmgray-900">Services &amp; Pricing</h1>
          <p className="text-warmgray-600 text-sm">Manage the services shown on the booking page.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 bg-teal-gradient text-white font-semibold px-4 py-2.5 rounded-full shadow-soft"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-warmgray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <motion.div
              key={s.id}
              layout
              className={`bg-white rounded-2xl shadow-soft p-5 border-2 ${s.active ? 'border-teal/20' : 'border-warmgray-200 opacity-70'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-warmgray-900 truncate">{s.name}</h3>
                  <p className="text-xs text-warmgray-500 mt-0.5">#{s.display_order} · {s.slug}</p>
                </div>
                <button onClick={() => toggleActive(s)} title="Toggle active" className="text-teal">
                  {s.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-warmgray-400" />}
                </button>
              </div>
              <p className="text-sm text-warmgray-600 mt-2 line-clamp-2">{s.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="inline-flex items-center gap-1 font-bold text-teal">
                  <IndianRupee className="w-4 h-4" />{s.price}
                </span>
                <span className="inline-flex items-center gap-1 text-warmgray-600">
                  <Clock className="w-4 h-4" />{s.duration_minutes} min
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditing(s)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-teal/10 text-teal font-semibold px-3 py-2 rounded-lg hover:bg-teal/20"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => remove(s)}
                  className="inline-flex items-center justify-center gap-1.5 bg-coral/10 text-coral font-semibold px-3 py-2 rounded-lg hover:bg-coral/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <ServiceForm
          service={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
};

const ServiceForm: React.FC<{
  service: ServiceItem | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ service, onClose, onSaved }) => {
  const [form, setForm] = useState<Partial<ServiceItem>>({
    name: service?.name || '',
    slug: service?.slug || '',
    description: service?.description || '',
    price: service?.price ?? 0,
    duration_minutes: service?.duration_minutes ?? 45,
    display_order: service?.display_order ?? 0,
    active: service?.active ?? true,
    image_url: service?.image_url || '',
    icon: service?.icon || '',
  });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (service) {
        await adminServicesService.update(service.id, form);
        toast.success('Service updated');
      } else {
        await adminServicesService.create(form);
        toast.success('Service created');
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof ServiceItem, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={save}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-soft-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-warmgray-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-xl font-bold text-warmgray-900">{service ? 'Edit Service' : 'New Service'}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-warmgray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-warmgray-800 mb-1">Name *</label>
            <input
              required
              value={form.name as string}
              onChange={(e) => set('name', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-warmgray-800 mb-1">Slug</label>
            <input
              value={form.slug as string}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="auto-generated from name"
              className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-warmgray-800 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description as string}
              onChange={(e) => set('description', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal resize-none"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-1">Price (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price as number}
                onChange={(e) => set('price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={form.duration_minutes as number}
                onChange={(e) => set('duration_minutes', parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-1">Order</label>
              <input
                type="number"
                value={form.display_order as number}
                onChange={(e) => set('display_order', parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-1">Image URL</label>
              <input
                value={form.image_url as string}
                onChange={(e) => set('image_url', e.target.value)}
                placeholder="/services/speech-therapy.png"
                className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-1">Icon</label>
              <input
                value={form.icon as string}
                onChange={(e) => set('icon', e.target.value)}
                placeholder="lucide icon name"
                className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-warmgray-800">Active (shown to users)</span>
          </label>
        </div>

        <div className="p-6 border-t border-warmgray-100 flex gap-3 justify-end bg-warmgray-50 rounded-b-3xl sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full font-semibold text-warmgray-700 hover:bg-warmgray-100">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-teal-gradient text-white font-bold px-6 py-2.5 rounded-full shadow-soft disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ServicesAdmin;
