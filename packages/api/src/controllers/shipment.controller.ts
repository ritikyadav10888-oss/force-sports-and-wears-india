import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

const createShipmentSchema = z.object({
    orderId: z.string(),
    carrier: z.string(),
    estimatedDate: z.string().transform(str => new Date(str))
});

export const createShipment = async (req: AuthRequest, res: Response) => {
    try {
        const data = createShipmentSchema.parse(req.body);

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: data.orderId }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Generate tracking number
        const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const shipment = await prisma.shipment.create({
            data: {
                orderId: data.orderId,
                trackingNumber,
                carrier: data.carrier,
                status: 'preparing',
                estimatedDate: data.estimatedDate
            },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        // Update order status to SHIPPED
        await prisma.order.update({
            where: { id: data.orderId },
            data: { status: 'SHIPPED' }
        });

        res.status(201).json({ message: 'Shipment created', shipment });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create shipment' });
    }
};

export const getAllShipments = async (req: AuthRequest, res: Response) => {
    try {
        const shipments = await prisma.shipment.findMany({
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ shipments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
};

export const getShipmentById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const shipment = await prisma.shipment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        },
                        shippingAddress: true
                    }
                }
            }
        });

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        res.json({ shipment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
};

export const updateShipmentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const shipment = await prisma.shipment.update({
            where: { id },
            data: { status }
        });

        // Update order status if delivered
        if (status === 'delivered') {
            await prisma.order.update({
                where: { id: shipment.orderId },
                data: { status: 'DELIVERED' }
            });
        }

        res.json({ message: 'Shipment status updated', shipment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shipment status' });
    }
};
