import { Response } from 'express';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive()
    })),
    subtotal: z.number().positive(),
    shipping: z.number().nonnegative(),
    total: z.number().positive(),
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

// Helper to parse SQLite array fields in products
const parseProduct = (product: any) => {
    if (!product) return null;
    const p = { ...product };
    if (typeof p.images === 'string') {
        try { p.images = JSON.parse(p.images); } catch (e) { p.images = []; }
    }
    if (typeof p.sizes === 'string') {
        try { p.sizes = JSON.parse(p.sizes); } catch (e) { p.sizes = []; }
    }
    p.price = Number(p.price);
    return p;
};

// Helper to parse order items and their products
const parseOrder = (order: any) => {
    if (!order) return null;
    const o = { ...order };
    if (o.items) {
        o.items = o.items.map((item: any) => ({
            ...item,
            product: item.product ? parseProduct(item.product) : undefined,
            price: Number(item.price)
        }));
    }
    o.total = Number(o.total);
    o.subtotal = Number(o.subtotal);
    o.shipping = Number(o.shipping);
    return o;
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const data = createOrderSchema.parse(req.body);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Use a transaction to validate stock and create order atomically
        const order = await prisma.$transaction(async (tx: any) => {
            // Step 1: Validate and lock stock for all items
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    select: { id: true, name: true, stock: true }
                });

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }

                if (product.stock <= 0) {
                    throw new Error(`"${product.name}" is out of stock`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`"${product.name}" only has ${product.stock} unit(s) available`);
                }
            }

            // Step 2: Generate order number
            const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            // Step 3: Create the order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    status: 'PENDING',
                    subtotal: data.subtotal,
                    shipping: data.shipping,
                    total: data.total,
                    paymentMethod: data.paymentMethod,
                    items: {
                        create: data.items.map(item => ({
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

            // Step 4: Decrement stock for each ordered item
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            return newOrder;
        });

        res.status(201).json({ message: 'Order created', order: parseOrder(order) });
    } catch (error: any) {
        console.error('Error creating order:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        // Return stock/product errors as 400 so the frontend can display them
        if (error.message && (error.message.includes('out of stock') || error.message.includes('only has') || error.message.includes('not found'))) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({
            error: 'Failed to create order',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
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

        res.json({ orders: orders.map(parseOrder) });
    } catch (error: any) {
        console.error('Error fetching my orders:', error);

        // Log to file for debugging
        const errorLogPath = path.join(process.cwd(), 'error.log');
        const errorDetail = `\n[${new Date().toISOString()}] Error in getMyOrders:\n${error.stack || error}\n${JSON.stringify(error, null, 2)}\n`;
        fs.appendFileSync(errorLogPath, errorDetail);

        res.status(500).json({
            error: 'Failed to fetch orders',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
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

        res.json({ order: parseOrder(order) });
    } catch (error: any) {
        console.error('Error fetching order by ID:', error);

        // Log to file for debugging
        const errorLogPath = path.join(process.cwd(), 'error.log');
        const errorDetail = `\n[${new Date().toISOString()}] Error in getOrderById for ID ${req.params.id}:\n${error.stack || error}\n${JSON.stringify(error, null, 2)}\n`;
        fs.appendFileSync(errorLogPath, errorDetail);

        res.status(500).json({
            error: 'Failed to fetch order',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
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

        res.json({ orders: orders.map(parseOrder) });
    } catch (error: any) {
        console.error('CRITICAL: Error in getAllOrders:', error);

        // Log to file for debugging
        const errorLogPath = path.join(process.cwd(), 'error.log');
        const errorDetail = `\n[${new Date().toISOString()}] Error in getAllOrders:\n${error.stack || error}\n${JSON.stringify(error, null, 2)}\n`;
        fs.appendFileSync(errorLogPath, errorDetail);

        res.status(500).json({
            error: 'Failed to fetch orders',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
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

        res.json({ message: 'Order status updated', order: parseOrder(order) });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            error: 'Failed to update order status',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};
