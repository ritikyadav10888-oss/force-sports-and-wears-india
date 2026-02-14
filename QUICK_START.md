# 🚀 E-Commerce Website - Quick Start Guide

## ✅ Services Running

### User Storefront (Customer-Facing)
- **URL:** http://localhost:3000
- **Status:** ✅ Running (Port 3000)
- **Purpose:** Customer shopping experience

### Backend API
- **URL:** http://localhost:5000
- **Status:** ⚠️ Needs MySQL setup
- **Purpose:** API endpoints for data

### Admin Panel
- **URL:** http://localhost:3001
- **Status:** ⏸️ Not started yet
- **Purpose:** Admin dashboard

---

## 🌐 Access Your Website

### Option 1: Open in Browser
1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Force E-Commerce storefront

### Option 2: Direct Link
Click here: [http://localhost:3000](http://localhost:3000)

---

## 📋 Current Setup Status

| Service | Port | Status | Action Needed |
|---------|------|--------|---------------|
| **User Storefront** | 3000 | ✅ Running | Ready to use |
| **Backend API** | 5000 | ⚠️ Needs DB | Setup MySQL |
| **Admin Panel** | 3001 | ⏸️ Not started | Run `npm run dev` |

---

## ⚠️ Important: Backend API Setup

The API needs MySQL to be configured:

### Step 1: Update MySQL Password
Edit `packages/api/.env` and change:
```env
DATABASE_URL="mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/force_ecommerce"
```

### Step 2: Create Database
```sql
-- Open MySQL
mysql -u root -p

-- Create database
CREATE DATABASE force_ecommerce;
```

### Step 3: Run Migrations
```bash
cd packages/api
npx prisma db push
```

### Step 4: Start API Server
```bash
cd packages/api
npm run dev
```

---

## 🎯 Start All Services

### Terminal 1: User Storefront (Already Running ✅)
```bash
npm run dev
# Running on http://localhost:3000
```

### Terminal 2: Backend API
```bash
cd packages/api
npm run dev
# Will run on http://localhost:5000
```

### Terminal 3: Admin Panel
```bash
cd packages/admin
npm install  # First time only
npm run dev
# Will run on http://localhost:3001
```

---

## 🛍️ What You Can Do Now

### On User Storefront (Port 3000)
- Browse products
- View product details
- Add items to cart
- Register as customer
- Login
- Place orders
- View order history

### On Admin Panel (Port 3001) - After Setup
- Manage products
- View all orders
- Manage customers
- Track shipments
- View analytics

---

## 🔍 Troubleshooting

### Storefront Not Loading?
1. Check if port 3000 is running: `netstat -ano | findstr :3000`
2. Restart: Stop the terminal and run `npm run dev` again

### API Not Working?
1. Ensure MySQL is running
2. Check DATABASE_URL in `.env`
3. Run `npx prisma db push`
4. Start API: `npm run dev` in `packages/api`

### Admin Panel Not Starting?
1. Install dependencies: `cd packages/admin && npm install`
2. Start server: `npm run dev`

---

## 📱 Features Available

### Customer Features
- ✅ Product browsing (public)
- ✅ Product search
- ✅ Shopping cart
- ✅ User registration
- ✅ User login
- ⏸️ Checkout (needs API)
- ⏸️ Order tracking (needs API)

### Admin Features (Port 3001)
- ⏸️ Product management
- ⏸️ Order management
- ⏸️ Customer management
- ⏸️ Shipment tracking
- ⏸️ Analytics dashboard

---

## 🎉 Quick Access

**Open your browser and visit:**

### 🛍️ Shop as Customer
👉 **http://localhost:3000**

### 🔐 Admin Dashboard
👉 **http://localhost:3001** (after starting)

### 🔌 API Health Check
👉 **http://localhost:5000/health** (after starting)

---

## 📚 Documentation

- [Root README](../README.md) - Project overview
- [API README](packages/api/README.md) - Backend documentation
- [Admin README](packages/admin/README.md) - Admin panel guide
- [MySQL Migration](packages/api/MYSQL_MIGRATION.md) - Database setup

---

## ✨ Your E-Commerce Platform is Ready!

The user storefront is **live and running** on port 3000. Just open your browser and start shopping! 🚀

For full functionality (checkout, orders, etc.), complete the MySQL setup for the backend API.
