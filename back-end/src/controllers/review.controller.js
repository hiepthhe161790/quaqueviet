const { ReviewService } = require('../services/index');

class ReviewController {
    async createReview(req, res) {
        try {
            const review = await ReviewService.createReview(req.body);
            res.status(201).json(review);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getReviews(req, res) {
        try {
            const reviews = await ReviewService.getReviews();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getReview(req, res) {
        try {
            const review = await ReviewService.getReviewById(req.params.reviewId);
            res.status(200).json(review);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getReviewsByProduct(req, res) {
        try {
            const reviews = await ReviewService.getReviewsByProductId(req.params.productId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getReviewsByUser(req, res) {
        try {
            const reviews = await ReviewService.getReviewsByUserId(req.params.userId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async deleteReview(req, res) {
        try {
            await ReviewService.deleteReview(req.params.reviewId);
            res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async updateReview(req, res) {
        try {
            const review = await ReviewService.updateReview(req.params.reviewId, req.body);
            res.status(200).json(review);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
    async getReviewSummary(req, res) {
        try {
            const summary = await ReviewService.getReviewSummary(req.params.productId);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = new ReviewController();
