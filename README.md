# Cranberry - AI-Powered Multi-Vendor E-Commerce Marketplace

> **Empowering Small Businesses with AI-Driven Commerce Solutions**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-0066FF?style=for-the-badge&logo=vercel)](https://cranberry-ai-multivendor-e-commerce.vercel.app)
[![API Status](https://img.shields.io/badge/API-Online-00C853?style=for-the-badge&logo=spring)](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=flat-square&logo=spring)](https://spring.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [UN Sustainable Development Goals](#-un-sustainable-development-goals)
- [System Architecture](#-system-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [API Architecture](#-api-architecture)
- [AI/ML Pipeline](#-aiml-pipeline)
- [Security Architecture](#-security-architecture)
- [Deployment Architecture](#-deployment-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Future Roadmap](#-future-roadmap)
- [Team](#-team)

---

## 🌐 Live Demo

| Component | URL | Status |
|-----------|-----|--------|
| **Web Application** | [cranberry-ai-multivendor-e-commerce.vercel.app](https://cranberry-ai-multivendor-e-commerce.vercel.app) | ✅ Live |
| **REST API** | [cranberry-ai-powered-multi-vendor-e.onrender.com](https://cranberry-ai-powered-multi-vendor-e.onrender.com) | ✅ Live |
| **Health Check** | [/api/health](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health) | ✅ Active |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cranberry.com | password |
| Vendor | techvista@cranberry.com | password |
| Customer | aryan@example.com | password |

---

## 🎯 Problem Statement

### The Digital Divide in E-Commerce

Small and medium businesses face significant barriers in the digital marketplace:

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         THE E-COMMERCE CHALLENGE                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║   ┌────────────────┐    ┌────────────────┐    ┌────────────────┐                ║
║   │  💰 HIGH COST  │    │  🤖 NO AI      │    │  📊 LIMITED    │                ║
║   │                │    │                │    │                │                ║
║   │  Platform fees │    │  Enterprise AI │    │  No insights   │                ║
║   │  15-30% per    │    │  costs $10K+   │    │  on customer   │                ║
║   │  transaction   │    │  per month     │    │  behavior      │                ║
║   └────────────────┘    └────────────────┘    └────────────────┘                ║
║                                                                                  ║
║   ┌────────────────┐    ┌────────────────┐    ┌────────────────┐                ║
║   │  🔍 POOR       │    │  😤 COMPLEX    │    │  📱 TECH       │                ║
║   │  DISCOVERY     │    │  CHECKOUT      │    │  BARRIERS      │                ║
║   │                │    │                │    │                │                ║
║   │  Products get  │    │  70% cart      │    │  No technical  │                ║
║   │  lost among    │    │  abandonment   │    │  expertise to  │                ║
║   │  millions      │    │  rate          │    │  build stores  │                ║
║   └────────────────┘    └────────────────┘    └────────────────┘                ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

### Impact Statistics

| Statistic | Value | Source |
|-----------|-------|--------|
| Small businesses struggling with digital transformation | 60% | World Bank 2024 |
| Annual cart abandonment value globally | $4.6 Trillion | Baymard Institute |
| Customers expecting personalized experiences | 73% | Salesforce Report |
| SMBs unable to afford AI tools | 89% | Gartner Survey |

---

## 💡 Our Solution

**Cranberry** is a comprehensive AI-powered multi-vendor marketplace that democratizes e-commerce technology for small businesses.

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                           CRANBERRY SOLUTION                                      ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║                          ┌─────────────────────┐                                 ║
║                          │     CRANBERRY       │                                 ║
║                          │   AI Marketplace    │                                 ║
║                          └──────────┬──────────┘                                 ║
║                                     │                                            ║
║            ┌────────────────────────┼────────────────────────┐                   ║
║            │                        │                        │                   ║
║            ▼                        ▼                        ▼                   ║
║   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐           ║
║   │   FOR VENDORS   │     │  FOR CUSTOMERS  │     │   FOR ADMINS    │           ║
║   ├─────────────────┤     ├─────────────────┤     ├─────────────────┤           ║
║   │ • Zero platform │     │ • AI chatbot    │     │ • Platform      │           ║
║   │   fees          │     │   assistant     │     │   analytics     │           ║
║   │ • AI pricing    │     │ • Smart search  │     │ • Vendor        │           ║
║   │   suggestions   │     │ • Personalized  │     │   management    │           ║
║   │ • Dashboard     │     │   recommendations│    │ • Product       │           ║
║   │   analytics     │     │ • Secure        │     │   moderation    │           ║
║   │ • Order         │     │   payments      │     │ • User          │           ║
║   │   management    │     │ • Order         │     │   management    │           ║
║   │                 │     │   tracking      │     │                 │           ║
║   └─────────────────┘     └─────────────────┘     └─────────────────┘           ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

### Key Differentiators

| Feature | Traditional Platforms | Cranberry |
|---------|----------------------|-----------|
| Platform Fees | 15-30% per sale | 0% |
| AI Chatbot | Premium only ($$$) | ✅ Included |
| Smart Search | Basic keyword | AI-powered semantic |
| Price Optimization | Not available | AI suggestions |
| Personalization | Enterprise tier | ✅ For everyone |

---

## 🌍 UN Sustainable Development Goals

Cranberry directly contributes to the following UN SDGs:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    UN SUSTAINABLE DEVELOPMENT GOALS                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  SDG 8: DECENT WORK AND ECONOMIC GROWTH                                     ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                    ││
│  │  • Enables small vendors to participate in digital economy                  ││
│  │  • Creates entrepreneurship opportunities with zero barrier                 ││
│  │  • Provides tools previously available only to large enterprises           ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  SDG 9: INDUSTRY, INNOVATION AND INFRASTRUCTURE                             ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                         ││
│  │  • Democratizes AI technology for all business sizes                        ││
│  │  • Provides modern e-commerce infrastructure                                ││
│  │  • Promotes technological innovation in retail                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  SDG 10: REDUCED INEQUALITIES                                               ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                       ││
│  │  • Levels playing field between small and large businesses                  ││
│  │  • Provides equal access to AI-powered tools                                ││
│  │  • Reduces economic disparities in digital commerce                         ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │  SDG 12: RESPONSIBLE CONSUMPTION AND PRODUCTION                             ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                        ││
│  │  • AI recommendations reduce wasteful purchases                             ││
│  │  • Smart inventory management reduces overproduction                        ││
│  │  • Data-driven insights promote sustainable practices                       ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗 System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            SYSTEM ARCHITECTURE                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                              CLIENT LAYER                                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ││
│  │  │   Customer   │  │    Vendor    │  │    Admin     │  │   Mobile     │    ││
│  │  │   Web App    │  │  Dashboard   │  │  Dashboard   │  │  (Future)    │    ││
│  │  │              │  │              │  │              │  │              │    ││
│  │  │  • Browse    │  │  • Products  │  │  • Analytics │  │  • iOS       │    ││
│  │  │  • Search    │  │  • Orders    │  │  • Vendors   │  │  • Android   │    ││
│  │  │  • Purchase  │  │  • Analytics │  │  • Moderation│  │              │    ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    ││
│  └──────────────────────────────────────┬──────────────────────────────────────┘│
│                                         │                                        │
│                                    HTTPS│REST API                                │
│                                         │                                        │
│  ┌──────────────────────────────────────▼──────────────────────────────────────┐│
│  │                          PRESENTATION LAYER                                  ││
│  │                                                                              ││
│  │  ┌────────────────────────────────────────────────────────────────────────┐ ││
│  │  │                         VERCEL CDN                                     │ ││
│  │  │  • React 18.3 SPA          • TailwindCSS Styling                      │ ││
│  │  │  • Vite Build System       • 46+ shadcn/ui Components                 │ ││
│  │  │  • React Router v7         • Responsive Design                        │ ││
│  │  └────────────────────────────────────────────────────────────────────────┘ ││
│  └──────────────────────────────────────┬──────────────────────────────────────┘│
│                                         │                                        │
│  ┌──────────────────────────────────────▼──────────────────────────────────────┐│
│  │                          API GATEWAY LAYER                                   ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        ││
│  │  │    CORS     │  │    Rate     │  │  Request    │  │    JWT      │        ││
│  │  │   Filter    │  │  Limiter    │  │ Validation  │  │   Filter    │        ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        ││
│  └──────────────────────────────────────┬──────────────────────────────────────┘│
│                                         │                                        │
│  ┌──────────────────────────────────────▼──────────────────────────────────────┐│
│  │                          APPLICATION LAYER                                   ││
│  │                         (Spring Boot 3.4.2)                                  ││
│  │                                                                              ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐    ││
│  │  │                      CONTROLLER LAYER (REST API)                    │    ││
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │    ││
│  │  │  │  Auth  │ │Product │ │ Order  │ │ Vendor │ │Payment │ │   AI   │ │    ││
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │    ││
│  │  └───────────────────────────────┬─────────────────────────────────────┘    ││
│  │                                  │                                          ││
│  │  ┌───────────────────────────────▼─────────────────────────────────────┐    ││
│  │  │                       SERVICE LAYER (Business Logic)                │    ││
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐       │    ││
│  │  │  │AuthService │ │ProductSvc  │ │ OrderSvc   │ │  AISvc     │       │    ││
│  │  │  │            │ │            │ │            │ │            │       │    ││
│  │  │  │• Register  │ │• CRUD      │ │• Create    │ │• Chat      │       │    ││
│  │  │  │• Login     │ │• Search    │ │• Track     │ │• Search    │       │    ││
│  │  │  │• OAuth     │ │• Filter    │ │• Status    │ │• Recommend │       │    ││
│  │  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘       │    ││
│  │  └───────────────────────────────┬─────────────────────────────────────┘    ││
│  │                                  │                                          ││
│  │  ┌───────────────────────────────▼─────────────────────────────────────┐    ││
│  │  │                    REPOSITORY LAYER (Data Access)                   │    ││
│  │  │                     Spring Data JPA + Hibernate                     │    ││
│  │  └───────────────────────────────┬─────────────────────────────────────┘    ││
│  └──────────────────────────────────┼──────────────────────────────────────────┘│
│                                     │                                            │
│  ┌──────────────────────────────────▼──────────────────────────────────────────┐│
│  │                           DATA LAYER                                         ││
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              ││
│  │  │   PostgreSQL    │  │     Ollama      │  │    Razorpay     │              ││
│  │  │   (Render)      │  │   (AI/LLM)      │  │   (Payments)    │              ││
│  │  │                 │  │                 │  │                 │              ││
│  │  │  • Users        │  │  • llama3.2     │  │  • Orders       │              ││
│  │  │  • Vendors      │  │  • gemma3       │  │  • Verification │              ││
│  │  │  • Products     │  │  • Intent       │  │  • Webhooks     │              ││
│  │  │  • Orders       │  │    Detection    │  │                 │              ││
│  │  │  • Payments     │  │                 │  │                 │              ││
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT INTERACTION FLOW                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│      USER                  FRONTEND                 BACKEND              DATABASE │
│        │                      │                       │                      │   │
│        │   1. Browse Site     │                       │                      │   │
│        │─────────────────────▶│                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │  2. GET /api/products │                      │   │
│        │                      │──────────────────────▶│                      │   │
│        │                      │                       │  3. Query Products   │   │
│        │                      │                       │─────────────────────▶│   │
│        │                      │                       │◀─────────────────────│   │
│        │                      │◀──────────────────────│  4. Product List     │   │
│        │◀─────────────────────│                       │                      │   │
│        │   5. Display Products│                       │                      │   │
│        │                      │                       │                      │   │
│        │   6. Ask AI Chatbot  │                       │                      │   │
│        │─────────────────────▶│                       │                      │   │
│        │                      │  7. POST /api/ai/chat │                      │   │
│        │                      │──────────────────────▶│                      │   │
│        │                      │                       │  8. Process with     │   │
│        │                      │                       │     Ollama LLM       │   │
│        │                      │                       │─────────┐            │   │
│        │                      │                       │◀────────┘            │   │
│        │                      │◀──────────────────────│  9. AI Response      │   │
│        │◀─────────────────────│                       │                      │   │
│        │  10. Show Response   │                       │                      │   │
│        │                      │                       │                      │   │
│        │  11. Add to Cart     │                       │                      │   │
│        │─────────────────────▶│                       │                      │   │
│        │                      │  12. POST /api/cart   │                      │   │
│        │                      │──────────────────────▶│                      │   │
│        │                      │                       │─────────────────────▶│   │
│        │                      │◀──────────────────────│◀─────────────────────│   │
│        │◀─────────────────────│                       │                      │   │
│        │                      │                       │                      │   │
│        │  13. Checkout        │                       │                      │   │
│        │─────────────────────▶│                       │                      │   │
│        │                      │  14. POST /api/payments/create               │   │
│        │                      │──────────────────────▶│                      │   │
│        │                      │                       │──▶ Razorpay API      │   │
│        │                      │◀──────────────────────│◀──                   │   │
│        │◀─────────────────────│  15. Payment Gateway  │                      │   │
│        │                      │                       │                      │   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Customer Features

| Feature | Description | Technology |
|---------|-------------|------------|
| 🤖 **AI Chatbot** | Natural language product queries and support | Ollama LLM |
| 🔍 **Smart Search** | Semantic search with intent understanding | AI + Full-text |
| 🎯 **Recommendations** | Personalized product suggestions | ML Algorithms |
| 🛒 **Shopping Cart** | Persistent cart with real-time sync | React Context |
| ❤️ **Wishlist** | Save products for later | Local + Cloud |
| 📦 **Order Tracking** | Real-time item-level status updates | WebSocket |
| 💳 **Secure Payments** | Razorpay integration with retry | PCI Compliant |
| 🔐 **Google OAuth** | One-click social login | OAuth 2.0 |

### Vendor Features

| Feature | Description | Technology |
|---------|-------------|------------|
| 📊 **Dashboard** | Revenue analytics and insights | Charts.js |
| 📦 **Product Management** | Full CRUD with image upload | REST API |
| 💰 **AI Price Suggestions** | Market-aware pricing recommendations | Ollama LLM |
| 📋 **Order Management** | Item-level status updates | Real-time |
| 📈 **Sales Analytics** | Performance metrics and trends | Data Viz |

### Admin Features

| Feature | Description | Technology |
|---------|-------------|------------|
| 🏢 **Platform Dashboard** | Comprehensive platform analytics | Real-time |
| ✅ **Vendor Approval** | Review and approve vendor applications | Workflow |
| 🛡️ **Product Moderation** | Review and moderate listings | Queue |
| 👥 **User Management** | Manage all platform users | RBAC |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI Framework |
| Vite | 6.0 | Build Tool |
| TailwindCSS | 3.4 | Styling |
| Radix UI | Latest | Accessible Primitives |
| React Router | 7.0 | Routing |
| Axios | 1.7 | HTTP Client |
| Zod | 3.23 | Validation |
| Lucide React | Latest | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Language |
| Spring Boot | 3.4.2 | Framework |
| Spring Security | 6.2 | Authentication |
| Spring Data JPA | 3.4 | ORM |
| PostgreSQL | 16 | Database |
| JWT | 0.11.5 | Token Auth |
| Ollama | Latest | AI/LLM |
| Razorpay | 1.4.7 | Payments |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Frontend Hosting |
| Render | Backend + PostgreSQL |
| GitHub Actions | CI/CD |

---

## 💾 Database Design

### Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA (PostgreSQL)                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐                    ┌─────────────────────┐              │
│  │        USERS        │                    │       VENDOR        │              │
│  ├─────────────────────┤                    ├─────────────────────┤              │
│  │ PK id          BIGINT│───────────────────│ PK id          BIGINT│             │
│  │    name      VARCHAR │                    │    shop_name VARCHAR │             │
│  │    email     VARCHAR │◀──────────────────│ FK user_id    BIGINT │             │
│  │    password  VARCHAR │                    │    status    VARCHAR │             │
│  │    role      VARCHAR │                    │    contact   VARCHAR │             │
│  │    google_id VARCHAR │                    │    address      TEXT │             │
│  │    avatar    VARCHAR │                    │    logo_url  VARCHAR │             │
│  │    created_at  TIMESTAMP│                 │    joined_at TIMESTAMP│            │
│  └──────────┬──────────┘                    └──────────┬──────────┘              │
│             │                                          │                          │
│             │                                          │                          │
│             │                               ┌──────────▼──────────┐              │
│             │                               │      PRODUCT        │              │
│             │                               ├─────────────────────┤              │
│             │                               │ PK id          BIGINT│             │
│             │                               │    name      VARCHAR │              │
│             │                               │    description  TEXT │              │
│             │                               │    price      DOUBLE │              │
│             │                               │    stock         INT │              │
│             │                               │    image_url VARCHAR │              │
│             │                               │    category  VARCHAR │              │
│             │                               │    status    VARCHAR │              │
│             │                               │ FK vendor_id  BIGINT │              │
│             │                               └──────────┬──────────┘              │
│             │                                          │                          │
│             │    ┌─────────────────────┐               │                          │
│             │    │       ORDER         │               │                          │
│             │    ├─────────────────────┤               │                          │
│             └───▶│ PK id          BIGINT│              │                          │
│                  │    total       DOUBLE │              │                          │
│                  │    status    VARCHAR │               │                          │
│                  │    address      TEXT │               │                          │
│                  │    tracking  VARCHAR │               │                          │
│                  │ FK user_id    BIGINT │               │                          │
│                  │    created_at TIMESTAMP│             │                          │
│                  └──────────┬──────────┘               │                          │
│                             │                          │                          │
│                             │    ┌─────────────────────▼─────┐                   │
│                             │    │      ORDER_ITEM           │                   │
│                             │    ├───────────────────────────┤                   │
│                             └───▶│ PK id              BIGINT │                   │
│                                  │    quantity           INT │                   │
│                                  │    price           DOUBLE │                   │
│                                  │    status         VARCHAR │                   │
│                                  │ FK order_id        BIGINT │                   │
│                                  │ FK product_id      BIGINT │◀──────────────────┘
│                                  └───────────────────────────┘                   │
│                                                                                  │
│  ┌─────────────────────┐              ┌─────────────────────┐                   │
│  │      PAYMENT        │              │        CART         │                   │
│  ├─────────────────────┤              ├─────────────────────┤                   │
│  │ PK id          BIGINT│             │ PK id          BIGINT│                  │
│  │    razorpay_id VARCHAR│            │ FK user_id    BIGINT │                  │
│  │    amount      DOUBLE │            └─────────────────────┘                   │
│  │    status    VARCHAR │                                                       │
│  │ FK order_id   BIGINT │              ┌─────────────────────┐                  │
│  └─────────────────────┘              │      WISHLIST       │                   │
│                                        ├─────────────────────┤                   │
│                                        │ PK id          BIGINT│                  │
│                                        │ FK user_id    BIGINT │                  │
│                                        └─────────────────────┘                   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Architecture

### REST API Endpoints

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              API ENDPOINT STRUCTURE                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  BASE URL: https://cranberry-ai-powered-multi-vendor-e.onrender.com              │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ AUTHENTICATION                                                /api/auth     ││
│  ├─────────────────────────────────────────────────────────────────────────────┤│
│  │ POST   /register        Register new user                         Public   ││
│  │ POST   /login           Login with credentials                    Public   ││
│  │ POST   /google          Google OAuth login                        Public   ││
│  │ GET    /me              Get current user                          Auth     ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ PRODUCTS                                                     /api/products  ││
│  ├─────────────────────────────────────────────────────────────────────────────┤│
│  │ GET    /                 List all products                        Public   ││
│  │ GET    /{id}             Get product details                      Public   ││
│  │ GET    /category/{cat}   Filter by category                       Public   ││
│  │ GET    /search?q=        Search products                          Public   ││
│  │ POST   /                 Create product                           Vendor   ││
│  │ PUT    /{id}             Update product                           Vendor   ││
│  │ DELETE /{id}             Delete product                           Vendor   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ ORDERS                                                        /api/orders  ││
│  ├─────────────────────────────────────────────────────────────────────────────┤│
│  │ GET    /                 Get user's orders                        Auth     ││
│  │ GET    /{id}             Get order details                        Auth     ││
│  │ POST   /                 Create new order                         Auth     ││
│  │ PUT    /{id}/cancel      Cancel order                             Auth     ││
│  │ PUT    /{id}/status      Update status (vendor)                   Vendor   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ AI FEATURES                                                       /api/ai  ││
│  ├─────────────────────────────────────────────────────────────────────────────┤│
│  │ POST   /chat             AI chatbot conversation                  Public   ││
│  │ POST   /search           Semantic product search                  Public   ││
│  │ GET    /recommend/{id}   Product recommendations                  Public   ││
│  │ GET    /recommend/user   Personalized recommendations             Auth     ││
│  │ POST   /price-suggest    AI price suggestions                     Vendor   ││
│  │ GET    /health           AI service health check                  Public   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │ PAYMENTS                                                     /api/payments ││
│  ├─────────────────────────────────────────────────────────────────────────────┤│
│  │ GET    /config           Get Razorpay public key                  Public   ││
│  │ POST   /create           Create payment order                     Auth     ││
│  │ POST   /verify           Verify payment signature                 Auth     ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI/ML Pipeline

### AI Feature Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            AI/ML PIPELINE ARCHITECTURE                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           USER INPUT LAYER                                   ││
│  │                                                                              ││
│  │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                ││
│  │    │   Chatbot    │    │   Search     │    │   Browse     │                ││
│  │    │    Query     │    │    Query     │    │   History    │                ││
│  │    │              │    │              │    │              │                ││
│  │    │ "Find me a   │    │ "wireless    │    │ [Product     │                ││
│  │    │  laptop      │    │  headphones" │    │  View Logs]  │                ││
│  │    │  under 50k"  │    │              │    │              │                ││
│  │    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                ││
│  │           │                   │                   │                         ││
│  └───────────┼───────────────────┼───────────────────┼─────────────────────────┘│
│              │                   │                   │                          │
│              ▼                   ▼                   ▼                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                        AI PROCESSING LAYER                                   ││
│  │                                                                              ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐    ││
│  │  │                    INTENT DETECTION                                  │    ││
│  │  │                                                                      │    ││
│  │  │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    ││
│  │  │    │   Product    │  │    Price     │  │   Order      │            │    ││
│  │  │    │   Search     │  │   Query      │  │   Inquiry    │            │    ││
│  │  │    └──────────────┘  └──────────────┘  └──────────────┘            │    ││
│  │  │                                                                      │    ││
│  │  │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │    ││
│  │  │    │   Category   │  │  Comparison  │  │   General    │            │    ││
│  │  │    │   Browse     │  │   Request    │  │   Support    │            │    ││
│  │  │    └──────────────┘  └──────────────┘  └──────────────┘            │    ││
│  │  └─────────────────────────────────────────────────────────────────────┘    ││
│  │                                    │                                         ││
│  │                                    ▼                                         ││
│  │  ┌─────────────────────────────────────────────────────────────────────┐    ││
│  │  │                      OLLAMA LLM ENGINE                               │    ││
│  │  │                                                                      │    ││
│  │  │   Model: llama3.2 / gemma3:4b                                       │    ││
│  │  │                                                                      │    ││
│  │  │   ┌───────────────────────────────────────────────────────────┐     │    ││
│  │  │   │                   CONTEXT INJECTION                        │     │    ││
│  │  │   │                                                            │     │    ││
│  │  │   │   • Product Catalog (name, price, category, description)  │     │    ││
│  │  │   │   • User Preferences (browsing history, past orders)      │     │    ││
│  │  │   │   • Current Cart Contents                                  │     │    ││
│  │  │   │   • Platform Policies                                      │     │    ││
│  │  │   └───────────────────────────────────────────────────────────┘     │    ││
│  │  └─────────────────────────────────────────────────────────────────────┘    ││
│  │                                    │                                         ││
│  └────────────────────────────────────┼─────────────────────────────────────────┘│
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                          OUTPUT LAYER                                        ││
│  │                                                                              ││
│  │    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                ││
│  │    │   Chat       │    │   Product    │    │   Price      │                ││
│  │    │  Response    │    │   Results    │    │ Suggestions  │                ││
│  │    │              │    │              │    │              │                ││
│  │    │ "Here are    │    │ [Filtered    │    │ "Based on    │                ││
│  │    │  laptops     │    │  Product     │    │  market, we  │                ││
│  │    │  under ₹50k" │    │  List]       │    │  suggest     │                ││
│  │    │              │    │              │    │  ₹499-599"   │                ││
│  │    └──────────────┘    └──────────────┘    └──────────────┘                ││
│  │                                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY ARCHITECTURE                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                    AUTHENTICATION FLOW                                       ││
│  │                                                                              ││
│  │    Client              API Gateway           Auth Service         Database  ││
│  │      │                     │                      │                   │     ││
│  │      │  1. Login Request   │                      │                   │     ││
│  │      │────────────────────▶│                      │                   │     ││
│  │      │                     │  2. Validate         │                   │     ││
│  │      │                     │─────────────────────▶│                   │     ││
│  │      │                     │                      │  3. Check User    │     ││
│  │      │                     │                      │─────────────────▶│     ││
│  │      │                     │                      │◀─────────────────│     ││
│  │      │                     │                      │  4. Verify Pass   │     ││
│  │      │                     │◀─────────────────────│                   │     ││
│  │      │                     │  5. Generate JWT     │                   │     ││
│  │      │◀────────────────────│                      │                   │     ││
│  │      │  6. Return Token    │                      │                   │     ││
│  │                                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                    AUTHORIZATION (RBAC)                                      ││
│  │                                                                              ││
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    ││
│  │   │   CUSTOMER  │    │   VENDOR    │    │    ADMIN    │                    ││
│  │   ├─────────────┤    ├─────────────┤    ├─────────────┤                    ││
│  │   │ • Browse    │    │ • All       │    │ • All       │                    ││
│  │   │ • Search    │    │   Customer  │    │   Vendor    │                    ││
│  │   │ • Purchase  │    │   features  │    │   features  │                    ││
│  │   │ • Cart      │    │ • Products  │    │ • Approve   │                    ││
│  │   │ • Orders    │    │   CRUD      │    │   Vendors   │                    ││
│  │   │ • Wishlist  │    │ • Orders    │    │ • Moderate  │                    ││
│  │   │ • Profile   │    │   Manage    │    │   Products  │                    ││
│  │   │             │    │ • Dashboard │    │ • Analytics │                    ││
│  │   └─────────────┘    └─────────────┘    └─────────────┘                    ││
│  │                                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                    SECURITY MEASURES                                         ││
│  │                                                                              ││
│  │   • JWT Token Authentication (24hr expiry)                                  ││
│  │   • BCrypt Password Hashing (cost factor 10)                                ││
│  │   • CORS Protection (whitelist origins)                                     ││
│  │   • CSRF Protection (disabled for stateless API)                            ││
│  │   • SQL Injection Prevention (Parameterized queries)                        ││
│  │   • XSS Protection (Input sanitization)                                     ││
│  │   • HTTPS Enforcement (TLS 1.3)                                             ││
│  │   • Rate Limiting (100 req/min)                                             ││
│  │                                                                              ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                              ┌─────────────────┐                                 │
│                              │     GitHub      │                                 │
│                              │   Repository    │                                 │
│                              └────────┬────────┘                                 │
│                                       │                                          │
│                              Push to main branch                                 │
│                                       │                                          │
│                    ┌──────────────────┴──────────────────┐                       │
│                    │                                     │                       │
│                    ▼                                     ▼                       │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────────┐      │
│  │           VERCEL                │   │           RENDER                │      │
│  │      (Frontend Hosting)         │   │      (Backend Hosting)          │      │
│  ├─────────────────────────────────┤   ├─────────────────────────────────┤      │
│  │                                 │   │                                 │      │
│  │  ┌───────────────────────────┐  │   │  ┌───────────────────────────┐  │      │
│  │  │     Build Process         │  │   │  │     Build Process         │  │      │
│  │  │                           │  │   │  │                           │  │      │
│  │  │  1. npm install           │  │   │  │  1. Docker Build          │  │      │
│  │  │  2. npm run build         │  │   │  │  2. Maven Package         │  │      │
│  │  │  3. Deploy to CDN         │  │   │  │  3. Deploy Container      │  │      │
│  │  │                           │  │   │  │                           │  │      │
│  │  └───────────────────────────┘  │   │  └───────────────────────────┘  │      │
│  │                                 │   │                                 │      │
│  │  ┌───────────────────────────┐  │   │  ┌───────────────────────────┐  │      │
│  │  │     Environment           │  │   │  │     Environment           │  │      │
│  │  │                           │  │   │  │                           │  │      │
│  │  │  VITE_API_BASE_URL        │  │   │  │  DATABASE_URL             │  │      │
│  │  │                           │  │   │  │  JWT_SECRET               │  │      │
│  │  │                           │  │   │  │  RAZORPAY_KEY             │  │      │
│  │  │                           │  │   │  │  RAZORPAY_SECRET          │  │      │
│  │  └───────────────────────────┘  │   │  └───────────────────────────┘  │      │
│  │                                 │   │                                 │      │
│  │  URL: cranberry-ai-multivendor  │   │  URL: cranberry-ai-powered-    │      │
│  │       -e-commerce.vercel.app    │   │       multi-vendor-e.onrender  │      │
│  │                                 │   │                    .com        │      │
│  └─────────────────────────────────┘   └───────────────┬─────────────────┘      │
│                                                        │                         │
│                                                        ▼                         │
│                                        ┌─────────────────────────────────┐      │
│                                        │       RENDER PostgreSQL         │      │
│                                        │                                 │      │
│                                        │  • Auto-managed backups         │      │
│                                        │  • SSL connections              │      │
│                                        │  • 256MB storage (free tier)    │      │
│                                        │                                 │      │
│                                        └─────────────────────────────────┘      │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏃 Getting Started

### Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| Java | 17+ | [Adoptium](https://adoptium.net/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8+ | [MySQL](https://dev.mysql.com/downloads/) |
| Maven | 3.9+ | [Maven](https://maven.apache.org/) |
| Ollama | Latest | [Ollama](https://ollama.ai/) (Optional) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aryangaikwad-966/Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-.git
cd "Cranberry- AI Powered Multivendor Ecommerce Marketplace"

# 2. Setup Database
mysql -u root -p
CREATE DATABASE cranberry_db;
USE cranberry_db;
SOURCE Cranberry-Backend/database_setup.sql;

# 3. Setup Backend
cd Cranberry-Backend
cp .env.example .env
# Edit .env with your credentials
mvn spring-boot:run

# 4. Setup Frontend (new terminal)
cd Cranberry-Frontend
npm install
npm run dev

# 5. (Optional) Start Ollama for AI
ollama serve
ollama pull llama3.2
```

### Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| API Health | http://localhost:8080/api/health |

---

## 📊 API Documentation

### Quick Reference

```bash
# Health Check
curl https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health

# Get Products
curl https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/products

# Login
curl -X POST https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aryan@example.com","password":"password"}'

# AI Chat
curl -X POST https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Find me a laptop under 50000"}'
```

> 📖 Full API documentation: [API_DOCUMENTATION.md](./Cranberry-Backend/API_DOCUMENTATION.md)

---

## 🗺 Future Roadmap

### Phase 2: Enhancement (Q2 2026)
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Cloud image storage

### Phase 3: Scale (Q3-Q4 2026)
- [ ] Mobile app (React Native)
- [ ] Real-time chat (WebSocket)
- [ ] Multi-currency support
- [ ] Inventory management
- [ ] Coupon/Discount system
- [ ] Shipping integration

---

## 👨‍💻 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aryangaikwad-966">
        <img src="https://github.com/aryangaikwad-966.png" width="100px;" alt=""/>
        <br />
        <sub><b>Aryan Gaikwad</b></sub>
      </a>
      <br />
      <sub>Full Stack Developer</sub>
    </td>
  </tr>
</table>

[![GitHub](https://img.shields.io/badge/GitHub-aryangaikwad--966-black?style=flat-square&logo=github)](https://github.com/aryangaikwad-966)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/aryan-gaikwad-943474334/)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat-square&logo=gmail)](mailto:aryangaikwad966@gmail.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - Backend Framework
- [React](https://react.dev/) - Frontend Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Ollama](https://ollama.ai/) - Local AI/LLM
- [Razorpay](https://razorpay.com/) - Payment Gateway
- [Vercel](https://vercel.com/) - Frontend Hosting
- [Render](https://render.com/) - Backend Hosting

---
<p align="center">
  ⭐ Star this repository if you found it helpful!
</p>
