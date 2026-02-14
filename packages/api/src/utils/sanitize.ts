import { z } from 'zod';

// Email sanitization
export const sanitizeEmail = (email: string): string => {
    return email.toLowerCase().trim();
};

// Remove HTML tags and dangerous characters
export const sanitizeString = (input: string): string => {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
};

// Phone number sanitization
export const sanitizePhone = (phone: string): string => {
    return phone.replace(/[^\d+\-() ]/g, '').trim();
};

// Enhanced validation schemas with sanitization
export const registerSchema = z.object({
    email: z.string().email().transform(sanitizeEmail),
    password: z.string().min(8).max(100),
    name: z.string().min(2).max(100).transform(sanitizeString),
    phone: z.string().optional().transform(val => val ? sanitizePhone(val) : undefined),
});

export const loginSchema = z.object({
    email: z.string().email().transform(sanitizeEmail),
    password: z.string(),
});

export const productSchema = z.object({
    name: z.string().min(1).max(200).transform(sanitizeString),
    description: z.string().min(1).max(5000).transform(sanitizeString),
    price: z.number().positive(),
    category: z.string().min(1).max(100).transform(sanitizeString),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string().url()).optional(),
});

export const orderSchema = z.object({
    items: z.array(z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })),
    shippingAddress: z.object({
        name: z.string().min(1).max(100).transform(sanitizeString),
        address: z.string().min(1).max(500).transform(sanitizeString),
        city: z.string().min(1).max(100).transform(sanitizeString),
        state: z.string().min(1).max(100).transform(sanitizeString),
        zipCode: z.string().min(1).max(20).transform(sanitizeString),
        country: z.string().min(1).max(100).transform(sanitizeString),
        phone: z.string().transform(sanitizePhone),
    }),
});
