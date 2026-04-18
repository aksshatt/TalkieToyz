import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, MessageSquare, ChevronRight, Search, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import therapistService from '../../services/therapistService';

const TherapistPatients: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['therapist_patients'],
    queryFn: therapistService.getPatients,
  });

  const patients = (data?.data || []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">My Patients</h1>
        <p className="text-warmgray-500 text-sm mt-1">Patients assigned to you by the admin</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients…"
          className="w-full pl-9 pr-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
          <Users className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
          <p className="font-semibold text-warmgray-600">{search ? 'No patients match your search' : 'No patients assigned yet'}</p>
          <p className="text-warmgray-400 text-sm mt-1">Ask the admin to assign patients to you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient, i) => (
            <motion.div key={patient.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/therapist/patients/${patient.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-md transition-all border border-warmgray-100 hover:border-teal/30 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-warmgray-900 group-hover:text-teal transition-colors">{patient.name}</p>
                    {patient.unread_messages > 0 && (
                      <span className="bg-coral text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {patient.unread_messages}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warmgray-500">{patient.email}</p>
                  {patient.last_message_at && (
                    <p className="text-xs text-warmgray-400 mt-0.5">
                      Last message: {new Date(patient.last_message_at).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-warmgray-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </div>
                  <div className="flex items-center gap-1 text-xs text-warmgray-400">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Results
                  </div>
                  <ChevronRight className="w-4 h-4 text-warmgray-300 group-hover:text-teal transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistPatients;
