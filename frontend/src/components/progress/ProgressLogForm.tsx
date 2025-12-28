import { useState } from 'react';
import type { ProgressLogFormData, ProgressLogCategory } from '../../types/progress';

interface ProgressLogFormProps {
  initialData?: Partial<ProgressLogFormData>;
  onSubmit: (data: ProgressLogFormData) => void;
  onCancel?: () => void;
}

const ProgressLogForm = ({ initialData, onSubmit, onCancel }: ProgressLogFormProps) => {
  const [formData, setFormData] = useState<ProgressLogFormData>({
    child_name: initialData?.child_name || '',
    child_age_months: initialData?.child_age_months || 0,
    log_date: initialData?.log_date || new Date().toISOString().split('T')[0],
    category: initialData?.category || 'general_progress',
    notes: initialData?.notes || '',
    achievements: initialData?.achievements || [],
    metrics: initialData?.metrics || {},
  });

  const [newAchievement, setNewAchievement] = useState('');

  const categories: { value: ProgressLogCategory; label: string }[] = [
    { value: 'expressive_language', label: 'Expressive Language' },
    { value: 'receptive_language', label: 'Receptive Language' },
    { value: 'articulation', label: 'Articulation' },
    { value: 'social_communication', label: 'Social Communication' },
    { value: 'fluency', label: 'Fluency' },
    { value: 'voice', label: 'Voice' },
    { value: 'feeding_swallowing', label: 'Feeding & Swallowing' },
    { value: 'general_progress', label: 'General Progress' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), newAchievement.trim()],
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">
            Child Name *
          </label>
          <input
            type="text"
            required
            value={formData.child_name}
            onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">
            Age (months) *
          </label>
          <input
            type="number"
            required
            min="0"
            max="240"
            value={formData.child_age_months}
            onChange={(e) => setFormData({ ...formData, child_age_months: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">
            Log Date *
          </label>
          <input
            type="date"
            required
            value={formData.log_date}
            onChange={(e) => setFormData({ ...formData, log_date: e.target.value })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-warmgray-700 mb-2">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProgressLogCategory })}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">
          Notes
        </label>
        <textarea
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
          placeholder="Add any observations or notes..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-warmgray-700 mb-2">
          Achievements
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
            className="flex-1 px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20"
            placeholder="Add an achievement..."
          />
          <button
            type="button"
            onClick={addAchievement}
            className="btn-secondary-talkie"
          >
            Add
          </button>
        </div>
        {formData.achievements && formData.achievements.length > 0 && (
          <div className="space-y-2">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between bg-teal-light/30 px-4 py-2 rounded-lg">
                <span className="text-sm text-warmgray-700">{achievement}</span>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-coral hover:text-coral-dark"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary-talkie flex-1">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary-talkie flex-1">
          Save Progress Log
        </button>
      </div>
    </form>
  );
};

export default ProgressLogForm;
