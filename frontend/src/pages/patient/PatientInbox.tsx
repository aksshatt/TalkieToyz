import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, ArrowLeft, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import patientConversationService from '../../services/patientConversationService';

const PatientInbox: React.FC = () => {
  const qc = useQueryClient();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convsData, isLoading: convsLoading } = useQuery({
    queryKey: ['patient_conversations'],
    queryFn: patientConversationService.getConversations,
    refetchInterval: 8000,
  });

  const { data: convData } = useQuery({
    queryKey: ['patient_conversation', selectedConvId],
    queryFn: () => patientConversationService.getConversation(selectedConvId!),
    enabled: !!selectedConvId,
    refetchInterval: 5000,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) => patientConversationService.sendMessage(selectedConvId!, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['patient_conversation', selectedConvId] });
      qc.invalidateQueries({ queryKey: ['patient_conversations'] });
      setNewMessage('');
    },
    onError: () => toast.error('Failed to send message'),
  });

  const markReadMutation = useMutation({
    mutationFn: () => patientConversationService.markRead(selectedConvId!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['patient_conversations'] }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convData?.data?.messages]);

  useEffect(() => {
    if (selectedConvId) markReadMutation.mutate();
  }, [selectedConvId]);

  const conversations = convsData?.data || [];
  const messages = convData?.data?.messages || [];
  const selectedConv = convData?.data?.conversation;
  const selectedTherapistName = (selectedConv as any)?.therapist?.name || '';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMutation.mutate(newMessage.trim());
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (ts: string) => new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-warmgray-50">
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {selectedConvId && (
            <button onClick={() => setSelectedConvId(null)} className="p-2 rounded-xl hover:bg-warmgray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-warmgray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-[var(--font-family-fun)] font-bold text-warmgray-900">
              {selectedConvId && selectedConv ? `Chat with ${selectedTherapistName}` : 'My Messages'}
            </h1>
            {!selectedConvId && <p className="text-warmgray-500 text-sm mt-0.5">Messages from your therapist</p>}
          </div>
        </div>

        {!selectedConvId ? (
          /* Conversation List */
          convsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-warmgray-200 rounded-2xl h-20" />)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-soft p-12 text-center">
              <div className="w-16 h-16 bg-teal-light/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-teal" />
              </div>
              <p className="font-bold text-warmgray-800 text-lg mb-2">No messages yet</p>
              <p className="text-warmgray-500 text-sm leading-relaxed max-w-xs mx-auto">
                Your therapist will start a conversation with you once they're assigned to you.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map(conv => (
                <motion.button key={conv.id} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                  onClick={() => setSelectedConvId(conv.id)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-md transition-all border border-warmgray-100 hover:border-teal/30 text-left">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {conv.therapist?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-warmgray-900">{conv.therapist?.name}</p>
                      {conv.unread_by_patient > 0 && (
                        <span className="bg-coral text-white text-xs font-bold px-2 py-0.5 rounded-full">{conv.unread_by_patient}</span>
                      )}
                    </div>
                      <p className="text-xs text-teal font-medium">Your Therapist</p>
                    {conv.last_message && (
                      <p className="text-sm text-warmgray-500 truncate mt-0.5">
                        {conv.last_message.message_type !== 'text' ? `[${conv.last_message.message_type}]` : conv.last_message.content}
                      </p>
                    )}
                  </div>
                  {conv.last_message_at && (
                    <p className="text-xs text-warmgray-400 flex-shrink-0">{formatDate(conv.last_message_at)}</p>
                  )}
                </motion.button>
              ))}
            </div>
          )
        ) : (
          /* Chat View */
          <div className="bg-white rounded-3xl shadow-soft border border-warmgray-100 flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-10 h-10 text-warmgray-300 mx-auto mb-2" />
                  <p className="text-warmgray-400 text-sm">No messages yet. Say hello!</p>
                </div>
              ) : messages.map(msg => {
                const isPatient = msg.sender_role === 'customer';
                return (
                  <div key={msg.id} className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] flex items-end gap-2 ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${isPatient ? 'bg-gradient-to-br from-coral to-sunshine' : 'bg-gradient-to-br from-teal to-sky'}`}>
                        {msg.sender_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        {msg.message_type === 'text' ? (
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isPatient ? 'bg-coral-light/20 text-warmgray-800 rounded-br-sm' : 'bg-teal-light/20 text-warmgray-800 rounded-bl-sm'}`}>
                            {msg.content}
                          </div>
                        ) : msg.message_type === 'product' ? (
                          <Link to={`/products/${msg.metadata?.product_slug}`}
                            className="block bg-warmgray-50 hover:bg-teal-light/10 border-2 border-warmgray-200 hover:border-teal/30 rounded-2xl p-3 min-w-[200px] transition-colors">
                            <p className="text-xs text-teal font-bold mb-1">Recommended Product</p>
                            <p className="text-sm font-bold text-warmgray-800">{msg.metadata?.product_name}</p>
                            <p className="text-xs text-teal mt-1 font-semibold">View product →</p>
                          </Link>
                        ) : msg.message_type === 'assessment' ? (
                          <Link to={`/assessments/${msg.metadata?.assessment_slug}`}
                            className="block bg-warmgray-50 hover:bg-sky-light/10 border-2 border-warmgray-200 hover:border-sky/30 rounded-2xl p-3 min-w-[200px] transition-colors">
                            <p className="text-xs text-sky font-bold mb-1">Recommended Assessment</p>
                            <p className="text-sm font-bold text-warmgray-800">{msg.metadata?.assessment_name}</p>
                            <p className="text-xs text-sky mt-1 font-semibold">Take assessment →</p>
                          </Link>
                        ) : null}
                        <p className={`text-xs text-warmgray-400 mt-1 ${isPatient ? 'text-right' : 'text-left'}`}>{formatTime(msg.created_at)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-warmgray-100 flex gap-3">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2.5 border-2 border-warmgray-200 rounded-2xl text-sm focus:border-teal focus:outline-none"
                disabled={sendMutation.isPending}
              />
              <motion.button type="submit" disabled={!newMessage.trim() || sendMutation.isPending}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="w-11 h-11 bg-teal-gradient rounded-2xl flex items-center justify-center shadow-soft disabled:opacity-50">
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientInbox;
