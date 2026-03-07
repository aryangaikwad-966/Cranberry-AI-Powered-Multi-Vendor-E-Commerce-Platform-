<div align="center">

# 🍒 Cranberry

### AI-Powered Multi-Vendor E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/🔴_LIVE_DEMO-cranberry.vercel.app-0066FF?style=for-the-badge)](https://cranberry-ai-multivendor-e-commerce.vercel.app)
[![API](https://img.shields.io/badge/API-Online-00C853?style=for-the-badge&logo=spring)](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health)

**Full-stack e-commerce platform with self-hosted AI for semantic search, chatbot, recommendations, and pricing intelligence**

![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.4-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama_LLM-000000?style=flat-square&logo=ollama&logoColor=white)

</div>

---

## 💡 What I Built

A production-ready marketplace supporting **3 user roles** (Customer, Vendor, Admin) with integrated AI capabilities — all running on **self-hosted LLMs** to eliminate per-request API costs.

### Key Highlights

| Area | Implementation |
|------|----------------|
| **AI Chatbot** | Multi-turn conversations with 5-intent classification (product search, order tracking, deals, help, general) |
| **Semantic Search** | Natural language queries → keyword/price/category extraction → multi-axis relevance scoring |
| **Recommendations** | Category-weighted collaborative filtering with purchase history analysis |
| **Price Intelligence** | AI-powered competitive pricing suggestions for vendors with market positioning |
| **Authentication** | Stateless JWT with role-based access control (RBAC) across 11 REST endpoints |
| **Payments** | Razorpay integration with complete order lifecycle management |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, shadcn/ui, React Router, Zod |
| **Backend** | Java 17, Spring Boot 3.4, Spring Security, Spring Data JPA |
| **AI/ML** | Ollama (self-hosted), llama3.2, gemma3, WebFlux non-blocking HTTP |
| **Database** | PostgreSQL (prod), MySQL (dev) |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  React SPA (Customer / Vendor / Admin Dashboards)           │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API + JWT
┌─────────────────────────────▼───────────────────────────────┐
│  Spring Boot Backend                                         │
│  ├── 11 Controllers (Auth, Product, Order, Cart, AI, etc.)  │
│  ├── 10 Services + AI Module (semantic search, chatbot)     │
│  └── Spring Security (JWT filter chain, RBAC)               │
└──────────────┬────────────────────────────┬─────────────────┘
               │                            │
    ┌──────────▼──────────┐     ┌──────────▼──────────┐
    │  PostgreSQL / MySQL │     │  Ollama Runtime     │
    │  (11 entity model)  │     │  (llama3.2, gemma3) │
    └─────────────────────┘     └─────────────────────┘
```

---

## 📸 Screenshots

<div align="center">

| Home Page | Product Discovery | Shopping Cart |
|-----------|------------------|---------------|
| ![Home](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.47%E2%80%AFPM.png) | ![Products](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.50.23%E2%80%AFPM.png) | ![Cart](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.46.35%E2%80%AFPM.png) |

| Vendor Dashboard | Admin Panel | Payment Gateway |
|------------------|-------------|-----------------|
| ![Vendor](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.56.38%E2%80%AFPM.png) | ![Admin](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.57.01%E2%80%AFPM.png) | ![Payment](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.53.21%E2%80%AFPM.png) |

</div>

---

## 🎯 Skills Demonstrated

| Domain | What I Did |
|--------|-----------|
| **System Design** | Multi-tenant data model (11 entities), layered architecture with clean service boundaries, API design across 11 controllers |
| **Backend Engineering** | Spring Boot with JPA relationships, custom JWT security filter, transactional services, 28 DTOs |
| **AI/LLM Integration** | Self-hosted inference, intent classification, semantic search pipeline, recommendation engine, prompt engineering |
| **Full-Stack Development** | React SPA with role-aware UI, form validation (Zod), RESTful API consumption |
| **Security** | JWT authentication, RBAC, BCrypt hashing, CORS configuration, SQL injection prevention |
| **Payment Systems** | Razorpay SDK integration, order lifecycle, signature verification |

---

## 🚀 Quick Start

```bash
# Backend
cd Cranberry-Backend && ./mvnw spring-boot:run

# Frontend
cd Cranberry-Frontend && npm install && npm run dev

# AI (optional)
ollama pull llama3.2 && ollama pull gemma3
```

> 📖 Detailed setup: [SETUP_GUIDE.md](Cranberry-Backend/SETUP_GUIDE.md) | API Docs: [API_DOCUMENTATION.md](Cranberry-Backend/API_DOCUMENTATION.md)

---

<div align="center">

**Built by [Aryan Gaikwad](https://github.com/aryangaikwad-966)** 

[![GitHub](https://img.shields.io/badge/GitHub-aryangaikwad--966-181717?style=flat-square&logo=github)](https://github.com/aryangaikwad-966)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>