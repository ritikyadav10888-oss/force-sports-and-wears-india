import path from 'path';
import 'dotenv/config'; // Load env vars before any other imports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import customerRoutes from './routes/customer.routes';
import shipmentRoutes from './routes/shipment.routes';
import supportRoutes from './routes/support.routes';
import reviewRoutes from './routes/review.routes';
import bulkInquiryRoutes from './routes/bulk-inquiry.routes';
import uploadRoutes from './routes/upload';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter, authLimiter, adminLimiter } from './middleware/rateLimiter';
import { validateApiSecret } from './middleware/apiSecret';

// dotenv.config() is now handled by the import above

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Trust proxy for accurate IP addresses behind reverse proxies
app.set('trust proxy', 1);

// Security: CORS configuration with origin validation
app.use(cors({
    origin: true, // Allow ALL origins temporarily to debug production access
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Secret'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security: Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bulk-inquiry', bulkInquiryRoutes);

app.get('/api/debug-support', (req, res) => {
    res.json({ message: 'Debug route is working', timestamp: new Date().toISOString() });
});

// Admin routes: Require API secret + higher rate limit
app.use('/api/customers', validateApiSecret, adminLimiter, customerRoutes);
app.use('/api/shipments', validateApiSecret, adminLimiter, shipmentRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// Health check (no rate limit)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Force E-Commerce API is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Database health check
app.get('/health/db', async (req, res) => {
    try {
        // Import prisma dynamically or use global if available
        const prisma = (await import('./config/database')).default;
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database health check failed:', error);
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            error: String(error),
            timestamp: new Date().toISOString()
        });
    }
});

// Security check endpoint
// Restart trigger
app.get('/api/security-check', (req, res) => {
    // Restrict to internal/localhost access only
    const clientIp = req.ip || req.socket.remoteAddress;
    const isInternal = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1';

    if (!isInternal && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Access denied: Internal access only' });
    }

    res.json({
        apiSecretConfigured: !!process.env.API_SECRET,
        jwtSecretConfigured: !!process.env.JWT_SECRET,
        encryptionKeyConfigured: !!process.env.ENCRYPTION_KEY,
        stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
        corsOrigins: process.env.CORS_ORIGINS?.split(',').length || 0,
        clientIp // Useful for debugging internal access
    });
});

// Error handling
app.use(errorHandler);

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 API Server is booting up...`);
    console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 JWT: ${process.env.JWT_SECRET ? 'Configured ✓' : 'Missing ✗ (Using fallback)'}`);
    console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured ✓' : 'Missing ✗'}`);
    console.log(`📦 Database: ${process.env.DATABASE_URL ? 'URL Provided ✓' : 'URL Missing ✗'}`);
});


export default app;

// Restart trigger: 403 fix verification
