import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, IndianRupee, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../config/axios';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { servicesService, type ServiceItem } from '../services/servicesService';

const BookSession: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    service_id: '',
    name: '',
    email: '',
    phone: '',
    child_name: '',
    child_age: '',
    preferred_date: '',
    preferred_language: 'English',
    message: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const list = await servicesService.list();
        setServices(list);
        const pre = params.get('service');
        if (pre) {
          const match = list.find((s) => s.slug === pre);
          if (match) setForm((f) => ({ ...f, service_id: String(match.id) }));
        }
      } catch {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const selected = useMemo(
    () => services.find((s) => String(s.id) === form.service_id),
    [services, form.service_id]
  );

  const handleChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_id) {
      toast.error('Please select a service');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/appointments', {
        appointment: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          preferred_language: form.preferred_language,
          service_id: Number(form.service_id),
          preferred_date: form.preferred_date || null,
          child_name: form.child_name,
          child_age: form.child_age,
        },
      });
      setSubmitted(true);
      toast.success('Booking request submitted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <SEO title="Booking Confirmed" url="/book" />
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-white rounded-3xl shadow-soft-lg p-10 text-center"
          >
            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-teal" />
            </div>
            <h1 className="text-2xl font-bold text-warmgray-900 mb-2">Booking Received!</h1>
            <p className="text-warmgray-600 mb-6">
              Thank you, {form.name || 'friend'}. Our team will reach out shortly to confirm your
              {selected ? ` ${selected.name} ` : ' '}session.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/" className="bg-teal-gradient text-white font-bold px-6 py-3 rounded-full shadow-soft">
                Back to Home
              </Link>
              <Link to="/services" className="bg-white border-2 border-teal/20 text-teal font-bold px-6 py-3 rounded-full">
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Book a Session"
        description="Book a therapy or counselling session at Talkie Toyz. Pick your service, see transparent pricing, and schedule with our expert team."
        url="/book"
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-teal-light/30 via-white to-coral-light/20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-warmgray-900 mb-3"
          >
            Book a <span className="bg-gradient-to-r from-teal to-coral bg-clip-text text-transparent">Session</span>
          </motion.h1>
          <p className="text-warmgray-600 max-w-2xl mx-auto">
            Pick the service that fits your child, see pricing upfront, and we’ll confirm your slot.
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-soft p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-2">Select Service *</label>
              {loading ? (
                <div className="h-12 bg-warmgray-100 rounded-xl animate-pulse" />
              ) : (
                <select
                  required
                  value={form.service_id}
                  onChange={(e) => handleChange('service_id', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal bg-white"
                >
                  <option value="">Choose a service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ₹{s.price} ({s.duration_minutes} min)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Your Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Phone *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-2">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Child’s Name</label>
                <input
                  value={form.child_name}
                  onChange={(e) => handleChange('child_name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Child’s Age</label>
                <input
                  placeholder="e.g. 4 years"
                  value={form.child_age}
                  onChange={(e) => handleChange('child_age', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Preferred Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={form.preferred_date}
                  onChange={(e) => handleChange('preferred_date', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">Preferred Language</label>
                <select
                  value={form.preferred_language}
                  onChange={(e) => handleChange('preferred_language', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal bg-white"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-warmgray-800 mb-2">Anything we should know?</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Concerns, prior diagnoses, goals..."
                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-gradient text-white font-bold py-3.5 rounded-full shadow-soft hover:shadow-soft-lg transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting...' : (<>Request Booking <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          {/* Summary card */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gradient-to-br from-teal-light/30 to-coral-light/20 rounded-3xl p-6 shadow-soft">
              <h3 className="text-lg font-bold text-warmgray-900 mb-4">Booking Summary</h3>
              {selected ? (
                <div className="space-y-4">
                  {selected.image_url && (
                    <img src={selected.image_url} alt={selected.name} className="w-full aspect-video object-cover rounded-2xl" />
                  )}
                  <div>
                    <div className="font-bold text-warmgray-900">{selected.name}</div>
                    <p className="text-sm text-warmgray-600 mt-1">{selected.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-warmgray-700">
                      <Clock className="w-4 h-4" /> {selected.duration_minutes} min
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xl font-extrabold text-teal">
                      <IndianRupee className="w-5 h-5" />{selected.price}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-warmgray-600 text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Select a service to see pricing.
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/60 text-xs text-warmgray-600 space-y-2">
                <p>✓ Pay after your first consultation</p>
                <p>✓ Reschedule up to 24h before</p>
                <p>✓ Certified, experienced therapists</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default BookSession;
