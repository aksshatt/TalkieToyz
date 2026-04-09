import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, ChevronDown, ChevronUp, Send, CheckCircle } from 'lucide-react';
import { productQuestionsService, ProductQuestion } from '../../services/productQuestionsService';
import { useAuth } from '../../contexts/AuthContext';

interface ProductQAProps {
  productSlug: string;
}

const ProductQA: React.FC<ProductQAProps> = ({ productSlug }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [answerDraft, setAnswerDraft] = useState<Record<number, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['product_questions', productSlug],
    queryFn: () => productQuestionsService.getQuestions(productSlug),
  });

  const askMutation = useMutation({
    mutationFn: () => productQuestionsService.askQuestion(productSlug, newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_questions', productSlug] });
      setNewQuestion('');
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ questionId, answer }: { questionId: number; answer: string }) =>
      productQuestionsService.answerQuestion(productSlug, questionId, answer),
    onSuccess: (_, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: ['product_questions', productSlug] });
      setAnswerDraft(d => { const copy = { ...d }; delete copy[questionId]; return copy; });
    },
  });

  const questions: ProductQuestion[] = data?.data || [];
  const isTherapistOrAdmin = user?.role === 'therapist' || user?.role === 'admin';

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">Parent Q&A</h2>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
      </div>

      {user && (
        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ask a question about this product…"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && newQuestion.length >= 10 && askMutation.mutate()}
          />
          <button
            onClick={() => askMutation.mutate()}
            disabled={newQuestion.length < 10 || askMutation.isPending}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-16" />)}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">Q</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{q.question}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.user.name} · {new Date(q.created_at).toLocaleDateString()}</p>
                </div>
                {q.answered ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <span className="text-xs text-orange-500 font-medium flex-shrink-0 mt-1">Awaiting answer</span>
                )}
                {expandedId === q.id ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />}
              </button>

              {expandedId === q.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  {q.answered ? (
                    <div className="flex gap-3 mt-3">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">A</span>
                      <div>
                        <p className="text-sm text-gray-800">{q.answer}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Answered by {q.answered_by?.name} ({q.answered_by?.role === 'therapist' ? 'Speech Therapist' : 'Admin'})
                          · {q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  ) : isTherapistOrAdmin ? (
                    <div className="mt-3">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        rows={3}
                        placeholder="Write your answer…"
                        value={answerDraft[q.id] || ''}
                        onChange={e => setAnswerDraft(d => ({ ...d, [q.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => answerMutation.mutate({ questionId: q.id, answer: answerDraft[q.id] || '' })}
                        disabled={!answerDraft[q.id] || answerMutation.isPending}
                        className="mt-2 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Post Answer
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mt-3 italic">Our therapist team will answer this soon.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductQA;
