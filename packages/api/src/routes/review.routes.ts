import { Router } from 'express';
import { createReview, getProductReviews, deleteReview, getAllReviews, updateReview, getProductReviewSummaries } from '../controllers/review.controller';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

// Public routes
router.get('/products/:productId', getProductReviews);

// Protected routes (Customer)
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

// Admin routes
router.get('/summaries', authenticate, requireAdmin, getProductReviewSummaries);
router.get('/all', authenticate, requireAdmin, getAllReviews);

export default router;
