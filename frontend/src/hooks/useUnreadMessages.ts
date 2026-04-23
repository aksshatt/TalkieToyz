import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import patientConversationService from '../services/patientConversationService';
import therapistService from '../services/therapistService';

export function useUnreadMessages() {
  const { user, isAuthenticated } = useAuth();
  const prevCountRef = useRef<number>(0);

  const isPatient = isAuthenticated && user?.role === 'customer';
  const isTherapist = isAuthenticated && user?.role === 'therapist';

  const { data: patientConvs } = useQuery({
    queryKey: ['patient_conversations_unread'],
    queryFn: patientConversationService.getConversations,
    enabled: isPatient,
    refetchInterval: 3000,
  });

  const { data: therapistConvs } = useQuery({
    queryKey: ['therapist_conversations_unread'],
    queryFn: therapistService.getConversations,
    enabled: isTherapist,
    refetchInterval: 3000,
  });

  const unreadCount = isPatient
    ? (patientConvs?.data || []).reduce((sum, c) => sum + (c.unread_by_patient || 0), 0)
    : isTherapist
    ? (therapistConvs?.data || []).reduce((sum, c) => sum + (c.unread_by_therapist || 0), 0)
    : 0;

  useEffect(() => {
    if (unreadCount > prevCountRef.current && prevCountRef.current !== 0) {
      const senderLabel = isTherapist ? 'A patient' : 'Your therapist';
      toast(`${senderLabel} sent you a new message!`, {
        icon: '💬',
        duration: 5000,
        style: { fontWeight: '600' },
      });
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount, isTherapist]);

  return { unreadCount };
}
