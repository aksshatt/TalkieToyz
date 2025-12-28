import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams } from 'react-router-dom';
import AssessmentResults from '../components/assessment/AssessmentResults';
import type { AssessmentResult } from '../types/assessment';

const AssessmentResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the result from API
    // For now, get from localStorage or state
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
        </div>
      </Layout>
    );
  }

  if (!result) return <div>Result not found</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <AssessmentResults result={result} />
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentResultsPage;
