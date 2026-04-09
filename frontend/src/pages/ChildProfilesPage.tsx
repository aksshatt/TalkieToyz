import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, User, ChevronRight, Trash2, Edit } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SEO from '../components/common/SEO';
import { childProfilesService, ChildProfile } from '../services/childProfilesService';

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const SPEECH_GOALS_LIST = ['Articulation', 'Vocabulary', 'Fluency', 'Social Communication', 'Phonology', 'Language Delay', 'AAC'];

const ProfileForm: React.FC<{ initial?: Partial<ChildProfile>; onSave: (data: any) => void; onCancel: () => void; loading: boolean }> = ({
  initial, onSave, onCancel, loading
}) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    date_of_birth: initial?.date_of_birth || '',
    speech_goals: initial?.speech_goals || [] as string[],
    notes: initial?.notes || '',
    avatar_color: initial?.avatar_color || AVATAR_COLORS[0],
  });

  const toggleGoal = (g: string) => {
    setForm(f => ({
      ...f,
      speech_goals: f.speech_goals.includes(g) ? f.speech_goals.filter(x => x !== g) : [...f.speech_goals, g]
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-bold text-lg text-gray-900 mb-5">{initial?.id ? 'Edit' : 'Add'} Child Profile</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Child's Name *</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Aanya"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth *</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
            value={form.date_of_birth}
            onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Speech Goals (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {SPEECH_GOALS_LIST.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  form.speech_goals.includes(g)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Profile Color</label>
          <div className="flex gap-2">
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, avatar_color: c }))}
                className={`w-7 h-7 rounded-full transition ${form.avatar_color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm"
            rows={2}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any additional notes about your child's needs…"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => onSave(form)}
          disabled={!form.name || !form.date_of_birth || loading}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Profile'}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
};

const ChildProfilesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ChildProfile | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['child_profiles'],
    queryFn: childProfilesService.getProfiles,
  });

  const createMutation = useMutation({
    mutationFn: childProfilesService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => childProfilesService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child_profiles'] });
      setEditingProfile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: childProfilesService.deleteProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['child_profiles'] }),
  });

  const profiles: ChildProfile[] = data?.data || [];

  return (
    <Layout>
      <SEO url="/children" />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
              <p className="text-gray-500 text-sm mt-1">Track each child's progress and get personalised product recommendations.</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" /> Add Child
              </button>
            )}
          </div>

          {showForm && (
            <div className="mb-6">
              <ProfileForm
                onSave={data => createMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                loading={createMutation.isPending}
              />
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-32" />)}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 mb-1">No child profiles yet</h3>
              <p className="text-sm text-gray-400 mb-4">Add your child's profile to get tailored recommendations.</p>
              <button onClick={() => setShowForm(true)} className="text-indigo-600 font-medium text-sm hover:underline">
                + Add your first child
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(profile => (
                editingProfile?.id === profile.id ? (
                  <div key={profile.id} className="md:col-span-2">
                    <ProfileForm
                      initial={profile}
                      onSave={data => updateMutation.mutate({ id: profile.id, data })}
                      onCancel={() => setEditingProfile(null)}
                      loading={updateMutation.isPending}
                    />
                  </div>
                ) : (
                  <div key={profile.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: profile.avatar_color }}
                      >
                        {profile.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.age_display}</p>
                        {profile.speech_goals.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {profile.speech_goals.map(g => (
                              <span key={g} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{g}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/children/${profile.id}`}
                        className="flex-1 flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Progress <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setEditingProfile(profile)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete ${profile.name}'s profile?`)) deleteMutation.mutate(profile.id); }}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChildProfilesPage;
