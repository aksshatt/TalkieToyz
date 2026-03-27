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
  const [initialData, setInitialData] = useState<Partial<ResourceFormData> | undefined>(undefined);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    if (slug) {
      blogService.admin.getResource(slug)
        .then((response) => {
          const resource = response.data;
          setInitialData({
            title: resource.title,
            description: resource.description,
            resource_type: resource.resource_type,
            resource_category_id: resource.resource_category.id,
            premium: resource.premium,
            active: resource.active,
            tags: resource.tags,
          });
        })
        .catch(() => setError('Failed to load resource'))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const loadCategories = async () => {
    try {
      const response = await blogService.getResourceCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (data: ResourceFormData) => {
    setError(null);
    setSaving(true);
    try {
      if (slug) {
        await blogService.admin.updateResource(slug, data);
      } else {
        await blogService.admin.createResource(data);
      }
      navigate('/admin/resources');
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.join(', ') ||
        err?.response?.data?.message ||
        'Failed to save resource';
      setError(msg);
      console.error('Failed to save resource:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/resources')} className="btn-secondary-talkie mb-6 flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <div className="card-talkie p-8">
        <h1 className="heading-talkie mb-6">{slug ? 'Edit' : 'New'} Resource</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <ResourceForm
          initialData={initialData}
          categories={categories}
          onSubmit={handleSubmit}
          saving={saving}
          onCancel={() => navigate('/admin/resources')}
        />
      </div>
    </div>
  );
};

export default ResourceFormPage;
