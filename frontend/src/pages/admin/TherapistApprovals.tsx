import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, Stethoscope, Mail, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import adminTherapistService from '../../services/adminTherapistService';

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected'] as const;
type StatusTab = typeof STATUS_TABS[number];

const TherapistApprovals: React.FC = () => {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<StatusTab>('pending');
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: number; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin_therapist_approvals'],
    queryFn: adminTherapistService.getApprovals,
  });

  const approveMutation = useMutation({
    mutationFn: adminTherapistService.approveTherapist,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_therapist_approvals'] }); toast.success('Therapist approved!'); },
    onError: () => toast.error('Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => adminTherapistService.rejectTherapist(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_therapist_approvals'] }); toast.success('Therapist rejected'); setRejectModal(null); setRejectReason(''); },
    onError: () => toast.error('Failed to reject'),
  });

  const therapists = (data?.data || []).filter(t => {
    const matchTab = activeTab === 'all' || t.approval_status === activeTab;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: data?.data?.length || 0,
    pending: data?.data?.filter(t => t.approval_status === 'pending').length || 0,
    approved: data?.data?.filter(t => t.approval_status === 'approved').length || 0,
    rejected: data?.data?.filter(t => t.approval_status === 'rejected').length || 0,
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-sunshine/20 text-sunshine-dark', icon: Clock },
    approved: { label: 'Approved', color: 'bg-teal-light/30 text-teal', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-coral-light/20 text-coral', icon: XCircle },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warmgray-900">Therapist Approvals</h1>
        <p className="text-warmgray-500 text-sm mt-1">Review and manage therapist registration requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'all', label: 'Total', color: 'bg-warmgray-100 text-warmgray-700' },
          { key: 'pending', label: 'Pending', color: 'bg-sunshine/20 text-sunshine-dark' },
          { key: 'approved', label: 'Approved', color: 'bg-teal-light/30 text-teal' },
          { key: 'rejected', label: 'Rejected', color: 'bg-coral-light/20 text-coral' },
        ].map(({ key, label, color }) => (
          <div key={key} className={`rounded-2xl p-4 ${color}`}>
            <p className="text-3xl font-bold">{counts[key as StatusTab]}</p>
            <p className="text-sm font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-teal-gradient text-white shadow-soft' : 'bg-white border-2 border-warmgray-200 text-warmgray-500 hover:border-teal'}`}>
              {tab} {tab !== 'all' && counts[tab] > 0 && <span className="ml-1 bg-white/30 rounded-full px-1.5 text-xs">{counts[tab]}</span>}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search therapists…"
            className="pl-9 pr-4 py-2 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none" />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
        </div>
      ) : therapists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
          <Stethoscope className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
          <p className="font-semibold text-warmgray-600">No therapists found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {therapists.map(t => {
            const cfg = statusConfig[t.approval_status as keyof typeof statusConfig] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <motion.div key={t.id} layout
                className="bg-white rounded-2xl shadow-soft p-5 border border-warmgray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-warmgray-900">{t.name}</p>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-warmgray-500 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {t.email}
                  </p>
                  <p className="text-xs text-warmgray-400 mt-0.5">
                    Registered {new Date(t.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {t.approval_status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => approveMutation.mutate(t.id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 bg-teal-gradient text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft disabled:opacity-60">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => setRejectModal({ id: t.id, name: t.name })}
                      className="flex items-center gap-1.5 border-2 border-coral text-coral px-4 py-2 rounded-xl text-sm font-bold hover:bg-coral-light/10">
                      <XCircle className="w-4 h-4" /> Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-soft-xl p-6 max-w-md w-full">
              <h3 className="font-bold text-warmgray-900 mb-1">Reject {rejectModal.name}?</h3>
              <p className="text-sm text-warmgray-500 mb-4">Optionally provide a reason (sent via email to the therapist).</p>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                rows={3} placeholder="Reason for rejection (optional)…"
                className="w-full px-4 py-3 border-2 border-warmgray-200 rounded-xl text-sm focus:border-coral focus:outline-none resize-none mb-4" />
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => rejectMutation.mutate({ id: rejectModal.id, reason: rejectReason })}
                  disabled={rejectMutation.isPending}
                  className="flex-1 bg-coral text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-60">
                  Confirm Reject
                </motion.button>
                <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  className="flex-1 border-2 border-warmgray-200 text-warmgray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-warmgray-50">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TherapistApprovals;
