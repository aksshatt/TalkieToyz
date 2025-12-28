import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import AssessmentCard from '../components/assessment/AssessmentCard';
import { assessmentService } from '../services/assessmentService';
import type { AssessmentSummary } from '../types/assessment';
import Layout from '../components/layout/Layout';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-gradient rounded-full mb-4">
            <ClipboardList className="h-8 w-8 text-white" />
          </div>
          <h1 className="heading-talkie mb-4">Speech Development Assessments</h1>
          <p className="text-warmgray-600 max-w-2xl mx-auto">
            Take a quick assessment to understand your child's speech development and get personalized recommendations.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            <p className="mt-4 text-warmgray-600">Loading assessments...</p>
          </div>
        )}

        {error && (
          <div className="bg-coral-light border-l-4 border-coral p-4 rounded-lg mb-6">
            <p className="text-coral-dark">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        )}

        {!loading && !error && assessments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warmgray-600">No assessments available at the moment.</p>
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};

export default AssessmentList;
