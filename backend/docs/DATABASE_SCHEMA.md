# TalkieToys Database Schema Documentation

## Overview

Complete database schema for the TalkieToys e-commerce platform with 12 tables, supporting users, products, orders, and speech therapy goals.

## Entity Relationship Diagram

```
Users (1) ━━━ (1) Cart ━━━ (*) CartItems ━━━ (*) Products
  │                                                  │
  │ (*)                                             (*) ProductSpeechGoals
  ├── Orders (*) ━━━ (*) OrderItems                 │
  ├── Reviews (*)                                    │
  ├── Addresses (*)                            SpeechGoals
  │                                                  │
  └── (referenced by Products via category_id) ━━━ Categories
```

## Tables

### 1. Users
**Purpose:** Stores user accounts with three roles: customer, therapist, admin

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| email | string | NOT NULL, UNIQUE | User email |
| encrypted_password | string | NOT NULL | Devise password |
| name | string | NOT NULL | Full name |
| phone | string | - | Phone number |
| role | integer | NOT NULL, DEFAULT 0 | 0=customer, 1=therapist, 2=admin |
| bio | text | - | User biography |
| avatar_url | string | - | Profile image URL |
| preferences | jsonb | DEFAULT {} | User preferences |
| deleted_at | datetime | - | Soft delete timestamp |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `email` (unique)
- `role`
- `deleted_at`

**Associations:**
- `has_one :cart`
- `has_many :orders`
- `has_many :addresses`
- `has_many :reviews`

**Features:**
- Devise authentication
- Soft deletes
- Role-based access (enum)
- JSONB preferences field

---

### 2. Categories
**Purpose:** Product categories for organizing toys

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| name | string | NOT NULL | Category name |
| description | text | - | Category description |
| slug | string | NOT NULL, UNIQUE | URL-friendly identifier |
| position | integer | DEFAULT 0 | Display order |
| active | boolean | DEFAULT true | Active status |
| image_url | string | - | Category image |
| deleted_at | datetime | - | Soft delete timestamp |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `slug` (unique)
- `position`
- `active`
- `deleted_at`

**Associations:**
- `has_many :products`

**Features:**
- Slug auto-generation
- Soft deletes
- Positioning for ordering

---

### 3. SpeechGoals
**Purpose:** Tags for speech therapy goals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| name | string | NOT NULL | Goal name |
| description | text | - | Goal description |
| slug | string | NOT NULL, UNIQUE | URL-friendly identifier |
| color | string | DEFAULT '#3B82F6' | Display color (hex) |
| icon | string | DEFAULT 'target' | Icon identifier |
| active | boolean | DEFAULT true | Active status |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `slug` (unique)
- `active`

**Associations:**
- `has_many :product_speech_goals`
- `has_many :products, through: :product_speech_goals`

**Features:**
- Color-coded goals
- Icon support
- Slug auto-generation

---

### 4. Products
**Purpose:** Main product catalog

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| name | string | NOT NULL | Product name |
| description | text | - | Short description |
| long_description | text | - | Detailed description |
| price | decimal(10,2) | NOT NULL | Current price |
| compare_at_price | decimal(10,2) | - | Original price (for sales) |
| stock_quantity | integer | NOT NULL, DEFAULT 0 | Available stock |
| sku | string | UNIQUE | Stock keeping unit |
| slug | string | NOT NULL, UNIQUE | URL-friendly identifier |
| category_id | bigint | FK | Foreign key to categories |
| min_age | integer | - | Minimum recommended age |
| max_age | integer | - | Maximum recommended age |
| specifications | jsonb | DEFAULT {} | Product specifications |
| images | jsonb | DEFAULT [] | Product image URLs |
| active | boolean | DEFAULT true | Active status |
| featured | boolean | DEFAULT false | Featured product |
| view_count | integer | DEFAULT 0 | View counter |
| deleted_at | datetime | - | Soft delete timestamp |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `slug` (unique)
- `sku` (unique)
- `category_id`
- `active`, `featured`, `price`
- `min_age`, `max_age`
- `deleted_at`
- `specifications` (GIN index for JSONB)
- `images` (GIN index for JSONB)

**Associations:**
- `belongs_to :category`
- `has_many :product_speech_goals`
- `has_many :speech_goals, through: :product_speech_goals`
- `has_many :cart_items`
- `has_many :order_items`
- `has_many :reviews`

**Features:**
- JSONB for specifications and images
- Sale pricing support
- Age range targeting
- SKU auto-generation
- View tracking

---

### 5. ProductSpeechGoals
**Purpose:** Join table for many-to-many relationship between products and speech goals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| product_id | bigint | NOT NULL, FK | Foreign key to products |
| speech_goal_id | bigint | NOT NULL, FK | Foreign key to speech_goals |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `[product_id, speech_goal_id]` (unique composite)

**Associations:**
- `belongs_to :product`
- `belongs_to :speech_goal`

---

### 6. Carts
**Purpose:** Shopping cart for each user

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| user_id | bigint | NOT NULL, FK, UNIQUE | Foreign key to users |
| metadata | jsonb | DEFAULT {} | Additional cart data |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `user_id` (auto-created by FK, unique)
- `metadata` (GIN index for JSONB)

**Associations:**
- `belongs_to :user`
- `has_many :cart_items`
- `has_many :products, through: :cart_items`

**Features:**
- Auto-created when user signs up
- One cart per user

---

### 7. CartItems
**Purpose:** Items in shopping cart

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| cart_id | bigint | NOT NULL, FK | Foreign key to carts |
| product_id | bigint | NOT NULL, FK | Foreign key to products |
| quantity | integer | NOT NULL, DEFAULT 1 | Item quantity |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `[cart_id, product_id]` (unique composite)

**Associations:**
- `belongs_to :cart`
- `belongs_to :product`

**Validations:**
- One product per cart (unique constraint)
- Quantity must be > 0
- Product must be in stock

---

### 8. Orders
**Purpose:** Customer orders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| user_id | bigint | NOT NULL, FK | Foreign key to users |
| order_number | string | NOT NULL, UNIQUE | Auto-generated order ID |
| status | integer | NOT NULL, DEFAULT 0 | Order status enum |
| subtotal | decimal(10,2) | NOT NULL | Order subtotal |
| tax | decimal(10,2) | DEFAULT 0 | Tax amount |
| shipping_cost | decimal(10,2) | DEFAULT 0 | Shipping cost |
| discount | decimal(10,2) | DEFAULT 0 | Discount amount |
| total | decimal(10,2) | NOT NULL | Total amount |
| shipping_address | jsonb | DEFAULT {} | Shipping address snapshot |
| billing_address | jsonb | DEFAULT {} | Billing address snapshot |
| tracking_number | string | - | Shipment tracking |
| shipped_at | datetime | - | Shipment timestamp |
| delivered_at | datetime | - | Delivery timestamp |
| payment_method | string | - | Payment method |
| payment_status | string | - | Payment status |
| payment_intent_id | string | - | Stripe/payment gateway ID |
| payment_details | jsonb | DEFAULT {} | Payment metadata |
| notes | text | - | Internal notes |
| customer_notes | text | - | Customer notes |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `order_number` (unique)
- `user_id` (auto-created)
- `status`
- `payment_status`
- `created_at`
- `shipping_address` (GIN)
- `billing_address` (GIN)

**Associations:**
- `belongs_to :user`
- `has_many :order_items`
- `has_many :products, through: :order_items`

**Enums:**
- Status: pending(0), confirmed(1), processing(2), shipped(3), delivered(4), cancelled(5), refunded(6)

**Features:**
- Auto-generated order numbers
- Address snapshots (JSONB)
- Auto-calculated totals
- Status tracking

---

### 9. OrderItems
**Purpose:** Line items in orders

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| order_id | bigint | NOT NULL, FK | Foreign key to orders |
| product_id | bigint | NOT NULL, FK | Foreign key to products |
| quantity | integer | NOT NULL | Item quantity |
| unit_price | decimal(10,2) | NOT NULL | Price per unit |
| total_price | decimal(10,2) | NOT NULL | Line total |
| product_snapshot | jsonb | DEFAULT {} | Product data snapshot |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `[order_id, product_id]`
- `product_snapshot` (GIN)

**Associations:**
- `belongs_to :order`
- `belongs_to :product`

**Features:**
- Product snapshot for historical record
- Auto-calculated prices

---

### 10. Reviews
**Purpose:** Product reviews

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| user_id | bigint | NOT NULL, FK | Foreign key to users |
| product_id | bigint | NOT NULL, FK | Foreign key to products |
| rating | integer | NOT NULL | Rating (1-5) |
| title | string | - | Review title |
| comment | text | - | Review text |
| verified_purchase | boolean | DEFAULT false | Purchased verification |
| approved | boolean | DEFAULT false | Admin approval |
| helpful_count | integer | DEFAULT 0 | Helpful votes |
| deleted_at | datetime | - | Soft delete |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `[user_id, product_id]` (unique - one review per user per product)
- `rating`
- `approved`
- `deleted_at`
- `created_at`

**Associations:**
- `belongs_to :user`
- `belongs_to :product`

**Features:**
- One review per product per user
- Moderation (approved flag)
- Soft deletes

---

### 11. Addresses
**Purpose:** User shipping/billing addresses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| user_id | bigint | NOT NULL, FK | Foreign key to users |
| label | string | - | Address label (e.g., "Home") |
| full_name | string | NOT NULL | Recipient name |
| phone | string | NOT NULL | Contact phone |
| address_line_1 | string | NOT NULL | Street address |
| address_line_2 | string | - | Apt/Suite number |
| city | string | NOT NULL | City |
| state_province | string | NOT NULL | State/Province |
| postal_code | string | NOT NULL | ZIP/Postal code |
| country | string | NOT NULL, DEFAULT 'US' | Country code |
| is_default | boolean | DEFAULT false | Default address |
| is_billing | boolean | DEFAULT false | Billing address |
| is_shipping | boolean | DEFAULT true | Shipping address |
| deleted_at | datetime | - | Soft delete |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `[user_id, is_default]`
- `deleted_at`

**Associations:**
- `belongs_to :user`

**Features:**
- Soft deletes
- Ensures only one default per user
- Supports both billing and shipping

---

### 12. JwtDenylists
**Purpose:** Revoked JWT tokens for Devise-JWT

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PK | Primary key |
| jti | string | NOT NULL, UNIQUE | JWT ID |
| exp | datetime | NOT NULL | Expiration time |
| created_at | datetime | NOT NULL | - |
| updated_at | datetime | NOT NULL | - |

**Indexes:**
- `jti` (unique)

**Purpose:** Blacklist for invalidated JWT tokens

---

## Seed Data

### Categories (6)
1. Articulation Toys
2. Language Development
3. Social Communication
4. Fluency Tools
5. Oral Motor Skills
6. Sensory Integration

### Speech Goals (10)
1. Articulation Practice
2. Vocabulary Building
3. Sentence Formation
4. Social Skills
5. Following Directions
6. Phonological Awareness
7. Pragmatic Language
8. Oral Motor Strength
9. Auditory Processing
10. Fluency Development

### Users (4)
- Admin: admin@talkietoys.com / password123
- Therapist: therapist@example.com / password123
- Customer 1: parent@example.com / password123
- Customer 2: parent2@example.com / password123

### Products (5)
1. Sound Sorting Game - $29.99
2. Vocabulary Builder Flashcards - $24.99
3. Conversation Starter Board Game - $34.99
4. Chewy Tubes Set - $19.99
5. Sequencing Story Cards - $27.99

## Key Features

### JSONB Fields
- `users.preferences` - User settings
- `products.specifications` - Product specs
- `products.images` - Image URLs array
- `orders.shipping_address` - Address snapshot
- `orders.billing_address` - Address snapshot
- `orders.payment_details` - Payment metadata
- `order_items.product_snapshot` - Product data snapshot
- `carts.metadata` - Cart metadata

### Soft Deletes
- Users
- Categories
- Products
- Reviews
- Addresses

### Auto-Generated Fields
- Product SKU
- Product slug (from name)
- Category slug
- Speech Goal slug
- Order number

### Validation Rules
- Email format validation
- Phone format validation
- Rating must be 1-5
- Passwords 6-128 characters
- Age ranges must be valid
- One review per user per product
- One cart per user

## Performance Optimizations

### GIN Indexes (PostgreSQL)
- JSONB fields for fast queries on specifications, images, addresses
- Enables queries like: `products.where("specifications @> ?", {material: 'wood'}.to_json)`

### Composite Indexes
- `[cart_id, product_id]` for cart uniqueness
- `[order_id, product_id]` for order items
- `[user_id, product_id]` for unique reviews
- `[product_id, speech_goal_id]` for goal assignments

### Foreign Key Indexes
- Automatically created on all `references` fields
- Improves join performance

## Migration Files

All migrations are timestamped and located in `db/migrate/`:
1. `20251226184747_devise_create_users.rb`
2. `20251226184800_create_jwt_denylists.rb`
3. `20251226184900_create_categories.rb`
4. `20251226185000_create_speech_goals.rb`
5. `20251226185100_create_products.rb`
6. `20251226185200_create_product_speech_goals.rb`
7. `20251226185300_create_carts.rb`
8. `20251226185400_create_cart_items.rb`
9. `20251226185500_create_orders.rb`
10. `20251226185600_create_order_items.rb`
11. `20251226185700_create_reviews.rb`
12. `20251226185800_create_addresses.rb`

## Usage Examples

### Creating a Product with Speech Goals
```ruby
product = Product.create!(
  name: "ABC Sound Cards",
  price: 19.99,
  category: Category.find_by(slug: 'articulation-toys')
)

product.speech_goals << SpeechGoal.find_by(slug: 'articulation-practice')
product.speech_goals << SpeechGoal.find_by(slug: 'phonological-awareness')
```

### Adding to Cart
```ruby
user.cart.add_product(product, quantity: 2)
```

### Creating an Order
```ruby
order = Order.create!(
  user: user,
  subtotal: 59.98,
  total: 59.98,
  status: :pending,
  shipping_address: user.addresses.default_address.first.to_json_object
)
```

### Querying with JSONB
```ruby
# Find products with specific specification
Product.where("specifications @> ?", {material: 'wood'}.to_json)

# Find products in age range
Product.where('min_age <= ? AND max_age >= ?', 5, 5)
```
