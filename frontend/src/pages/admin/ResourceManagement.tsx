import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { blogService } from '../../services/blogService';
import type { Resource } from '../../types/blog';

const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await blogService.admin.getResources();
      setResources(response.data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await blogService.admin.deleteResource(slug);
        loadResources();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-12">
      <div className="container-talkie">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-talkie">Resource Management</h1>
          <Link to="/admin/resources/new" className="btn-primary-talkie flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Resource
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
          </div>
        ) : (
          <div className="card-talkie overflow-hidden">
            <table className="w-full">
              <thead className="bg-warmgray-100">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Downloads</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id} className="border-t border-warmgray-200">
                    <td className="p-4">{resource.title}</td>
                    <td className="p-4">{resource.resource_type_display_name}</td>
                    <td className="p-4">{resource.resource_category.name}</td>
                    <td className="p-4">{resource.download_count}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/resources/edit/${resource.slug}`} className="p-2 hover:bg-warmgray-100 rounded">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(resource.slug)} className="p-2 hover:bg-warmgray-100 rounded text-coral">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManagement;
