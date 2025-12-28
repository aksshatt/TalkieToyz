# Shopping Cart & Order Management API Documentation

## Overview

This document describes the shopping cart and order management API endpoints for TalkieToys. The API supports full cart management, order creation, Razorpay payment integration, coupon validation, and automated email notifications.

## Table of Contents

1. [Cart Management](#cart-management)
2. [Order Management](#order-management)
3. [Coupon Validation](#coupon-validation)
4. [Payment Integration](#payment-integration)
5. [Email Notifications](#email-notifications)
6. [Data Models](#data-models)

---

## Cart Management

All cart endpoints require authentication via JWT token.

### Get Current Cart

Retrieves the current user's shopping cart with all items.

**Endpoint:** `GET /api/v1/cart`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "total_items": 3,
    "subtotal": 89.97,
    "tax_amount": 8.99,
    "total": 98.96,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T12:30:00Z",
    "cart_items": [
      {
        "id": 1,
        "quantity": 2,
        "item_price": 29.99,
        "total_price": 59.98,
        "item_name": "Speech Learning Toy",
        "available_stock": 15,
        "product": { /* ProductSummarySerializer */ },
        "product_variant": null
      }
    ]
  }
}
```

### Add Item to Cart

Adds a product (with optional variant) to the cart.

**Endpoint:** `POST /api/v1/cart/items`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 5,
  "product_variant_id": 12,  // Optional
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": { /* Full Cart object */ }
}
```

**Error Responses:**
- `404`: Product or variant not found
- `422`: Product out of stock, insufficient quantity, or inactive variant

### Update Cart Item Quantity

Updates the quantity of an existing cart item.

**Endpoint:** `PATCH /api/v1/cart/items/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": { /* Full Cart object */ }
}
```

### Remove Item from Cart

Removes a specific item from the cart.

**Endpoint:** `DELETE /api/v1/cart/items/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": { /* Full Cart object */ }
}
```

### Clear Cart

Removes all items from the cart.

**Endpoint:** `DELETE /api/v1/cart/clear`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": { /* Empty Cart object */ }
}
```

---

## Order Management

### List Orders

Retrieves a paginated list of the current user's orders.

**Endpoint:** `GET /api/v1/orders`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (pending, confirmed, processing, shipped, delivered, cancelled, refunded)

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 10,
        "order_number": "ORD-20250115-A7B3C9D2",
        "status": "confirmed",
        "payment_method": "razorpay",
        "payment_status": "paid",
        "subtotal": 89.97,
        "tax": 8.99,
        "shipping_cost": 0.00,
        "discount": 10.00,
        "total": 88.96,
        "shipping_address": { /* Address object */ },
        "billing_address": { /* Address object */ },
        "tracking_number": null,
        "shipped_at": null,
        "delivered_at": null,
        "notes": null,
        "customer_notes": "Please deliver after 5 PM",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:05:00Z",
        "coupon": { /* CouponSerializer if used */ },
        "order_items": [
          {
            "id": 15,
            "quantity": 2,
            "unit_price": 29.99,
            "total_price": 59.98,
            "item_name": "Speech Learning Toy",
            "product_snapshot": { /* Product details at time of order */ },
            "product": { /* ProductSummarySerializer */ },
            "product_variant": null
          }
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 45,
      "per_page": 20
    }
  }
}
```

### Get Order Details

Retrieves detailed information about a specific order.

**Endpoint:** `GET /api/v1/orders/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": { /* Full Order object */ }
}
```

**Error Responses:**
- `403`: Access denied (not your order and not admin)
- `404`: Order not found

### Create Order

Creates a new order from the current cart.

**Endpoint:** `POST /api/v1/orders`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_method": "razorpay",  // or "cod"
  "shipping_address": {
    "name": "John Doe",
    "address_line1": "123 Main St",
    "address_line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA",
    "phone": "+1-555-0123"
  },
  "billing_address": { /* Same structure as shipping_address, optional */ },
  "coupon_code": "SUMMER25",  // Optional
  "customer_notes": "Please deliver after 5 PM"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": { /* Full Order object */ }
}
```

**Error Responses:**
- `422`: Cart is empty, invalid coupon, missing required fields

### Update Order (Admin Only)

Updates order details. Restricted to administrators.

**Endpoint:** `PATCH /api/v1/orders/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shipped",  // Optional
  "tracking_number": "1Z999AA10123456784",  // Optional
  "notes": "Shipped via FedEx Express"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": { /* Full Order object */ }
}
```

**Error Responses:**
- `403`: Admin access required
- `404`: Order not found

### Cancel Order

Allows a user to cancel their own order (only in pending or confirmed status).

**Endpoint:** `POST /api/v1/orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": { /* Full Order object with status: "cancelled" */ }
}
```

**Error Responses:**
- `403`: Not your order
- `422`: Order cannot be cancelled at this stage
- `404`: Order not found

---

## Coupon Validation

### Validate Coupon

Validates a coupon code and calculates the discount amount.

**Endpoint:** `POST /api/v1/coupons/validate`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "SUMMER25",
  "order_amount": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon is valid",
  "data": {
    "coupon": {
      "id": 3,
      "code": "SUMMER25",
      "discount_type": "percentage",
      "discount_value": 25.00,
      "description": "Summer Sale 25% Off",
      "min_order_amount": 50.00,
      "max_discount_amount": 50.00,
      "valid_from": "2025-06-01T00:00:00Z",
      "valid_until": "2025-08-31T23:59:59Z",
      "can_be_used": true
    },
    "discount_amount": 25.00,
    "final_amount": 75.00
  }
}
```

**Error Responses:**
- `404`: Coupon not found
- `422`: Coupon is invalid (inactive, expired, usage limit reached, minimum order not met)

---

## Payment Integration

### Create Razorpay Order

Creates a Razorpay order for payment processing.

**Endpoint:** `POST /api/v1/orders/:id/create_razorpay_order`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Razorpay order created successfully",
  "data": {
    "order": { /* Full Order object */ },
    "razorpay_order_id": "order_K8sR2L9vN3mP4q",
    "razorpay_key_id": "rzp_test_xxxxxxxxxxxxx",
    "amount": 8896  // Amount in paise (₹88.96)
  }
}
```

**Error Responses:**
- `403`: Access denied (not your order)
- `422`: Order does not use Razorpay payment
- `404`: Order not found

### Verify Payment

Verifies Razorpay payment signature after successful payment.

**Endpoint:** `POST /api/v1/orders/:id/payment/verify`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_K8sR2L9vN3mP4q",
  "razorpay_payment_id": "pay_K8sR3M0wO4nQ5r",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": { /* Full Order object with payment_status: "paid", status: "confirmed" */ }
}
```

**Error Responses:**
- `403`: Access denied (not your order)
- `422`: Payment verification failed
- `404`: Order not found

---

## Email Notifications

The system automatically sends email notifications using background jobs (Sidekiq) for the following events:

### 1. Order Confirmation
- **Triggered:** After order creation (COD) or successful payment (Razorpay)
- **Template:** `order_confirmation.html.erb`
- **Content:** Order details, items, pricing, shipping address

### 2. Order Shipped
- **Triggered:** When order status changes to "shipped"
- **Template:** `order_shipped.html.erb`
- **Content:** Tracking number, estimated delivery

### 3. Order Delivered
- **Triggered:** When order status changes to "delivered"
- **Template:** `order_delivered.html.erb`
- **Content:** Delivery confirmation, request for review

### 4. Order Cancelled
- **Triggered:** When order is cancelled
- **Template:** `order_cancelled.html.erb`
- **Content:** Cancellation confirmation, refund information (if applicable)

---

## Data Models

### Cart

```ruby
{
  id: Integer,
  user_id: Integer,
  metadata: JSONB,
  created_at: DateTime,
  updated_at: DateTime,

  # Calculated fields
  total_items: Integer,
  subtotal: Decimal,
  tax_amount: Decimal (10% of subtotal),
  total: Decimal
}
```

### CartItem

```ruby
{
  id: Integer,
  cart_id: Integer,
  product_id: Integer,
  product_variant_id: Integer (optional),
  quantity: Integer,
  created_at: DateTime,
  updated_at: DateTime,

  # Calculated fields
  item_price: Decimal,
  total_price: Decimal,
  item_name: String,
  available_stock: Integer
}
```

### Order

```ruby
{
  id: Integer,
  user_id: Integer,
  coupon_id: Integer (optional),
  order_number: String (unique, auto-generated),
  status: Enum (pending, confirmed, processing, shipped, delivered, cancelled, refunded),

  # Pricing
  subtotal: Decimal,
  tax: Decimal,
  shipping_cost: Decimal,
  discount: Decimal,
  total: Decimal,

  # Shipping
  shipping_address: JSONB,
  billing_address: JSONB,
  tracking_number: String (optional),
  shipped_at: DateTime (optional),
  delivered_at: DateTime (optional),

  # Payment
  payment_method: String (razorpay, cod),
  payment_status: String (pending, awaiting_payment, paid, failed),
  payment_intent_id: String (Razorpay order ID),
  payment_details: JSONB,

  # Additional
  notes: Text (admin notes),
  customer_notes: Text,
  created_at: DateTime,
  updated_at: DateTime
}
```

### OrderItem

```ruby
{
  id: Integer,
  order_id: Integer,
  product_id: Integer,
  product_variant_id: Integer (optional),
  quantity: Integer,
  unit_price: Decimal,
  total_price: Decimal,
  product_snapshot: JSONB (product details at time of order),
  created_at: DateTime,
  updated_at: DateTime
}
```

### Coupon

```ruby
{
  id: Integer,
  code: String (unique, uppercase),
  discount_type: String (percentage, fixed),
  discount_value: Decimal,
  min_order_amount: Decimal (optional),
  max_discount_amount: Decimal (optional),
  valid_from: DateTime (optional),
  valid_until: DateTime (optional),
  usage_limit: Integer (0 = unlimited),
  usage_count: Integer,
  active: Boolean,
  description: Text,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (SMTP)
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_DOMAIN=talkietoys.com
SMTP_USERNAME=noreply@talkietoys.com
SMTP_PASSWORD=your_smtp_password
SMTP_AUTHENTICATION=plain
SMTP_ENABLE_STARTTLS_AUTO=true
DEFAULT_EMAIL_FROM=TalkieToys <noreply@talkietoys.com>

# Redis (for Sidekiq)
REDIS_URL=redis://localhost:6379/1
```

### Running Background Jobs

Start Sidekiq to process background email jobs:

```bash
bundle exec sidekiq -C config/sidekiq.yml
```

---

## Tax Calculation

The system applies a 10% tax rate to all orders. This is configured in `app/models/cart.rb`:

```ruby
TAX_RATE = 0.10 # 10% tax
```

To modify the tax rate, update this constant.

---

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

Common HTTP status codes:
- `200 OK`: Successful GET/PATCH/DELETE request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors

---

## Testing

### Manual Testing with cURL

#### Get Cart
```bash
curl -X GET http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

#### Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "cod",
    "shipping_address": {
      "name": "John Doe",
      "address_line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "USA",
      "phone": "+1-555-0123"
    }
  }'
```

---

## Support

For questions or issues, please contact the development team or create an issue in the repository.
