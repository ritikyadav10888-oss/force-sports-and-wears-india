import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/authenticate';

const reviewSchema = z.object({
    productId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3).max(1000)
});

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { productId, rating, comment } = reviewSchema.parse(req.body);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if user has already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });

        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this product' });
        }

        // Optional: Check if user has actually purchased the product
        const order = await prisma.order.findFirst({
            where: {
                userId,
                status: 'COMPLETED',
                items: {
                    some: { productId }
                }
            }
        });

        // Uncomment the below if you want to restrict reviews to verified purchasers
        /*
        if (!order) {
            return res.status(403).json({ error: 'You can only review products you have purchased' });
        }
        */

        const review = await prisma.review.create({
            data: {
                productId,
                userId,
                rating,
                comment
            },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

export const getProductReviews = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const stats = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true }
        });

        res.json({
            reviews,
            stats: {
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count.rating
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Allow deletion if owner or admin
        if (review.userId !== userId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Unauthorized to delete this review' });
        }

        await prisma.review.delete({
            where: { id }
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, comment } = z.object({
            rating: z.number().min(1).max(5),
            comment: z.string().min(3).max(1000)
        }).parse(req.body);
        const userId = req.user?.userId;

        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this review' });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { rating, comment },
            include: {
                user: { select: { name: true } }
            }
        });

        res.json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
};


export const getAllReviews = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ reviews });
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch all reviews' });
    }
};

export const getProductReviewSummaries = async (req: AuthRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                reviews: {
                    some: {}
                }
            },
            select: {
                id: true,
                name: true,
                images: true,
                price: true,
                reviews: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { name: true } }
                    }
                }
            }
        });

        const summaries = await Promise.all(products.map(async (product: any) => {
            const stats = await prisma.review.aggregate({
                where: { productId: product.id },
                _avg: { rating: true },
                _count: { rating: true }
            });

            return {
                id: product.id,
                name: product.name,
                image: Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images as string)[0],
                price: product.price,
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count.rating,
                latestReview: product.reviews[0] || null
            };
        }));

        res.json({ summaries });
    } catch (error) {
        console.error('Get product review summaries error:', error);
        res.status(500).json({ error: 'Failed to fetch review summaries' });
    }
};
