import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

// Validation schema
const createProductSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    images: z.array(z.string()),
    category: z.string(),
    stock: z.number().int().nonnegative()
});

export const getAllProducts = async (req: AuthRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products', details: String(error) });
    }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const data = createProductSchema.parse(req.body);

        const product = await prisma.product.create({
            data: {
                ...data,
                price: data.price.toString()
            }
        });

        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const data = createProductSchema.partial().parse(req.body);

        const product = await prisma.product.update({
            where: { id },
            data: data.price ? { ...data, price: data.price.toString() } : data
        });

        res.json({ message: 'Product updated', product });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
