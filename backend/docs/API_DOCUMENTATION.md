# TalkieToys API Documentation

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.talkietoys.com/api/v1
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Description of the action",
  "data": { ... },
  "meta": { ... }  // Optional, for pagination
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["List of error messages"]
}
```

---

## Products API

### List Products
Get a paginated list of products with optional filtering.

**Endpoint:** `GET /api/v1/products`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Items per page (default: 20, max: 100) |
| `category_id` | integer | Filter by category ID |
| `age` | integer | Filter products suitable for this age |
| `featured` | boolean | Filter featured products (true/false) |
| `in_stock` | boolean | Filter in-stock products (true/false) |
| `q` | string | Search query (searches name and description) |
| `speech_goal_ids` | string | Comma-separated speech goal IDs (e.g., "1,2,3") |
| `sort` | string | Sort order: `price_asc`, `price_desc`, `newest`, `popular` |

**Example Request:**
```bash
GET /api/v1/products?category_id=1&age=5&sort=price_asc&page=1&per_page=10
```

**Example Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Sound Sorting Game",
      "description": "Interactive card game for practicing initial and final sounds",
      "price": "29.99",
      "compare_at_price": "39.99",
      "slug": "sound-sorting-game",
      "images": ["https://example.com/image1.jpg"],
      "in_stock": true,
      "on_sale": true,
      "discount_percentage": 25,
      "average_rating": 4.5
    }
  ],
  "meta": {
    "current_page": 1,
    "next_page": 2,
    "prev_page": null,
    "total_pages": 5,
    "total_count": 50
  }
}
```

---

### Get Product Details
Get detailed information about a specific product.

**Endpoint:** `GET /api/v1/products/:id`

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Product slug or ID |

**Example Request:**
```bash
GET /api/v1/products/sound-sorting-game
```

**Example Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sound Sorting Game",
    "description": "Interactive card game for practicing initial and final sounds",
    "long_description": "This engaging card game helps children practice...",
    "price": "29.99",
    "compare_at_price": "39.99",
    "stock_quantity": 50,
    "sku": "TOY-ABC12345",
    "slug": "sound-sorting-game",
    "min_age": 4,
    "max_age": 8,
    "specifications": {
      "Number of Cards": "50",
      "Material": "Laminated cardstock",
      "Dimensions": "3.5\" x 2.5\" per card"
    },
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "featured": true,
    "view_count": 1234,
    "in_stock": true,
    "on_sale": true,
    "discount_percentage": 25,
    "average_rating": 4.5,
    "review_count": 42,
    "category": {
      "id": 1,
      "name": "Articulation Toys",
      "slug": "articulation-toys"
    },
    "speech_goals": [
      {
        "id": 1,
        "name": "Articulation Practice",
        "slug": "articulation-practice",
        "color": "#3B82F6",
        "icon": "message-circle"
      }
    ]
  }
}
```

---

### Get Related Products
Get products related to a specific product.

**Endpoint:** `GET /api/v1/products/:id/related`

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Product slug or ID |

**Example Request:**
```bash
GET /api/v1/products/sound-sorting-game/related
```

**Example Response:**
```json
{
  "success": true,
  "message": "Related products retrieved successfully",
  "data": [
    {
      "id": 2,
      "name": "Vocabulary Builder Flashcards",
      "description": "Comprehensive flashcard set...",
      "price": "24.99",
      "slug": "vocabulary-builder-flashcards",
      "images": ["https://example.com/image.jpg"],
      "in_stock": true,
      "on_sale": false,
      "discount_percentage": 0,
      "average_rating": 4.8
    }
  ]
}
```

---

## Categories API

### List Categories
Get all active categories.

**Endpoint:** `GET /api/v1/categories`

**Example Request:**
```bash
GET /api/v1/categories
```

**Example Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Articulation Toys",
      "description": "Toys designed to help children practice...",
      "slug": "articulation-toys",
      "position": 1,
      "image_url": "https://example.com/category1.jpg",
      "product_count": 15
    }
  ]
}
```

---

### Get Category Details
Get a specific category with its products.

**Endpoint:** `GET /api/v1/categories/:id`

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Category slug or ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for products |
| `per_page` | integer | Items per page |

**Example Request:**
```bash
GET /api/v1/categories/articulation-toys?page=1&per_page=10
```

**Example Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "id": 1,
      "name": "Articulation Toys",
      "description": "Toys designed to help children practice...",
      "slug": "articulation-toys",
      "position": 1,
      "image_url": "https://example.com/category1.jpg",
      "product_count": 15
    },
    "products": [
      {
        "id": 1,
        "name": "Sound Sorting Game",
        "price": "29.99",
        "slug": "sound-sorting-game"
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "total_pages": 2,
    "total_count": 15
  }
}
```

---

## Speech Goals API

### List Speech Goals
Get all active speech goals.

**Endpoint:** `GET /api/v1/speech_goals`

**Example Request:**
```bash
GET /api/v1/speech_goals
```

**Example Response:**
```json
{
  "success": true,
  "message": "Speech goals retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Articulation Practice",
      "description": "Improving pronunciation of specific sounds",
      "slug": "articulation-practice",
      "color": "#3B82F6",
      "icon": "message-circle"
    }
  ]
}
```

---

### Get Speech Goal Details
Get a specific speech goal with its products.

**Endpoint:** `GET /api/v1/speech_goals/:id`

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Speech goal slug or ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number for products |
| `per_page` | integer | Items per page |

**Example Request:**
```bash
GET /api/v1/speech_goals/articulation-practice?page=1
```

**Example Response:**
```json
{
  "success": true,
  "message": "Speech goal retrieved successfully",
  "data": {
    "speech_goal": {
      "id": 1,
      "name": "Articulation Practice",
      "description": "Improving pronunciation of specific sounds",
      "slug": "articulation-practice",
      "color": "#3B82F6",
      "icon": "message-circle"
    },
    "products": [...]
  },
  "meta": {
    "current_page": 1,
    "total_pages": 3,
    "total_count": 28
  }
}
```

---

## Cart API
**Note:** All cart endpoints require authentication.

### Get Cart
Get the current user's shopping cart.

**Endpoint:** `GET /api/v1/cart`

**Authentication:** Required

**Example Request:**
```bash
GET /api/v1/cart
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "total_items": 3,
    "subtotal": "84.97",
    "cart_items": [
      {
        "id": 1,
        "quantity": 2,
        "total_price": "59.98",
        "product": {
          "id": 1,
          "name": "Sound Sorting Game",
          "price": "29.99",
          "slug": "sound-sorting-game",
          "images": ["https://example.com/image.jpg"],
          "in_stock": true
        }
      }
    ]
  }
}
```

---

### Add Item to Cart
Add a product to the cart or increase quantity if already exists.

**Endpoint:** `POST /api/v1/cart/items`

**Authentication:** Required

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Example Request:**
```bash
POST /api/v1/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "total_items": 2,
    "subtotal": "59.98",
    "cart_items": [...]
  }
}
```

**Error Responses:**
- `404 Not Found` - Product not found
- `422 Unprocessable Entity` - Product out of stock or quantity exceeds available stock

---

### Update Cart Item
Update the quantity of an item in the cart.

**Endpoint:** `PATCH /api/v1/cart/items/:id`

**Authentication:** Required

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Cart item ID |

**Request Body:**
```json
{
  "quantity": 3
}
```

**Example Request:**
```bash
PATCH /api/v1/cart/items/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "total_items": 3,
    "subtotal": "89.97",
    "cart_items": [...]
  }
}
```

**Error Responses:**
- `404 Not Found` - Cart item not found
- `422 Unprocessable Entity` - Invalid quantity or exceeds stock

---

### Remove Item from Cart
Remove a product from the cart.

**Endpoint:** `DELETE /api/v1/cart/items/:id`

**Authentication:** Required

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Cart item ID |

**Example Request:**
```bash
DELETE /api/v1/cart/items/1
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "id": 1,
    "total_items": 0,
    "subtotal": "0.00",
    "cart_items": []
  }
}
```

---

### Clear Cart
Remove all items from the cart.

**Endpoint:** `DELETE /api/v1/cart/clear`

**Authentication:** Required

**Example Request:**
```bash
DELETE /api/v1/cart/clear
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "id": 1,
    "total_items": 0,
    "subtotal": "0.00",
    "cart_items": []
  }
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

---

## Pagination

All list endpoints support pagination with the following parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | 1 | Page number |
| `per_page` | 20 | Items per page (max: 100) |

Pagination metadata is included in the `meta` object:

```json
{
  "meta": {
    "current_page": 1,
    "next_page": 2,
    "prev_page": null,
    "total_pages": 5,
    "total_count": 95
  }
}
```

---

## Search and Filtering

### Product Search
Products can be searched and filtered using multiple parameters:

**Example: Find toys for 5-year-olds in Articulation category, on sale:**
```bash
GET /api/v1/products?category_id=1&age=5&in_stock=true&sort=price_asc
```

**Example: Search for "flashcards" with specific speech goals:**
```bash
GET /api/v1/products?q=flashcards&speech_goal_ids=1,2
```

**Example: Get featured products under $30:**
```bash
GET /api/v1/products?featured=true&sort=price_asc
```

---

## Testing with cURL

### Get all categories:
```bash
curl http://localhost:3000/api/v1/categories
```

### Get products in a category:
```bash
curl http://localhost:3000/api/v1/categories/articulation-toys
```

### Search products:
```bash
curl "http://localhost:3000/api/v1/products?q=cards&age=5&sort=price_asc"
```

### View cart (requires auth):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/v1/cart
```

### Add to cart (requires auth):
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"product_id": 1, "quantity": 2}' \
     http://localhost:3000/api/v1/cart/items
```

---

## Next Steps

1. **Authentication** - Implement JWT-based authentication (see separate auth documentation)
2. **Orders API** - Create, view, and manage orders
3. **Reviews API** - Add and manage product reviews
4. **User Profile** - Manage user accounts and addresses
5. **Admin APIs** - Product management, order processing

---

## Notes

- All timestamps are in ISO 8601 format
- All prices are in USD (configurable)
- Product images are returned as arrays of URLs
- JSONB fields (specifications, preferences) are returned as objects
- Soft-deleted records are automatically excluded from queries
- The API uses Kaminari for pagination
- ActiveModel::Serializers handles JSON formatting
