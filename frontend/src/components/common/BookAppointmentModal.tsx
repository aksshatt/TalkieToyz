import { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import toast from 'react-hot-toast';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookAppointmentModal = ({ isOpen, onClose }: BookAppointmentModalProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferred_language: 'English',
  });
  const [otherLanguage, setOtherLanguage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const language = form.preferred_language === 'Others'
        ? otherLanguage.trim() || 'Others'
        : form.preferred_language;
      await appointmentService.createAppointment({ ...form, preferred_language: language });
      setSubmitted(true);
      toast.success('Appointment request submitted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', message: '', preferred_language: 'English' });
    setOtherLanguage('');
    onClose();
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-soft-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-warmgray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-gradient rounded-full">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-bold text-lg text-warmgray-900">Book an Appointment</h2>
          </div>
          <button onClick={handleClose} className="p-1 text-warmgray-500 hover:text-warmgray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="font-bold text-xl text-warmgray-900 mb-2">Request Submitted!</h3>
            <p className="text-warmgray-600 mb-2">We'll contact you shortly to confirm your appointment.</p>
            <p className="text-sm text-warmgray-500 mb-6">
              <strong>Swekchaa Tamrakar</strong><br />
              Audiologist & Speech Therapist<br />
              BASLP, M.Sc. Audiology (Mumbai)
            </p>
            <button onClick={handleClose} className="btn-primary-talkie px-8">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm text-warmgray-600 bg-teal-light/20 p-3 rounded-lg">
              Book a session with <strong>Swekchaa Tamrakar</strong>, Audiologist & Speech Therapist (BASLP, M.Sc. Audiology, Mumbai)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-warmgray-700 mb-1">Phone *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Preferred Language</label>
              <select
                value={form.preferred_language}
                onChange={e => setForm({ ...form, preferred_language: e.target.value })}
                className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                <option value="Konkani">Konkani (कोंकणी)</option>
                <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                <option value="Others">Others</option>
              </select>
              {form.preferred_language === 'Others' && (
                <input
                  type="text"
                  value={otherLanguage}
                  onChange={e => setOtherLanguage(e.target.value)}
                  className="mt-2 w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none"
                  placeholder="Please specify language"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-warmgray-700 mb-1">Message / Concern</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2 border-2 border-warmgray-300 rounded-lg text-sm focus:border-teal focus:outline-none resize-none"
                placeholder="Briefly describe your child's needs or any concerns..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-gradient text-white font-semibold rounded-xl disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Request Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentModal;
