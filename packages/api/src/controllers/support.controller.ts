import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

const createTicketSchema = z.object({
    orderId: z.string().optional(),
    issueType: z.string(),
    description: z.string()
});

export const createTicket = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const data = createTicketSchema.parse(req.body);

        const ticket = await prisma.supportTicket.create({
            data: {
                userId,
                orderId: data.orderId,
                issueType: data.issueType,
                description: data.description,
                status: 'OPEN'
            }
        });

        res.status(201).json({ message: 'Support ticket created', ticket });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Failed to create support ticket' });
    }
};

export const getMyTickets = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const tickets = await prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};

export const getAllTickets = async (req: AuthRequest, res: Response) => {
    try {
        const tickets = await prisma.supportTicket.findMany({
            include: {
                order: true,
                // userId can be linked back to User if we add that relation, but for now we can select userId
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};

export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ticket = await prisma.supportTicket.update({
            where: { id },
            data: {
                status,
                closedAt: status === 'CLOSED' ? new Date() : null
            }
        });

        res.json({ message: 'Ticket status updated', ticket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update ticket status' });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { id: ticketId } = req.params;
        const userId = req.user?.userId;

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            select: { userId: true, status: true, closedAt: true }
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Security check: Only the owner or an admin can see messages
        if (req.user?.role !== 'ADMIN' && ticket.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Expiry check: 24h after closing
        if (ticket.status === 'CLOSED' && ticket.closedAt) {
            const expiryTime = new Date(ticket.closedAt.getTime() + 24 * 60 * 60 * 1000);
            if (new Date() > expiryTime) {
                return res.status(403).json({
                    error: 'Conversation Expired',
                    message: 'This conversation is no longer available as it was closed more than 24 hours ago.'
                });
            }
        }

        const messages = await prisma.supportMessage.findMany({
            where: { ticketId },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

export const addMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { id: ticketId } = req.params;
        const { content } = req.body;
        const userId = req.user?.userId;
        const userName = req.user?.name || (req.user?.role === 'ADMIN' ? 'Support Agent' : 'User');

        if (!content) return res.status(400).json({ error: 'Message content required' });

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId }
        });

        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Block adding messages to closed tickets
        if (ticket.status === 'CLOSED') {
            return res.status(400).json({ error: 'Ticket is closed. Please open a new request.' });
        }

        // Security check: Only owner or admin
        if (req.user?.role !== 'ADMIN' && ticket.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const message = await prisma.supportMessage.create({
            data: {
                ticketId,
                content,
                senderId: userId!,
                senderName: userName,
                isAdmin: req.user?.role === 'ADMIN'
            }
        });

        // Update ticket status if admin is replying
        if (req.user?.role === 'ADMIN' && ticket.status === 'OPEN') {
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { status: 'WAITING_FOR_USER' }
            });
        } else if (req.user?.role === 'CUSTOMER' && ticket.status === 'WAITING_FOR_USER') {
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { status: 'OPEN' }
            });
        }

        res.status(201).json({ message });
    } catch (error) {
        console.error('Add message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
