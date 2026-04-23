import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ChevronRight, ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import adminTherapistService from '../../services/adminTherapistService';

const ConversationMonitor: React.FC = () => {
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convsData, isLoading: convsLoading } = useQuery({
    queryKey: ['admin_conversations'],
    queryFn: () => adminTherapistService.getConversations(),
    refetchInterval: 3000,
  });

  const { data: msgData } = useQuery({
    queryKey: ['admin_conversation_messages', selectedConvId],
    queryFn: () => adminTherapistService.getConversationMessages(selectedConvId!),
    enabled: !!selectedConvId,
    refetchInterval: 3000,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgData?.data]);

  const conversations = convsData?.data || [];
  const messages = msgData?.data?.messages || [];
  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts: string) => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {selectedConvId && (
          <button onClick={() => setSelectedConvId(null)} className="p-2 rounded-xl hover:bg-warmgray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-warmgray-600" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-warmgray-900">Conversation Monitor</h1>
            <span className="flex items-center gap-1 text-xs bg-warmgray-100 text-warmgray-500 px-2.5 py-1 rounded-full font-semibold">
              <Eye className="w-3 h-3" /> Silent Mode
            </span>
          </div>
          <p className="text-warmgray-500 text-sm mt-1">
            {selectedConvId ? `Viewing: ${selectedConv?.therapist_name} ↔ ${selectedConv?.patient_name}` : 'Monitor all therapist–patient conversations'}
          </p>
        </div>
      </div>

      {!selectedConvId ? (
        /* Conversations List */
        convsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-warmgray-200">
            <MessageSquare className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
            <p className="font-semibold text-warmgray-600">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <motion.button key={conv.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                onClick={() => setSelectedConvId(conv.id)}
                className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-md transition-all border border-warmgray-100 hover:border-teal/30 text-left">
                {/* Avatars */}
                <div className="relative w-12 h-12 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-sm absolute top-0 left-0 z-10 border-2 border-white">
                    {conv.therapist_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-sunshine flex items-center justify-center text-white font-bold text-xs absolute bottom-0 right-0 border-2 border-white">
                    {conv.patient_name?.charAt(0)?.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-teal text-sm">{conv.therapist_name}</span>
                    <span className="text-warmgray-300 text-xs">↔</span>
                    <span className="font-bold text-coral text-sm">{conv.patient_name}</span>
                    {(conv.unread_by_therapist > 0 || conv.unread_by_patient > 0) && (
                      <span className="bg-sunshine/30 text-sunshine-dark text-xs font-bold px-2 py-0.5 rounded-full">
                        {conv.unread_by_therapist + conv.unread_by_patient} unread
                      </span>
                    )}
                  </div>
                  {conv.last_message && (
                    <p className="text-sm text-warmgray-500 truncate mt-0.5">{conv.last_message.content || `[${conv.last_message.message_type}]`}</p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  {conv.last_message_at && <p className="text-xs text-warmgray-400">{formatDate(conv.last_message_at)}</p>}
                  <ChevronRight className="w-4 h-4 text-warmgray-300 mt-1 ml-auto" />
                </div>
              </motion.button>
            ))}
          </div>
        )
      ) : (
        /* Message Thread */
        <div className="bg-white rounded-3xl shadow-soft border border-warmgray-100 flex flex-col" style={{ height: 'calc(100vh - 240px)' }}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-warmgray-100 flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-xs absolute top-0 left-0 z-10 border-2 border-white">
                {selectedConv?.therapist_name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-coral to-sunshine flex items-center justify-center text-white font-bold text-xs absolute bottom-0 right-0 border-2 border-white">
                {selectedConv?.patient_name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <div>
              <p className="font-bold text-warmgray-900 text-sm">
                <span className="text-teal">{selectedConv?.therapist_name}</span>
                <span className="text-warmgray-400 mx-1.5">↔</span>
                <span className="text-coral">{selectedConv?.patient_name}</span>
              </p>
              <p className="text-xs text-warmgray-400 flex items-center gap-1"><Eye className="w-3 h-3" /> Admin view only — therapist is unaware</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-warmgray-400 text-sm">No messages yet</div>
            ) : messages.map(msg => {
              const isTherapist = msg.sender_role === 'therapist';
              return (
                <div key={msg.id} className={`flex ${isTherapist ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] ${isTherapist ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-end gap-2 ${isTherapist ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${isTherapist ? 'bg-gradient-to-br from-teal to-sky' : 'bg-gradient-to-br from-coral to-sunshine'}`}>
                        {msg.sender_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        {msg.message_type === 'text' ? (
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isTherapist ? 'bg-teal-light/20 text-warmgray-800 rounded-tl-sm' : 'bg-coral-light/20 text-warmgray-800 rounded-tr-sm'}`}>
                            {msg.content}
                          </div>
                        ) : msg.message_type === 'product' ? (
                          <div className="bg-warmgray-50 border border-warmgray-200 rounded-2xl p-3 min-w-[200px]">
                            <p className="text-xs text-teal font-semibold mb-1">Shared Product</p>
                            <p className="text-sm font-bold text-warmgray-800">{msg.metadata?.product_name}</p>
                          </div>
                        ) : msg.message_type === 'assessment' ? (
                          <div className="bg-warmgray-50 border border-warmgray-200 rounded-2xl p-3 min-w-[200px]">
                            <p className="text-xs text-sky font-semibold mb-1">Shared Assessment</p>
                            <p className="text-sm font-bold text-warmgray-800">{msg.metadata?.assessment_title}</p>
                          </div>
                        ) : null}
                        <p className={`text-xs text-warmgray-400 mt-1 ${isTherapist ? 'text-left' : 'text-right'}`}>{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                    <p className={`text-xs text-warmgray-400 mt-0.5 px-1 ${isTherapist ? 'text-left' : 'text-right'}`}>
                      {msg.sender_name} · {isTherapist ? 'Therapist' : 'Patient'}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Read-only notice */}
          <div className="px-6 py-3 border-t border-warmgray-100 bg-warmgray-50 rounded-b-3xl">
            <p className="text-xs text-warmgray-400 text-center flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Read-only monitoring — you cannot send messages from this view
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationMonitor;
