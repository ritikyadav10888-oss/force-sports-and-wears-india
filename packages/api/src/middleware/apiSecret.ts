import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const API_SECRET = process.env.API_SECRET;

if (!API_SECRET || API_SECRET.length < 32) {
    console.warn('⚠️  WARNING: API_SECRET must be at least 32 characters long for production use');
}

export const validateApiSecret = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const providedSecret = req.headers['x-api-secret'] as string;

    if (!providedSecret) {
        return res.status(403).json({ error: 'API secret required' });
    }

    if (!API_SECRET) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Constant-time comparison to prevent timing attacks
    try {
        const isValid = crypto.timingSafeEqual(
            Buffer.from(providedSecret),
            Buffer.from(API_SECRET)
        );

        if (!isValid) {
            return res.status(403).json({ error: 'Invalid API secret' });
        }

        next();
    } catch (error) {
        // Lengths don't match
        return res.status(403).json({ error: 'Invalid API secret' });
    }
};
