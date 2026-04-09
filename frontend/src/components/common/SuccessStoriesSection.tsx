import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { successStoriesService, SuccessStory } from '../../services/successStoriesService';
import { useAuth } from '../../contexts/AuthContext';

interface SuccessStoriesSectionProps {
  productId?: number;
  productSlug?: string;
  featured?: boolean;
}

const SPEECH_GOALS = ['Articulation', 'Vocabulary', 'Fluency', 'Social Communication', 'Phonology', 'Language Delay', 'Other'];

const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({ productId, featured }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ child_name: '', age_months: '', speech_goal: '', before_text: '', after_text: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['success_stories', productId, featured, page],
    queryFn: () => successStoriesService.getStories({ product_id: productId, featured, page }),
  });

  const submit = useMutation({
    mutationFn: () => successStoriesService.submitStory({
      child_name: form.child_name,
      age_months: form.age_months ? parseInt(form.age_months) : undefined,
      speech_goal: form.speech_goal || undefined,
      before_text: form.before_text,
      after_text: form.after_text,
      product_id: productId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['success_stories'] });
      setShowForm(false);
      setForm({ child_name: '', age_months: '', speech_goal: '', before_text: '', after_text: '' });
      alert('Thank you! Your story has been submitted for review.');
    },
  });

  const stories: SuccessStory[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parent Success Stories</h2>
          <p className="text-gray-500 text-sm mt-1">Real journeys from families like yours</p>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" /> Share Your Story
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-indigo-900">Share Your Child's Journey</h3>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Child's first name *"
              value={form.child_name}
              onChange={e => setForm(f => ({ ...f, child_name: e.target.value }))}
            />
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Age (in months, e.g. 36)"
              type="number"
              value={form.age_months}
              onChange={e => setForm(f => ({ ...f, age_months: e.target.value }))}
            />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.speech_goal}
              onChange={e => setForm(f => ({ ...f, speech_goal: e.target.value }))}
            >
              <option value="">Select speech goal (optional)</option>
              {SPEECH_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Before (what was the struggle?) *</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows={3}
                placeholder="e.g. Aanya couldn't say more than 5 words at 2 years..."
                value={form.before_text}
                onChange={e => setForm(f => ({ ...f, before_text: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">After (what changed?) *</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows={3}
                placeholder="e.g. After 3 months, she's now building 3-word sentences..."
                value={form.after_text}
                onChange={e => setForm(f => ({ ...f, after_text: e.target.value }))}
              />
            </div>
          </div>
          <button
            onClick={() => submit.mutate()}
            disabled={!form.child_name || !form.before_text || !form.after_text || submit.isPending}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submit.isPending ? 'Submitting…' : 'Submit Story'}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-40" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No stories yet. Be the first to share!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map(story => (
              <div key={story.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                    {story.child_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{story.child_name}</p>
                    <p className="text-xs text-gray-500">
                      {story.age_months ? `${Math.floor(story.age_months / 12)}y ${story.age_months % 12}m` : ''}
                      {story.speech_goal && ` · ${story.speech_goal}`}
                    </p>
                  </div>
                  {story.featured && (
                    <span className="ml-auto bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-600 mb-1">Before</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{story.before_text}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-600 mb-1">After</p>
                    <p className="text-sm text-gray-700 line-clamp-3">{story.after_text}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">— {story.user.name}</p>
              </div>
            ))}
          </div>

          {meta && meta.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {meta.total_pages}</span>
              <button
                disabled={page >= meta.total_pages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuccessStoriesSection;
