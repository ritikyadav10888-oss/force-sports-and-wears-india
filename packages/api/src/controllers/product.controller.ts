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
    stock: z.number().int().nonnegative(),
    sizes: z.array(z.string()).optional(),
    returnPolicy: z.enum(['RETURNABLE', 'EXCHANGE_ONLY', 'NON_RETURNABLE']).optional(),
    deliveryDays: z.number().int().positive().optional()
});

// Helper to parse SQLite array fields (stored as JSON strings)
const parseProduct = (product: any) => {
    if (!product) return null;
    const p = { ...product };

    // Detect if fields are strings (SQLite) and parse them
    if (typeof p.images === 'string') {
        try {
            p.images = JSON.parse(p.images);
        } catch (e) {
            p.images = [];
        }
    }

    if (typeof p.sizes === 'string') {
        try {
            p.sizes = JSON.parse(p.sizes);
        } catch (e) {
            p.sizes = [];
        }
    }

    // Ensure price is a number for the frontend
    p.price = Number(p.price);

    return p;
};

export const getAllProducts = async (req: AuthRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        const parsedProducts = products.map(parseProduct);
        res.json({ products: parsedProducts });
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

        res.json({ product: parseProduct(product) });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({
            error: 'Failed to fetch product',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const data = createProductSchema.parse(req.body);

        const product = await prisma.product.create({
            data: {
                ...data,
                price: data.price,
                images: JSON.stringify(data.images),
                sizes: data.sizes ? JSON.stringify(data.sizes) : undefined
            }
        });

        res.status(201).json({ message: 'Product created', product: parseProduct(product) });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({
            error: 'Failed to create product',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const data = createProductSchema.partial().parse(req.body);

        const updateData: any = { ...data };
        if (data.images) updateData.images = JSON.stringify(data.images);
        if (data.sizes) updateData.sizes = JSON.stringify(data.sizes);

        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        res.json({ message: 'Product updated', product: parseProduct(product) });
    } catch (error) {
        console.error('Error updating product:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({
            error: 'Failed to update product',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            error: 'Failed to delete product',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};
