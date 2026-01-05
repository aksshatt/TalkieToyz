import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AssessmentQuiz from '../components/assessment/AssessmentQuiz';
import { assessmentService } from '../services/assessmentService';
import type { Assessment } from '../types/assessment';

const AssessmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(''); // Age in years
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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
    }
  };

  const handleComplete = async (answers: Record<string, any>) => {
    try {
      // Convert years to months for backend compatibility
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
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">Child's Name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                    placeholder="Enter child's name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">Child's Age (years)</label>
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

                {/* Language Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-warmgray-700 mb-2">Preferred Language</label>
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

                {/* Quick Screening Questions */}
                <div className="bg-coral-light/20 p-3 sm:p-4 rounded-lg">
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
              </div>

              <button
                onClick={handleStart}
                disabled={!childName || !childAge}
                className="btn-primary-talkie w-full text-sm sm:text-base py-2.5 sm:py-3"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
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
