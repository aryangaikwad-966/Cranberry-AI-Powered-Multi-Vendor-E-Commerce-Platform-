<div align="center">

# Cranberry

**AI-Powered Multi-Vendor E-Commerce Platform**

[Live Demo](https://cranberry-ai-multivendor-e-commerce.vercel.app) ·
[API](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health) ·
[Docs](Cranberry-Backend/API_DOCUMENTATION.md)

</div>

<br />

## What is this?

A production-deployed e-commerce marketplace with **self-hosted LLM inference** — semantic search, conversational AI, personalized recommendations, and pricing intelligence — all without external API costs.

| Metric | Value |
|--------|-------|
| **Users** | 3 roles (Customer, Vendor, Admin) with RBAC |
| **Backend** | 11 controllers, 10 services, 28 DTOs |
| **Database** | 9 tables with relational integrity |
| **AI** | 5 intent types, 3-axis relevance scoring |

<br />

## Technical Highlights

**System Design**
- Multi-tenant architecture with vendor isolation at service layer
- Stateless JWT authentication (HMAC-SHA256, 24h expiry)
- Layered monolith with clean microservice extraction boundaries

**AI/ML Integration**
- Self-hosted LLM (Ollama) — fixed cost vs. per-token API billing
- Intent classification pipeline routing to specialized handlers
- Semantic search with composite scoring: `0.5×keyword + 0.3×category + 0.2×price`
- Non-blocking inference via Spring WebFlux WebClient

**Backend Engineering**
- Spring Boot 3.4 with Spring Security 6 filter chain
- JPA entity relationships (1:1, 1:N, M:N) with cascade policies
- Transactional service methods with HikariCP connection pooling

**Full-Stack**
- React 18 SPA with role-aware route protection
- Form validation (Zod) mirroring server-side Bean Validation
- Razorpay payment integration with signature verification

<br />

## Architecture

<p align="center">
  <img src="docs/diagrams/system-architecture.svg" alt="Architecture" width="85%" />
</p>

<details>
<summary>View AI Pipeline</summary>
<p align="center">
  <img src="docs/diagrams/ai-architecture.svg" alt="AI Pipeline" width="85%" />
</p>
</details>

<br />

## Stack

| | |
|---|---|
| **Backend** | Java 17, Spring Boot 3.4, Spring Security 6, Spring Data JPA |
| **Frontend** | React 18, Vite, TailwindCSS, shadcn/ui |
| **AI** | Ollama, llama3.2, gemma3 |
| **Database** | PostgreSQL 16, MySQL 8 |
| **Infra** | Vercel, Render |

<br />

## Screenshots

<table>
<tr>
<td><img src="Cranberry-Frontend/public/images/screenshots/home.png" alt="Home" /></td>
<td><img src="Cranberry-Frontend/public/images/screenshots/products.png" alt="Products" /></td>
<td><img src="Cranberry-Frontend/public/images/screenshots/cart.png" alt="Cart" /></td>
</tr>
<tr>
<td><img src="Cranberry-Frontend/public/images/screenshots/vendor-dashboard.png" alt="Vendor" /></td>
<td><img src="Cranberry-Frontend/public/images/screenshots/admin-panel.png" alt="Admin" /></td>
<td><img src="Cranberry-Frontend/public/images/screenshots/payment.png" alt="Payment" /></td>
</tr>
</table>

<br />

## Run Locally

```bash
# Backend
cd Cranberry-Backend && ./mvnw spring-boot:run

# Frontend
cd Cranberry-Frontend && npm install && npm run dev

# AI (optional)
ollama pull llama3.2
```

> [Setup Guide](Cranberry-Backend/SETUP_GUIDE.md) · [API Docs](Cranberry-Backend/API_DOCUMENTATION.md) · [Database Schema](Cranberry-Backend/database_setup.sql)

<br />

## Project Structure

```
Cranberry-Backend/
├── controller/    11 REST endpoints
├── service/       10 business logic services
├── repository/    10 JPA repositories
├── model/         9 entity classes
├── dto/           28 request/response objects
├── security/      JWT filter, CORS config
└── ai/            Search, chat, recommendations

Cranberry-Frontend/
├── components/    shadcn/ui components
├── pages/         Customer, Vendor, Admin views
├── context/       Auth, Cart, Wishlist state
└── services/      API client
```

<br />

---

<div align="center">

[Aryan Gaikwad](https://github.com/aryangaikwad-966) · [MIT License](LICENSE)

</div>