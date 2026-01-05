import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, CheckCircle, X } from 'lucide-react';
import AssessmentCard from '../components/assessment/AssessmentCard';
import { assessmentService } from '../services/assessmentService';
import { appointmentService } from '../services/appointmentService';
import type { AssessmentSummary } from '../types/assessment';
import Layout from '../components/layout/Layout';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

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
      <div className="min-h-screen bg-cream-light py-6 sm:py-8 md:py-12 px-4">
        <div className="container-talkie">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-gradient rounded-full mb-3 sm:mb-4">
              <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h1 className="heading-talkie mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">Speech Development Assessments</h1>
            <p className="text-sm sm:text-base text-warmgray-600 max-w-2xl mx-auto px-4">
              Take a quick assessment to understand your child's speech development and get personalized recommendations.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-teal mx-auto"></div>
              <p className="mt-4 text-sm sm:text-base text-warmgray-600">Loading assessments...</p>
            </div>
          )}

          {error && (
            <div className="bg-coral-light border-l-4 border-coral p-3 sm:p-4 rounded-lg mb-6 mx-4 sm:mx-0">
              <p className="text-sm sm:text-base text-coral-dark">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          )}

          {!loading && !error && assessments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-warmgray-600">No assessments available at the moment.</p>
            </div>
          )}

          {/* Book Appointment Section */}
          {!loading && (
            <div className="mt-8 sm:mt-10 md:mt-12">
              <div className="bg-gradient-to-br from-teal-light/40 via-cream-light to-coral-light/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft-lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-coral-gradient rounded-full mb-3 sm:mb-4">
                    <Calendar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <h2 className="font-[var(--font-family-fun)] font-bold text-xl sm:text-2xl text-warmgray-900 mb-2 sm:mb-3">
                    Need Professional Support?
                  </h2>
                  <p className="text-sm sm:text-base text-warmgray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
                    Book an appointment with our speech therapy experts for personalized therapy sessions.
                  </p>

                  {!showBookingModal ? (
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      Book Appointment  
                    </button>
                  ) : null}
                </div>

                {/* Booking Form - Inline Expansion */}
                {showBookingModal && (
                  <div className="mt-6 sm:mt-8 animate-slide-in">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft-lg p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h3 className="font-[var(--font-family-fun)] font-bold text-xl sm:text-2xl text-warmgray-900">
                          Book an Appointment
                        </h3>
                        <button
                          onClick={() => {
                            setShowBookingModal(false);
                            setSubmitError(null);
                            setSubmitSuccess(false);
                          }}
                          className="text-warmgray-500 hover:text-warmgray-700 transition-colors p-1"
                          aria-label="Close booking form"
                        >
                          <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </div>

                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        setSubmitting(true);
                        setSubmitError(null);
                        setSubmitSuccess(false);

                        try {
                          await appointmentService.createAppointment({
                            ...bookingData,
                            preferred_language: selectedLanguage
                          });

                          setSubmitSuccess(true);
                          setBookingData({ name: '', email: '', phone: '', message: '' });
                          setSelectedLanguage('English');

                          // Close form after 3 seconds
                          setTimeout(() => {
                            setShowBookingModal(false);
                            setSubmitSuccess(false);
                          }, 3000);
                        } catch (err: any) {
                          setSubmitError(err.response?.data?.message || 'Failed to submit appointment request. Please try again.');
                        } finally {
                          setSubmitting(false);
                        }
                      }}>
                        {/* Success Message */}
                        {submitSuccess && (
                          <div className="mb-4 sm:mb-6 bg-teal-light/30 border-l-4 border-teal p-3 sm:p-4 rounded-lg flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-teal mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-sm sm:text-base text-teal-dark">Success!</p>
                              <p className="text-xs sm:text-sm text-warmgray-700">Your appointment request has been submitted. We will contact you soon!</p>
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {submitError && (
                          <div className="mb-4 sm:mb-6 bg-coral-light/30 border-l-4 border-coral p-3 sm:p-4 rounded-lg flex items-start gap-3">
                            <X className="h-5 w-5 text-coral-dark mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-sm sm:text-base text-coral-dark">Error</p>
                              <p className="text-xs sm:text-sm text-warmgray-700">{submitError}</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {/* Language Selection */}
                          <div className="md:col-span-2">
                            <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">
                              Preferred Language
                            </label>
                            <select
                              value={selectedLanguage}
                              onChange={(e) => setSelectedLanguage(e.target.value)}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                            >
                              <option value="English">English</option>
                              <option value="Hindi">Hindi (हिंदी)</option>
                              <option value="Marathi">Marathi (मराठी)</option>
                              <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                              <option value="Konkani">Konkani (कोंकणी)</option>
                              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                            </select>
                          </div>

                          {/* Name */}
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">
                              Your Name *
                            </label>
                            <input
                              type="text"
                              value={bookingData.name}
                              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                              required
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={bookingData.email}
                              onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                              required
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                              placeholder="your.email@example.com"
                            />
                          </div>

                          {/* Phone */}
                          <div className="md:col-span-2">
                            <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={bookingData.phone}
                              onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                              required
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
                              placeholder="+91 1234567890"
                            />
                          </div>

                          {/* Message */}
                          <div className="md:col-span-2">
                            <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">
                              Message (Optional)
                            </label>
                            <textarea
                              value={bookingData.message}
                              onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                              rows={4}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-warmgray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                              placeholder="Tell us about your child's needs or any specific concerns..."
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              setShowBookingModal(false);
                              setSubmitError(null);
                              setSubmitSuccess(false);
                            }}
                            disabled={submitting}
                            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-warmgray-300 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting || submitSuccess}
                            className="flex-1 btn-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                          >
                            {submitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Request'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentList;
