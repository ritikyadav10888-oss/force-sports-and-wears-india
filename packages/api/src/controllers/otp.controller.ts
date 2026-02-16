import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authenticate';

const sendOtpSchema = z.object({
    phone: z.string().min(10),
    countryCode: z.string().default('IN') // Default to India
});

const verifyOtpSchema = z.object({
    phone: z.string().min(10),
    otp: z.string().length(6)
});

export const sendOtp = async (req: AuthRequest, res: Response) => {
    try {
        const { phone } = sendOtpSchema.parse(req.body);

        // Check if user exists or create a temporary one?
        // For now, we only allow OTP for existing users or we treat it as signup/login combined.
        // Let's assume we find the user by phone.

        let user = await prisma.user.findFirst({
            where: { phone: { contains: phone } }
        });

        if (!user) {
            // If user doesn't exist, we might want to create a placeholder or return error.
            // For "Login with OTP", user must exist.
            // For "Signup", we might verification first.
            // Let's allow it for now, assuming frontend handles signup flow.
            // But to store OTP, we need a user record? Or we can store in a separate Otp table.
            // Since we added `otp` to `User`, we need a user.

            // If user not found, we can't update.
            // Let's Create a user if not exists?
             return res.status(404).json({ error: 'User not found. Please sign up first.' });
        }

        // Generate 6-digit OTP (Fixed for test user)
        const otp = phone === '9999999999' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt
            }
        });

        // Mock Send SMS
        console.log(`[MOCK SMS] OTP for ${phone} is: ${otp}`);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
    try {
        const { phone, otp } = verifyOtpSchema.parse(req.body);

        const user = await prisma.user.findFirst({
            where: { phone: { contains: phone } }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.otp || !user.otpExpiresAt) {
             return res.status(400).json({ error: 'No OTP requested' });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Clear OTP
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp: null,
                otpExpiresAt: null,
                lastLoginAt: new Date(),
                loginAttempts: 0 // Reset attempts
            }
        });

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone
            },
            token
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};
