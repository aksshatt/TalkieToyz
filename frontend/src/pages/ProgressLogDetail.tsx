import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import ProgressLogCard from '../components/progress/ProgressLogCard';
import { progressService } from '../services/progressService';
import type { ProgressLog } from '../types/progress';

const ProgressLogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<ProgressLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadLog();
  }, [id]);

  const loadLog = async () => {
    try {
      setLoading(true);
      const response = await progressService.getProgressLog(parseInt(id!));
      setLog(response.data);
    } catch (err) {
      console.error('Failed to load log:', err);
    } finally {
      setLoading(false);
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

  if (!log) return <div>Log not found</div>;

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/progress')} className="btn-secondary-talkie flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button onClick={() => navigate(`/progress/log/${id}/edit`)} className="btn-primary-talkie flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit
            </button>
          </div>
          <ProgressLogCard log={log} />
        </div>
      </div>
    </Layout>
  );
};

export default ProgressLogDetail;
