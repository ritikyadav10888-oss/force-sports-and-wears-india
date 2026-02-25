import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

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

// Helper to parse orders in customer records
const parseCustomerOrder = (order: any) => {
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
    return o;
};

export const getAllCustomers = async (req: AuthRequest, res: Response) => {
    try {
        const customers = await prisma.user.findMany({
            where: { role: 'CUSTOMER' },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                createdAt: true,
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate stats for each customer
        const customersWithStats = customers.map((customer: any) => ({
            ...customer,
            totalOrders: customer.orders.length,
            totalSpent: customer.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
        }));

        res.json({ customers: customersWithStats });
    } catch (error) {
        console.error('Error fetching all customers:', error);
        res.status(500).json({
            error: 'Failed to fetch customers',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const getCustomerById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const customer = await prisma.user.findUnique({
            where: { id, role: 'CUSTOMER' },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                createdAt: true,
                orders: {
                    include: {
                        items: {
                            include: { product: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const totalOrders = customer.orders.length;
        const totalSpent = customer.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        res.json({
            customer: {
                ...customer,
                orders: customer.orders.map(parseCustomerOrder),
                stats: {
                    totalOrders,
                    totalSpent,
                    avgOrderValue
                }
            }
        });
    } catch (error) {
        console.error('Error fetching customer by ID:', error);
        res.status(500).json({
            error: 'Failed to fetch customer',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const deleteCustomer = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const customer = await prisma.user.findUnique({
            where: { id, role: 'CUSTOMER' }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Delete all associated data
        await prisma.$transaction([
            prisma.refreshToken.deleteMany({ where: { userId: id } }),
            prisma.supportTicket.deleteMany({ where: { userId: id } }),
            prisma.order.deleteMany({ where: { userId: id } }),
            prisma.user.delete({ where: { id } })
        ]);

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            error: 'Failed to delete customer',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

