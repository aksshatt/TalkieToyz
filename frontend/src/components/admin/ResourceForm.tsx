import { useState } from 'react';
import type { ResourceFormData, ResourceType, ResourceCategory } from '../../types/blog';
import { Upload } from 'lucide-react';

interface ResourceFormProps {
  initialData?: Partial<ResourceFormData>;
  categories: ResourceCategory[];
  onSubmit: (data: ResourceFormData) => void;
  onCancel?: () => void;
}

const ResourceForm = ({ initialData, categories, onSubmit, onCancel }: ResourceFormProps) => {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    resource_type: initialData?.resource_type || 'pdf',
    resource_category_id: initialData?.resource_category_id || (categories[0]?.id || 0),
    premium: initialData?.premium ?? false,
    active: initialData?.active ?? true,
    tags: initialData?.tags || [],
  });

  const [file, setFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState('');

  const resourceTypes: { value: ResourceType; label: string }[] = [
    { value: 'pdf', label: 'PDF' },
    { value: 'worksheet', label: 'Worksheet' },
    { value: 'guide', label: 'Guide' },
    { value: 'checklist', label: 'Checklist' },
    { value: 'template', label: 'Template' },
    { value: 'infographic', label: 'Infographic' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, file: file || undefined });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">Resource Type *</label>
          <select
            required
            value={formData.resource_type}
            onChange={(e) => setFormData({ ...formData, resource_type: e.target.value as ResourceType })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {resourceTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">Category *</label>
          <select
            required
            value={formData.resource_category_id}
            onChange={(e) => setFormData({ ...formData, resource_category_id: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">File</label>
        <div className="border-2 border-dashed border-warmgray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-warmgray-400 mx-auto mb-4" />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-warmgray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-gradient file:text-white hover:file:opacity-90"
          />
          {file && <p className="mt-2 text-sm text-teal">{file.name}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
          <button type="button" onClick={addTag} className="btn-secondary-talkie">Add</button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span key={tag} className="bg-teal-light px-3 py-1 rounded-pill text-sm flex items-center gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) })}
                  className="text-coral"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.premium}
            onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
            className="w-4 h-4 text-teal"
          />
          <span className="text-sm font-semibold text-warmgray-700">Premium Resource</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 text-teal"
          />
          <span className="text-sm font-semibold text-warmgray-700">Active</span>
        </label>
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary-talkie flex-1">Cancel</button>
        )}
        <button type="submit" className="btn-primary-talkie flex-1">Save Resource</button>
      </div>
    </form>
  );
};

export default ResourceForm;
