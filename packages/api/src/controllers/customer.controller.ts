import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

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
        const customersWithStats = customers.map(customer => ({
            ...customer,
            totalOrders: customer.orders.length,
            totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.total), 0)
        }));

        res.json({ customers: customersWithStats });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customers' });
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
        const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.total), 0);
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        res.json({
            customer: {
                ...customer,
                stats: {
                    totalOrders,
                    totalSpent,
                    avgOrderValue
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
};
