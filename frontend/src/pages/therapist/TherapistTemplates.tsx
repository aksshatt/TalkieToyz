import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, BookOpen, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import therapistService, { MessageTemplate } from '../../services/therapistService';

const CATEGORIES = ['greeting', 'progress', 'reminder', 'exercise', 'assessment', 'other'];
const CAT_COLORS: Record<string, string> = {
  greeting: 'bg-teal-light/30 text-teal',
  progress: 'bg-sky-light/30 text-sky',
  reminder: 'bg-sunshine/20 text-sunshine',
  exercise: 'bg-coral-light/20 text-coral',
  assessment: 'bg-purple-100 text-purple-600',
  other: 'bg-warmgray-100 text-warmgray-500',
};

interface FormState { title: string; content: string; category: string; shared: boolean }
const empty: FormState = { title: '', content: '', category: 'greeting', shared: false };

const TherapistTemplates: React.FC = () => {
  const qc = useQueryClient();
  const [filterCat, setFilterCat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MessageTemplate | null>(null);
  const [form, setForm] = useState<FormState>(empty);

  const { data, isLoading } = useQuery({
    queryKey: ['message_templates'],
    queryFn: () => therapistService.getTemplates(),
  });

  const templates = (data?.data || []).filter(t => !filterCat || t.category === filterCat);

  const createMutation = useMutation({
    mutationFn: therapistService.createTemplate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['message_templates'] }); toast.success('Template created!'); closeForm(); },
    onError: () => toast.error('Failed to create template'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MessageTemplate> }) => therapistService.updateTemplate(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['message_templates'] }); toast.success('Template updated!'); closeForm(); },
    onError: () => toast.error('Failed to update template'),
  });

  const deleteMutation = useMutation({
    mutationFn: therapistService.deleteTemplate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['message_templates'] }); toast.success('Template deleted'); },
    onError: () => toast.error('Failed to delete template'),
  });

  const openCreate = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (t: MessageTemplate) => { setEditing(t); setForm({ title: t.title, content: t.content, category: t.category || 'other', shared: t.shared }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">Message Templates</h1>
          <p className="text-warmgray-500 text-sm mt-1">Reusable messages for common scenarios</p>
        </div>
        <motion.button onClick={openCreate} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 bg-teal-gradient text-white px-5 py-2.5 rounded-full font-bold shadow-soft text-sm">
          <Plus className="w-4 h-4" /> New Template
        </motion.button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilterCat('')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!filterCat ? 'bg-teal-gradient text-white shadow-soft' : 'bg-white border-2 border-warmgray-200 text-warmgray-500 hover:border-teal'}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c === filterCat ? '' : c)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${filterCat === c ? 'bg-teal-gradient text-white shadow-soft' : 'bg-white border-2 border-warmgray-200 text-warmgray-500 hover:border-teal'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Template form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-3xl shadow-soft-xl p-6 mb-6 border border-warmgray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[var(--font-family-fun)] font-bold text-warmgray-900">{editing ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-warmgray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-warmgray-600 mb-1 block">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Welcome message"
                    className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-warmgray-600 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none capitalize">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-warmgray-600 mb-1 block">Content *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  rows={4} placeholder="Template message content…"
                  className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="shared" checked={form.shared} onChange={e => setForm(f => ({ ...f, shared: e.target.checked }))}
                  className="w-4 h-4 accent-teal" />
                <label htmlFor="shared" className="text-sm text-warmgray-700">Share with all therapists</label>
              </div>
              <div className="flex gap-3">
                <motion.button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-teal-gradient text-white px-6 py-2.5 rounded-xl font-bold shadow-soft text-sm disabled:opacity-60">
                  <Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}
                </motion.button>
                <button type="button" onClick={closeForm}
                  className="px-5 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm font-semibold text-warmgray-600 hover:bg-warmgray-50">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-32" />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
          <BookOpen className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
          <p className="font-semibold text-warmgray-600">{filterCat ? `No ${filterCat} templates` : 'No templates yet'}</p>
          <button onClick={openCreate} className="text-teal font-bold text-sm mt-2 hover:underline">Create your first template</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(t => (
            <motion.div key={t.id} layout
              className="bg-white rounded-2xl shadow-soft p-5 border border-warmgray-100 hover:border-teal/20 transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${CAT_COLORS[t.category || 'other']}`}>
                    {t.category || 'other'}
                  </span>
                  {t.shared && <span className="text-xs bg-warmgray-100 text-warmgray-500 px-2 py-0.5 rounded-full">Shared</span>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-warmgray-100 transition-colors text-warmgray-400 hover:text-teal">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this template?')) deleteMutation.mutate(t.id); }}
                    className="p-1.5 rounded-lg hover:bg-coral-light/20 transition-colors text-warmgray-400 hover:text-coral">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-bold text-warmgray-900 mb-2">{t.title}</p>
              <p className="text-sm text-warmgray-500 line-clamp-3 leading-relaxed">{t.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistTemplates;
