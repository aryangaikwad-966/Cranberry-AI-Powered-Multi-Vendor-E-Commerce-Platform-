<div align="center">

# 🍒 Cranberry

### AI-Powered Multi-Vendor E-Commerce Platform

A full-stack marketplace platform with integrated LLM capabilities — built for intelligent product discovery, vendor analytics, and autonomous customer support.

[![Live Demo](https://img.shields.io/badge/Live_Demo-cranberry.vercel.app-0066FF?style=for-the-badge&logo=vercel)](https://cranberry-ai-multivendor-e-commerce.vercel.app)
[![API](https://img.shields.io/badge/REST_API-Online-00C853?style=for-the-badge&logo=spring)](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 🚀 Project Overview

**Cranberry** is a production-grade, multi-vendor e-commerce platform that integrates large language models (LLMs) directly into the marketplace experience. The system supports three distinct user roles — **Customer**, **Vendor**, and **Admin** — each with dedicated interfaces, capabilities, and access-controlled API surfaces.

The platform solves a core problem in marketplace design: **how to deliver AI-driven product discovery, pricing intelligence, and conversational support without depending on expensive third-party AI APIs**. Cranberry achieves this by integrating [Ollama](https://ollama.com) as a self-hosted LLM runtime, enabling semantic search, contextual recommendations, dynamic pricing suggestions, and a fully autonomous AI chatbot — all running on local infrastructure with zero per-request cost.

> **Engineering philosophy:** Build a system where AI is not a bolt-on feature, but a deeply integrated layer that enhances every user interaction — from search to checkout to vendor analytics.

---

## 🧠 Problem Statement

Modern multi-vendor marketplaces face a fundamental tension: **customers expect intelligent, personalized experiences**, but the AI infrastructure required to deliver them is prohibitively expensive for most platforms.

| Challenge | Impact |
|-----------|--------|
| Keyword-based search returns irrelevant results | Poor product discovery → lost conversions |
| No pricing intelligence for vendors | Suboptimal pricing → reduced competitiveness |
| Customer support requires human agents at scale | High operational cost → slow response times |
| Recommendation engines require massive datasets | Cold-start problem → generic suggestions |

**Cranberry addresses these challenges** by embedding a self-hosted LLM (via Ollama) into the platform's service layer, enabling:

- **Semantic search** that understands natural language intent, not just keyword matches
- **AI-powered pricing suggestions** derived from real-time market data analysis  
- **Autonomous chatbot** capable of product search, order tracking, and contextual Q&A
- **Personalized recommendations** based on purchase history and browsing behavior

---

## ✨ Key Features

### Customer Features
- Natural language product search with semantic understanding
- AI chatbot for product discovery, order tracking, and support
- Personalized product recommendations based on purchase history
- Wishlist and persistent cart management
- Razorpay-integrated secure checkout with order lifecycle tracking
- Responsive, mobile-first shopping interface

### Vendor Features
- Dedicated vendor dashboard with real-time sales analytics
- AI-powered price suggestion engine (market analysis + competitive positioning)
- Full product catalog management (CRUD with image support)
- Order fulfillment workflow with status management
- Revenue and performance metrics

### Admin Features
- Platform-wide analytics dashboard
- Vendor approval and management workflows
- Product moderation and category management
- User management with role-based controls
- AI-generated order insights and business intelligence

### AI Features
- **Conversational AI** — Multi-turn chatbot with intent detection (product search, order tracking, deals, general queries)
- **Semantic Search** — LLM-enhanced query understanding with relevance scoring
- **Recommendation Engine** — Collaborative filtering with category-based personalization
- **Price Intelligence** — Market analysis with AI-generated pricing insights
- **Order Analytics** — AI-summarized business intelligence for admin dashboards

---

## 🏗️ System Architecture

Cranberry follows a **layered monolithic architecture** with clear separation of concerns. The backend enforces a strict `Controller → Service → Repository → Database` pattern, with cross-cutting concerns (authentication, CORS, request validation) handled at the filter level.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   React 18 SPA (Vite)  •  TailwindCSS  •  Radix UI / shadcn    │
│   Customer UI  │  Vendor Dashboard  │  Admin Panel              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│   CORS Filter  →  JWT Authentication Filter  →  Rate Limiting   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │  Controllers  │  │   Services   │  │   AI Module        │     │
│  │              │  │              │  │                    │     │
│  │ Auth         │  │ AuthService  │  │ AiService          │     │
│  │ Product      │──│ Product      │  │ AiProviderClient   │     │
│  │ Order        │  │ Order        │  │ RecommendationSvc  │     │
│  │ Cart         │  │ Cart         │  │ OrderInsightsSvc   │     │
│  │ Payment      │  │ Payment      │  │                    │     │
│  │ Vendor       │  │ Vendor       │  └────────┬───────────┘     │
│  │ Admin        │  │ Admin        │           │                 │
│  │ AI           │  │ Wishlist     │           │                 │
│  └──────────────┘  └──────┬───────┘           │                 │
│                           │                   │                 │
│  ┌────────────────────────▼───────┐  ┌────────▼───────────┐     │
│  │       Repository Layer         │  │   Ollama Runtime   │     │
│  │  Spring Data JPA / Hibernate   │  │  llama3.2 / gemma3 │     │
│  └────────────────┬───────────────┘  └────────────────────┘     │
└───────────────────┼─────────────────────────────────────────────┘
                    │
     ┌──────────────▼──────────────┐
     │     PostgreSQL / MySQL      │
     │  Users │ Products │ Orders  │
     │  Vendors │ Payments │ Cart  │
     └─────────────────────────────┘
```

### JWT Authentication Flow

```
Client                    JwtFilter                  JwtUtil                  Controller
  │                          │                         │                         │
  │── POST /api/auth/login ──▶                         │                         │
  │                          │                         │                         │
  │◀── JWT {email, userId, role, exp} ─────────────────│                         │
  │                          │                         │                         │
  │── GET /api/orders ───────▶                         │                         │
  │   Authorization: Bearer  │── extractEmail(token) ──▶                         │
  │                          │── extractRole(token) ───▶                         │
  │                          │◀── claims ──────────────│                         │
  │                          │── isTokenValid() ───────▶                         │
  │                          │◀── true ────────────────│                         │
  │                          │── setAuthentication ────────────────▶             │
  │                          │                         │        Process Request  │
  │◀──────────────── 200 OK + Response ────────────────────────────│             │
```

> *📌 Architecture diagram assets can be placed in the repository root as `architecture-diagram.svg`.*

---

## 🤖 AI Architecture

The AI subsystem is implemented as a dedicated module (`com.cranberry.marketplace.ai`) with four core components:

### Component Overview

| Component | Class | Responsibility |
|-----------|-------|----------------|
| **LLM Client** | `AiProviderClient` | HTTP interface to Ollama runtime; handles prompt construction, response parsing, and fallback logic |
| **AI Service** | `AiService` | Core business logic for chat, search, recommendations, and pricing — orchestrates LLM calls with database queries |
| **Recommendation Engine** | `RecommendationService` | Collaborative filtering and category-based personalization |
| **Order Insights** | `OrderInsightsService` | Aggregates order data and generates AI-summarized business intelligence |

### LLM Integration (Ollama)

Cranberry uses **Ollama** as a self-hosted LLM runtime, supporting `llama3.2` and `gemma3` models. The `AiProviderClient` communicates with Ollama via its REST API (`localhost:11434`) using Spring WebFlux's `WebClient`.

```
User Query → Intent Detection → Route to Handler
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            Product Search    Order Tracking    General Query
                    │               │               │
            ┌───────▼──────┐  ┌─────▼─────┐  ┌─────▼──────┐
            │ Extract:     │  │ Lookup     │  │ Forward to │
            │ - Keywords   │  │ orders by  │  │ LLM with   │
            │ - Price range│  │ user ID    │  │ marketplace│
            │ - Category   │  │            │  │ context    │
            └───────┬──────┘  └─────┬─────┘  └─────┬──────┘
                    ▼               ▼               ▼
            DB Query +        Format order      LLM Response
            Relevance         status info       Generation
            Scoring
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                            Structured Response
                            to Client
```

### Semantic Search Pipeline

1. **Query Analysis** — Extract keywords, price constraints (`min`/`max`), and category signals from natural language input
2. **Database Retrieval** — Fetch candidate products using extracted filters via JPA queries
3. **Relevance Scoring** — Score each product against the original query using token overlap, category matching, and price proximity
4. **Result Ranking** — Sort by composite relevance score and return top-N results with AI-generated search insights

### Recommendation Logic

The recommendation engine supports two modes:

- **Similar Products** (`productId` → related items) — Finds products in the same category, ranks by price proximity and name similarity, excludes the source product
- **Personalized Recommendations** (`userId` → suggested items) — Analyzes user's order history to identify preferred categories, retrieves unseen products weighted by purchase frequency, applies diversity constraints to avoid echo-chamber recommendations

### AI Price Suggestion Engine

For vendor pricing decisions, the system:

1. Retrieves all products in the same category from the database
2. Computes market statistics (average price, price range, standard deviation)
3. Determines competitive positioning (budget / mid-range / premium)
4. Sends market context to the LLM for natural language pricing insights
5. Returns structured response with recommended price, confidence score, and strategic rationale

---

## ⚙️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2 | Component-based SPA framework |
| **Build Tool** | Vite | 7.3.1 | Fast HMR and optimized production builds |
| **Styling** | TailwindCSS | 3.4.17 | Utility-first CSS framework |
| **UI Components** | Radix UI + shadcn/ui | Latest | Accessible, headless component primitives |
| **Routing** | React Router | 7.5.1 | Client-side navigation |
| **Forms** | React Hook Form + Zod | 7.56 / 3.24 | Type-safe form validation |
| **Backend** | Spring Boot | 3.4.2 | Enterprise Java application framework |
| **Language** | Java | 17 | Backend runtime |
| **Security** | Spring Security + JWT | 6.x / jjwt 0.11.5 | Authentication and authorization |
| **ORM** | Spring Data JPA / Hibernate | 3.x | Database abstraction and query generation |
| **Database** | PostgreSQL (prod) / MySQL (dev) | 16 / 8.0 | Relational data persistence |
| **AI Runtime** | Ollama | Latest | Self-hosted LLM inference engine |
| **AI Models** | llama3.2, gemma3 | Latest | Language models for chat, search, recommendations |
| **HTTP Client** | Spring WebFlux (WebClient) | 6.x | Non-blocking HTTP for Ollama API calls |
| **Payments** | Razorpay SDK | 1.4.7 | Payment gateway integration |
| **Validation** | Spring Validation (Hibernate Validator) | 3.x | Request payload validation |
| **Deployment** | Vercel (FE) + Render (BE) | — | Cloud hosting infrastructure |

---

## 🔐 Security & Authentication

### Authentication Architecture

- **Stateless JWT authentication** — No server-side session storage; all auth state is encoded in the token
- **Token structure** — JWT payload includes `email`, `userId`, and `role` claims with HMAC-SHA256 signing
- **Token lifecycle** — 24-hour expiration with client-side token refresh
- **Password security** — BCrypt hashing with Spring Security's `BCryptPasswordEncoder`

### Role-Based Access Control (RBAC)

| Resource Pattern | Customer | Vendor | Admin | Public |
|-----------------|----------|--------|-------|--------|
| `GET /api/products/**` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/products/**` | ❌ | ✅ | ✅ | ❌ |
| `/api/cart/**`, `/api/wishlist/**` | ✅ | ✅ | ✅ | ❌ |
| `/api/orders/**` | ✅ | ✅ | ✅ | ❌ |
| `/api/vendor/dashboard` | ❌ | ✅ | ✅ | ❌ |
| `/api/admin/**` | ❌ | ❌ | ✅ | ❌ |
| `/api/ai/admin/**` | ❌ | ❌ | ✅ | ❌ |
| `/api/ai/chat`, `/api/ai/search` | ✅ | ✅ | ✅ | ✅ |

### Secure API Design Principles

- **CORS policy** — Explicitly configured allowed origins, methods, and headers
- **Filter chain** — `CorsFilter → JwtFilter → UsernamePasswordAuthenticationFilter`
- **Input validation** — Bean validation (`@Valid`) on all request DTOs
- **SQL injection prevention** — Parameterized queries via JPA/Hibernate
- **Stateless sessions** — `SessionCreationPolicy.STATELESS` enforced globally
- **Environment-based secrets** — Database credentials, API keys loaded from environment variables (dotenv in dev)

---

## 📊 Scalability & Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **Spring Boot 3.4** | Mature, battle-tested framework with excellent ecosystem support. Provides out-of-the-box dependency injection, security, data access, and web infrastructure. Suitable for horizontal scaling behind a load balancer. |
| **Stateless JWT** | Eliminates server-side session storage entirely. Any instance can validate any request — critical for horizontal scaling. No sticky sessions or shared session stores required. |
| **Multi-vendor data model** | First-class `Vendor` entity with dedicated product, order, and analytics APIs. Designed for multi-tenancy from day one — vendor data isolation enforced at the service layer. |
| **Self-hosted LLM (Ollama)** | Zero per-request AI cost. No vendor lock-in. Full control over model selection, prompt engineering, and inference latency. Enables AI features that would be cost-prohibitive with OpenAI/Anthropic APIs at scale. |
| **Layered architecture** | Strict `Controller → Service → Repository` separation enables independent testing, clear ownership boundaries, and straightforward refactoring to microservices. |
| **PostgreSQL + MySQL dual support** | PostgreSQL for production (ACID compliance, advanced indexing), MySQL for lightweight local development. Seamless switching via Spring profiles. |
| **React + Vite** | Fast development iteration with HMR. Tree-shaking and code-splitting for optimized production bundles. Component-based architecture maps cleanly to the three user roles. |

---

## 🚀 Future Improvements

These enhancements reflect production-readiness concerns for scaling the platform:

| Area | Improvement | Impact |
|------|-------------|--------|
| **Caching** | Redis layer for product catalog, search results, and session-adjacent data | Reduce DB load by ~60% on read-heavy endpoints |
| **Event-Driven Processing** | Kafka/RabbitMQ for order state transitions, payment confirmations, inventory updates | Decouple order pipeline; enable async processing and retry semantics |
| **Microservices Decomposition** | Extract AI, Payment, and Order modules into independent services | Independent scaling, deployment, and failure isolation |
| **AI Personalization** | Vector embeddings (pgvector) for product descriptions; user behavior embeddings for collaborative filtering | Move from keyword-based to true semantic similarity |
| **Observability** | Structured logging (ELK), distributed tracing (OpenTelemetry), metrics (Prometheus + Grafana) | Production debugging, SLA monitoring, performance profiling |
| **Search Infrastructure** | Elasticsearch/OpenSearch for full-text product search with faceting | Sub-100ms search latency at scale with relevance tuning |
| **CI/CD Pipeline** | GitHub Actions with automated testing, linting, Docker builds, and staged deployments | Reduce deployment risk; enforce code quality gates |
| **Rate Limiting & API Gateway** | Spring Cloud Gateway or Kong for centralized rate limiting, API versioning, and request routing | Protect against abuse; enable API evolution without breaking clients |

---

## 🧪 Local Setup

### Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Java JDK | 17+ | ✅ |
| Node.js | 18+ | ✅ |
| MySQL | 8.0+ | ✅ (dev) |
| Ollama | Latest | Optional (AI features) |

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/aryangaikwad-966/Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-.git
cd Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-

# 2. Configure environment
cd Cranberry-Backend
cp .env.example .env
# Edit .env: set DB_URL, DB_USERNAME, DB_PASSWORD, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# 3. Start the backend server (port 8080)
./mvnw spring-boot:run
```

### Frontend Setup

```bash
# 1. Install dependencies
cd Cranberry-Frontend
npm install

# 2. Start the dev server (port 5173)
npm run dev
```

### AI Services Setup (Optional)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull the required models
ollama pull llama3.2
ollama pull gemma3

# 3. Verify Ollama is running
curl http://localhost:11434/api/tags
```

### Verify Installation

| Service | URL | Expected |
|---------|-----|----------|
| Frontend | `http://localhost:5173` | React application loads |
| Backend API | `http://localhost:8080/api/health` | `{"status": "UP"}` |
| AI Health | `http://localhost:8080/api/ai/health` | `{"ollama_available": true}` |

---

## 📸 Screenshots

<div align="center">

| Home Page | Product Discovery | Shopping Cart |
|-----------|------------------|---------------|
| ![Home](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.47%E2%80%AFPM.png) | ![Products](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.50.23%E2%80%AFPM.png) | ![Cart](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.46.35%E2%80%AFPM.png) |

| Product Detail | Secure Checkout | Razorpay Payment |
|----------------|----------------|------------------|
| ![Detail](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.04%E2%80%AFPM.png) | ![Checkout](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.51.37%E2%80%AFPM.png) | ![Payment](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.53.21%E2%80%AFPM.png) |

| Vendor Dashboard | Admin Panel |
|------------------|-------------|
| ![Vendor](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.56.38%E2%80%AFPM.png) | ![Admin](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.57.01%E2%80%AFPM.png) |

</div>

---

## 📈 Learning Outcomes

This project demonstrates competency across the following engineering domains:

| Domain | Skills Demonstrated |
|--------|-------------------|
| **System Design** | Multi-tenant data modeling, role-based access control architecture, layered service decomposition, API contract design |
| **Backend Engineering** | Spring Boot application architecture, JPA entity relationships, transactional service logic, custom security filter chains |
| **AI/ML Integration** | LLM prompt engineering, semantic search pipeline design, recommendation algorithm implementation, self-hosted inference infrastructure |
| **Security Engineering** | JWT-based stateless authentication, RBAC implementation, CORS policy configuration, input validation and injection prevention |
| **Frontend Engineering** | React component architecture, client-side routing, state management, form validation with Zod, responsive design with TailwindCSS |
| **Full-Stack Coordination** | End-to-end feature delivery across frontend, backend, database, and AI layers; API design and integration; deployment pipeline to Vercel + Render |
| **Payment Systems** | Razorpay integration with order lifecycle management, payment verification, and idempotent transaction handling |

---

## 🎯 Portfolio Positioning

Cranberry is a **full-stack, AI-integrated marketplace** built to production-grade standards. It demonstrates the ability to:

- **Design and implement complex backend systems** with authentication, authorization, and multi-entity data models
- **Integrate AI/ML capabilities** into a real application — not as a demo, but as functional features serving real user workflows
- **Make deliberate engineering trade-offs** (self-hosted LLM vs. API, monolith vs. microservices, JWT vs. sessions) and articulate the reasoning behind them
- **Ship end-to-end** — from database schema to RESTful APIs to responsive frontend to cloud deployment

This project is representative of the scope, complexity, and technical depth expected in **backend engineering**, **AI engineering**, and **full-stack software engineering** roles at product-driven companies.

---

<div align="center">

**Built by [Aryan Gaikwad](https://github.com/aryangaikwad-966)**

[![GitHub](https://img.shields.io/badge/GitHub-aryangaikwad--966-181717?style=flat-square&logo=github)](https://github.com/aryangaikwad-966)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>