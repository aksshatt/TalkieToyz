import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, Save, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { siteContentService } from '../../services/siteContentService';
import type { SiteContent, PageType, ContentType } from '../../types/siteContent';
import { toast } from 'react-hot-toast';

const ContentManagement = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<PageType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<SiteContent>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<SiteContent>>({
    page: 'about',
    content_type: 'text',
    active: true,
    display_order: 0
  });

  const pages: Array<PageType | 'all'> = ['all', 'home', 'about', 'contact', 'faq', 'header', 'footer'];
  const contentTypes: ContentType[] = ['text', 'textarea', 'html', 'image', 'url', 'json'];

  useEffect(() => {
    loadContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, selectedPage, searchQuery]);

  const loadContents = async () => {
    try {
      setIsLoading(true);
      const response = await siteContentService.getAllContent();
      setContents(response.data.contents);
    } catch (error) {
      toast.error('Failed to load contents');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = contents;

    if (selectedPage !== 'all') {
      filtered = filtered.filter((c) => c.page === selectedPage);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContents(filtered);
  };

  const handleEdit = (content: SiteContent) => {
    setEditingId(content.id);
    setEditForm(content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await siteContentService.updateContent(editingId, {
        value: editForm.value,
        label: editForm.label,
        description: editForm.description,
        active: editForm.active,
        display_order: editForm.display_order,
        content_type: editForm.content_type
      });
      toast.success('Content updated successfully');
      setEditingId(null);
      setEditForm({});
      loadContents();
    } catch (error) {
      toast.error('Failed to update content');
      console.error(error);
    }
  };

  const handleDelete = async (id: number, key: string) => {
    if (!confirm(`Are you sure you want to delete "${key}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await siteContentService.deleteContent(id);
      toast.success('Content deleted successfully');
      loadContents();
    } catch (error) {
      toast.error('Failed to delete content');
      console.error(error);
    }
  };

  const handleCreate = async () => {
    if (!createForm.key || !createForm.page || !createForm.value) {
      toast.error('Please fill in all required fields (key, page, value)');
      return;
    }

    try {
      await siteContentService.createContent({
        key: createForm.key!,
        page: createForm.page!,
        content_type: createForm.content_type || 'text',
        value: createForm.value!,
        label: createForm.label,
        description: createForm.description,
        active: createForm.active ?? true,
        display_order: createForm.display_order ?? 0
      });
      toast.success('Content created successfully');
      setIsCreating(false);
      setCreateForm({
        page: 'about',
        content_type: 'text',
        active: true,
        display_order: 0
      });
      loadContents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create content');
      console.error(error);
    }
  };

  const renderEditForm = (content: SiteContent) => {
    const isEditing = editingId === content.id;

    if (!isEditing) {
      return (
        <tr key={content.id} className="border-b border-warmgray-200 hover:bg-warmgray-50">
          <td className="px-4 py-3 text-sm font-mono text-warmgray-800">{content.key}</td>
          <td className="px-4 py-3 text-sm">
            <span className="px-2 py-1 bg-teal-light/30 text-teal rounded text-xs font-medium">
              {content.page}
            </span>
          </td>
          <td className="px-4 py-3 text-sm">
            <span className="px-2 py-1 bg-coral-light/30 text-coral rounded text-xs font-medium">
              {content.content_type}
            </span>
          </td>
          <td className="px-4 py-3 text-sm text-warmgray-700">{content.label}</td>
          <td className="px-4 py-3 text-sm text-warmgray-600 max-w-xs truncate">{content.value}</td>
          <td className="px-4 py-3 text-sm text-center">{content.display_order}</td>
          <td className="px-4 py-3 text-center">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                content.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {content.active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-3 text-right space-x-2">
            <button
              onClick={() => handleEdit(content)}
              className="text-teal hover:text-teal-dark transition-colors"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(content.id, content.key)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={content.id} className="border-b border-warmgray-200 bg-teal-light/10">
        <td className="px-4 py-3 text-sm font-mono text-warmgray-800">{content.key}</td>
        <td className="px-4 py-3 text-sm">
          <span className="px-2 py-1 bg-teal-light/30 text-teal rounded text-xs font-medium">
            {content.page}
          </span>
        </td>
        <td className="px-4 py-3">
          <select
            value={editForm.content_type}
            onChange={(e) => setEditForm({ ...editForm, content_type: e.target.value as ContentType })}
            className="input-talkie text-sm py-1"
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3">
          <input
            type="text"
            value={editForm.label || ''}
            onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
            className="input-talkie text-sm py-1 w-full"
            placeholder="Label"
          />
        </td>
        <td className="px-4 py-3">
          {editForm.content_type === 'textarea' || editForm.content_type === 'html' ? (
            <textarea
              value={editForm.value || ''}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              className="input-talkie text-sm py-1 w-full"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={editForm.value || ''}
              onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
              className="input-talkie text-sm py-1 w-full"
            />
          )}
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            value={editForm.display_order || 0}
            onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
            className="input-talkie text-sm py-1 w-20"
          />
        </td>
        <td className="px-4 py-3 text-center">
          <input
            type="checkbox"
            checked={editForm.active}
            onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
            className="w-4 h-4"
          />
        </td>
        <td className="px-4 py-3 text-right space-x-2">
          <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700" title="Save">
            <Save size={18} />
          </button>
          <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700" title="Cancel">
            <X size={18} />
          </button>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-warmgray-800">Content Management</h1>
            <p className="text-warmgray-600 mt-1">Manage all website content from one place</p>
          </div>
          <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Create Content
          </button>
        </div>

        {/* Create Form Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-soft-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-warmgray-800">Create New Content</h2>
                <button onClick={() => setIsCreating(false)} className="text-warmgray-500 hover:text-warmgray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warmgray-700 mb-1">
                      Key <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createForm.key || ''}
                      onChange={(e) => setCreateForm({ ...createForm, key: e.target.value })}
                      className="input-talkie"
                      placeholder="e.g., hero_title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warmgray-700 mb-1">
                      Page <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={createForm.page || 'about'}
                      onChange={(e) => setCreateForm({ ...createForm, page: e.target.value as PageType })}
                      className="input-talkie"
                    >
                      {pages.filter((p) => p !== 'all').map((page) => (
                        <option key={page} value={page}>
                          {page}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warmgray-700 mb-1">Content Type</label>
                    <select
                      value={createForm.content_type || 'text'}
                      onChange={(e) => setCreateForm({ ...createForm, content_type: e.target.value as ContentType })}
                      className="input-talkie"
                    >
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warmgray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={createForm.display_order || 0}
                      onChange={(e) => setCreateForm({ ...createForm, display_order: parseInt(e.target.value) })}
                      className="input-talkie"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-warmgray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={createForm.label || ''}
                    onChange={(e) => setCreateForm({ ...createForm, label: e.target.value })}
                    className="input-talkie"
                    placeholder="Human-readable label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-warmgray-700 mb-1">Description</label>
                  <textarea
                    value={createForm.description || ''}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="input-talkie"
                    rows={2}
                    placeholder="Help text for editors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-warmgray-700 mb-1">
                    Value <span className="text-red-500">*</span>
                  </label>
                  {createForm.content_type === 'textarea' || createForm.content_type === 'html' ? (
                    <textarea
                      value={createForm.value || ''}
                      onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })}
                      className="input-talkie"
                      rows={5}
                      placeholder="Content value"
                    />
                  ) : (
                    <input
                      type="text"
                      value={createForm.value || ''}
                      onChange={(e) => setCreateForm({ ...createForm, value: e.target.value })}
                      className="input-talkie"
                      placeholder="Content value"
                    />
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={createForm.active ?? true}
                    onChange={(e) => setCreateForm({ ...createForm, active: e.target.checked })}
                    className="w-4 h-4 mr-2"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-warmgray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleCreate} className="btn-primary flex-1">
                    Create Content
                  </button>
                  <button onClick={() => setIsCreating(false)} className="btn-outline flex-1">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card-talkie mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by key, label, or value..."
                className="input-talkie w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value as PageType | 'all')}
                className="input-talkie w-full"
              >
                {pages.map((page) => (
                  <option key={page} value={page}>
                    {page === 'all' ? 'All Pages' : page.charAt(0).toUpperCase() + page.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="card-talkie overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-warmgray-200 bg-warmgray-50">
                <th className="px-4 py-3 text-left text-sm font-bold text-warmgray-700">Key</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-warmgray-700">Page</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-warmgray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-warmgray-700">Label</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-warmgray-700">Value</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-warmgray-700">Order</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-warmgray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-warmgray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-warmgray-500">
                    No content found. Try adjusting your filters or create new content.
                  </td>
                </tr>
              ) : (
                filteredContents.map((content) => renderEditForm(content))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-6 text-sm text-warmgray-600">
          Showing {filteredContents.length} of {contents.length} content items
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
