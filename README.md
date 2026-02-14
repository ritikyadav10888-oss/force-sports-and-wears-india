# Force E-Commerce Platform

A modern, secure, decoupled e-commerce platform built with **industry-standard security practices**.

## 🏗️ Architecture

This is a **monorepo** containing three distinct services:

```
e-comm/
├── packages/api/          # Central API (Express + PostgreSQL)
├── packages/admin/        # Admin Dashboard (Next.js) [Coming Soon]
└── src/                   # User Storefront (Next.js)
```

### Three-Service Architecture

1. **Central API** (`packages/api/`) - The Hub
   - Express.js REST API
   - PostgreSQL database with Prisma ORM
   - JWT authentication with RBAC
   - Stripe payment integration
   - Industry-standard security (OWASP Top 10, PCI-DSS)

2. **User Storefront** (`src/`) - Customer-Facing App
   - Next.js with App Router
   - SEO optimized (SSR/ISR)
   - Customer authentication
   - Product browsing and checkout

3. **Admin Dashboard** (`packages/admin/`) - Internal Tool [Planned]
   - Separate Next.js application
   - Admin-only access with API secret
   - CRUD operations for products, orders, customers
   - Sales analytics and reporting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install API dependencies
cd packages/api
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start development servers
npm run dev          # User Storefront (port 3000)
cd packages/api && npm run dev  # API (port 5000)
```

## 🔒 Security Features

✅ **OWASP Top 10 Protection**
- Rate limiting (DDoS protection)
- Input validation & sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection
- Secure authentication (JWT + bcrypt)

✅ **PCI-DSS Compliance Ready**
- Stripe integration (SAQ A)
- Never stores card data
- Webhook signature verification
- Audit logging

✅ **Data Security**
- AES-256 encryption for sensitive data
- Account lockout after failed logins
- Comprehensive audit trail
- Role-based access control (RBAC)

## 📁 Project Structure

```
e-comm/
├── packages/
│   └── api/                    # Central API
│       ├── prisma/
│       │   └── schema.prisma   # Database schema
│       ├── src/
│       │   ├── config/         # Database config
│       │   ├── controllers/    # Business logic
│       │   ├── middleware/     # Auth, rate limiting, security
│       │   ├── routes/         # API routes
│       │   ├── utils/          # Helpers (encryption, audit, etc.)
│       │   └── server.ts       # Express server
│       ├── .env.example        # Environment template
│       └── package.json
│
├── src/                        # User Storefront
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   └── store/                  # State management (Zustand)
│
├── public/                     # Static assets
├── package.json                # Root package.json
└── README.md                   # This file
```

## 🛠️ Technology Stack

### Backend (API)
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe
- **Security**: helmet, express-rate-limit, crypto-js
- **Validation**: Zod

### Frontend (User Storefront)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📚 Documentation

Comprehensive documentation is available in the `brain/` artifacts folder:

- **[Implementation Plan](./brain/implementation_plan.md)** - Complete architecture guide
- **[Architecture Diagrams](./brain/architecture_diagram.md)** - Visual system overview
- **[Security Implementation](./brain/security_implementation.md)** - Industry standards guide
- **[Task Checklist](./brain/task.md)** - Implementation progress

## 🔐 Environment Variables

### API (`packages/api/.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/force_ecommerce"

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"

# API Security
API_SECRET="your-api-secret-here"
ENCRYPTION_KEY="your-encryption-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# CORS
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

## 🧪 Testing

```bash
# Run API tests
cd packages/api
npm test

# Run frontend tests
npm test
```

## 🚢 Deployment

### API Deployment (Railway/Render/Heroku)
1. Set environment variables in hosting platform
2. Connect PostgreSQL database
3. Deploy from `packages/api/`

### Frontend Deployment (Vercel)
1. Connect repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

## 📝 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - List products

### Protected Endpoints (Customer)
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders` - Create order
- `POST /api/payments/create-intent` - Create payment

### Admin Endpoints (Requires API Secret)
- `GET /api/customers` - List all customers
- `GET /api/admin/orders` - List all orders
- `PUT /api/products/:id` - Update product
- `GET /api/shipments` - Manage shipments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using industry-standard security practices**
