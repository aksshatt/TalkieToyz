import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { faqService } from '../../services/faqService';
import toast from 'react-hot-toast';
import type { Faq } from '../../types/faq';

const FAQManagement = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState<Partial<Faq>>({
    question: '',
    answer: '',
    category: 'general',
    display_order: 0,
    active: true,
  });

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const response = await faqService.getAdminFaqs();
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      display_order: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData(faq);
    setIsModalOpen(true);
  };

  const handleDelete = async (faq: Faq) => {
    if (!confirm(`Are you sure you want to delete "${faq.question}"?`)) {
      return;
    }

    try {
      const response = await faqService.deleteFaq(faq.id);
      if (response.success) {
        toast.success('FAQ deleted successfully');
        loadFaqs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        await faqService.updateFaq(editingFaq.id, formData);
        toast.success('FAQ updated successfully');
      } else {
        await faqService.createFaq(formData);
        toast.success('FAQ created successfully');
      }

      setIsModalOpen(false);
      loadFaqs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-warmgray-800">FAQ Management</h1>
          <p className="text-warmgray-600 mt-1">Manage frequently asked questions</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add FAQ
        </button>
      </div>

      {/* Table */}
      <div className="card-talkie overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-warmgray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Question</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Views</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-warmgray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-warmgray-500">
                    Loading...
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-warmgray-500">
                    No FAQs found
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-warmgray-50">
                    <td className="px-4 py-3 max-w-md truncate" title={faq.question}>
                      {faq.question}
                    </td>
                    <td className="px-4 py-3">{faq.category_display_name}</td>
                    <td className="px-4 py-3">{faq.display_order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-pill text-sm font-semibold ${
                          faq.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {faq.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{faq.view_count}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-warmgray-800 mb-6">
                {editingFaq ? 'Edit FAQ' : 'Create FAQ'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="input-talkie"
                    required
                    minLength={5}
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="input-talkie"
                    rows={6}
                    required
                    minLength={10}
                    maxLength={5000}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-talkie"
                      required
                    >
                      <option value="general">General</option>
                      <option value="products">Products</option>
                      <option value="shipping">Shipping</option>
                      <option value="orders">Orders</option>
                      <option value="returns">Returns</option>
                      <option value="therapy">Therapy</option>
                      <option value="assessments">Assessments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-warmgray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                      }
                      className="input-talkie"
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-teal"
                  />
                  <label htmlFor="active" className="text-sm font-semibold text-warmgray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingFaq ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;
