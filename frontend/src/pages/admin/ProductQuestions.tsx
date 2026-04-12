import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageSquare, Trash2, Search, Send } from 'lucide-react';
import { adminService, type AdminProductQuestion } from '../../services/adminService';
import toast from 'react-hot-toast';

type Filter = 'all' | 'pending' | 'unanswered' | 'answered';

export default function ProductQuestions() {
  const [questions, setQuestions] = useState<AdminProductQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [showAnswerForm, setShowAnswerForm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = { per_page: 50 };
      if (filter === 'pending') filters.approved = false;
      if (filter === 'unanswered') { filters.approved = true; filters.answered = false; }
      if (filter === 'answered') filters.answered = true;
      if (search.trim()) filters.q = search.trim();

      const res = await adminService.getProductQuestions(filters);
      setQuestions(res.data.product_questions);
      setTotalCount(res.data.meta?.total_count ?? res.data.product_questions.length);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveQuestion(id);
      toast.success('Question approved');
      load();
    } catch {
      toast.error('Failed to approve question');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Reject and delete this question?')) return;
    try {
      await adminService.rejectQuestion(id);
      toast.success('Question removed');
      load();
    } catch {
      toast.error('Failed to reject question');
    }
  };

  const handleAnswer = async (id: number) => {
    const answer = answerText[id]?.trim();
    if (!answer) { toast.error('Please enter an answer'); return; }
    setSubmitting(id);
    try {
      await adminService.answerQuestion(id, answer);
      toast.success('Answer posted');
      setShowAnswerForm(null);
      setAnswerText((prev) => { const next = { ...prev }; delete next[id]; return next; });
      load();
    } catch {
      toast.error('Failed to post answer');
    } finally {
      setSubmitting(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this question permanently?')) return;
    try {
      await adminService.deleteQuestion(id);
      toast.success('Question deleted');
      load();
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: 'pending', label: 'Pending Approval' },
    { key: 'unanswered', label: 'Unanswered' },
    { key: 'answered', label: 'Answered' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Q&amp;A</h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} total questions</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions or users..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            type="submit"
            className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === t.key
                ? 'bg-teal-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No questions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {q.product.name}
                    </span>
                    {q.approved && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Approved</span>
                    )}
                    {q.answered && (
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> Answered
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2">
                    From <span className="font-medium">{q.user.name}</span> ({q.user.email})
                    · {new Date(q.created_at).toLocaleDateString()}
                  </p>

                  <p className="text-gray-900 font-medium mb-2">{q.question}</p>

                  {q.answered && q.answer && (
                    <div className="bg-teal-50 rounded-lg p-3 mt-2">
                      <p className="text-xs font-semibold text-teal-700 mb-1">
                        Answer{q.answered_by ? ` by ${q.answered_by.name}` : ''}:
                      </p>
                      <p className="text-sm text-gray-700">{q.answer}</p>
                    </div>
                  )}

                  {showAnswerForm === q.id && (
                    <div className="mt-3 flex gap-2">
                      <textarea
                        rows={3}
                        value={answerText[q.id] || ''}
                        onChange={(e) => setAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your answer..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                      />
                      <button
                        onClick={() => handleAnswer(q.id)}
                        disabled={submitting === q.id}
                        className="flex items-center gap-1 px-3 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors self-end"
                      >
                        <Send className="h-4 w-4" />
                        {submitting === q.id ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!q.approved && (
                    <button
                      onClick={() => handleApprove(q.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => setShowAnswerForm(showAnswerForm === q.id ? null : q.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {q.answered ? 'Edit Answer' : 'Answer'}
                  </button>
                  <button
                    onClick={() => handleReject(q.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
