import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import ProgressLogForm from '../components/progress/ProgressLogForm';
import { progressService } from '../services/progressService';
import type { ProgressLogFormData } from '../types/progress';

const ProgressLogFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const handleSubmit = async (data: ProgressLogFormData) => {
    try {
      if (id) {
        await progressService.updateProgressLog(parseInt(id), data);
      } else {
        await progressService.createProgressLog(data);
      }
      navigate('/progress');
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  };
  return (
    <Layout>
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie max-w-3xl">
        <button onClick={() => navigate('/progress')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Back to Progress
        </button>
        <div className="card-talkie p-8">
          <h1 className="heading-talkie mb-6">{id ? 'Edit' : 'New'} Progress Log</h1>
          <ProgressLogForm onSubmit={handleSubmit} onCancel={() => navigate('/progress')} />
        </div>
      </div>
    </div>
    </Layout>
  );
};
export default ProgressLogFormPage;
