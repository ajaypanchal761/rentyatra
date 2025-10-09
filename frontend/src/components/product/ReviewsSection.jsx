import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import StarRating from '../common/StarRating';
import Button from '../common/Button';
import { format } from 'date-fns';

const ReviewsSection = ({ itemId }) => {
  const { isAuthenticated, user } = useAuth();
  const { getItemReviews, addReview, getAverageRating, getReviewsCount } = useApp();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const reviews = getItemReviews(itemId);
  const averageRating = getAverageRating(itemId);
  const totalReviews = getReviewsCount(itemId);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    if (comment.trim().length < 10) {
      alert('Review must be at least 10 characters long');
      return;
    }

    addReview({
      itemId,
      rating,
      comment: comment.trim(),
      userName: user.name,
      userEmail: user.email,
    });

    setComment('');
    setRating(5);
    setShowReviewForm(false);
  };

  return (
    <div className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Customer Reviews
          </h2>
          {isAuthenticated && !showReviewForm && (
            <Button 
              onClick={() => setShowReviewForm(true)}
              variant="outline"
              size="sm"
              className="w-full md:w-auto"
            >
              <MessageCircle size={16} className="mr-2" />
              Write a Review
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="text-center mb-4">
                <div className="text-5xl md:text-6xl font-black text-gray-900 mb-2">
                  {totalReviews > 0 ? averageRating.toFixed(1) : '0.0'}
                </div>
                <StarRating 
                  rating={averageRating} 
                  size={24} 
                  className="justify-center mb-2"
                />
                <p className="text-sm text-gray-600">
                  Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 mt-6">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-8">{star}</span>
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 md:p-6 mb-6 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Write Your Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <StarRating
                      rating={rating}
                      size={32}
                      interactive={true}
                      onRatingChange={setRating}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      placeholder="Share your experience with this item... (minimum 10 characters)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.length} characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      Submit Review
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setComment('');
                        setRating(5);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to review this item!
                </p>
                {isAuthenticated && !showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)} size="sm">
                    Write First Review
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                              {review.userName}
                            </h4>
                            <CheckCircle size={14} className="text-green-500" />
                          </div>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {format(new Date(review.createdAt), 'dd MMM yyyy')}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition">
                        <ThumbsUp size={14} />
                        <span>Helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;

