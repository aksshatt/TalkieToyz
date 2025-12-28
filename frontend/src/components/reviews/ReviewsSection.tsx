import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewSubmissionForm from './ReviewSubmissionForm';
import ReviewsList from './ReviewsList';
import { reviewService } from '../../services/reviewService';
import { Review, ReviewFilters } from '../../types/review';
import toast from 'react-hot-toast';

interface ReviewsSectionProps {
  productSlug: string;
  canUserReview: boolean;
  hasVerifiedPurchase: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productSlug,
  canUserReview,
  hasVerifiedPurchase,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({
    sort: 'recent',
    page: 1,
    per_page: 10,
  });
  const [meta, setMeta] = useState<any>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getProductReviews(
        productSlug,
        filters
      );
      setReviews(response.data);
      setMeta(response.meta);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productSlug, filters]);

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleHelpfulClick = async (reviewId: number) => {
    try {
      await reviewService.markHelpful(reviewId);
      toast.success('Marked as helpful');
      loadReviews(); // Reload to get updated helpful_count
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Already marked, try unmarking
        try {
          await reviewService.unmarkHelpful(reviewId);
          toast.success('Unmarked as helpful');
          loadReviews();
        } catch (e) {
          toast.error('Failed to update helpful status');
        }
      } else {
        toast.error('Failed to mark as helpful');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {meta && (
        <div className="bg-cream rounded-2xl p-6 border border-warmgray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-4xl font-bold text-warmgray-900 mb-2">
                {meta.average_rating.toFixed(1)}
              </div>
              <StarRating
                rating={Math.round(meta.average_rating)}
                readonly
                size="lg"
              />
              <p className="text-sm text-warmgray-600 mt-2">
                Based on {meta.total_reviews} review
                {meta.total_reviews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-2">
              {meta.rating_breakdown
                .slice()
                .reverse()
                .map((item: any) => (
                  <div key={item.rating} className="flex items-center gap-2">
                    <span className="text-sm w-12 text-warmgray-700">
                      {item.rating} star
                    </span>
                    <div className="flex-1 bg-warmgray-200 rounded-full h-2">
                      <div
                        className="bg-sunshine h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            meta.total_reviews > 0
                              ? (item.count / meta.total_reviews) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm w-8 text-warmgray-600">
                      {item.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      <ReviewSubmissionForm
        productSlug={productSlug}
        canReview={canUserReview}
        hasVerifiedPurchase={hasVerifiedPurchase}
        onReviewSubmitted={loadReviews}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filters.sort}
          onChange={(e) =>
            handleFilterChange({ sort: e.target.value as any })
          }
          className="px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
        >
          <option value="recent">Most Recent</option>
          <option value="most_helpful">Most Helpful</option>
          <option value="highest_rated">Highest Rated</option>
          <option value="lowest_rated">Lowest Rated</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.verified || false}
            onChange={(e) =>
              handleFilterChange({ verified: e.target.checked })
            }
            className="rounded border-warmgray-300"
          />
          <span className="text-sm text-warmgray-700">
            Verified Purchases Only
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.with_photos || false}
            onChange={(e) =>
              handleFilterChange({ with_photos: e.target.checked })
            }
            className="rounded border-warmgray-300"
          />
          <span className="text-sm text-warmgray-700">With Photos</span>
        </label>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-warmgray-600">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-warmgray-600">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <>
          <ReviewsList reviews={reviews} onHelpfulClick={handleHelpfulClick} />

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handleFilterChange({ page })}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      filters.page === page
                        ? 'bg-teal text-white'
                        : 'bg-warmgray-200 text-warmgray-700 hover:bg-warmgray-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsSection;
