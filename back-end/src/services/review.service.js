const Review = require('../models/review.model');

class ReviewService {
    async createReview({ productId, userId, rating, comment }) {
        // const existingReview = await Review.findOne({ productId, userId });
        // if (existingReview) {
        //     throw new Error('User has already reviewed this product.');
        // }
        const review = new Review({ productId, userId, rating, comment });
        return await review.save();
    }

    async getReviews() {
        return await Review.find().populate('userId', 'fullName').lean();
    }

    async getReviewById(reviewId) {
        return await Review.findById(reviewId).populate('userId', 'fullName').lean();
    }

    async getReviewsByProductId(productId) {
        return await Review.find({ productId }).populate('userId', 'fullName').lean();
    }

    async getReviewsByUserId(userId) {
        return await Review.find({ userId }).populate('productId').lean();
    }

    async deleteReview(reviewId) {
        return await Review.findByIdAndDelete(reviewId);
    }

    async updateReview(reviewId, { rating, comment }) {
        return await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
    }

    async getReviewSummary(productId) {
        const reviews = await Review.find({ productId }).lean();

        const totalReviews = reviews.length;
        const ratingCounts = [0, 0, 0, 0, 0];

        let sumRatings = 0;

        reviews.forEach(review => {
            const ratingIndex = review.rating - 1;
            ratingCounts[ratingIndex]++;
            sumRatings += review.rating;
        });

        const averageRating = sumRatings / totalReviews;

        const ratingPercentages = ratingCounts.map(count => ({
            count,
            percentage: (count / totalReviews) * 100
        }));

        return {
            averageRating,
            totalReviews,
            ratingPercentages
        };
    }
}

module.exports = new ReviewService();
