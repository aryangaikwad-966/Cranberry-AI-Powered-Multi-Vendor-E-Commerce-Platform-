# Cranberry Marketplace Backend

AI-Powered Multi-Vendor Marketplace Backend built with Spring Boot.

## Tech Stack

- **Framework**: Spring Boot 3.2.5
- **Database**: MySQL with Spring Data JPA
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay Integration
- **AI**: Ollama (Local LLM - llama3.2)

## Setup

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.8+
- Ollama (Local AI)

### Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Run the Application

```bash
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

---

## API Documentation for Frontend Integration

### Base URL
```
http://localhost:8080/api
```

### Response Format
All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-22T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2024-01-22T10:30:00"
}
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

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
    "email": "john@example.com"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

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
    "email": "john@example.com"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

## Product Endpoints

### Get All Products (Public)
```http
GET /api/products
```

### Get Product by ID (Public)
```http
GET /api/products/{id}
```

### Search Products (Public)
```http
GET /api/products/search?query=phone
```

### Get Products by Vendor (Public)
```http
GET /api/products/vendor/{vendorId}
```

### Add Product (Protected)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 79999.00,
  "stock": 50,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics"
}
```

### Update Product (Protected)
```http
PUT /api/products/{id}
Authorization: Bearer <token>
```

### Delete Product (Protected)
```http
DELETE /api/products/{id}
Authorization: Bearer <token>
```

---

## Order Endpoints (All Protected)

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "totalAmount": 79999.00,
  "items": [...]
}
```

### Get Order by ID
```http
GET /api/orders/{orderId}
Authorization: Bearer <token>
```

### Get User Orders
```http
GET /api/orders/user/{userId}
Authorization: Bearer <token>
```

### Get Order Items
```http
GET /api/orders/{orderId}/items
Authorization: Bearer <token>
```

### Update Order Status
```http
PUT /api/orders/{orderId}/status?status=SHIPPED
Authorization: Bearer <token>
```

---

## Payment Endpoints (All Protected)

### Create Payment
```http
POST /api/payments/create/{orderId}
Authorization: Bearer <token>
```

**Response includes Razorpay order ID for frontend checkout.**

### Verify Payment
```http
POST /api/payments/verify?razorpayOrderId=xxx&razorpayPaymentId=xxx&razorpaySignature=xxx
Authorization: Bearer <token>
```

### Get Payment by Order
```http
GET /api/payments/order/{orderId}
Authorization: Bearer <token>
```

---

## Vendor Endpoints

### Get All Vendors (Public)
```http
GET /api/vendors
```

### Get Vendor by ID (Public)
```http
GET /api/vendors/{id}
```

### Create Vendor (Protected)
```http
POST /api/vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Store",
  "description": "Best products",
  "userId": 1
}
```

### Get Vendor by User
```http
GET /api/vendors/user/{userId}
```

---

## AI Endpoints (All Protected)

### Get Recommendations
```http
GET /api/ai/recommend/{userId}
Authorization: Bearer <token>
```

### Smart Search
```http
POST /api/ai/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "best phone under 50000"
}
```

---

## Frontend Integration Guide

### 1. Store Token After Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { data } = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data));
```

### 2. Add Token to Protected Requests
```javascript
const token = localStorage.getItem('token');
const response = await fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Handle Errors
```javascript
const response = await fetch('/api/...');
const result = await response.json();

if (!result.success) {
  // Show error message
  alert(result.message);
}
```

### CORS Configuration
The backend allows requests from:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)
- `http://localhost:5174` (Vite alternate)

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (Invalid/Missing Token) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |
