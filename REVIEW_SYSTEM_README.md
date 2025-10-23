# Customer Review System

This document describes the customer review system implemented for RentYatra, allowing users to rate and review products and rental requests.

## Features

### Backend Features
- **Review Model**: Complete review system with rating (1-5 stars), review text, user and product/rental request references
- **Review Statistics**: Automatic calculation of average ratings and rating distribution
- **Review Moderation**: Support for pending, approved, rejected, and hidden review statuses
- **Helpful Votes**: Users can vote on whether reviews are helpful or not
- **User Statistics**: Automatic update of user rating statistics
- **Product/Rental Request Statistics**: Automatic update of item rating statistics

### Frontend Features
- **Review Display**: Beautiful review cards with user avatars, ratings, and timestamps
- **Review Form**: Interactive form for submitting reviews with star rating and text input
- **Rating Distribution**: Visual breakdown of ratings (5-star to 1-star)
- **Helpful Voting**: Users can vote on review helpfulness
- **Pagination**: Load more reviews functionality
- **Responsive Design**: Mobile-friendly interface

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `GET /api/reviews/product/:productId/stats` - Get review statistics for a product
- `GET /api/reviews/rental-request/:rentalRequestId` - Get reviews for a rental request
- `GET /api/reviews/user/:userId` - Get reviews by a specific user

### Protected Endpoints (Authentication Required)
- `POST /api/reviews/product/:productId` - Create a review for a product
- `POST /api/reviews/rental-request/:rentalRequestId` - Create a review for a rental request
- `PUT /api/reviews/:reviewId` - Update a review (only by review author)
- `DELETE /api/reviews/:reviewId` - Delete a review (only by review author)
- `POST /api/reviews/:reviewId/vote` - Vote on review helpfulness
- `DELETE /api/reviews/:reviewId/vote` - Remove vote on review

## Database Schema

### Review Model
```javascript
{
  rating: Number, // 1-5 stars
  reviewText: String, // 10-1000 characters
  user: ObjectId, // Reference to User
  product: ObjectId, // Reference to Product (optional)
  rentalRequest: ObjectId, // Reference to RentalRequest (optional)
  status: String, // 'pending', 'approved', 'rejected', 'hidden'
  helpfulVotes: Number,
  notHelpfulVotes: Number,
  helpfulVoters: [ObjectId], // Users who voted helpful
  notHelpfulVoters: [ObjectId], // Users who voted not helpful
  createdAt: Date,
  updatedAt: Date
}
```

### Updated Models
- **Product Model**: Added `averageRating`, `totalReviews`, and `ratingDistribution` fields
- **RentalRequest Model**: Added `averageRating`, `totalReviews`, and `ratingDistribution` fields
- **User Model**: Already had rating statistics in `stats` object

## Frontend Components

### ReviewsSection Component
- **Location**: `frontend/src/components/product/ReviewsSection.jsx`
- **Props**: 
  - `itemId`: ID of the product or rental request
  - `isRentalRequest`: Boolean indicating if it's a rental request
- **Features**:
  - Displays review statistics and rating distribution
  - Shows individual reviews with user information
  - Handles review submission form
  - Manages helpful voting
  - Supports pagination

### Integration
- **ItemDetail Page**: Integrated into the item detail page to show reviews
- **API Service**: Added review-related API methods to `api.js`

## Usage Examples

### Creating a Review
```javascript
// Frontend
const response = await apiService.createProductReview(productId, {
  rating: 5,
  reviewText: "Excellent product, highly recommended!"
});
```

### Getting Reviews
```javascript
// Frontend
const response = await apiService.getProductReviews(productId, {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
```

### Voting on Reviews
```javascript
// Frontend
const response = await apiService.voteReview(reviewId, true); // true for helpful
```

## Business Rules

1. **One Review Per User**: Each user can only review a product/rental request once
2. **Rating Validation**: Ratings must be whole numbers between 1 and 5
3. **Review Text**: Must be between 10 and 1000 characters
4. **Auto-Approval**: Reviews are automatically approved (can be changed to pending for moderation)
5. **Statistics Update**: Product and user statistics are automatically updated when reviews are added/removed
6. **Vote Management**: Users can change their vote or remove it entirely

## Security Features

- **Authentication Required**: Only authenticated users can create, update, or delete reviews
- **Ownership Validation**: Users can only modify their own reviews
- **Input Validation**: Server-side validation for all review data
- **Rate Limiting**: Can be implemented to prevent spam reviews

## Future Enhancements

1. **Review Moderation**: Admin panel for reviewing and moderating reviews
2. **Review Images**: Allow users to attach images to reviews
3. **Review Replies**: Allow product owners to reply to reviews
4. **Review Filtering**: Filter reviews by rating, date, helpfulness
5. **Review Analytics**: Detailed analytics for review performance
6. **Review Notifications**: Notify users when their reviews receive votes or replies

## Testing

The review system can be tested by:
1. Creating a product or rental request
2. Logging in as a user
3. Navigating to the item detail page
4. Writing a review with rating and text
5. Viewing the review in the reviews section
6. Testing helpful voting functionality

## Dependencies

### Backend
- MongoDB with Mongoose
- Express.js
- JWT authentication middleware

### Frontend
- React with hooks
- Lucide React icons
- Custom API service
- Authentication context
