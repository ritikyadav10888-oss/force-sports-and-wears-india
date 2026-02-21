import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
    })),
    shipping: z.number().nonnegative().optional().default(0),
    paymentMethod: z.string(),
    shippingAddress: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
        phone: z.string()
    })
});

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const data = createOrderSchema.parse(req.body);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Fetch products to calculate total and verify stock
        let subtotal = 0;
        const orderItemsData = [];

        for (const item of data.items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });

            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }

            if (product.stock < item.quantity) {
                 return res.status(400).json({ error: `Insufficient stock for product: ${product.name}` });
            }

            const price = Number(product.price);
            subtotal += price * item.quantity;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price // Use DB price (Decimal or string from Prisma)
            });
        }

        const shipping = data.shipping || 0;
        const total = subtotal + shipping;

        // Generate order number
        const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId,
                status: 'PENDING',
                subtotal: subtotal.toString(),
                shipping: shipping.toString(),
                total: total.toString(),
                paymentMethod: data.paymentMethod,
                items: {
                    create: orderItemsData.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                },
                shippingAddress: {
                    create: data.shippingAddress
                }
            },
            include: {
                items: {
                    include: { product: true }
                },
                shippingAddress: true
            }
        });

        res.status(201).json({ message: 'Order created', order });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                },
                shipment: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const isAdmin = req.user?.role === 'ADMIN';

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                shippingAddress: true,
                shipment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check authorization
        if (!isAdmin && order.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                shipment: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
};
