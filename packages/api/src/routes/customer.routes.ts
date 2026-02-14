import { Router } from 'express';
import { getAllCustomers, getCustomerById } from '../controllers/customer.controller';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

// All customer routes are admin-only
router.get('/', authenticate, requireAdmin, getAllCustomers);
router.get('/:id', authenticate, requireAdmin, getCustomerById);

export default router;
