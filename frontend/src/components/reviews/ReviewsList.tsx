import { ThumbsUp, CheckCircle, MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import { Review } from '../../types/review';

interface ReviewsListProps {
  reviews: Review[];
  onHelpfulClick: (reviewId: number) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onHelpfulClick,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-warmgray-200 pb-6 last:border-0"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} readonly size="sm" />
                {review.verified_purchase && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-sm text-warmgray-600">
                by {review.user.name} on {formatDate(review.created_at)}
              </p>
            </div>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-warmgray-900 mb-2">
              {review.title}
            </h4>
          )}

          {/* Comment */}
          <p className="text-warmgray-700 mb-3">{review.comment}</p>

          {/* Photos */}
          {review.has_photos && review.photo_urls.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {review.photo_urls.map((photo, index) => (
                <img
                  key={index}
                  src={photo.thumbnail_url}
                  alt={`Review photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => window.open(photo.url, '_blank')}
                />
              ))}
            </div>
          )}

          {/* Admin Response */}
          {review.admin_response && (
            <div className="bg-sky/10 border-l-4 border-sky p-4 mt-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-sky" />
                <span className="text-sm font-semibold text-warmgray-900">
                  Store Response
                </span>
              </div>
              <p className="text-sm text-warmgray-700">
                {review.admin_response}
              </p>
            </div>
          )}

          {/* Helpful Button */}
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => onHelpfulClick(review.id)}
              className="flex items-center gap-2 text-sm text-warmgray-600 hover:text-teal transition-colors"
            >
              <ThumbsUp className="h-4 w-4" />
              Helpful ({review.helpful_count})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
