import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';

const createInquirySchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    company: z.string().optional(),
    productId: z.string().optional(),
    productName: z.string().optional(),
    quantity: z.number().int().positive(),
    message: z.string().min(10),
    type: z.enum(['BULK_ORDER', 'CUSTOM_MANUFACTURING']).default('BULK_ORDER'),
});

export const createBulkInquiry = async (req: Request, res: Response) => {
    try {
        const data = createInquirySchema.parse(req.body);
        const inquiry = await prisma.bulkInquiry.create({ data });
        res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating bulk inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
};

export const getAllBulkInquiries = async (req: Request, res: Response) => {
    try {
        const inquiries = await prisma.bulkInquiry.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json({ inquiries });
    } catch (error: any) {
        console.error('Error fetching bulk inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'CONTACTED', 'CLOSED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const inquiry = await prisma.bulkInquiry.update({
            where: { id },
            data: { status },
        });
        res.json({ message: 'Status updated', inquiry });
    } catch (error: any) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
};
