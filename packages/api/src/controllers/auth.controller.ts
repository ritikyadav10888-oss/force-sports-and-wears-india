import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/authenticate';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization (using env vars)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

// Initialize supabase lazily or with a check to prevent startup crash
let supabase: any;
try {
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
    } else {
        console.warn('⚠️ Supabase credentials missing. Auth will fallback to local database.');
        supabase = {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
                    })
                })
            })
        };
    }
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
}

// Hardcoded Admin Credentials

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@force.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
    console.warn('⚠️  CRITICAL SECURITY WARNING: Using default admin credentials in production. Set ADMIN_EMAIL and ADMIN_PASSWORD env vars!');
}

const HARDCODED_ADMIN = {
    id: 'hardcoded-admin-id',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: 'Admin User',
    role: 'ADMIN' as 'ADMIN' | 'CUSTOMER',
    phone: '+1 111 222 3333'
};

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
                phone: user.phone
            }
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Registration error:', error);

        // Log to file for debugging
        const errorLogPath = path.join(process.cwd(), 'error.log');
        const errorDetail = `\n[${new Date().toISOString()}] Error in register:\n${error.stack || error}\n${JSON.stringify(error, null, 2)}\n`;
        fs.appendFileSync(errorLogPath, errorDetail);

        res.status(500).json({
            error: 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const verifyOtp = async (req: AuthRequest, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

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
            name: updatedUser.name,
            role: updatedUser.role as 'CUSTOMER' | 'ADMIN'
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
        console.error('OTP Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Check for hardcoded admin first
        if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
            const token = generateToken({
                userId: HARDCODED_ADMIN.id,
                email: HARDCODED_ADMIN.email,
                name: HARDCODED_ADMIN.name,
                role: HARDCODED_ADMIN.role
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({
                message: 'Login successful (Hardcoded Admin)',
                user: {
                    id: HARDCODED_ADMIN.id,
                    email: HARDCODED_ADMIN.email,
                    name: HARDCODED_ADMIN.name,
                    role: HARDCODED_ADMIN.role
                },
                token
            });
        }

        // Find user - Try Supabase first, then fallback to Prisma
        let user;
        const { data: supabaseUser, error: supabaseError } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single();

        if (supabaseUser) {
            user = supabaseUser;
        } else {
            // Fallback to Prisma if Supabase direct fails (e.g. RLS)
            try {
                user = await prisma.user.findUnique({ where: { email } });
            } catch (prismaError) {
                console.error('Prisma connection failed:', prismaError);
                throw new Error('Database connection failed');
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check verification (Excluding Hardcoded Admin)
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
            name: user.name,
            role: user.role as 'CUSTOMER' | 'ADMIN'
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
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Login error:', error);

        // Log to file for debugging
        const errorLogPath = path.join(process.cwd(), 'error.log');
        const errorDetail = `\n[${new Date().toISOString()}] Error in login:\n${error.stack || error}\n${JSON.stringify(error, null, 2)}\n`;
        fs.appendFileSync(errorLogPath, errorDetail);

        res.status(500).json({
            error: 'Login failed',
            details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        });
    }
};

export const logout = async (req: AuthRequest, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // Check for hardcoded admin
        if (req.user?.userId === HARDCODED_ADMIN.id) {
            return res.json({
                user: {
                    id: HARDCODED_ADMIN.id,
                    email: HARDCODED_ADMIN.email,
                    name: HARDCODED_ADMIN.name,
                    phone: HARDCODED_ADMIN.phone,
                    role: HARDCODED_ADMIN.role,
                    createdAt: new Date().toISOString()
                }
            });
        }

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
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

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
            message: 'OTP resent successfully'
        });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check for hardcoded admin
        if (userId === HARDCODED_ADMIN.id) {
            return res.status(403).json({ error: 'Cannot delete hardcoded admin account' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete all associated data manually to ensure complete removal
        // Even if cascading deletes are set in the schema, this is more explicit for this request
        await prisma.$transaction([
            prisma.refreshToken.deleteMany({ where: { userId } }),
            prisma.supportTicket.deleteMany({ where: { userId } }),
            prisma.order.deleteMany({ where: { userId } }),
            prisma.user.delete({ where: { id: userId } })
        ]);

        res.clearCookie('token');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};

