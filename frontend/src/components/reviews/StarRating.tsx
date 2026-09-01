import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Read-only display: expose a single label, hide the individual icons.
  if (readonly) {
    return (
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`Rated ${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-sunshine fill-sunshine' : 'text-warmgray-200 fill-warmgray-200'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === rating}
          onClick={() => onRatingChange?.(star)}
          className="cursor-pointer hover:scale-110 transition-transform"
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
        >
          <Star
            aria-hidden
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-sunshine fill-sunshine' : 'text-warmgray-200 fill-warmgray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
