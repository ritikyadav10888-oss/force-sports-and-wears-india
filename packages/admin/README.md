# Force E-Commerce - Admin Panel

**Secure Admin Dashboard** for Force E-Commerce Platform with industry-standard security.

## 🔒 Security Features

✅ **API Secret Authentication** - All requests include API secret  
✅ **JWT Token Verification** - Secure session management  
✅ **Role-Based Access** - Admin-only access enforced  
✅ **Rate Limiting** - 200 requests per 15 minutes  
✅ **Audit Logging** - All actions logged  

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on port 5000
- Admin credentials

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL and API secret

# Start development server
npm run dev
```

The admin panel will be available at: **http://localhost:3001**

## 🔐 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_SECRET=your-api-secret-here
```

> **Important:** The `NEXT_PUBLIC_API_SECRET` must match the `API_SECRET` in your backend API.

## 📱 Features

### Dashboard
- Real-time statistics
- Recent orders overview
- Customer metrics
- Sales analytics

### Customer Management
- View all customers
- Customer details
- Order history per customer

### Order Management
- View all orders
- Update order status
- Track shipments
- Order details

### Product Management
- Create new products
- Edit existing products
- Delete products
- Manage inventory

### Shipment Tracking
- Create shipments
- Update tracking information
- View shipment status

## 🛡️ Security Architecture

### Authentication Flow

1. Admin logs in with email/password
2. Backend verifies credentials and role
3. JWT token returned and stored
4. All subsequent requests include:
   - `Authorization: Bearer <token>`
   - `X-API-Secret: <api-secret>`

### Protected Routes

All routes except `/login` are protected by middleware that:
- Checks for valid JWT token
- Redirects to login if not authenticated
- Verifies admin role

## 📁 Project Structure

```
packages/admin/
├── app/
│   ├── login/
│   │   └── page.tsx          # Admin login
│   ├── dashboard/            # [Coming Soon]
│   │   ├── page.tsx          # Dashboard home
│   │   ├── customers/        # Customer management
│   │   ├── orders/           # Order management
│   │   ├── products/         # Product management
│   │   └── shipments/        # Shipment tracking
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Home/redirect
├── lib/
│   └── admin-api-client.ts   # API client with API secret
├── components/               # [Coming Soon]
├── .env.example
├── package.json
└── README.md
```

## 🔗 API Integration

The admin panel communicates with the backend API using the `adminAPI` client:

```typescript
import { adminAPI } from '@/lib/admin-api-client';

// All requests automatically include API secret
const customers = await adminAPI.getCustomers();
const orders = await adminAPI.getOrders();
```

## 🚢 Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Set root directory to `packages/admin`
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - Your production API URL
   - `NEXT_PUBLIC_API_SECRET` - Your API secret
4. Deploy

### Environment-Specific URLs

- **Development:** http://localhost:3001
- **Production:** https://admin.your-domain.com

## 📚 Documentation

- **[Security Implementation](../../brain/security_implementation.md)** - Security guide
- **[Service Separation Plan](../../brain/service_separation_plan.md)** - Architecture details
- **[API Documentation](../api/README.md)** - Backend API docs

## ⚠️ Important Notes

- **Never commit `.env.local`** - Contains sensitive API secret
- **API Secret Required** - All admin endpoints require valid API secret
- **Admin Role Only** - Only users with ADMIN role can access
- **Separate from User App** - No shared code with customer storefront

## 📄 License

ISC
