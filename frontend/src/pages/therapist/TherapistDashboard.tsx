import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, MessageSquare, Award, Briefcase, Plus, X, Save } from 'lucide-react';
import therapistService from '../../services/therapistService';
import toast from 'react-hot-toast';

const TherapistDashboard: React.FC = () => {
  const qc = useQueryClient();
  const [editingCreds, setEditingCreds] = useState(false);
  const [credForm, setCredForm] = useState<any>({});

  const { data: patientsData } = useQuery({
    queryKey: ['therapist_patients'],
    queryFn: therapistService.getPatients,
  });

  const { data: credsData } = useQuery({
    queryKey: ['therapist_credentials'],
    queryFn: therapistService.getCredentials,
  });

  useEffect(() => {
    if (credsData && !editingCreds) setCredForm((credsData as any).data || {});
  }, [credsData, editingCreds]);

  const { data: convsData } = useQuery({
    queryKey: ['therapist_conversations'],
    queryFn: therapistService.getConversations,
  });

  const saveCreds = useMutation({
    mutationFn: (data: any) => therapistService.updateCredentials(data),
    onSuccess: () => {
      toast.success('Credentials updated');
      setEditingCreds(false);
      qc.invalidateQueries({ queryKey: ['therapist_credentials'] });
    },
    onError: () => toast.error('Failed to update credentials'),
  });

  const patients = patientsData?.data || [];
  const convs = (convsData?.data || []) as any[];
  const unread = convs.filter((c: any) => c.unread_by_therapist > 0).length;
  const creds = credsData?.data || {};

  const handleSaveCreds = () => {
    saveCreds.mutate({
      experience_years: credForm.experience_years ? Number(credForm.experience_years) : undefined,
      bio: credForm.bio,
      specializations: credForm.specializations || [],
      languages_spoken: credForm.languages_spoken || [],
      certifications: credForm.certifications || [],
    });
  };

  const addCertification = () => {
    setCredForm((f: any) => ({
      ...f,
      certifications: [...(f.certifications || []), { name: '', issuer: '', year: new Date().getFullYear() }],
    }));
  };

  const updateCert = (idx: number, field: string, value: any) => {
    setCredForm((f: any) => {
      const certs = [...(f.certifications || [])];
      certs[idx] = { ...certs[idx], [field]: value };
      return { ...f, certifications: certs };
    });
  };

  const removeCert = (idx: number) => {
    setCredForm((f: any) => ({
      ...f,
      certifications: (f.certifications || []).filter((_: any, i: number) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900 dark:text-warmgray-100">Dashboard</h1>
        <p className="text-warmgray-500 text-sm mt-1">Overview of your patients and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-dark-raised rounded-2xl p-5 shadow-soft border border-warmgray-100 dark:border-surface-dark-border">
          <Users className="h-8 w-8 text-teal mb-3" />
          <p className="text-3xl font-bold text-warmgray-900 dark:text-warmgray-100">{patients.length}</p>
          <p className="text-sm text-warmgray-500 mt-1">Assigned Patients</p>
        </div>
        <div className="bg-white dark:bg-surface-dark-raised rounded-2xl p-5 shadow-soft border border-warmgray-100 dark:border-surface-dark-border">
          <MessageSquare className="h-8 w-8 text-sky mb-3" />
          <p className="text-3xl font-bold text-warmgray-900 dark:text-warmgray-100">{unread}</p>
          <p className="text-sm text-warmgray-500 mt-1">Unread Messages</p>
        </div>
        <div className="bg-white dark:bg-surface-dark-raised rounded-2xl p-5 shadow-soft border border-warmgray-100 dark:border-surface-dark-border col-span-2 sm:col-span-1">
          <Award className="h-8 w-8 text-coral mb-3" />
          <p className="text-3xl font-bold text-warmgray-900 dark:text-warmgray-100">{creds.experience_years ?? '—'}</p>
          <p className="text-sm text-warmgray-500 mt-1">Years Experience</p>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white dark:bg-surface-dark-raised rounded-2xl shadow-soft border border-warmgray-100 dark:border-surface-dark-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-warmgray-900 dark:text-warmgray-100">Recent Patients</h2>
          <Link to="/therapist/patients" className="text-sm text-teal font-medium hover:underline">View all</Link>
        </div>
        {patients.length === 0 ? (
          <p className="text-warmgray-500 text-sm text-center py-6">No patients assigned yet</p>
        ) : (
          <div className="space-y-3">
            {patients.slice(0, 5).map((p: any) => (
              <Link key={p.id} to={`/therapist/patients/${p.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-warmgray-50 dark:hover:bg-white/5 dark:bg-surface-dark transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-warmgray-900 dark:text-warmgray-100 text-sm">{p.name}</p>
                  <p className="text-xs text-warmgray-500 truncate">{p.email}</p>
                </div>
                {p.unread_messages > 0 && (
                  <span className="w-5 h-5 rounded-full bg-coral text-white text-xs flex items-center justify-center font-bold">
                    {p.unread_messages}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Credentials */}
      <div className="bg-white dark:bg-surface-dark-raised rounded-2xl shadow-soft border border-warmgray-100 dark:border-surface-dark-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-warmgray-900 dark:text-warmgray-100 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-teal" /> Professional Credentials
          </h2>
          {!editingCreds ? (
            <button
              onClick={() => { setCredForm({ ...creds }); setEditingCreds(true); }}
              className="text-sm text-teal font-medium hover:underline"
            >Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditingCreds(false)} className="text-sm text-warmgray-500 hover:underline">Cancel</button>
              <button
                onClick={handleSaveCreds}
                disabled={saveCreds.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> {saveCreds.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {!editingCreds ? (
          <div className="space-y-3 text-sm">
            <div><span className="text-warmgray-500 dark:text-warmgray-500">Experience:</span> <span className="font-medium">{creds.experience_years ? `${creds.experience_years} years` : 'Not set'}</span></div>
            <div><span className="text-warmgray-500 dark:text-warmgray-500">Specializations:</span> <span className="font-medium">{(creds.specializations || []).join(', ') || 'Not set'}</span></div>
            <div><span className="text-warmgray-500 dark:text-warmgray-500">Languages:</span> <span className="font-medium">{(creds.languages_spoken || []).join(', ') || 'Not set'}</span></div>
            <div>
              <span className="text-warmgray-500 dark:text-warmgray-500">Certifications:</span>
              {(creds.certifications || []).length === 0 ? <span className="font-medium ml-1">None</span> : (
                <ul className="mt-1 space-y-1 ml-2">
                  {(creds.certifications || []).map((c: any, i: number) => (
                    <li key={i} className="font-medium">{c.name} — {c.issuer} ({c.year})</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-warmgray-600 dark:text-warmgray-400 mb-1">Years of Experience</label>
              <input type="number" min={0} value={credForm.experience_years || ''} onChange={e => setCredForm((f: any) => ({ ...f, experience_years: e.target.value }))}
                className="w-32 px-3 py-2 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            <div>
              <label className="block text-warmgray-600 dark:text-warmgray-400 mb-1">Specializations (comma-separated)</label>
              <input type="text" value={(credForm.specializations || []).join(', ')}
                onChange={e => setCredForm((f: any) => ({ ...f, specializations: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }))}
                className="w-full px-3 py-2 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" placeholder="e.g. Speech Delay, Autism, Aphasia" />
            </div>
            <div>
              <label className="block text-warmgray-600 dark:text-warmgray-400 mb-1">Languages Spoken (comma-separated)</label>
              <input type="text" value={(credForm.languages_spoken || []).join(', ')}
                onChange={e => setCredForm((f: any) => ({ ...f, languages_spoken: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }))}
                className="w-full px-3 py-2 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" placeholder="e.g. Hindi, English, Tamil" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-warmgray-600 dark:text-warmgray-400">Certifications</label>
                <button onClick={addCertification} className="flex items-center gap-1 text-teal text-xs font-medium hover:underline">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {(credForm.certifications || []).map((cert: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <input placeholder="Name" value={cert.name} onChange={e => updateCert(idx, 'name', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal text-xs" />
                    <input placeholder="Issuer" value={cert.issuer} onChange={e => updateCert(idx, 'issuer', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal text-xs" />
                    <input placeholder="Year" type="number" value={cert.year} onChange={e => updateCert(idx, 'year', Number(e.target.value))}
                      className="w-20 px-2 py-1.5 border border-warmgray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-1 focus:ring-teal text-xs" />
                    <button onClick={() => removeCert(idx)} className="p-1.5 text-red-400 hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
