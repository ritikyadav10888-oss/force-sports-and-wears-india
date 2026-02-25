import { Router } from 'express';
import { createBulkInquiry, getAllBulkInquiries, updateInquiryStatus } from '../controllers/bulk-inquiry.controller';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

// Public: anyone can submit an inquiry
router.post('/', createBulkInquiry);

// Admin only
router.get('/', authenticate, requireAdmin, getAllBulkInquiries);
router.patch('/:id/status', authenticate, requireAdmin, updateInquiryStatus);

export default router;
