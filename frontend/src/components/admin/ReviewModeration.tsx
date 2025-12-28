import { useState, useEffect } from 'react';
import { Check, X, MessageCircle } from 'lucide-react';
import StarRating from '../reviews/StarRating';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';
import { Review } from '../../types/review';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>(
    'pending'
  );
  const [responseText, setResponseText] = useState<{ [key: number]: string }>(
    {}
  );
  const [showResponseForm, setShowResponseForm] = useState<number | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filter === 'pending') filters.pending = true;
      if (filter === 'approved') filters.approved = true;

      const response = await reviewService.admin.getReviews(filters);
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const handleApprove = async (reviewId: number) => {
    try {
      await reviewService.admin.approveReview(reviewId);
      toast.success('Review approved');
      loadReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: number) => {
    if (!confirm('Are you sure you want to reject this review?')) return;

    try {
      await reviewService.admin.rejectReview(reviewId);
      toast.success('Review rejected');
      loadReviews();
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  const handleAddResponse = async (reviewId: number) => {
    const response = responseText[reviewId];
    if (!response || response.trim() === '') {
      toast.error('Please enter a response');
      return;
    }

    try {
      await reviewService.admin.addResponse(reviewId, response);
      toast.success('Response added');
      setResponseText((prev) => ({ ...prev, [reviewId]: '' }));
      setShowResponseForm(null);
      loadReviews();
    } catch (error) {
      toast.error('Failed to add response');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warmgray-900 mb-4">
          Review Moderation
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'pending'
                ? 'bg-teal text-white'
                : 'bg-warmgray-200 text-warmgray-700 hover:bg-warmgray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'approved'
                ? 'bg-teal text-white'
                : 'bg-warmgray-200 text-warmgray-700 hover:bg-warmgray-300'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-teal text-white'
                : 'bg-warmgray-200 text-warmgray-700 hover:bg-warmgray-300'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-warmgray-600">Loading...</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: Review) => (
            <div
              key={review.id}
              className="bg-white border border-warmgray-300 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <StarRating rating={review.rating} readonly />
                  <p className="text-sm text-warmgray-600 mt-1">
                    by {review.user.name} on{' '}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  {review.product && (
                    <p className="text-sm text-warmgray-600">
                      Product: {review.product.name}
                    </p>
                  )}
                  {review.verified_purchase && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!review.verified_purchase && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {review.title && (
                <h3 className="font-semibold mb-2 text-warmgray-900">
                  {review.title}
                </h3>
              )}
              <p className="text-warmgray-700 mb-4">{review.comment}</p>

              {review.has_photos && review.photo_urls.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {review.photo_urls.map((photo: any, idx: number) => (
                    <img
                      key={idx}
                      src={photo.thumbnail_url}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {review.admin_response ? (
                <div className="bg-sky/10 border-l-4 border-sky p-3 rounded">
                  <p className="text-sm font-semibold text-warmgray-900 mb-1">
                    Store Response
                  </p>
                  <p className="text-sm text-warmgray-700">
                    {review.admin_response}
                  </p>
                </div>
              ) : (
                <div>
                  {showResponseForm === review.id ? (
                    <div className="border-t border-warmgray-200 pt-4">
                      <textarea
                        value={responseText[review.id] || ''}
                        onChange={(e) =>
                          setResponseText((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                        placeholder="Write your response..."
                        rows={3}
                        className="w-full border-2 border-warmgray-300 rounded-lg p-2 mb-2 focus:border-teal focus:ring-2 focus:ring-teal/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddResponse(review.id)}
                          className="px-4 py-2 bg-teal text-white rounded hover:bg-teal/90 transition-colors"
                        >
                          Submit Response
                        </button>
                        <button
                          onClick={() => setShowResponseForm(null)}
                          className="px-4 py-2 bg-warmgray-300 text-warmgray-700 rounded hover:bg-warmgray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowResponseForm(review.id)}
                      className="flex items-center gap-1 text-sm text-teal hover:text-teal/80 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Add Response
                    </button>
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

export default ReviewModeration;
