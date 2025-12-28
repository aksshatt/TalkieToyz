import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';

interface ReviewSubmissionFormProps {
  productSlug: string;
  canReview: boolean;
  hasVerifiedPurchase: boolean;
  onReviewSubmitted: () => void;
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  productSlug,
  canReview,
  hasVerifiedPurchase,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setPhotos((prev) => [...prev, ...validFiles].slice(0, 3));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewService.createReview(productSlug, {
        rating,
        title,
        comment,
        photos,
      });

      toast.success(
        'Review submitted successfully! It will be visible after admin approval.'
      );

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setPhotos([]);

      onReviewSubmitted();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canReview) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          {hasVerifiedPurchase
            ? 'You have already reviewed this product.'
            : 'Only verified purchasers can write reviews. Purchase this product to leave a review!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-warmgray-300 p-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      {hasVerifiedPurchase && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            ✓ Verified Purchase - Your review will be marked as verified
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-warmgray-900 mb-2">
            Rating <span className="text-coral">*</span>
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-warmgray-900 mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
            placeholder="Sum up your experience"
          />
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-warmgray-900 mb-2">
            Your Review <span className="text-coral">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-2 border-2 border-warmgray-300 rounded-lg focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
            placeholder="Share your experience with this product..."
          />
          <p className="text-sm text-warmgray-600 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-warmgray-900 mb-2">
            Add Photos (Optional, up to 3)
          </label>

          {photos.length < 3 && (
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-warmgray-300 rounded-lg cursor-pointer hover:border-teal hover:bg-teal/5 transition-colors">
              <Upload className="h-5 w-5 text-warmgray-500" />
              <span className="text-sm text-warmgray-700">Upload Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-coral text-white rounded-full p-1 hover:bg-coral/80 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full btn-primary-talkie disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewSubmissionForm;
