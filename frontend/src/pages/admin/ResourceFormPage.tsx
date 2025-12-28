import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ResourceForm from '../../components/admin/ResourceForm';
import { blogService } from '../../services/blogService';
import type { ResourceFormData, ResourceCategory } from '../../types/blog';

const ResourceFormPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await blogService.getResourceCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (data: ResourceFormData) => {
    try {
      if (slug) {
        await blogService.admin.updateResource(slug, data);
      } else {
        await blogService.admin.createResource(data);
      }
      navigate('/admin/resources');
    } catch (err) {
      console.error('Failed to save resource:', err);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie max-w-4xl">
        <button onClick={() => navigate('/admin/resources')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="card-talkie p-8">
          <h1 className="heading-talkie mb-6">{slug ? 'Edit' : 'New'} Resource</h1>
          <ResourceForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/resources')}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceFormPage;
