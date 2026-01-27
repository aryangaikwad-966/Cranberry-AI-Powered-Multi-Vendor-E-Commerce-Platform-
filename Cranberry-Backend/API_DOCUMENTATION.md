# Cranberry Marketplace - Frontend Integration Guide

## Base URL
```
http://localhost:8080/api
```

## Response Format

All endpoints return a consistent JSON response:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2026-01-22T10:30:00"
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-01-22T10:30:00"
}
```

---

## Authentication

### 1. Register User
**POST** `/api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

### 3. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## Products

### 1. Get All Products
**GET** `/api/products`

**Query Parameters (Optional):**
- `category` - Filter by category name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High performance laptop",
      "price": 45000.00,
      "stock": 10,
      "imageUrl": "https://example.com/laptop.jpg",
      "category": "Electronics",
      "vendor": {
        "id": 1,
        "shopName": "Tech Store"
      }
    }
  ]
}
```

### 2. Get Product by ID
**GET** `/api/products/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 45000.00,
    "stock": 10,
    "imageUrl": "https://example.com/laptop.jpg",
    "category": "Electronics",
    "vendor": {
      "id": 1,
      "shopName": "Tech Store"
    }
  }
}
```

### 3. Search Products
**GET** `/api/products/search?query=laptop`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 45000.00,
      "category": "Electronics"
    }
  ]
}
```

### 4. Get All Categories
**GET** `/api/products/categories`

**Response:**
```json
{
  "success": true,
  "data": ["Electronics", "Fashion", "Home & Garden"]
}
```

### 5. Get Products by Vendor
**GET** `/api/products/vendor/{vendorId}`

### 6. Add Product (Vendor only)
**POST** `/api/products`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Smartphone",
  "description": "Latest model smartphone",
  "price": 25000.00,
  "stock": 50,
  "imageUrl": "https://example.com/phone.jpg",
  "category": "Electronics",
  "vendor": {
    "id": 1
  }
}
```

### 7. Update Product
**PUT** `/api/products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

### 8. Delete Product
**DELETE** `/api/products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

---

## Orders

### 1. Create Order
**POST** `/api/orders`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "userId": 1,
  "shippingAddress": "123 Main St, City, Country",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user": { "id": 1, "name": "John Doe" },
    "items": [
      {
        "id": 1,
        "product": { "id": 1, "name": "Laptop" },
        "quantity": 2,
        "price": 90000.00
      }
    ],
    "totalAmount": 90000.00,
    "status": "CREATED",
    "shippingAddress": "123 Main St, City, Country",
    "createdAt": "2026-01-22T10:30:00"
  }
}
```

### 2. Get Order by ID
**GET** `/api/orders/{orderId}`

**Headers:**
```
Authorization: Bearer {token}
```

### 3. Get User Orders
**GET** `/api/orders/user/{userId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "totalAmount": 90000.00,
      "status": "CREATED",
      "createdAt": "2026-01-22T10:30:00"
    }
  ]
}
```

### 4. Get Order Items
**GET** `/api/orders/{orderId}/items`

**Headers:**
```
Authorization: Bearer {token}
```

### 5. Update Order Status
**PUT** `/api/orders/{orderId}/status?status=CONFIRMED`

**Headers:**
```
Authorization: Bearer {token}
```

---

## Payments (Razorpay)

### 1. Create Payment
**POST** `/api/payments/create/{orderId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "id": 1,
    "razorpayOrderId": "order_xyz123",
    "amount": 90000.00,
    "currency": "INR",
    "status": "PENDING"
  }
}
```

### 2. Verify Payment
**POST** `/api/payments/verify`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `razorpayOrderId`
- `razorpayPaymentId`
- `razorpaySignature`

### 3. Payment Success
**POST** `/api/payments/success`

**Query Params:**
- `razorpayOrderId`
- `razorpayPaymentId`

### 4. Get Payment by Order
**GET** `/api/payments/order/{orderId}`

**Headers:**
```
Authorization: Bearer {token}
```

---

## AI Features (Ollama - Local)

### 1. Check Ollama Health
**GET** `/api/ai/health`

**Response:**
```json
{
  "success": true,
  "data": {
    "ollama_available": true,
    "status": "healthy",
    "message": "Ollama is running and accessible"
  }
}
```

### 2. Get AI Recommendations
**GET** `/api/ai/recommend/{userId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productIds": [1, 3, 7, 9]
  }
}
```

### 3. Smart Search with AI
**POST** `/api/ai/search`

**Request:**
```json
{
  "query": "cheap laptop"
}
```

**Response:**
```json
{
  "success": true,
  "data": "laptop budget under 30000 INR"
}
```

---

## Vendors

### 1. Get All Vendors
**GET** `/api/vendors`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shopName": "Tech Store",
      "contactEmail": "tech@store.com",
      "contactPhone": "1234567890",
      "address": "123 Main St",
      "status": "APPROVED",
      "user": { "id": 1, "name": "John Doe" }
    }
  ]
}
```

### 2. Get Vendor by ID
**GET** `/api/vendors/{id}`

### 3. Get Vendor by User
**GET** `/api/vendors/user/{userId}`

### 4. Register as Vendor
**POST** `/api/vendors`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "shopName": "Tech Store",
  "contactEmail": "tech@store.com",
  "contactPhone": "1234567890",
  "address": "123 Main St",
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor created successfully",
  "data": {
    "id": 1,
    "shopName": "Tech Store",
    "contactEmail": "tech@store.com",
    "contactPhone": "1234567890",
    "address": "123 Main St",
    "status": "PENDING",
    "user": { "id": 1, "name": "John Doe" }
  }
}
```

### 5. Update Vendor
**PUT** `/api/vendors/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "shopName": "Updated Store Name",
  "contactEmail": "updated@store.com",
  "contactPhone": "9876543210",
  "address": "456 New St"
}
```

### 6. Update Vendor Status (Admin only)
**PUT** `/api/vendors/{id}/status?status=APPROVED`

**Headers:**
```
Authorization: Bearer {token}
```

---

## Authentication Headers

For protected endpoints, include the JWT token:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## CORS Configuration

The backend accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

---

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Resource not found",
  "timestamp": "2026-01-22T10:30:00"
}
```

Common HTTP Status Codes:
- `200 OK` - Success
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Setup Requirements

### 1. Database
Create MySQL database:
```sql
CREATE DATABASE cranberry_db;
```

### 2. Environment Variables
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Update values in `.env`:
```env
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### 3. Run Ollama Locally
```bash
# Install Ollama from https://ollama.ai
# Pull the model
ollama pull llama3.2

# Start Ollama (usually runs automatically)
ollama serve
```

### 4. Start Backend
```bash
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

---

## Testing with Frontend

### Example Fetch Request (React/Next.js)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem('token', result.data.token);
    return result.data;
  }
  
  throw new Error(result.message);
};

// Get Products
const getProducts = async () => {
  const response = await fetch('http://localhost:8080/api/products');
  const result = await response.json();
  return result.data;
};

// Create Order (Protected)
const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  
  const result = await response.json();
  return result.data;
};

// AI Smart Search
const smartSearch = async (query) => {
  const response = await fetch('http://localhost:8080/api/ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  const result = await response.json();
  return result.data;
};
```

---

## API Testing with cURL

```bash
# Health Check
curl http://localhost:8080/api/ai/health

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get Products
curl http://localhost:8080/api/products

# Search Products
curl "http://localhost:8080/api/products/search?query=laptop"

# AI Smart Search
curl -X POST http://localhost:8080/api/ai/search \
  -H "Content-Type: application/json" \
  -d '{"query":"cheap phone"}'
```
