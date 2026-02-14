import { Router } from 'express';
import {
    createShipment,
    getAllShipments,
    getShipmentById,
    updateShipmentStatus
} from '../controllers/shipment.controller';
import { authenticate, requireAdmin } from '../middleware/authenticate';

const router = Router();

// All shipment routes are admin-only
router.post('/', authenticate, requireAdmin, createShipment);
router.get('/', authenticate, requireAdmin, getAllShipments);
router.get('/:id', authenticate, requireAdmin, getShipmentById);
router.put('/:id/status', authenticate, requireAdmin, updateShipmentStatus);

export default router;
