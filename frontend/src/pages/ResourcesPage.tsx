import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { FolderOpen } from 'lucide-react';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceCategoryFilter from '../components/resources/ResourceCategoryFilter';
import { blogService } from '../services/blogService';
import type { Resource, ResourceCategory } from '../types/blog';

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadResources();
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const response = await blogService.getResourceCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await blogService.getResources({ category_id: selectedCategoryId });
      setResources(response.data);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (slug: string) => {
    blogService.downloadResource(slug);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream-light py-12">
        <div className="container-talkie">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-gradient rounded-full mb-4">
              <FolderOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="heading-talkie mb-4">Resource Library</h1>
            <p className="text-warmgray-600 max-w-2xl mx-auto">
              Download free worksheets, guides, and resources for speech development.
            </p>
          </div>
          <div className="mb-8">
            <ResourceCategoryFilter
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={setSelectedCategoryId}
            />
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} onDownload={handleDownload} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
