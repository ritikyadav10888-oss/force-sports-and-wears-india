import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
}

export const generateToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

