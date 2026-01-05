import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import AssessmentResults from '../components/assessment/AssessmentResults';
import { assessmentService } from '../services/assessmentService';
import type { AssessmentResult } from '../types/assessment';

const AssessmentResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) {
        setError('No result ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await assessmentService.getAssessmentResult(id);
        setResult(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch assessment result:', err);
        setError(err.response?.data?.message || 'Failed to load assessment results');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
            <p className="text-warmgray-600">Loading your results...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !result) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="bg-coral-light border-l-4 border-coral p-6 rounded-lg mb-6">
              <p className="text-coral-dark font-semibold mb-2">Error</p>
              <p className="text-warmgray-700">{error || 'Result not found'}</p>
            </div>
            <button
              onClick={() => navigate('/assessments')}
              className="btn-primary-talkie"
            >
              Back to Assessments
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-6 sm:py-8 md:py-12 px-4">
        <div className="container-talkie">
          <AssessmentResults result={result} />
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentResultsPage;
