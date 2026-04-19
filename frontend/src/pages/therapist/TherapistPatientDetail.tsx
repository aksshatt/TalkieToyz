import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft, Send, Package, ClipboardList, BookOpen, Star, TrendingUp,
  MessageSquare, FileText, CheckCircle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import therapistService, { Message, MessageTemplate } from '../../services/therapistService';
import axiosInstance from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'chat' | 'results' | 'share';

const TEMPLATE_CATEGORIES = ['greeting', 'progress', 'reminder', 'exercise', 'assessment', 'other'];

const MessageBubble: React.FC<{ msg: Message; isMine: boolean }> = ({ msg, isMine }) => {
  const isProduct    = msg.message_type === 'product';
  const isAssessment = msg.message_type === 'assessment';

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isMine && <p className="text-xs text-warmgray-400 mb-1 ml-1">{msg.sender_name}</p>}

        {isProduct && msg.metadata ? (
          <Link to={`/products/${msg.metadata.product_slug}`}
            className={`rounded-2xl overflow-hidden border shadow-soft hover:shadow-soft-md transition-all block ${isMine ? 'bg-teal-light/30 border-teal/20' : 'bg-white border-warmgray-200'}`}>
            {msg.metadata.image_url && (
              <img src={msg.metadata.image_url} alt={msg.metadata.product_name} className="w-full h-32 object-cover" />
            )}
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-xs text-teal font-semibold mb-1">
                <Package className="w-3.5 h-3.5" /> Shared Product
              </div>
              <p className="font-semibold text-warmgray-900 text-sm line-clamp-2">{msg.metadata.product_name}</p>
              <div className="flex items-center gap-1 text-xs text-teal mt-2 font-medium">
                <ExternalLink className="w-3 h-3" /> Tap to view
              </div>
            </div>
          </Link>
        ) : isAssessment && msg.metadata ? (
          <Link to={`/assessments/${msg.metadata.assessment_slug}`}
            className={`rounded-2xl overflow-hidden border shadow-soft hover:shadow-soft-md transition-all block p-4 ${isMine ? 'bg-teal-light/30 border-teal/20' : 'bg-white border-warmgray-200'}`}>
            <div className="flex items-center gap-1.5 text-xs text-coral font-semibold mb-1">
              <ClipboardList className="w-3.5 h-3.5" /> Shared Assessment
            </div>
            <p className="font-semibold text-warmgray-900 text-sm">{msg.metadata.assessment_title}</p>
            <div className="flex items-center gap-1 text-xs text-coral mt-2 font-medium">
              <ExternalLink className="w-3 h-3" /> Tap to take assessment
            </div>
          </Link>
        ) : (
          <div className={`px-4 py-3 rounded-2xl text-sm ${
            isMine
              ? 'bg-teal-gradient text-white rounded-tr-sm'
              : 'bg-white border border-warmgray-200 text-warmgray-800 rounded-tl-sm'
          }`}>
            {msg.content}
          </div>
        )}

        <p className="text-xs text-warmgray-400 mt-1 mx-1">
          {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

const TherapistPatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = parseInt(id || '0', 10);
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('chat');
  const [text, setText] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: patientData } = useQuery({
    queryKey: ['therapist_patient', patientId],
    queryFn: () => therapistService.getPatient(patientId),
    enabled: !!patientId,
  });
  const patient = patientData?.data;

  const { data: convData, refetch: refetchConv } = useQuery({
    queryKey: ['therapist_conversation', conversationId],
    queryFn: () => therapistService.getConversation(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 5000, // poll every 5s
  });
  const messages: Message[] = convData?.data?.messages || [];

  const { data: templatesData } = useQuery({
    queryKey: ['message_templates'],
    queryFn: () => therapistService.getTemplates(),
  });
  const templates: MessageTemplate[] = (templatesData?.data || []).filter(t =>
    t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
    t.content.toLowerCase().includes(templateSearch.toLowerCase())
  );

  // Product/assessment search for sharing
  const [productSearch, setProductSearch] = useState('');
  const [assessmentSearch, setAssessmentSearch] = useState('');
  const { data: productSearchData } = useQuery({
    queryKey: ['share_products', productSearch],
    queryFn: async () => {
      if (!productSearch.trim()) return { data: [] };
      const res = await axiosInstance.get('/products', { params: { q: productSearch, per_page: 8 } });
      return res.data;
    },
    enabled: productSearch.length > 1,
  });
  const { data: assessmentSearchData } = useQuery({
    queryKey: ['share_assessments', assessmentSearch],
    queryFn: async () => {
      const res = await axiosInstance.get('/assessments', { params: { q: assessmentSearch || undefined, per_page: 10 } });
      return res.data;
    },
    enabled: tab === 'share',
  });

  // Initialize conversation
  useEffect(() => {
    if (patient && !conversationId) {
      therapistService.getOrCreateConversation(patientId).then(res => {
        setConversationId(res.data.id);
      }).catch(() => {});
    }
  }, [patient, patientId, conversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark read when opening chat
  useEffect(() => {
    if (conversationId && tab === 'chat') {
      therapistService.markRead(conversationId).catch(() => {});
    }
  }, [conversationId, tab]);

  const sendMutation = useMutation({
    mutationFn: (payload: { message_type: string; content?: string; metadata?: object }) =>
      therapistService.sendMessage(conversationId!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['therapist_conversation', conversationId] });
      setText('');
    },
    onError: () => toast.error('Failed to send message'),
  });

  const sendText = () => {
    if (!text.trim() || !conversationId) return;
    sendMutation.mutate({ message_type: 'text', content: text.trim() });
  };

  const shareProduct = (product: any) => {
    if (!conversationId) return;
    sendMutation.mutate({
      message_type: 'product',
      content: `Check out this product: ${product.name}`,
      metadata: {
        product_id: product.id,
        product_slug: product.slug,
        product_name: product.name,
        image_url: product.image_urls?.[0]?.thumbnail_url || product.image_urls?.[0]?.url,
      },
    });
    toast.success('Product shared!');
    setTab('chat');
  };

  const shareAssessment = (assessment: any) => {
    if (!conversationId) return;
    sendMutation.mutate({
      message_type: 'assessment',
      content: `Please complete this assessment: ${assessment.title}`,
      metadata: {
        assessment_id: assessment.id,
        assessment_slug: assessment.slug,
        assessment_title: assessment.title,
      },
    });
    toast.success('Assessment shared!');
    setTab('chat');
  };

  const useTemplate = (t: MessageTemplate) => {
    setText(t.content);
    setShowTemplates(false);
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/therapist/patients" className="p-2 rounded-xl hover:bg-warmgray-100 transition-colors">
          <ChevronLeft className="w-5 h-5 text-warmgray-600" />
        </Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-sky flex items-center justify-center text-white font-bold flex-shrink-0">
          {patient.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-[var(--font-family-fun)] font-bold text-warmgray-900">{patient.name}</h1>
          <p className="text-sm text-warmgray-500">{patient.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warmgray-100 rounded-2xl p-1 mb-5 w-fit">
        {(['chat', 'results', 'share'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
              tab === t ? 'bg-white text-teal shadow-soft' : 'text-warmgray-500 hover:text-warmgray-700'
            }`}>
            {t === 'chat' ? 'Chat' : t === 'results' ? 'Assessment Results' : 'Share'}
          </button>
        ))}
      </div>

      {/* ── Chat Tab ─────────────────────────────────────────────────────── */}
      {tab === 'chat' && (
        <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-soft overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0" style={{ maxHeight: 'calc(100vh - 340px)' }}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <MessageSquare className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
                  <p className="text-warmgray-500 font-semibold">No messages yet</p>
                  <p className="text-warmgray-400 text-sm">Start the conversation with {patient.name}</p>
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} isMine={msg.sender_id === user?.id} />
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-warmgray-100 p-4">
            {/* Template picker */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="mb-3 overflow-hidden">
                  <div className="bg-warmgray-50 rounded-2xl p-3 max-h-52 overflow-y-auto">
                    <input value={templateSearch} onChange={e => setTemplateSearch(e.target.value)}
                      placeholder="Search templates…"
                      className="w-full px-3 py-2 border border-warmgray-200 rounded-xl text-sm mb-2 focus:border-teal focus:outline-none" />
                    {templates.length === 0 ? (
                      <p className="text-xs text-warmgray-400 text-center py-3">No templates found</p>
                    ) : (
                      templates.map(t => (
                        <button key={t.id} onClick={() => useTemplate(t)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-white hover:shadow-soft transition-all mb-1">
                          <p className="text-xs font-bold text-warmgray-800">{t.title}</p>
                          <p className="text-xs text-warmgray-500 line-clamp-1">{t.content}</p>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-2">
              <button onClick={() => setShowTemplates(v => !v)}
                className={`p-2.5 rounded-xl border-2 transition-colors flex-shrink-0 ${showTemplates ? 'border-teal bg-teal-light/20 text-teal' : 'border-warmgray-200 text-warmgray-400 hover:border-teal hover:text-teal'}`}>
                <BookOpen className="w-4 h-4" />
              </button>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                placeholder={`Message ${patient.name}…`}
                rows={2}
                className="flex-1 px-4 py-3 border-2 border-warmgray-200 rounded-2xl text-sm focus:border-teal focus:outline-none resize-none"
              />
              <motion.button
                onClick={sendText}
                disabled={!text.trim() || sendMutation.isPending}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="p-3 bg-teal-gradient text-white rounded-2xl shadow-soft disabled:opacity-50 flex-shrink-0">
                <Send className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Quick share buttons */}
            <div className="flex gap-2 mt-2">
              <button onClick={() => setTab('share')}
                className="flex items-center gap-1.5 text-xs text-teal font-semibold px-3 py-1.5 bg-teal-light/20 rounded-full hover:bg-teal-light/40 transition-colors">
                <Package className="w-3.5 h-3.5" /> Share Product
              </button>
              <button onClick={() => setTab('share')}
                className="flex items-center gap-1.5 text-xs text-coral font-semibold px-3 py-1.5 bg-coral-light/20 rounded-full hover:bg-coral-light/40 transition-colors">
                <ClipboardList className="w-3.5 h-3.5" /> Share Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Results Tab ───────────────────────────────────────────────────── */}
      {tab === 'results' && (
        <div className="space-y-4">
          {patient.assessment_results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
              <ClipboardList className="w-12 h-12 text-warmgray-300 mx-auto mb-3" />
              <p className="text-warmgray-500 font-semibold">No assessment results yet</p>
              <p className="text-warmgray-400 text-sm mt-1">Share an assessment with {patient.name} to get started.</p>
            </div>
          ) : (
            patient.assessment_results.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-soft p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-warmgray-900">{r.assessment_title}</p>
                    <p className="text-sm text-warmgray-500 mt-0.5">
                      For: <span className="font-semibold">{r.child_name}</span> ·{' '}
                      {new Date(r.completed_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-teal">{Math.round(r.percentage_score)}%</p>
                    <p className="text-xs text-warmgray-400">Score: {r.total_score}</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mt-4 h-2 bg-warmgray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-gradient rounded-full transition-all duration-700"
                    style={{ width: `${r.percentage_score}%` }} />
                </div>

                {r.recommendations?.message && (
                  <div className="mt-3 bg-sunshine/10 border border-sunshine/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-warmgray-700 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-sunshine" /> Recommendations
                    </p>
                    <p className="text-xs text-warmgray-600 leading-relaxed">{r.recommendations.message}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Share Tab ─────────────────────────────────────────────────────── */}
      {tab === 'share' && (
        <div className="space-y-6">
          {/* Share Product */}
          <div className="bg-white rounded-3xl shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-warmgray-900">Share a Product</h3>
            </div>
            <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
              placeholder="Search products to share…"
              className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-teal focus:outline-none mb-3" />
            {productSearchData?.data?.products?.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {productSearchData.data.products.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-warmgray-100 hover:border-teal/30 hover:bg-teal-light/5 transition-all cursor-pointer"
                    onClick={() => shareProduct(p)}>
                    {p.image_urls?.[0] ? (
                      <img src={p.image_urls[0].thumbnail_url || p.image_urls[0].url} alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-warmgray-100 flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-warmgray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-warmgray-900 text-sm line-clamp-1">{p.name}</p>
                      <p className="text-teal font-bold text-sm">₹{parseFloat(p.price).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-teal font-semibold px-3 py-1.5 bg-teal-light/20 rounded-full">
                      <Send className="w-3 h-3" /> Share
                    </div>
                  </div>
                ))}
              </div>
            )}
            {productSearch.length > 1 && !productSearchData?.data?.products?.length && (
              <p className="text-sm text-warmgray-400 text-center py-4">No products found</p>
            )}
            {productSearch.length <= 1 && (
              <p className="text-sm text-warmgray-400 text-center py-2">Type at least 2 characters to search</p>
            )}
          </div>

          {/* Share Assessment */}
          <div className="bg-white rounded-3xl shadow-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-coral" />
              <h3 className="font-bold text-warmgray-900">Share an Assessment</h3>
            </div>
            <input value={assessmentSearch} onChange={e => setAssessmentSearch(e.target.value)}
              placeholder="Filter assessments…"
              className="w-full px-4 py-2.5 border-2 border-warmgray-200 rounded-xl text-sm focus:border-coral focus:outline-none mb-3" />
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(assessmentSearchData?.data || [])
                .filter((a: any) => !assessmentSearch || a.title.toLowerCase().includes(assessmentSearch.toLowerCase()))
                .map((a: any) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-warmgray-100 hover:border-coral/30 hover:bg-coral-light/5 transition-all cursor-pointer"
                    onClick={() => shareAssessment(a)}>
                    <div className="w-10 h-10 rounded-xl bg-coral-light/30 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-5 h-5 text-coral" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-warmgray-900 text-sm line-clamp-1">{a.title}</p>
                      {a.age_range && <p className="text-xs text-warmgray-400">{a.age_range}</p>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-coral font-semibold px-3 py-1.5 bg-coral-light/20 rounded-full">
                      <Send className="w-3 h-3" /> Share
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistPatientDetail;
