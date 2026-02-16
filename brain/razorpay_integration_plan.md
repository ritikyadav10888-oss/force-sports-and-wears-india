# Razorpay Integration Plan

## Overview
This document outlines the steps to integrate Razorpay for payments in the Force E-Commerce Platform.

## 1. Backend Integration (`packages/api`)

### 1.1. Install Dependencies
```bash
npm install razorpay
```

### 1.2. Environment Variables
Add the following to `packages/api/.env`:
```env
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

### 1.3. Update Database Schema
Update `packages/api/prisma/schema.prisma` to include Razorpay fields in `Order` or a separate `Payment` model.
```prisma
model Order {
  // ... existing fields
  razorpayOrderId   String?
  razorpayPaymentId String?
  razorpaySignature String?
}
```
Run `npx prisma migrate dev`.

### 1.4. Create Payment Controller
Create `packages/api/src/controllers/payment.controller.ts`:
- **createOrder**:
    - Initializes Razorpay instance.
    - Calls `razorpay.orders.create({ amount, currency: 'INR', receipt })`.
    - Returns `id` (Razorpay Order ID), `currency`, `amount`.
- **verifyPayment**:
    - Verifies `razorpay_signature` using `crypto`.
    - Updates Order status to `CONFIRMED` or `PROCESSING`.

### 1.5. Add Routes
Create `packages/api/src/routes/payment.routes.ts`:
- `POST /create-order` (Authenticated)
- `POST /verify` (Authenticated)

Register routes in `packages/api/src/index.ts`.

## 2. Frontend Integration (`src/`)

### 2.1. Load Razorpay Script
In `src/app/layout.tsx` or a dedicated component, load the script:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
Or use a package like `react-razorpay`.

### 2.2. Update API Client
Update `src/lib/api-client.ts`:
- Add `createRazorpayOrder(amount, orderId)`
- Add `verifyRazorpayPayment(response)`

### 2.3. Checkout Flow (`src/app/checkout/page.tsx`)
1. User clicks "Place Order".
2. **Frontend** calls API to create internal Order (`POST /api/orders`).
3. **Frontend** calls API to create Razorpay Order (`POST /api/payments/create-order`).
4. **Frontend** initializes Razorpay Checkout options:
   ```javascript
   const options = {
     key: "rzp_test_...",
     amount: order.amount,
     currency: "INR",
     name: "Force Sports",
     description: "Order #123",
     order_id: razorpayOrderId,
     handler: async function (response) {
       // Call API to verify payment
       await api.verifyRazorpayPayment(response);
       // Redirect to success page
     },
     prefill: {
       name: user.name,
       email: user.email,
       contact: user.phone
     },
     theme: {
       color: "#3399cc"
     }
   };
   const rzp1 = new Razorpay(options);
   rzp1.open();
   ```

## 3. Webhooks (Optional but Recommended)
- Create an endpoint `POST /api/webhooks/razorpay` to handle `payment.captured` or `payment.failed` events asynchronously.
- Verify webhook signature.

## 4. Testing
- Use Razorpay Test Mode keys.
- Use Test Card details provided by Razorpay.
