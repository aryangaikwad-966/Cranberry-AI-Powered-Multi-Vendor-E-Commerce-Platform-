# Cranberry
### AI-Powered Multi-Vendor E-Commerce Platform

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


---

## 🖼️ Demo Screenshots


Below are key screenshots showcasing the Cranberry platform in action:

| Cart | Product Detail | Home Page |
|------|---------------|------------|
| ![Cart](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.46.35%E2%80%AFPM.png) | ![Product Detail](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.04%E2%80%AFPM.png) | ![Home Page ](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.47%E2%80%AFPM.png) |

| Products | Checkout | Razorpay Payment |
|----------|----------|--------------|
| ![Products](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.50.23%E2%80%AFPM.png) | ![Checkout](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.51.37%E2%80%AFPM.png) | ![Razorpay Payment](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.53.21%E2%80%AFPM.png) |

| Vendor Dashboard | Admin Dashboard |
|------------------|------------------|-----------------|
| ![Vendor Dashboard](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.56.38%E2%80%AFPM.png) | ![Vendor Dashboard](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.57.01%E2%80%AFPM.png) | 
---

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
│        │                      │                       │  4. Product List     │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │   │
│        │                      │                       │                      │  