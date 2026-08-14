import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Star, Trash2, Search, MessageSquare } from 'lucide-react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

type Filter = 'pending' | 'approved' | 'all';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');
  const [search, setSearch] = useState('');
  const [responseText, setResponseText] = useState<Record<number, string>>({});
  const [showResponseForm, setShowResponseForm] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const filters: Record<string, any> = { per_page: 50 };
      if (filter === 'pending') filters.pending = true;
      if (filter === 'approved') filters.approved = true;
      if (search.trim()) filters.q = search.trim();
      const res = await adminService.getReviews(filters);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveReview(id);
      toast.success('Review approved');
      load();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Reject and delete this review?')) return;
    try {
      await adminService.rejectReview(id);
      toast.success('Review rejected');
      load();
    } catch { toast.error('Failed to reject'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Permanently delete this review?')) return;
    try {
      await adminService.deleteReview(id);
      toast.success('Review deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleAddResponse = async (id: number) => {
    const text = responseText[id]?.trim();
    if (!text) return;
    setSubmitting(id);
    try {
      await adminService.addReviewResponse(id, text);
      toast.success('Response added');
      setResponseText(prev => ({ ...prev, [id]: '' }));
      setShowResponseForm(null);
      load();
    } catch { toast.error('Failed to add response'); }
    finally { setSubmitting(null); }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} className={`h-4 w-4 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">Approve, reject, or respond to customer reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {(['pending', 'approved', 'all'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium capitalize ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <form onSubmit={e => { e.preventDefault(); load(); }} className="flex gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Search</button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-gray-200" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            No reviews found
          </div>
        ) : reviews.map(review => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</span>
                  <StarRating rating={review.rating} />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                  {review.verified_purchase && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Verified Purchase</span>
                  )}
                </div>
                {review.product?.name && (
                  <p className="text-xs text-gray-500 mb-2">Product: <span className="font-medium">{review.product.name}</span></p>
                )}
                <p className="text-gray-700 text-sm">{review.comment}</p>

                {review.admin_response && (
                  <div className="mt-3 pl-3 border-l-2 border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">Admin Response</p>
                    <p className="text-sm text-gray-600">{review.admin_response}</p>
                  </div>
                )}

                {showResponseForm === review.id && (
                  <div className="mt-3 flex gap-2">
                    <textarea
                      value={responseText[review.id] || ''}
                      onChange={e => setResponseText(prev => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder="Write a response..."
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleAddResponse(review.id)}
                        disabled={submitting === review.id}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
                      >
                        {submitting === review.id ? '...' : 'Send'}
                      </button>
                      <button
                        onClick={() => setShowResponseForm(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                )}
                <button
                  onClick={() => setShowResponseForm(showResponseForm === review.id ? null : review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100"
                >
                  <MessageSquare className="h-4 w-4" /> Respond
                </button>
                <button
                  onClick={() => review.approved ? handleDelete(review.id) : handleReject(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" /> {review.approved ? 'Delete' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
