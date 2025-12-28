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
  const [childAge, setChildAge] = useState('');

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
      const response = await assessmentService.submitAssessment(slug!, {
        child_name: childName,
        child_age_months: parseInt(childAge),
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
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
        </div>
      </Layout>
    );
  }

  if (!assessment) return null;

  if (!started) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light py-12">
          <div className="container-talkie max-w-2xl">
            <button onClick={() => navigate('/assessments')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Assessments
            </button>
            <div className="card-talkie p-8">
              <h1 className="heading-talkie mb-4">{assessment.title}</h1>
              <p className="text-warmgray-700 mb-6">{assessment.description}</p>
              <div className="bg-teal-light/30 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Assessment Details:</h3>
                <ul className="space-y-1 text-sm text-warmgray-700">
                  <li>• {assessment.question_count} questions</li>
                  <li>• Recommended for ages {assessment.min_age}-{assessment.max_age} months</li>
                  <li>• Takes approximately 10-15 minutes</li>
                </ul>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-2">Child's Name</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="Enter child's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-2">Child's Age (months)</label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
                    placeholder="Enter age in months"
                    min="0"
                    max="240"
                  />
                </div>
              </div>
              <button
                onClick={handleStart}
                disabled={!childName || !childAge}
                className="btn-primary-talkie w-full"
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
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <AssessmentQuiz assessment={assessment} onComplete={handleComplete} />
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentDetail;
