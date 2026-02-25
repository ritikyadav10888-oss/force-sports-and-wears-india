import { Router } from 'express';
import {
    createTicket,
    getMyTickets,
    getMessages,
    addMessage,
    getAllTickets,
    updateTicketStatus
} from '../controllers/support.controller';
import { authenticate, authorize } from '../middleware/authenticate';

const router = Router();

// Debug
router.get('/test-route', (req, res) => res.json({ message: 'Support router is working' }));

// Customer routes
router.post('/', authenticate, createTicket);
router.get('/my-tickets', authenticate, getMyTickets);

// Ticket Interaction
router.get('/:id/messages', authenticate, getMessages);
router.post('/:id/messages', authenticate, addMessage);

// Admin routes
router.get('/all', authenticate, authorize(['ADMIN']), getAllTickets);
router.patch('/:id/status', authenticate, authorize(['ADMIN']), updateTicketStatus);

export default router;
