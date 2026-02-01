# Cranberry: AI-Powered Multivendor Ecommerce Marketplace

## 1. Project Title & One-Line Summary
Cranberry — A full-stack, AI-powered, multi-vendor ecommerce platform with modern architecture and modular design.

## 2. Problem Statement & Motivation
Modern ecommerce platforms must support multiple vendors, intelligent product discovery, and seamless user experiences. Cranberry is designed to demonstrate scalable, maintainable engineering practices and AI integration for next-generation commerce.

## 3. High-Level Architecture Overview

### Frontend
- **React 18** with Vite for fast builds and HMR
- **Tailwind CSS** for utility-first styling
- Modular components, context-based state management
- AI features: Chatbot, Recommendations, Smart Search
- API service layer for backend communication

### Backend
- **Spring Boot 3** (Java 17+)
- RESTful API design
- **Spring Security** with JWT authentication
- **MySQL** database (via Spring Data JPA)
- **Ollama** (local LLM) for AI endpoints
- **Razorpay** integration for payments

### Database
- MySQL, managed via JPA/Hibernate
- Models: User, Vendor, Product, Order, Cart, Wishlist, Payment, etc.

### Integrations
- Ollama (AI/LLM)
- Razorpay (payments)

## 4. Key Features
- Multi-vendor product management
- Customer, vendor, and admin roles
- Secure authentication (JWT)
- AI-powered chatbot, recommendations, and search
- Cart, wishlist, and order management
- Payment processing (Razorpay)
- Responsive, modern UI

## 5. Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Radix UI, Axios, React Router, Zod
- **Backend:** Spring Boot, Spring Security, JPA, MySQL, Ollama, Razorpay
- **DevOps:** Maven, Vite, environment configs, .env files

## 6. System Workflow (High-Level Request Flow)
1. User interacts with frontend (browse, search, chat, purchase)
2. Frontend sends API requests to backend (`/api`), proxied in dev
3. Backend authenticates, processes business logic, interacts with DB/AI/Payments
4. Responses returned to frontend for rendering

## 7. Project Structure (Major Folders)

```
Cranberry-Frontend/
  src/
    components/    # UI, layout, product, AI, utility
    context/       # Auth, cart, wishlist state
    pages/         # Admin, vendor, customer, auth
    services/      # API service layer
    ...
Cranberry-Backend/
  src/main/java/com/cranberry/marketplace/
    controller/    # REST API endpoints
    service/       # Business logic
    model/         # JPA entities
    repository/    # Data access
    ai/            # AI integration
    security/      # JWT, security config
    ...
  src/main/resources/
    application.yml # Main config
```

## 8. Setup & Run Instructions (Local)

### Backend
1. Install Java 17+, Maven, MySQL, and Ollama
2. Copy `.env.example` to `.env` and configure credentials
3. Start MySQL and Ollama
4. Run backend:
   ```bash
   cd Cranberry-Backend
   mvn spring-boot:run
   ```

### Frontend
1. Install Node.js (v18+)
2. Install dependencies:
   ```bash
   cd Cranberry-Frontend
   npm install
   # or yarn install
   ```
3. Start dev server:
   ```bash
   npm run dev
   # or yarn dev
   ```
4. Access at [http://localhost:3000](http://localhost:3000)

## 9. Current Status & Scope
- Core multi-vendor ecommerce flows implemented
- AI features (chatbot, recommendations, search) integrated
- Secure authentication and payment flows present
- Not yet production-hardened (see below)

## 10. Future Improvements
- Add automated tests (unit, integration, E2E)
- CI/CD pipeline setup
- Containerization (Docker)
- Advanced monitoring/logging
- Production-grade secrets management
- More robust error handling and validation
- Cloud deployment scripts

## 11. What This Project Demonstrates
- Full-stack, modular architecture
- Modern React and Java Spring Boot practices
- API-driven design and environment-based config
- AI/ML integration in a real-world context
- Secure authentication and payment flows
- Clean code, documentation, and onboarding readiness

---

> This project is ideal for demonstrating engineering maturity, modern stack proficiency, and readiness for job ready or advanced internship roles. 
