import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, CheckCircle, X, Globe, ChevronRight, Brain, Sparkles, Star } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AssessmentCard from '../components/assessment/AssessmentCard';
import StartAssessmentModal from '../components/assessment/StartAssessmentModal';
import { assessmentService } from '../services/assessmentService';
import { appointmentService } from '../services/appointmentService';
import type { AssessmentSummary } from '../types/assessment';
import Layout from '../components/layout/Layout';

const LANGUAGES = [
  { name: 'Hindi', native: 'हिंदी' },
  { name: 'English', native: 'English' },
  { name: 'Marathi', native: 'मराठी' },
  { name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { name: 'Konkani', native: 'कोंकणी' },
  { name: 'Gujarati', native: 'ગુજરાતી' },
];

const AssessmentList = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [bookingData, setBookingData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentSummary | null>(null);

  useEffect(() => { loadAssessments(); }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const response = await assessmentService.getAssessments();
      setAssessments(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Child Development Assessments"
        description="Take our free speech and developmental assessments designed by therapists. Understand your child's communication milestones and get personalized toy recommendations."
        url="/assessments"
      />
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-dark via-sky to-teal py-20 px-4">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '-10%', left: '-5%' }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-sunshine/20 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, 28, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ bottom: '-15%', right: '5%' }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-coral/15 blur-2xl pointer-events-none"
          animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ top: '20%', right: '20%' }}
        />

        {[Brain, ClipboardList, Star, Sparkles].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 pointer-events-none"
            style={{ top: `${10 + i * 22}%`, left: `${5 + i * 22}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          >
            <Icon className="w-7 h-7" />
          </motion.div>
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
          >
            <ClipboardList className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl md:text-5xl font-[var(--font-family-fun)] font-bold mb-4"
          >
            Speech Development <span className="text-sunshine">Assessments</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-white/85 max-w-xl mx-auto"
          >
            Take a quick assessment to understand your child's speech development and get personalized recommendations.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48C240 16 480 0 720 0C960 0 1200 16 1440 48H0Z" fill="#fdf8f0" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-light min-h-screen py-10 px-4">
        <div className="container-talkie">

          {loading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto" />
              <p className="mt-4 text-warmgray-600">Loading assessments...</p>
            </div>
          )}

          {error && (
            <div className="bg-coral-light border-l-4 border-coral p-4 rounded-xl mb-6">
              <p className="text-coral-dark">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {assessments.map((assessment, i) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.4 }}
                >
                  <AssessmentCard assessment={assessment} onStartAssessment={setSelectedAssessment} />
                </motion.div>
              ))}
            </div>
          )}

          {!loading && !error && assessments.length === 0 && (
            <div className="text-center py-16 text-warmgray-600">No assessments available at the moment.</div>
          )}

          {/* CTA: Book Appointment */}
          {!loading && (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-coral-light/40 via-white to-teal-light/20 rounded-3xl p-8 md:p-10 shadow-soft-lg border border-coral/10 text-center">
                {/* Background decoration */}
                <motion.div
                  className="absolute w-48 h-48 rounded-full bg-coral/10 blur-3xl pointer-events-none"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ top: '-20%', right: '10%' }}
                />

                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-coral-gradient rounded-2xl mb-4 shadow-soft"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Calendar className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="font-[var(--font-family-fun)] font-bold text-2xl text-warmgray-900 mb-3">
                  Need Professional Support?
                </h2>
                <p className="text-warmgray-600 mb-6 max-w-2xl mx-auto">
                  Our speech therapy experts provide personalized online therapy sessions tailored to your child's needs.
                </p>

                {!showBookingModal && (
                  <motion.button
                    onClick={() => setShowBookingModal(true)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-coral to-coral-dark text-white font-bold px-8 py-4 rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-shadow"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Appointment for Online Therapy
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                )}

                {/* Booking Form */}
                <AnimatePresence>
                  {showBookingModal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mt-8 overflow-hidden"
                    >
                      <div className="bg-white rounded-2xl shadow-soft-lg p-6 md:p-8 max-w-3xl mx-auto text-left">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900">Book an Appointment</h3>
                          <button
                            onClick={() => { setShowBookingModal(false); setSubmitError(null); setSubmitSuccess(false); }}
                            className="text-warmgray-400 hover:text-warmgray-700 transition-colors p-1 rounded-lg hover:bg-warmgray-100"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          setSubmitting(true); setSubmitError(null); setSubmitSuccess(false);
                          try {
                            await appointmentService.createAppointment({ ...bookingData, preferred_language: selectedLanguage });
                            setSubmitSuccess(true);
                            setBookingData({ name: '', email: '', phone: '', message: '' });
                            setSelectedLanguage('English');
                            setTimeout(() => { setShowBookingModal(false); setSubmitSuccess(false); }, 3000);
                          } catch (err: any) {
                            setSubmitError(err.response?.data?.message || 'Failed to submit. Please try again.');
                          } finally { setSubmitting(false); }
                        }}>
                          {submitSuccess && (
                            <div className="mb-5 bg-teal-light/30 border-l-4 border-teal p-4 rounded-xl flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-teal-dark">Success!</p>
                                <p className="text-sm text-warmgray-700">Your appointment request has been submitted. We'll contact you soon!</p>
                              </div>
                            </div>
                          )}
                          {submitError && (
                            <div className="mb-5 bg-coral-light/30 border-l-4 border-coral p-4 rounded-xl flex items-start gap-3">
                              <X className="h-5 w-5 text-coral-dark mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-coral-dark">Error</p>
                                <p className="text-sm text-warmgray-700">{submitError}</p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Preferred Language</label>
                              <select
                                value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal/10 focus:border-teal bg-warmgray-50 focus:bg-white transition-all"
                              >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi (हिंदी)</option>
                                <option value="Marathi">Marathi (मराठी)</option>
                                <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                                <option value="Konkani">Konkani (कोंकणी)</option>
                                <option value="Gujarati">Gujarati (ગુજรાતી)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Your Name *</label>
                              <input type="text" value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} required
                                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal/10 focus:border-teal bg-warmgray-50 focus:bg-white transition-all"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Email Address *</label>
                              <input type="email" value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} required
                                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal/10 focus:border-teal bg-warmgray-50 focus:bg-white transition-all"
                                placeholder="your.email@example.com"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Phone Number *</label>
                              <input type="tel" value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })} required
                                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal/10 focus:border-teal bg-warmgray-50 focus:bg-white transition-all"
                                placeholder="+91 1234567890"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-semibold text-warmgray-700 mb-1.5">Message (Optional)</label>
                              <textarea value={bookingData.message} onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })} rows={4}
                                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal/10 focus:border-teal bg-warmgray-50 focus:bg-white transition-all resize-none"
                                placeholder="Tell us about your child's needs or any specific concerns..."
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button type="button" disabled={submitting}
                              onClick={() => { setShowBookingModal(false); setSubmitError(null); setSubmitSuccess(false); }}
                              className="flex-1 px-6 py-3 border-2 border-warmgray-200 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <motion.button type="submit" disabled={submitting || submitSuccess}
                              whileHover={{ scale: submitting || submitSuccess ? 1 : 1.02 }}
                              whileTap={{ scale: submitting || submitSuccess ? 1 : 0.97 }}
                              className="flex-1 bg-gradient-to-r from-coral to-coral-dark text-white font-bold px-6 py-3 rounded-xl shadow-soft hover:shadow-soft-md transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {submitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Request'}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Languages Available */}
          {!loading && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl shadow-soft p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-gradient rounded-xl mb-4 shadow-soft">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-[var(--font-family-fun)] font-bold text-xl text-warmgray-900 mb-3">
                  Languages Available
                </h3>
                <p className="text-warmgray-600 text-sm mb-5 max-w-lg mx-auto">
                  Our therapy sessions are available in the following languages:
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {LANGUAGES.map((lang, i) => (
                    <motion.span
                      key={lang.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ scale: 1.06, y: -2 }}
                      className="bg-gradient-to-r from-teal-light/40 to-sky-light/40 text-warmgray-800 text-sm font-semibold px-4 py-2 rounded-full border border-teal/20 shadow-soft-sm cursor-default"
                    >
                      {lang.name} <span className="text-warmgray-500">({lang.native})</span>
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {selectedAssessment && (
        <StartAssessmentModal
          assessment={selectedAssessment}
          isOpen={!!selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </Layout>
  );
};

export default AssessmentList;
