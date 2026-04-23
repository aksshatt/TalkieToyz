import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ChevronRight } from 'lucide-react';
import therapistService from '../../services/therapistService';

const TherapistMessages: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['therapist_conversations'],
    queryFn: therapistService.getConversations,
    refetchInterval: 3000,
  });

  const conversations = data?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">Messages</h1>
        <p className="text-warmgray-500 text-sm mt-1">All your patient conversations</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
          <MessageSquare className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
          <p className="font-semibold text-warmgray-600">No conversations yet</p>
          <p className="text-warmgray-400 text-sm mt-1">Open a patient's profile to start chatting.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <Link key={conv.id} to={`/therapist/patients/${conv.patient.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-md transition-all border border-warmgray-100 hover:border-teal/30 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {conv.patient.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-warmgray-900 group-hover:text-teal transition-colors">{conv.patient.name}</p>
                  {conv.unread_by_therapist > 0 && (
                    <span className="bg-coral text-white text-xs font-bold px-2 py-0.5 rounded-full">{conv.unread_by_therapist}</span>
                  )}
                </div>
                {conv.last_message && (
                  <p className="text-sm text-warmgray-500 truncate mt-0.5">
                    {conv.last_message.message_type !== 'text' ? `[${conv.last_message.message_type}]` : conv.last_message.content}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                {conv.last_message_at && (
                  <p className="text-xs text-warmgray-400">{new Date(conv.last_message_at).toLocaleDateString('en-IN')}</p>
                )}
                <ChevronRight className="w-4 h-4 text-warmgray-300 group-hover:text-teal mt-1 ml-auto" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistMessages;
