import { Router } from 'express';
import { getAllCustomers, getCustomerById, deleteCustomer } from '../controllers/customer.controller';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

// All customer routes are admin-only
router.get('/', authenticate, requireAdmin, getAllCustomers);
router.get('/:id', authenticate, requireAdmin, getCustomerById);
router.delete('/:id', authenticate, requireAdmin, deleteCustomer);

export default router;
