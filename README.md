<div align="center">

# Cranberry

**AI-Powered Multi-Vendor E-Commerce Platform**

[Live Demo](https://cranberry-ai-multivendor-e-commerce.vercel.app) · [API Endpoint](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health) · [Documentation](Cranberry-Backend/API_DOCUMENTATION.md)

<br />

![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat&logo=postgresql&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-LLM-000000?style=flat)

</div>

<br />

## Overview

Full-stack e-commerce marketplace with **self-hosted LLM inference** for semantic search, conversational AI, personalized recommendations, and vendor pricing intelligence. Supports three user roles (Customer, Vendor, Admin) with role-based access control across 11 REST endpoints.

**Key differentiator:** Zero external AI API costs — all inference runs locally via Ollama, converting variable per-request billing to fixed infrastructure cost.

<br />

## Features

| Module | Capabilities |
|--------|-------------|
| **Search & Discovery** | Natural language queries with intent classification, multi-axis relevance scoring (keyword overlap 0.5 + category match 0.3 + price proximity 0.2) |
| **Conversational AI** | Multi-turn chatbot with 5 intent types: product search, order tracking, deals, help, general Q&A |
| **Recommendations** | Category-weighted collaborative filtering with purchase history analysis and diversity constraints |
| **Price Intelligence** | Market position analysis (budget/mid/premium) with AI-generated pricing rationale for vendors |
| **Authentication** | Stateless JWT with HMAC-SHA256, 24h expiry, BCrypt password hashing, CORS whitelisting |
| **Payments** | Razorpay SDK integration with order lifecycle management and signature verification |

<br />

## Architecture

<p align="center">
  <img src="docs/diagrams/system-architecture.svg" alt="System Architecture" width="90%" />
</p>

```
React 18 SPA  ──►  Spring Boot 3.4  ──►  PostgreSQL
     │                   │
     └── REST + JWT ─────┼──► Ollama Runtime (llama3.2, gemma3)
                         │
              11 Controllers · 10 Services · 10 Repositories
```

<details>
<summary><b>AI Pipeline</b></summary>
<br />
<p align="center">
  <img src="docs/diagrams/ai-architecture.svg" alt="AI Pipeline" width="90%" />
</p>
</details>

<br />

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18, Vite, TailwindCSS, shadcn/ui, React Router, React Hook Form, Zod |
| **Backend** | Java 17, Spring Boot 3.4, Spring Security 6, Spring Data JPA, Hibernate |
| **AI/ML** | Ollama (self-hosted), llama3.2, gemma3, WebFlux WebClient (non-blocking) |
| **Database** | PostgreSQL 16 (prod), MySQL 8 (dev), HikariCP connection pooling |
| **Infrastructure** | Vercel (frontend CDN), Render (backend containers), Maven |

<br />

## Screenshots

<table>
<tr>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.47%E2%80%AFPM.png" alt="Home" /></td>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.50.23%E2%80%AFPM.png" alt="Products" /></td>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.46.35%E2%80%AFPM.png" alt="Cart" /></td>
</tr>
<tr>
<td align="center"><sub>Home</sub></td>
<td align="center"><sub>Product Discovery</sub></td>
<td align="center"><sub>Shopping Cart</sub></td>
</tr>
<tr>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.56.38%E2%80%AFPM.png" alt="Vendor" /></td>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.57.01%E2%80%AFPM.png" alt="Admin" /></td>
<td width="33%"><img src="Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.53.21%E2%80%AFPM.png" alt="Payment" /></td>
</tr>
<tr>
<td align="center"><sub>Vendor Dashboard</sub></td>
<td align="center"><sub>Admin Panel</sub></td>
<td align="center"><sub>Razorpay Checkout</sub></td>
</tr>
</table>

<br />

## Quick Start

```bash
# Backend (requires Java 17+)
cd Cranberry-Backend
./mvnw spring-boot:run

# Frontend (requires Node 18+)
cd Cranberry-Frontend
npm install && npm run dev

# AI inference (optional)
ollama pull llama3.2 && ollama pull gemma3
```

| Service | URL | Health Check |
|---------|-----|--------------|
| Frontend | `localhost:5173` | — |
| Backend | `localhost:8080` | `/api/health` |
| Ollama | `localhost:11434` | `/api/tags` |

> See [SETUP_GUIDE.md](Cranberry-Backend/SETUP_GUIDE.md) for database configuration and environment variables.

<br />

## Project Structure

```
├── Cranberry-Backend/          # Spring Boot application
│   ├── src/main/java/com/cranberry/
│   │   ├── controller/         # 11 REST controllers
│   │   ├── service/            # 10 business services
│   │   ├── repository/         # 10 JPA repositories
│   │   ├── model/              # 11 entity classes
│   │   ├── dto/                # 28 request/response DTOs
│   │   ├── security/           # JWT filter, auth config
│   │   └── ai/                 # AI module (search, chat, recommendations)
│   └── API_DOCUMENTATION.md
│
├── Cranberry-Frontend/         # React SPA
│   ├── src/
│   │   ├── components/         # UI components (shadcn/ui)
│   │   ├── pages/              # Route components (customer, vendor, admin)
│   │   ├── services/           # API client
│   │   └── context/            # Auth, Cart, Wishlist state
│   └── package.json
│
└── docs/diagrams/              # Architecture diagrams (SVG)
```

<br />

## Engineering Highlights

| Area | Implementation |
|------|----------------|
| **System Design** | Multi-tenant data model (11 entities), layered architecture with clean service boundaries, tenant isolation via vendor ID filtering |
| **Security** | Custom JWT filter chain, role-based endpoint access (Customer/Vendor/Admin), stateless session management |
| **AI Integration** | Non-blocking LLM calls via WebClient, intent classification pipeline, semantic search with composite scoring |
| **API Design** | RESTful contracts across 11 controllers, DTO pattern for request/response separation, Bean Validation |
| **Database** | JPA relationships (1:1, 1:N, M:N), transactional service methods, HikariCP pooling |

<br />

## License

[MIT](LICENSE)

<br />

<div align="center">

**[Aryan Gaikwad](https://github.com/aryangaikwad-966)**

</div>