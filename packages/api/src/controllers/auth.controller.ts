import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authenticate';

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6)
});

const resendOtpSchema = z.object({
    email: z.string().email()
});

export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, name, phone } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: 'CUSTOMER',
                isVerified: false,
                otp,
                otpExpiresAt
            }
        });

        // SIMULATE SENDING OTP (Log to console)
        console.log(`[OTP] Generated for ${email}: ${otp}`);

        // Return success but NO token (user must verify)
        res.status(201).json({
            message: 'User registered successfully. Please verify OTP sent to your email.',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: false,
                phone: user.phone,
                otp: process.env.NODE_ENV === 'development' ? otp : undefined // For testing convenience
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
    try {
        const { email, otp } = verifyOtpSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User already verified' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        // Mark verified
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otp: null,
                otpExpiresAt: null
            }
        });

        // Generate token
        const token = generateToken({
            userId: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role
        });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Email verified successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                isVerified: true,
                phone: updatedUser.phone
            },
            token
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('OTP Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check verification
        if (!user.isVerified && user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Email not verified. Please verify your email.' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

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
                isVerified: user.isVerified,
                phone: user.phone
            },
            token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const resendOtp = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = resendOtpSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpiresAt
            }
        });

        console.log(`[OTP Resend] Generated for ${email}: ${otp}`);

        res.json({
            message: 'OTP resent successfully',
            user: {
                // Return OTP in development mode for convenience
                otp: process.env.NODE_ENV === 'development' ? otp : undefined
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
};
