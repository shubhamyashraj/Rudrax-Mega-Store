import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Rating } from '../atoms/Rating';

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified?: boolean;
  helpful?: number;
  images?: string[];
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
  onNotHelpful?: (id: string) => void;
}

export function ReviewCard({
  review,
  onHelpful,
  onNotHelpful
}: ReviewCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
          {review.userAvatar ? (
            <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-semibold text-muted-foreground">
              {review.userName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* User Info and Rating */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{review.userName}</h4>
            {review.verified && (
              <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">
                Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Rating rating={review.rating} size="sm" showNumber={false} />
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-semibold mb-2">{review.title}</h5>
      )}

      {/* Review Comment */}
      <p className="text-sm text-foreground mb-3">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {review.images.map((image, index) => (
            <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border border-border">
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">Was this helpful?</span>
        <div className="flex items-center gap-2">
          {onHelpful && (
            <button
              onClick={() => onHelpful(review.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              {review.helpful !== undefined && review.helpful > 0 && (
                <span>{review.helpful}</span>
              )}
            </button>
          )}
          {onNotHelpful && (
            <button
              onClick={() => onNotHelpful(review.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
