import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '../config/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['speech', 'language', 'motor', 'social', 'cognitive'] as const;
type Category = typeof CATEGORIES[number];

interface ProgressLog {
  id: number;
  child_name: string;
  child_age_months: number;
  log_date: string;
  category: string;
  notes: string;
  session_duration_minutes?: number;
  goals_addressed?: string[];
  progress_rating?: number;
}

const fetchLogs = async (params: Record<string, string>) => {
  const res = await axiosInstance.get('/progress_logs', { params });
  return res.data;
};

const emptyForm = {
  child_name: '',
  child_age_months: '',
  log_date: new Date().toISOString().split('T')[0],
  category: 'speech' as Category,
  notes: '',
  session_duration_minutes: '',
  goals_addressed: '',
  progress_rating: '',
};

export default function ProgressLogs() {
  const qc = useQueryClient();
  const [filterCategory, setFilterCategory] = useState('');
  const [filterChild, setFilterChild] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['progress_logs', filterCategory, filterChild],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filterCategory) params.category = filterCategory;
      if (filterChild) params.child_name = filterChild;
      return fetchLogs(params);
    },
  });

  const logs: ProgressLog[] = data?.data || [];

  const create = useMutation({
    mutationFn: (payload: any) => axiosInstance.post('/progress_logs', { progress_log: payload }),
    onSuccess: () => {
      toast.success('Log added');
      qc.invalidateQueries({ queryKey: ['progress_logs'] });
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => toast.error('Failed to add log'),
  });

  const destroy = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/progress_logs/${id}`),
    onSuccess: () => {
      toast.success('Log deleted');
      qc.invalidateQueries({ queryKey: ['progress_logs'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({
      child_name: form.child_name,
      child_age_months: Number(form.child_age_months),
      log_date: form.log_date,
      category: form.category,
      notes: form.notes,
      session_duration_minutes: form.session_duration_minutes ? Number(form.session_duration_minutes) : undefined,
      goals_addressed: form.goals_addressed ? form.goals_addressed.split(',').map(s => s.trim()).filter(Boolean) : [],
      progress_rating: form.progress_rating ? Number(form.progress_rating) : undefined,
    });
  };

  const categoryColor: Record<string, string> = {
    speech: 'bg-teal/10 text-teal',
    language: 'bg-sky/10 text-sky',
    motor: 'bg-coral/10 text-coral',
    social: 'bg-purple-100 text-purple-600',
    cognitive: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warmgray-900">Progress Logs</h1>
          <p className="text-sm text-warmgray-500 mt-1">Track your child's therapy progress over time</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal-dark"
        >
          {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Log'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warmgray-100 shadow-soft p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Child Name</label>
              <input required value={form.child_name} onChange={e => setForm(f => ({ ...f, child_name: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Age (months)</label>
              <input required type="number" min={0} value={form.child_age_months} onChange={e => setForm(f => ({ ...f, child_age_months: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Date</label>
              <input required type="date" value={form.log_date} onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal capitalize">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Session Duration (min)</label>
              <input type="number" min={0} value={form.session_duration_minutes} onChange={e => setForm(f => ({ ...f, session_duration_minutes: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-sm text-warmgray-600 mb-1">Progress Rating (1–5)</label>
              <input type="number" min={1} max={5} value={form.progress_rating} onChange={e => setForm(f => ({ ...f, progress_rating: e.target.value }))}
                className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-warmgray-600 mb-1">Goals Addressed (comma-separated)</label>
            <input value={form.goals_addressed} onChange={e => setForm(f => ({ ...f, goals_addressed: e.target.value }))}
              placeholder="e.g. Articulation, Vocabulary, Turn-taking"
              className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
          </div>
          <div>
            <label className="block text-sm text-warmgray-600 mb-1">Notes</label>
            <textarea required rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none" />
          </div>
          <button type="submit" disabled={create.isPending}
            className="w-full py-2.5 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal-dark disabled:opacity-50">
            {create.isPending ? 'Saving…' : 'Save Log'}
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input value={filterChild} onChange={e => setFilterChild(e.target.value)} placeholder="Filter by child name"
          className="px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-warmgray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal capitalize">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-warmgray-100" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-warmgray-400">No progress logs yet. Add your first one!</div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-white rounded-2xl border border-warmgray-100 shadow-soft p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-warmgray-900">{log.child_name}</span>
                    <span className="text-xs text-warmgray-400">{log.child_age_months}mo</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${categoryColor[log.category] || 'bg-gray-100 text-gray-600'}`}>{log.category}</span>
                    {log.progress_rating && (
                      <span className="text-xs text-yellow-600 font-medium">{'★'.repeat(log.progress_rating)}{'☆'.repeat(5 - log.progress_rating)}</span>
                    )}
                  </div>
                  <p className="text-xs text-warmgray-400 mb-2">{new Date(log.log_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{log.session_duration_minutes ? ` · ${log.session_duration_minutes} min` : ''}</p>
                  <p className="text-sm text-warmgray-700">{log.notes}</p>
                  {log.goals_addressed && log.goals_addressed.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {log.goals_addressed.map((g, i) => <span key={i} className="px-2 py-0.5 bg-warmgray-100 text-warmgray-600 rounded-full text-xs">{g}</span>)}
                    </div>
                  )}
                </div>
                <button onClick={() => destroy.mutate(log.id)} className="p-1.5 text-warmgray-300 hover:text-red-400 flex-shrink-0">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
