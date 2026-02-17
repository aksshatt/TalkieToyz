import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ClipboardList, X } from 'lucide-react';
import AssessmentQuiz from '../components/assessment/AssessmentQuiz';
import { assessmentService } from '../services/assessmentService';
import type { Assessment } from '../types/assessment';

const AssessmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Check if we came from the list page modal with autoStart
  useEffect(() => {
    const state = location.state as { childName?: string; childAge?: string; selectedLanguage?: string; autoStart?: boolean } | null;
    if (state?.autoStart && state.childName && state.childAge) {
      setChildName(state.childName);
      setChildAge(state.childAge);
      setSelectedLanguage(state.selectedLanguage || 'English');
      setStarted(true);
      // Clear the state so refreshing doesn't auto-start again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (slug) loadAssessment();
  }, [slug]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const response = await assessmentService.getAssessment(slug!);
      setAssessment(response.data);
    } catch (err) {
      console.error('Failed to load assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (childName && childAge) {
      setStarted(true);
      setShowModal(false);
    }
  };

  const handleComplete = async (answers: Record<string, any>) => {
    try {
      const ageInMonths = parseInt(childAge) * 12;
      const response = await assessmentService.submitAssessment(slug!, {
        child_name: childName,
        child_age_months: ageInMonths,
        answers,
      });
      navigate(`/assessment/results/${response.data.id}`);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-teal"></div>
        </div>
      </Layout>
    );
  }

  if (!assessment) return null;

  if (!started) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-4 sm:py-6 md:py-12 px-4">
          <div className="container-talkie max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/assessments')}
              className="btn-secondary-talkie mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back to Assessments</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="card-talkie p-4 sm:p-6 md:p-8">
              <h1 className="heading-talkie mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl">{assessment.title}</h1>
              <p className="text-sm sm:text-base text-warmgray-700 mb-4 sm:mb-6">{assessment.description}</p>
              <div className="bg-teal-light/30 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2">Assessment Details:</h3>
                <ul className="space-y-1 text-xs sm:text-sm text-warmgray-700">
                  <li>• {assessment.question_count} questions</li>
                  <li>• Recommended for ages {Math.floor(assessment.min_age / 12)}-{Math.ceil(assessment.max_age / 12)} years</li>
                  <li>• Takes approximately 10-15 minutes</li>
                </ul>
              </div>

              {/* Quick Screening Questions */}
              <div className="bg-coral-light/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-warmgray-800">Quick Screening Questions:</h3>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-coral mt-0.5 flex-shrink-0">•</span>
                    <p className="text-warmgray-700">Does your child respond to their name when called?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-coral mt-0.5 flex-shrink-0">•</span>
                    <p className="text-warmgray-700">Can your child follow simple one-step instructions?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-coral mt-0.5 flex-shrink-0">•</span>
                    <p className="text-warmgray-700">Does your child make eye contact during conversations?</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-coral mt-0.5 flex-shrink-0">•</span>
                    <p className="text-warmgray-700">Is your child able to express basic needs verbally or through gestures?</p>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-warmgray-600 mt-2 sm:mt-3 italic">
                  *These questions help us understand your child's current developmental stage
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full text-sm sm:text-base py-2.5 sm:py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[#B2EBF2] via-[#4DD0E1] to-[#26C6DA] hover:from-[#FF85C0] hover:via-[#FF69B4] hover:to-[#FF4DA6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Start Assessment Modal */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={handleBackdropClick}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft-lg w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-in">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-warmgray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-gradient rounded-full shadow-soft">
                    <ClipboardList className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="font-[var(--font-family-fun)] font-bold text-lg sm:text-xl text-warmgray-900">
                    Start Assessment
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-warmgray-500 hover:text-warmgray-700 transition-colors p-1"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                      Child's Name *
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                      placeholder="Enter child's name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                      Child's Age (years) *
                    </label>
                    <input
                      type="number"
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                      placeholder="Enter age in years"
                      min="0"
                      max="20"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-1.5">
                      Preferred Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                      <option value="Konkani">Konkani (कोंकणी)</option>
                      <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-warmgray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-warmgray-300 text-warmgray-700 rounded-xl hover:bg-warmgray-50 transition-colors font-semibold order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStart}
                  disabled={!childName || !childAge}
                  className="flex-1 text-sm sm:text-base py-2.5 sm:py-3 font-semibold rounded-full text-white bg-gradient-to-r from-[#B2EBF2] via-[#4DD0E1] to-[#26C6DA] hover:from-[#FF85C0] hover:via-[#FF69B4] hover:to-[#FF4DA6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none order-1 sm:order-2"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-4 sm:py-6 md:py-12 px-4">
        <div className="container-talkie max-w-4xl mx-auto">
          <AssessmentQuiz assessment={assessment} onComplete={handleComplete} />
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentDetail;
