const express = require('express');
const router = express.Router();
const { ReviewController } = require('../../../controllers/index');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

router.post('/create_review', AuthMiddleware.verifyToken, ReviewController.createReview);
router.get('/get_reviews', ReviewController.getReviews);
router.get('/get_review/:reviewId', ReviewController.getReview);
router.get('/get_reviews_by_product/:productId', ReviewController.getReviewsByProduct);
router.get('/get_reviews_by_user/:userId', ReviewController.getReviewsByUser);
router.put('/update_review/:reviewId', AuthMiddleware.verifyToken, ReviewController.updateReview);
router.delete('/delete_review/:reviewId', AuthMiddleware.verifyToken, ReviewController.deleteReview);
router.get('/review_summary/:productId', ReviewController.getReviewSummary);
module.exports = router;