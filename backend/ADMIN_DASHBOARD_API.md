# Admin Dashboard API Documentation

Complete admin panel API endpoints for TalkieToys e-commerce platform.

## 🔐 Authentication & Authorization

All admin endpoints require:
1. **Authentication** - Valid user session
2. **Authorization** - User must have `admin` role

```ruby
# User model should have:
enum role: { customer: 0, therapist: 1, admin: 2 }
```

**Authorization Check:**
```ruby
current_user&.admin? # Must return true
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Unauthorized access. Admin privileges required.",
  "errors": null
}
```

---

## 📊 Dashboard Endpoints

### GET /api/v1/admin/dashboard

Get overview statistics and recent activity.

**Response:**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "overview": {
      "total_sales": 125430.50,
      "total_orders": 523,
      "total_customers": 342,
      "total_products": 156,
      "pending_orders": 23,
      "orders_today": 12,
      "revenue_today": 3450.00,
      "average_order_value": 239.83
    },
    "recent_orders": [
      {
        "id": 1234,
        "order_number": "ORD-20250126-ABC123",
        "customer_name": "John Doe",
        "total": 89.97,
        "status": "pending",
        "payment_status": "paid",
        "created_at": "2025-01-26T10:30:00Z"
      }
    ],
    "top_products": [
      {
        "product_id": 607,
        "product_name": "Alphabet Learning Blocks",
        "units_sold": 145,
        "revenue": 4345.55
      }
    ],
    "revenue": {
      "last_7_days": [
        {
          "date": "2025-01-20",
          "revenue": 1234.50
        }
      ],
      "current_month": 45678.90,
      "last_month": 38912.45,
      "growth_percentage": 17.39
    }
  }
}
```

---

## 📦 Products Management

### GET /api/v1/admin/products

Get all products with filtering and pagination.

**Query Parameters:**
- `page` (integer) - Page number (default: 1)
- `per_page` (integer) - Items per page (default: 20)
- `active` (boolean) - Filter by active status
- `category_id` (integer) - Filter by category
- `featured` (boolean) - Filter featured products
- `low_stock` (integer) - Products with stock below this number
- `search` (string) - Search in name and description

**Example Request:**
```bash
GET /api/v1/admin/products?page=1&per_page=20&active=true&search=blocks
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 607,
        "name": "Alphabet Learning Blocks",
        "sku": "ALB001",
        "price": 29.99,
        "stock_quantity": 75,
        "category": "Speech Development",
        "active": true,
        "featured": true,
        "created_at": "2025-01-15T08:30:00Z",
        "total_sold": 145
      }
    ],
    "meta": {
      "current_page": 1,
      "total_pages": 8,
      "total_count": 156,
      "per_page": 20
    }
  }
}
```

### GET /api/v1/admin/products/:id

Get detailed product information including sales data.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 607,
    "name": "Alphabet Learning Blocks",
    "description": "Educational blocks for letter learning",
    "price": 29.99,
    "stock_quantity": 75,
    "category": {
      "id": 324,
      "name": "Speech Development",
      "slug": "speech-development"
    },
    "total_sold": 145,
    "total_revenue": 4348.55,
    "stock_status": "in_stock"
  }
}
```

**Stock Status Values:**
- `out_of_stock` - Stock quantity is 0
- `low_stock` - Stock quantity < 10
- `in_stock` - Stock quantity >= 10

### POST /api/v1/admin/products

Create a new product.

**Request Body:**
```json
{
  "product": {
    "name": "New Product",
    "description": "Product description",
    "long_description": "Detailed description",
    "price": 39.99,
    "compare_at_price": 49.99,
    "stock_quantity": 100,
    "sku": "NEWPROD001",
    "min_age": 3,
    "max_age": 8,
    "category_id": 324,
    "featured": false,
    "active": true,
    "specifications": {
      "material": "Wood",
      "weight": "500g"
    },
    "speech_goal_ids": [1, 2, 3]
  }
}
```

### PATCH /api/v1/admin/products/:id

Update an existing product.

**Request Body:** Same as create (partial updates allowed)

### DELETE /api/v1/admin/products/:id

Soft delete a product (sets `deleted_at` and `active: false`).

### POST /api/v1/admin/products/bulk_update

Bulk update product status.

**Request Body:**
```json
{
  "product_ids": [1, 2, 3, 4, 5],
  "action": "activate"
}
```

**Actions:**
- `activate` - Set active: true
- `deactivate` - Set active: false
- `delete` - Soft delete (set deleted_at)

### GET /api/v1/admin/products/export

Export products to CSV.

**Query Parameters:** Same as index (for filtering)

**Response:** CSV file download

**CSV Format:**
```csv
ID,Name,SKU,Price,Stock,Category,Active,Created At
607,Alphabet Learning Blocks,ALB001,29.99,75,Speech Development,true,2025-01-15 08:30:00
```

---

## 🛍️ Orders Management

### GET /api/v1/admin/orders

Get all orders with advanced filtering.

**Query Parameters:**
- `page` (integer) - Page number
- `per_page` (integer) - Items per page
- `status` (string) - Filter by order status
- `payment_status` (string) - Filter by payment status
- `payment_method` (string) - Filter by payment method (razorpay/cod)
- `user_id` (integer) - Filter by customer
- `date_from` (date) - Orders from this date
- `date_to` (date) - Orders until this date
- `search` (string) - Search order number
- `min_amount` (decimal) - Minimum order amount
- `max_amount` (decimal) - Maximum order amount

**Example:**
```bash
GET /api/v1/admin/orders?status=pending&payment_status=paid&date_from=2025-01-01
```

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1234,
        "order_number": "ORD-20250126-ABC123",
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "total": 89.97,
        "status": "pending",
        "payment_status": "paid",
        "payment_method": "razorpay",
        "items_count": 3,
        "created_at": "2025-01-26T10:30:00Z",
        "shipping_address": {
          "name": "John Doe",
          "phone": "1234567890",
          "address_line_1": "123 Main St",
          "city": "Mumbai",
          "state": "Maharashtra",
          "postal_code": "400001",
          "country": "India"
        }
      }
    ],
    "meta": {
      "current_page": 1,
      "total_pages": 27,
      "total_count": 523,
      "per_page": 20
    }
  }
}
```

### GET /api/v1/admin/orders/:id

Get detailed order information.

**Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1234,
    "order_number": "ORD-20250126-ABC123",
    "status": "pending",
    "payment_status": "paid",
    "order_items": [...],
    "customer": {
      "id": 42,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    },
    "timeline": [
      {
        "event": "Order Created",
        "timestamp": "2025-01-26T10:30:00Z"
      },
      {
        "event": "Payment Confirmed",
        "timestamp": "2025-01-26T10:31:00Z"
      }
    ]
  }
}
```

### PATCH /api/v1/admin/orders/:id/status

Update order status.

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Shipped via FedEx. Tracking: ABC123456"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`
- `refunded`

**Note:** Changing status to `shipped` or `delivered` triggers email notifications.

### POST /api/v1/admin/orders/bulk_update_status

Bulk update order statuses.

**Request Body:**
```json
{
  "order_ids": [1, 2, 3, 4, 5],
  "status": "confirmed"
}
```

### GET /api/v1/admin/orders/export

Export orders to CSV.

### GET /api/v1/admin/orders/statistics

Get order statistics.

**Response:**
```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "by_status": {
      "pending": 23,
      "confirmed": 15,
      "processing": 42,
      "shipped": 123,
      "delivered": 310,
      "cancelled": 10
    },
    "by_payment_method": {
      "razorpay": 423,
      "cod": 100
    },
    "by_payment_status": {
      "paid": 450,
      "pending": 23,
      "failed": 15,
      "refunded": 5
    },
    "average_processing_time": 3.5
  }
}
```

---

## 👥 Customers Management

### GET /api/v1/admin/customers

Get all customers with filtering.

**Query Parameters:**
- `page`, `per_page` - Pagination
- `search` - Search name or email
- `has_orders` (boolean) - Filter customers with/without orders
- `date_from`, `date_to` - Registration date range

**Response:**
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": {
    "customers": [
      {
        "id": 42,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "total_orders": 5,
        "total_spent": 449.85,
        "created_at": "2024-12-01T08:00:00Z",
        "last_order_at": "2025-01-26T10:30:00Z"
      }
    ],
    "meta": {...}
  }
}
```

### GET /api/v1/admin/customers/:id

Get detailed customer information.

**Response:**
```json
{
  "success": true,
  "message": "Customer retrieved successfully",
  "data": {
    "id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "bio": "Regular customer",
    "created_at": "2024-12-01T08:00:00Z",
    "orders_count": 5,
    "total_spent": 449.85,
    "average_order_value": 89.97,
    "last_order": {
      "id": 1234,
      "order_number": "ORD-20250126-ABC123",
      "total": 89.97,
      "status": "pending",
      "created_at": "2025-01-26T10:30:00Z"
    },
    "order_history": [...]
  }
}
```

### PATCH /api/v1/admin/customers/:id

Update customer information.

**Request Body:**
```json
{
  "customer": {
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "0987654321",
    "bio": "VIP customer"
  }
}
```

### DELETE /api/v1/admin/customers/:id

Soft delete a customer.

### GET /api/v1/admin/customers/export

Export customers to CSV.

### GET /api/v1/admin/customers/statistics

Get customer statistics.

**Response:**
```json
{
  "success": true,
  "message": "Customer statistics retrieved successfully",
  "data": {
    "total_customers": 342,
    "new_customers_this_month": 23,
    "customers_with_orders": 287,
    "average_order_value_by_customer": 367.52,
    "top_customers": [
      {
        "id": 42,
        "name": "John Doe",
        "email": "john@example.com",
        "total_revenue": 1234.56,
        "orders_count": 12
      }
    ]
  }
}
```

---

## 📈 Analytics Endpoints

### GET /api/v1/admin/analytics

Get comprehensive analytics data.

**Response:**
```json
{
  "success": true,
  "message": "Analytics data retrieved successfully",
  "data": {
    "sales_by_category": [...],
    "popular_products": [...],
    "revenue_trends": {...},
    "customer_demographics": {...},
    "conversion_metrics": {...},
    "product_performance": {...}
  }
}
```

### GET /api/v1/admin/analytics/sales_by_category

Get sales breakdown by category.

**Query Parameters:**
- `period` - Time period (7days, 30days, 90days, year)

**Response:**
```json
{
  "success": true,
  "message": "Sales by category retrieved successfully",
  "data": [
    {
      "category_id": 324,
      "category_name": "Speech Development",
      "revenue": 45678.90,
      "units_sold": 1523,
      "percentage": 36.5
    },
    {
      "category_id": 325,
      "category_name": "Motor Skills",
      "revenue": 34567.80,
      "units_sold": 987,
      "percentage": 27.6
    }
  ]
}
```

### GET /api/v1/admin/analytics/popular_products

Get top-selling products.

**Query Parameters:**
- `limit` (integer) - Number of products (default: 10)
- `period` - Time period (7days, 30days, 90days, year)

**Response:**
```json
{
  "success": true,
  "message": "Popular products retrieved successfully",
  "data": [
    {
      "product_id": 607,
      "product_name": "Alphabet Learning Blocks",
      "units_sold": 145,
      "revenue": 4348.55,
      "order_count": 132,
      "average_order_quantity": 1.1
    }
  ]
}
```

### GET /api/v1/admin/analytics/revenue_trends

Get revenue trends over time.

**Query Parameters:**
- `period` - Granularity (daily, weekly, monthly)
- `limit` (integer) - Number of periods (default: 12)

**Response (Monthly):**
```json
{
  "success": true,
  "message": "Revenue trends retrieved successfully",
  "data": [
    {
      "month": "January 2025",
      "year": 2025,
      "month_number": 1,
      "revenue": 45678.90,
      "orders_count": 234,
      "average_order_value": 195.20
    },
    {
      "month": "December 2024",
      "year": 2024,
      "month_number": 12,
      "revenue": 38912.45,
      "orders_count": 198,
      "average_order_value": 196.53
    }
  ]
}
```

### GET /api/v1/admin/analytics/customer_demographics

Get customer demographic data.

**Response:**
```json
{
  "success": true,
  "message": "Customer demographics retrieved successfully",
  "data": {
    "total_customers": 342,
    "new_customers_by_month": [
      {
        "month": "January 2025",
        "new_customers": 23
      }
    ],
    "customer_lifetime_value": [
      {
        "range": "$0-$100",
        "customer_count": 120
      },
      {
        "range": "$100-$500",
        "customer_count": 150
      }
    ],
    "order_frequency": [
      {
        "label": "1 order",
        "count": 180
      },
      {
        "label": "2-3 orders",
        "count": 95
      }
    ],
    "geographic_distribution": [
      {
        "state": "Maharashtra",
        "order_count": 156
      }
    ]
  }
}
```

---

## 📝 Activity Logging

All admin actions are automatically logged to `admin_activity_logs` table.

**Logged Information:**
- User who performed the action
- Action type (create, update, delete, etc.)
- Resource type and ID
- Additional details (JSON)
- IP address
- User agent
- Timestamp

**Example Log Entry:**
```ruby
{
  user_id: 1,
  action: "update_status",
  resource_type: "Order",
  resource_id: 1234,
  details: {
    order_number: "ORD-20250126-ABC123",
    old_status: "pending",
    new_status: "shipped"
  },
  ip_address: "192.168.1.1",
  user_agent: "Mozilla/5.0...",
  created_at: "2025-01-26T10:30:00Z"
}
```

---

## 🔍 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Pagination Meta
```json
{
  "current_page": 1,
  "total_pages": 10,
  "total_count": 200,
  "per_page": 20
}
```

---

## 🚀 Usage Examples

### Get Dashboard Stats
```bash
curl -X GET \
  http://localhost:3000/api/v1/admin/dashboard \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Update Order Status
```bash
curl -X PATCH \
  http://localhost:3000/api/v1/admin/orders/1234/status \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "status": "shipped",
    "notes": "Shipped via FedEx"
  }'
```

### Export Orders to CSV
```bash
curl -X GET \
  'http://localhost:3000/api/v1/admin/orders/export?status=delivered&date_from=2025-01-01' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o orders.csv
```

### Bulk Update Products
```bash
curl -X POST \
  http://localhost:3000/api/v1/admin/products/bulk_update \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "product_ids": [1, 2, 3, 4, 5],
    "action": "activate"
  }'
```

### Get Analytics Data
```bash
curl -X GET \
  'http://localhost:3000/api/v1/admin/analytics/sales_by_category?period=30days' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 📊 Database Schema

### AdminActivityLog
```sql
CREATE TABLE admin_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  action VARCHAR NOT NULL,
  resource_type VARCHAR,
  resource_id INTEGER,
  details JSONB DEFAULT '{}',
  ip_address VARCHAR,
  user_agent VARCHAR,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE INDEX index_admin_activity_logs_on_action ON admin_activity_logs(action);
CREATE INDEX index_admin_activity_logs_on_resource_type ON admin_activity_logs(resource_type);
CREATE INDEX index_admin_activity_logs_on_resource_type_and_resource_id ON admin_activity_logs(resource_type, resource_id);
CREATE INDEX index_admin_activity_logs_on_created_at ON admin_activity_logs(created_at);
```

---

## 🔐 Security Best Practices

1. **Authentication Required**: All endpoints require valid authentication
2. **Admin Authorization**: Endpoints return 403 if user is not admin
3. **Activity Logging**: All admin actions are logged
4. **Input Validation**: All inputs are validated
5. **SQL Injection Protection**: Uses parameterized queries
6. **CSRF Protection**: Enabled for state-changing operations
7. **Rate Limiting**: Recommended for production

---

## 📝 Notes

- All monetary values are in decimal format (e.g., 29.99)
- All dates are in ISO 8601 format
- Pagination defaults to 20 items per page
- CSV exports include all filtered results (no pagination)
- Activity logs are created asynchronously
- Email notifications are sent via background jobs

---

**Built with ❤️ for TalkieToys Admin Dashboard**
