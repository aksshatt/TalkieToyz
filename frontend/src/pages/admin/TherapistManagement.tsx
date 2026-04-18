import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Stethoscope, Plus, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import adminTherapistService from '../../services/adminTherapistService';

const TherapistManagement: React.FC = () => {
  const qc = useQueryClient();
  const [expandedTherapist, setExpandedTherapist] = useState<number | null>(null);
  const [assignModal, setAssignModal] = useState<{ therapistId: number; therapistName: string } | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [therapistSearch, setTherapistSearch] = useState('');

  const { data: therapistsData, isLoading: therapistsLoading } = useQuery({
    queryKey: ['admin_therapists_list'],
    queryFn: adminTherapistService.getTherapists,
  });

  const { data: patientsData, isLoading: patientsLoading } = useQuery({
    queryKey: ['admin_patients_list'],
    queryFn: adminTherapistService.getPatients,
    enabled: !!assignModal,
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ['admin_assignments'],
    queryFn: adminTherapistService.getAssignments,
  });

  const assignMutation = useMutation({
    mutationFn: ({ therapistId, patientId }: { therapistId: number; patientId: number }) =>
      adminTherapistService.assignPatient(therapistId, patientId, undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_assignments'] });
      toast.success('Patient assigned!');
      setAssignModal(null);
      setPatientSearch('');
    },
    onError: () => toast.error('Failed to assign patient'),
  });

  const unassignMutation = useMutation({
    mutationFn: adminTherapistService.unassignPatient,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin_assignments'] }); toast.success('Assignment removed'); },
    onError: () => toast.error('Failed to remove assignment'),
  });

  const therapists = (therapistsData?.data || []).filter(t =>
    !therapistSearch || t.name.toLowerCase().includes(therapistSearch.toLowerCase())
  );

  const getTherapistAssignments = (therapistId: number) =>
    (assignmentsData?.data || []).filter(a => a.therapist_id === therapistId);

  const availablePatients = (patientsData?.data || []).filter(p => {
    const alreadyAssigned = assignModal
      ? getTherapistAssignments(assignModal.therapistId).some(a => a.patient_id === p.id)
      : false;
    const matchSearch = !patientSearch || p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.email.toLowerCase().includes(patientSearch.toLowerCase());
    return !alreadyAssigned && matchSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warmgray-900">Therapist Management</h1>
        <p className="text-warmgray-500 text-sm mt-1">Assign patients to approved therapists</p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
        <input value={therapistSearch} onChange={e => setTherapistSearch(e.target.value)} placeholder="Search therapists…"
          className="w-full pl-9 pr-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none" />
      </div>

      {therapistsLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
        </div>
      ) : therapists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
          <Stethoscope className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
          <p className="font-semibold text-warmgray-600">No approved therapists found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {therapists.map(therapist => {
            const assignments = getTherapistAssignments(therapist.id);
            const isExpanded = expandedTherapist === therapist.id;
            return (
              <motion.div key={therapist.id} layout className="bg-white rounded-2xl shadow-soft border border-warmgray-100 overflow-hidden">
                {/* Therapist Row */}
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {therapist.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-warmgray-900">{therapist.name}</p>
                    <p className="text-sm text-warmgray-500">{therapist.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-sm text-warmgray-500 bg-warmgray-100 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" /> {assignments.length} patients
                    </span>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => setAssignModal({ therapistId: therapist.id, therapistName: therapist.name })}
                      className="flex items-center gap-1.5 bg-teal-gradient text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft">
                      <Plus className="w-4 h-4" /> Assign Patient
                    </motion.button>
                    <button onClick={() => setExpandedTherapist(isExpanded ? null : therapist.id)}
                      className="p-2 rounded-xl hover:bg-warmgray-100 transition-colors text-warmgray-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Assigned Patients */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-warmgray-100 px-5 pb-4">
                      {assignments.length === 0 ? (
                        <p className="text-sm text-warmgray-400 py-4 text-center">No patients assigned yet</p>
                      ) : (
                        <div className="space-y-2 pt-3">
                          {assignments.map(a => (
                            <div key={a.id} className="flex items-center gap-3 bg-warmgray-50 rounded-xl p-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-sunshine flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {a.patient_name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-warmgray-800 text-sm">{a.patient_name}</p>
                                <p className="text-xs text-warmgray-400">{a.patient_email}</p>
                              </div>
                              <button onClick={() => { if (confirm('Remove this assignment?')) unassignMutation.mutate(a.id); }}
                                className="p-1.5 rounded-lg hover:bg-coral-light/20 text-warmgray-400 hover:text-coral transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Assign Patient Modal */}
      <AnimatePresence>
        {assignModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-soft-xl p-6 max-w-md w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-warmgray-900">Assign Patient to {assignModal.therapistName}</h3>
                <button onClick={() => { setAssignModal(null); setPatientSearch(''); }} className="p-2 rounded-xl hover:bg-warmgray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
                <input value={patientSearch} onChange={e => setPatientSearch(e.target.value)} placeholder="Search patients…"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none" />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {patientsLoading ? (
                  [...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-xl h-14" />)
                ) : availablePatients.length === 0 ? (
                  <p className="text-center text-warmgray-400 py-6 text-sm">No available patients</p>
                ) : availablePatients.map(p => (
                  <motion.button key={p.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={() => assignMutation.mutate({ therapistId: assignModal.therapistId, patientId: p.id })}
                    disabled={assignMutation.isPending}
                    className="w-full flex items-center gap-3 p-3 bg-warmgray-50 hover:bg-teal-light/20 rounded-xl transition-colors text-left disabled:opacity-60">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-sunshine flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-warmgray-800 text-sm">{p.name}</p>
                      <p className="text-xs text-warmgray-400 truncate">{p.email}</p>
                    </div>
                    <Plus className="w-4 h-4 text-teal ml-auto flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TherapistManagement;
