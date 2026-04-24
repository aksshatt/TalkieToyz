import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Star,
  User,
  Mail,
  Phone,
  Baby,
  Languages,
  MessageCircle,
  PartyPopper,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../config/axios';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { servicesService, type ServiceItem } from '../services/servicesService';

const trustBadges = [
  { icon: ShieldCheck, label: 'Certified Experts', sub: 'RCI registered therapists' },
  { icon: HeartHandshake, label: 'Child-Friendly', sub: 'Play-based, gentle sessions' },
  { icon: Sparkles, label: 'Personalised Plan', sub: 'Tailored to your child' },
  { icon: Star, label: 'Trusted by 2000+', sub: 'Families across India' },
];

const testimonials = [
  {
    quote: 'The team made us feel at home. My son looks forward to every session now!',
    author: 'Priya S., Mumbai',
  },
  {
    quote: 'Booking was easy and the therapist was wonderful with our daughter.',
    author: 'Rahul M., Pune',
  },
];

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
      document.getElementById('service-picker')?.scrollIntoView({ behavior: 'smooth' });
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
        <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 overflow-hidden bg-gradient-to-br from-teal-light/40 via-cream-light to-coral-light/30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                background: i % 2 ? '#f59e8a' : '#14b8a6',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="relative max-w-xl w-full bg-white rounded-3xl shadow-soft-xl p-10 text-center border border-teal/10"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-teal to-teal-dark rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg"
            >
              <PartyPopper className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-warmgray-900 mb-2">You're all set!</h1>
            <p className="text-warmgray-600 mb-6 text-lg">
              Thanks {form.name || 'friend'} — our team will call you within 24 hours to confirm
              {selected ? ` your ${selected.name} ` : ' your '}session.
            </p>
            <div className="bg-teal-light/30 rounded-2xl p-4 mb-6 text-sm text-warmgray-700 flex items-center gap-3 justify-center">
              <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
              <span>Confirmation email sent to <strong>{form.email}</strong></span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/" className="bg-teal-gradient text-white font-bold px-6 py-3 rounded-full shadow-soft hover:shadow-soft-lg transition-all">
                Back to Home
              </Link>
              <Link to="/services" className="bg-white border-2 border-teal/30 text-teal font-bold px-6 py-3 rounded-full hover:bg-teal/5 transition-all">
                Explore More Services
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-dark via-teal to-sky py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-15%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '-5%' }}
        />
        {[Sparkles, HeartHandshake, Star].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20 pointer-events-none hidden md:block"
            style={{ top: `${15 + i * 22}%`, left: `${5 + i * 30}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full mb-5 border border-white/25"
          >
            <Sparkles className="w-4 h-4 text-sunshine" />
            <span className="text-sm font-semibold">Expert Care for Your Little One</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
          >
            Book Your Child's <span className="text-sunshine">Session</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
          >
            Warm, play-based therapy with certified experts. Transparent pricing, flexible slots,
            and a team that genuinely cares.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/90 text-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sunshine" /> No upfront payment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sunshine" /> Free first consultation call
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sunshine" /> Reschedule anytime
            </span>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-cream-light py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-soft border border-warmgray-100 text-center hover:shadow-soft-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-teal-light/40 flex items-center justify-center mx-auto mb-2">
                <b.icon className="w-5 h-5 text-teal" />
              </div>
              <div className="font-bold text-warmgray-900 text-sm">{b.label}</div>
              <div className="text-xs text-warmgray-600 mt-0.5">{b.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Service picker + form */}
      <section className="py-12 px-4 bg-cream-light">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            {/* Step 1: Service */}
            <motion.div
              id="service-picker"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-soft p-6 md:p-8 border border-warmgray-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-teal-gradient text-white font-extrabold flex items-center justify-center shadow-soft">1</div>
                <h2 className="text-xl md:text-2xl font-extrabold text-warmgray-900">Pick your service</h2>
              </div>
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-warmgray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <p className="text-warmgray-600">No services available right now.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const active = String(s.id) === form.service_id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => handleChange('service_id', String(s.id))}
                        className={`group text-left rounded-2xl p-4 border-2 transition-all ${
                          active
                            ? 'border-teal bg-teal-light/20 shadow-soft-md'
                            : 'border-warmgray-200 bg-white hover:border-teal/40 hover:shadow-soft'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-warmgray-900 leading-tight">{s.name}</div>
                          <div
                            className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              active ? 'border-teal bg-teal' : 'border-warmgray-300'
                            }`}
                          >
                            {active && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-sm text-warmgray-600">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {s.duration_minutes} min
                          </span>
                          <span className="inline-flex items-center gap-0.5 font-bold text-teal">
                            <IndianRupee className="w-3.5 h-3.5" />{s.price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Step 2: Details */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-soft p-6 md:p-8 space-y-5 border border-warmgray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-coral-gradient text-white font-extrabold flex items-center justify-center shadow-soft">2</div>
                <h2 className="text-xl md:text-2xl font-extrabold text-warmgray-900">Your details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FieldInput
                  icon={User}
                  label="Your Name *"
                  value={form.name}
                  onChange={(v) => handleChange('name', v)}
                  required
                />
                <FieldInput
                  icon={Phone}
                  label="Phone *"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => handleChange('phone', v)}
                  required
                />
              </div>

              <FieldInput
                icon={Mail}
                label="Email *"
                type="email"
                value={form.email}
                onChange={(v) => handleChange('email', v)}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FieldInput
                  icon={Baby}
                  label="Child's Name"
                  value={form.child_name}
                  onChange={(v) => handleChange('child_name', v)}
                />
                <FieldInput
                  icon={Baby}
                  label="Child's Age"
                  placeholder="e.g. 4 years"
                  value={form.child_age}
                  onChange={(v) => handleChange('child_age', v)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FieldInput
                  icon={Calendar}
                  label="Preferred Date & Time"
                  type="datetime-local"
                  value={form.preferred_date}
                  onChange={(v) => handleChange('preferred_date', v)}
                />
                <div>
                  <label className="block text-sm font-bold text-warmgray-800 mb-2">
                    <Languages className="w-4 h-4 inline mr-1.5 -mt-0.5 text-teal" />
                    Preferred Language
                  </label>
                  <select
                    value={form.preferred_language}
                    onChange={(e) => handleChange('preferred_language', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 bg-white transition-all"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-warmgray-800 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-1.5 -mt-0.5 text-teal" />
                  Anything we should know?
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Concerns, prior diagnoses, goals, milestones..."
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 resize-none transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-teal-gradient text-white font-extrabold py-4 rounded-full shadow-soft-md hover:shadow-soft-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 text-lg"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request My Booking <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
              <p className="text-center text-xs text-warmgray-500">
                By booking, you agree to our friendly reschedule & refund policy.
              </p>
            </motion.form>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 gap-4">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-soft border border-warmgray-100"
                >
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-sunshine text-sunshine" />
                    ))}
                  </div>
                  <p className="text-warmgray-700 italic text-sm mb-2">“{t.quote}”</p>
                  <p className="text-xs font-semibold text-warmgray-500">— {t.author}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-6 shadow-soft-md border border-teal/15 overflow-hidden relative"
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-teal-light/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-coral-light/30 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-teal" />
                  <h3 className="text-lg font-extrabold text-warmgray-900">Booking Summary</h3>
                </div>
                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {selected.image_url && (
                        <img
                          src={selected.image_url}
                          alt={selected.name}
                          className="w-full aspect-video object-cover rounded-2xl shadow-soft"
                        />
                      )}
                      <div>
                        <div className="font-extrabold text-warmgray-900 text-lg">{selected.name}</div>
                        <p className="text-sm text-warmgray-600 mt-1 line-clamp-3">{selected.description}</p>
                      </div>
                      <div className="bg-gradient-to-br from-teal-light/30 to-coral-light/20 rounded-2xl p-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-warmgray-700">
                          <Clock className="w-4 h-4" /> {selected.duration_minutes} min
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-2xl font-extrabold text-teal">
                          <IndianRupee className="w-5 h-5" />
                          {selected.price}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-warmgray-600 text-sm flex flex-col items-center gap-3 py-6 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-teal-light/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-teal" />
                      </div>
                      <p>Pick a service above to see pricing and details.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 pt-6 border-t border-warmgray-200 space-y-2.5">
                  {[
                    'Pay only after your first consultation',
                    'Free reschedule up to 24h before',
                    'Certified, experienced therapists',
                    '100% child-safe, play-based sessions',
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-2 text-sm text-warmgray-700">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="mt-4 bg-gradient-to-br from-coral to-coral-dark text-white rounded-2xl p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Need help?</span>
              </div>
              <p className="text-sm mb-2 text-white/90">Talk to our care team for guidance.</p>
              <a href="tel:+919999999999" className="font-extrabold underline underline-offset-2">
                +91 99999 99999
              </a>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

interface FieldInputProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const FieldInput: React.FC<FieldInputProps> = ({ icon: Icon, label, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-sm font-bold text-warmgray-800 mb-2">
      <Icon className="w-4 h-4 inline mr-1.5 -mt-0.5 text-teal" />
      {label}
    </label>
    <input
      required={required}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition-all"
    />
  </div>
);

export default BookSession;
