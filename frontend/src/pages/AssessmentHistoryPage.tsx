import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { assessmentService } from '../services/assessmentService';
import { ClipboardList, Download, Eye, ArrowLeft } from 'lucide-react';
import type { AssessmentResult } from '../types/assessment';

const SCORE_LEVEL = (pct: number) => {
  if (pct >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
  if (pct >= 60) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (pct >= 40) return { label: 'Making Progress', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  return { label: 'Needs Support', color: 'text-red-600', bg: 'bg-red-100' };
};

const AssessmentHistoryPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    assessmentService.getMyResults()
      .then(r => setResults(r.data))
      .catch(() => setError('Failed to load your assessment history.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownloadPdf = async (result: AssessmentResult) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${baseUrl}/assessment_results/${result.id}/download_pdf`, {
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_${result.child_name}_${result.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ageDisplay = (months: number) => {
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m > 0 ? `${y} yr ${m} mo` : `${y} yr`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/assessments')}
            className="btn-secondary-talkie mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessments
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-gradient rounded-xl shadow-soft">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="heading-talkie">Assessment History</h1>
              <p className="text-warmgray-600 text-sm">All your past child assessments</p>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="card-talkie p-6 text-center text-coral">{error}</div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="card-talkie p-12 text-center">
              <ClipboardList className="h-12 w-12 text-warmgray-300 mx-auto mb-4" />
              <p className="text-warmgray-600 mb-4">No assessments taken yet.</p>
              <button
                onClick={() => navigate('/assessments')}
                className="btn-primary-talkie"
              >
                Take Your First Assessment
              </button>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => {
                const level = SCORE_LEVEL(result.percentage_score);
                return (
                  <div key={result.id} className="card-talkie p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-warmgray-800">{result.child_name}</h3>
                        <span className="text-sm text-warmgray-500">• {ageDisplay(result.child_age_months)}</span>
                        {result.mother_tongue && (
                          <span className="text-sm text-warmgray-500">• {result.mother_tongue}</span>
                        )}
                      </div>
                      <p className="text-sm text-warmgray-600">{result.assessment?.title}</p>
                      <p className="text-xs text-warmgray-400 mt-1">
                        {result.completed_at
                          ? new Date(result.completed_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })
                          : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal">{Math.round(result.percentage_score)}%</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.bg} ${level.color}`}>
                          {level.label}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/assessment/results/${result.id}`)}
                          className="p-2 hover:bg-teal-light/30 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="h-5 w-5 text-teal" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(result)}
                          className="p-2 hover:bg-warmgray-100 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-5 w-5 text-warmgray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentHistoryPage;
