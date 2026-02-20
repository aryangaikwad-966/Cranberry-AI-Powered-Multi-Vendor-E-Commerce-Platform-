<div align="center">

# Cranberry

**AI-Powered Multi-Vendor E-Commerce Platform**

[![Live Demo](https://img.shields.io/badge/Live-cranberry.vercel.app-0066FF?style=for-the-badge&logo=vercel)](https://cranberry-ai-multivendor-e-commerce.vercel.app)
[![API](https://img.shields.io/badge/API-Online-00C853?style=for-the-badge&logo=spring)](https://cranberry-ai-powered-multi-vendor-e.onrender.com/api/health)
[![Java 17](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot 3.4.2](https://img.shields.io/badge/Spring_Boot-3.4.2-6DB33F?style=flat-square&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 🚀 Project Overview

Cranberry is a full-stack multi-vendor e-commerce platform with a natively integrated AI layer. It supports three user roles — **Customer**, **Vendor**, and **Admin** — each backed by dedicated APIs, dashboards, and access-controlled workflows.

The platform embeds a self-hosted LLM (Ollama) directly into the service layer, enabling semantic product search, conversational customer support, AI-driven pricing intelligence, and personalized recommendations — without reliance on external AI APIs or per-request billing.

Built with Spring Boot 3.4, React 18, and a layered monolithic architecture designed for clean decomposition into microservices.

---

## 🧠 Problem Statement

Multi-vendor marketplaces face compounding technical challenges as they scale:

| Challenge | Technical Impact |
|-----------|-----------------|
| Keyword-only search fails on natural language queries | Low search relevance → poor conversion rates |
| No pricing intelligence for independent vendors | Suboptimal pricing → competitive disadvantage |
| Customer support doesn't scale without automation | Linear cost growth per user → unsustainable ops |
| Recommendation engines require massive training data | Cold-start problem → generic, low-value suggestions |
| AI API costs scale linearly with request volume | Per-token billing → unpredictable infrastructure cost |

**Cranberry's engineering response:**

- Self-hosted LLM inference (Ollama) eliminates per-request AI cost
- Intent-detection pipeline routes queries to specialized handlers (search, tracking, deals, general)
- Relevance scoring combines token overlap, category matching, and price proximity — no external ML pipeline required
- Pricing engine aggregates real-time market data and generates LLM-powered competitive analysis
- Stateless JWT auth and layered architecture support horizontal scaling from day one

---

## ✨ Key Features

### Customer Features
- Semantic product search with natural language understanding
- AI chatbot — product discovery, order tracking, deals, general Q&A
- Personalized recommendations based on purchase history and category affinity
- Persistent cart and wishlist management
- Razorpay-integrated checkout with full order lifecycle tracking
- Mobile-responsive interface

### Vendor Features
- Real-time sales analytics dashboard
- AI-powered price suggestion engine with market positioning analysis
- Product catalog CRUD with image management
- Order fulfillment workflow with status transitions
- Revenue and performance metrics

### Admin Features
- Platform-wide analytics and business intelligence
- Vendor approval and moderation pipeline
- Product and category management
- User management with role-based controls
- AI-generated order insights

### AI Features
- **Conversational AI** — Multi-turn chatbot with intent classification (5 intent types)
- **Semantic Search** — Query decomposition → keyword/price/category extraction → relevance-scored results
- **Recommendation Engine** — Category-weighted collaborative filtering with diversity constraints
- **Price Intelligence** — Market statistics + LLM-generated competitive pricing rationale
- **Order Analytics** — Aggregated order data with AI-summarized business insights

---

## 🏗️ System Architecture

Cranberry uses a **layered monolithic architecture** with strict separation of concerns:

```
Controller Layer  →  Service Layer  →  Repository Layer  →  Database
     (REST)          (Business Logic)    (Data Access)       (MySQL / PostgreSQL)
```

Cross-cutting concerns — JWT authentication, CORS enforcement, and request validation — are handled by dedicated filters in the Spring Security filter chain, executed before any controller logic.

The AI module operates as an independent vertical within the application layer. It has its own controller (`AiController`), service classes (`AiService`, `OrderInsightsService`, `RecommendationService`), and a dedicated HTTP client (`AiProviderClient`) that interfaces with the Ollama runtime.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│    Customer SPA        Vendor Dashboard        Admin Panel          │
│    (React 18 + Vite + TailwindCSS + Radix UI / shadcn)             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS / REST
┌──────────────────────────────▼──────────────────────────────────────┐
│                       SECURITY FILTER CHAIN                         │
│                                                                     │
│   CorsFilter  →  JwtFilter  →  UsernamePasswordAuthFilter          │
│   (Origin validation)  (Token extraction,    (Spring Security       │
│                         claim verification,   authentication        │
│                         role injection)        context setup)        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                      APPLICATION LAYER                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     CONTROLLERS (10)                         │    │
│  │  Auth · Product · Order · Cart · Wishlist · Payment          │    │
│  │  Vendor · Admin · User · AI                                  │    │
│  └───────────────────────────┬─────────────────────────────────┘    │
│                              │                                      │
│  ┌───────────────────────────▼──────────┐  ┌────────────────────┐  │
│  │          SERVICE LAYER (10)          │  │    AI MODULE        │  │
│  │                                      │  │                    │  │
│  │  AuthService    ProductService       │  │  AiService         │  │
│  │  OrderService   CartService          │  │  AiProviderClient  │  │
│  │  PaymentService VendorService        │  │  RecommendationSvc │  │
│  │  AdminService   WishlistService      │  │  OrderInsightsSvc  │  │
│  └───────────────────────────┬──────────┘  └─────────┬──────────┘  │
│                              │                       │              │
│  ┌───────────────────────────▼───────┐  ┌────────────▼──────────┐  │
│  │      REPOSITORY LAYER (10)        │  │   OLLAMA RUNTIME      │  │
│  │    Spring Data JPA / Hibernate    │  │   llama3.2 · gemma3   │  │
│  └───────────────────┬───────────────┘  │   localhost:11434     │  │
│                      │                  └───────────────────────┘  │
└──────────────────────┼────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    PostgreSQL (prod)        │
        │    MySQL 8.0 (dev)          │
        │                             │
        │  users · vendors · products │
        │  orders · order_items       │
        │  payments · carts           │
        │  cart_items · wishlists     │
        │  wishlist_items             │
        └─────────────────────────────┘
```

`[INSERT SYSTEM ARCHITECTURE DIAGRAM HERE]`

### JWT Authentication Request Flow

```
Client                      JwtFilter                   JwtUtil                 Controller
  │                            │                           │                        │
  │── POST /api/auth/login ───▶│                           │                        │
  │                            │                           │                        │
  │◀── JWT {email, userId, ────│                           │                        │
  │     role, exp: 24h,        │                           │                        │
  │     alg: HS256}            │                           │                        │
  │                            │                           │                        │
  │── GET /api/orders ─────────▶                           │                        │
  │   [Authorization: Bearer]  │── extractEmail(token) ───▶│                        │
  │                            │── extractRole(token) ────▶│                        │
  │                            │── isTokenValid(token) ───▶│                        │
  │                            │◀── validated claims ──────│                        │
  │                            │                           │                        │
  │                            │── SecurityContext.set(auth)──────────▶              │
  │                            │                           │     Process Request     │
  │◀────────────────── 200 OK + JSON Response ─────────────────────────│            │
```

---

## 🤖 AI Architecture

The AI subsystem is implemented as a dedicated module at `com.cranberry.marketplace.ai` with four components that integrate directly into the business logic layer.

### Component Map

| Component | Class | Lines | Responsibility |
|-----------|-------|-------|----------------|
| LLM Client | `AiProviderClient` | 350+ | HTTP interface to Ollama. Prompt construction, response parsing, model fallback (llama3.2 → gemma3), health checking |
| Core AI Service | `AiService` | 757 | Intent detection, semantic search, recommendations, price suggestions. Orchestrates LLM calls with database queries |
| Recommendation Engine | `RecommendationService` | 150+ | Category-weighted collaborative filtering, purchase history analysis, diversity constraints |
| Order Intelligence | `OrderInsightsService` | 600+ | Aggregates order metrics, generates AI-summarized business intelligence for admin dashboards |

### Intent Detection & Routing Pipeline

Every chatbot message passes through a multi-stage pipeline:

```
User Message
     │
     ▼
┌─────────────────┐
│ Intent Detection │ ← Keyword matching + LLM classification
│ (5 intent types) │
└────────┬────────┘
         │
    ┌────┼────────────┬──────────────┬──────────────┐
    ▼    ▼            ▼              ▼              ▼
 PRODUCT  ORDER      DEALS        HELP          GENERAL
 SEARCH   TRACKING   QUERY        REQUEST       QUERY
    │       │          │             │              │
    ▼       ▼          ▼             ▼              ▼
 Extract   Lookup    Fetch top     Return        Forward to
 keywords, orders    discounted    structured    LLM with
 price     by user   products      help menu     marketplace
 range,    ID from   from DB                     context
 category  DB                                    prompt
    │       │          │             │              │
    ▼       ▼          ▼             ▼              ▼
 DB Query  Format    Format        Static        LLM
 + Score   order     deal          response      inference
 + Rank    status    listings                    + parse
    │       │          │             │              │
    └───────┴──────────┴─────────────┴──────────────┘
                       │
                       ▼
              Structured JSON Response
              {message, products[], suggestions[]}
```

### Semantic Search Pipeline

1. **Query Decomposition** — Extract keywords, min/max price constraints, and category signals from natural language input using regex + heuristics
2. **Candidate Retrieval** — JPA queries against product table using extracted filters
3. **Relevance Scoring** — Each product scored on three axes:
   - Token overlap between query terms and product `name + description` (weight: 0.5)
   - Category match (weight: 0.3)
   - Price proximity to query constraints (weight: 0.2)
4. **Ranking & Response** — Sort by composite score, return top-N results with LLM-generated search insight

### Recommendation Logic

Two operational modes with distinct algorithms:

| Mode | Input | Algorithm |
|------|-------|-----------|
| **Similar Products** | `productId` | Retrieve same-category products → rank by price proximity + name token similarity → exclude source product |
| **Personalized** | `userId` | Analyze order history → extract category frequency distribution → retrieve unseen products weighted by purchase frequency → apply diversity cap per category |

### AI Price Suggestion Engine

Vendor pricing flow:

```
Vendor submits: {productName, category, intendedPrice}
     │
     ▼
Query all products in same category
     │
     ▼
Compute: avgPrice, priceRange, stdDev, percentile position
     │
     ▼
Determine market position: BUDGET | MID_RANGE | PREMIUM
     │
     ▼
Construct prompt with market context → Send to Ollama
     │
     ▼
Return: {recommendedPrice, confidence, marketPosition, aiInsights}
```

### Integration with Business Logic

The AI module is **not** a standalone microservice — it is a first-class citizen within the service layer. `AiService` directly depends on `ProductRepository` and `OrderRepository` via constructor injection, allowing it to:

- Query live product data for search and recommendations
- Access order history for personalization
- Compute real-time market statistics for pricing
- Generate business intelligence from aggregated order data

This tight integration avoids the latency and complexity of inter-service communication while maintaining clean separation through the dedicated `ai` package boundary.

---

## ⚙️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2 | Component-based SPA |
| **Build** | Vite | 7.3.1 | Dev server with HMR, optimized production builds |
| **Styling** | TailwindCSS | 3.4.17 | Utility-first CSS |
| **UI Library** | Radix UI + shadcn/ui | Latest | Accessible, headless component primitives |
| **Routing** | React Router | 7.5.1 | Client-side navigation |
| **Forms** | React Hook Form + Zod | 7.56 / 3.24 | Declarative form state + schema validation |
| **Backend** | Spring Boot | 3.4.2 | Application framework |
| **Language** | Java | 17 | Backend runtime |
| **Security** | Spring Security + JWT (jjwt) | 6.x / 0.11.5 | Authentication, authorization, filter chain |
| **ORM** | Spring Data JPA / Hibernate | 3.x | Object-relational mapping, query generation |
| **Database** | PostgreSQL (prod) / MySQL (dev) | 16 / 8.0 | Relational data store |
| **AI Runtime** | Ollama | Latest | Self-hosted LLM inference |
| **AI Models** | llama3.2, gemma3 | Latest | Chat, search, recommendations, pricing |
| **AI HTTP Client** | Spring WebFlux (WebClient) | 6.x | Non-blocking HTTP for Ollama API |
| **Payments** | Razorpay Java SDK | 1.4.7 | Payment gateway |
| **Validation** | Hibernate Validator | 8.x | Request DTO validation |
| **Frontend Hosting** | Vercel | — | CDN + edge deployment |
| **Backend Hosting** | Render | — | Managed container deployment |

---

## 🔐 Security & Authentication

### JWT Lifecycle

1. **Login** — Client sends credentials to `POST /api/auth/login`
2. **Token Generation** — `JwtUtil.generateToken()` creates a signed JWT containing `email`, `userId`, and `role` claims. Algorithm: HMAC-SHA256. Expiry: 24 hours
3. **Subsequent Requests** — Client includes token in `Authorization: Bearer <token>` header
4. **Filter Validation** — `JwtFilter` extracts token, validates signature and expiry via `JwtUtil`, injects authenticated principal into Spring SecurityContext
5. **Controller Access** — Controllers receive pre-authenticated requests; role checks enforced at both filter and controller levels

### Role-Based Access Control

| Endpoint Pattern | Public | Customer | Vendor | Admin |
|-----------------|--------|----------|--------|-------|
| `POST /api/auth/**` | ✅ | ✅ | ✅ | ✅ |
| `GET /api/products/**` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/ai/chat`, `/search` | ✅ | ✅ | ✅ | ✅ |
| `POST/PUT/DELETE /api/products/**` | ❌ | ❌ | ✅ | ✅ |
| `/api/cart/**`, `/api/wishlist/**` | ❌ | ✅ | ✅ | ✅ |
| `/api/orders/**`, `/api/payments/**` | ❌ | ✅ | ✅ | ✅ |
| `/api/vendor/dashboard`, `/orders` | ❌ | ❌ | ✅ | ✅ |
| `/api/ai/price-suggest` | ❌ | ❌ | ✅ | ✅ |
| `/api/admin/**` | ❌ | ❌ | ❌ | ✅ |
| `/api/ai/admin/**` | ❌ | ❌ | ❌ | ✅ |

### Secure API Design

- **Stateless sessions** — `SessionCreationPolicy.STATELESS` enforced globally. No server-side session storage.
- **CORS** — Explicit origin, method, and header whitelisting via `CorsConfig`
- **Password hashing** — BCrypt via Spring Security's `BCryptPasswordEncoder`
- **Input validation** — Bean Validation (`@Valid`) on all request DTOs with Zod schema validation on the client
- **SQL injection prevention** — Parameterized queries enforced through JPA/Hibernate
- **Separation of concerns** — Security logic isolated in `security/` and `config/` packages; controllers contain zero auth logic

---

## 📊 Scalability & Engineering Decisions

| Decision | Rationale |
|----------|-----------|
| **Spring Boot 3.4** | Production-proven framework. Auto-configuration reduces boilerplate. Native support for JPA, Security, Validation, WebFlux. Large ecosystem for future integration (Spring Cloud, Actuator, etc.) |
| **Stateless JWT** | Eliminates server-side session storage. Any backend instance can validate any request independently — prerequisite for horizontal scaling behind a load balancer. No sticky sessions or Redis session replication required. |
| **Layered architecture** | `Controller → Service → Repository` enforces single-responsibility at each layer. Services are independently testable. Repository interfaces are swappable (JPA today, custom query implementations tomorrow). Clean seam for future microservice extraction. |
| **Multi-vendor data model** | `Vendor` is a first-class entity with its own product ownership, order visibility, and analytics scope. Tenant isolation enforced at the service layer via vendor ID filtering. Designed for multi-tenancy from the initial schema. |
| **Self-hosted LLM** | Ollama eliminates per-request API cost (OpenAI/Anthropic charges $0.01–$0.06/1K tokens). Full control over model selection, prompt templates, and inference latency. No vendor lock-in. AI features become a fixed infrastructure cost, not a variable per-user cost. |
| **PostgreSQL + MySQL dual support** | PostgreSQL for production (advanced indexing, JSONB, full ACID). MySQL for fast local development. Seamless switching via Spring profiles (`application-dev.yml` / `application-prod.yml`). |
| **React + Vite** | Vite provides sub-second HMR during development and tree-shaken production bundles. React's component model maps cleanly to the three-role UI (Customer / Vendor / Admin pages as isolated route groups). |
| **WebClient (non-blocking)** | Ollama API calls use Spring WebFlux's `WebClient` instead of `RestTemplate`. Non-blocking I/O prevents LLM inference latency from consuming servlet threads. |

---

## 🚀 Future Engineering Improvements

| Priority | Area | Implementation | Impact |
|----------|------|----------------|--------|
| **P0** | Caching | Redis cache for product catalog, search results, vendor analytics. Cache invalidation on product write. | ~60% reduction in DB read load |
| **P0** | CI/CD | GitHub Actions pipeline: lint → test → build → Docker image → staged deployment | Automated quality gates, zero-downtime deploys |
| **P1** | Event-Driven Processing | Kafka topics for `order.created`, `payment.verified`, `order.shipped`. Consumers handle inventory updates, notification dispatch, analytics ingestion | Decoupled order pipeline, async processing, retry semantics |
| **P1** | Microservices Decomposition | Extract three bounded contexts: `ai-service`, `payment-service`, `order-service`. Communicate via REST + Kafka events | Independent scaling, isolated failure domains, team-parallel development |
| **P1** | Containerization | Dockerfile per service, `docker-compose.yml` for local stack, Kubernetes manifests for production | Environment parity, reproducible builds, container orchestration readiness |
| **P2** | Vector Search | pgvector extension for product description embeddings. Replace keyword-based scoring with cosine similarity on dense vectors | True semantic similarity, ~3x relevance improvement on ambiguous queries |
| **P2** | Observability | Structured logging (ELK stack), distributed tracing (OpenTelemetry), metrics (Prometheus + Grafana) | Production debugging, SLA monitoring, performance profiling |
| **P2** | AI Personalization | User behavior embeddings (click, cart, purchase signals). Real-time feature store for recommendation model input | Context-aware recommendations, reduced cold-start, improved conversion |
| **P3** | Search Infrastructure | Elasticsearch for full-text product search with faceting, autocomplete, and typo tolerance | Sub-50ms search latency at scale |
| **P3** | API Gateway | Spring Cloud Gateway for centralized rate limiting, API versioning, request routing, circuit breaking | Abuse protection, graceful degradation, API lifecycle management |

---

## 🧪 Local Setup

### Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Java JDK | 17+ | Yes |
| Node.js | 18+ | Yes |
| MySQL | 8.0+ | Yes |
| Ollama | Latest | Optional (for AI features) |

### Backend Setup

```bash
git clone https://github.com/aryangaikwad-966/Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-.git
cd Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-/Cranberry-Backend

cp .env.example .env
# Configure: DB_URL, DB_USERNAME, DB_PASSWORD, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

./mvnw spring-boot:run
# Backend starts on http://localhost:8080
```

### Frontend Setup

```bash
cd Cranberry-Frontend

npm install
npm run dev
# Frontend starts on http://localhost:5173
```

### AI Setup (Optional)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
ollama pull llama3.2
ollama pull gemma3

# Verify
curl http://localhost:11434/api/tags
```

### Verify

| Service | Endpoint | Expected |
|---------|----------|----------|
| Frontend | `http://localhost:5173` | React app loads |
| Backend | `http://localhost:8080/api/health` | `{"status": "UP"}` |
| AI | `http://localhost:8080/api/ai/health` | `{"ollama_available": true}` |

---

## 📸 Screenshots

<div align="center">

| Home Page | Product Discovery | Shopping Cart |
|-----------|------------------|---------------|
| ![Home Page](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.47%E2%80%AFPM.png) | ![Products](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.50.23%E2%80%AFPM.png) | ![Cart](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.46.35%E2%80%AFPM.png) |

| Product Detail | Checkout | Razorpay Payment |
|----------------|----------|------------------|
| ![Product Detail](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.47.04%E2%80%AFPM.png) | ![Checkout](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.51.37%E2%80%AFPM.png) | ![Payment](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.53.21%E2%80%AFPM.png) |

| Vendor Dashboard | Admin Panel |
|------------------|-------------|
| ![Vendor Dashboard](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.56.38%E2%80%AFPM.png) | ![Admin Panel](Cranberry-Frontend/public/images/screenshots/Screenshot%202026-02-04%20at%201.57.01%E2%80%AFPM.png) |

</div>

`[AI CHATBOT SCREENSHOT — TODO]`

---

## 📈 Learning Outcomes

This project demonstrates applied competency across the following engineering domains:

| Domain | Demonstrated Capability |
|--------|------------------------|
| **System Design** | Multi-tenant data model with 11 entities, role-based access control, layered service architecture with clean package boundaries, API contract design across 10 controllers |
| **Backend Engineering** | Spring Boot application development, JPA entity relationships (1:1, 1:N, M:N), transactional service logic, custom Spring Security filter chain, stateless session management |
| **AI Engineering** | LLM integration via HTTP client, prompt engineering for intent detection and insight generation, semantic search with multi-axis relevance scoring, recommendation algorithm with diversity constraints |
| **Security** | JWT authentication lifecycle (generation, validation, claim extraction), RBAC with endpoint-level access control, BCrypt password hashing, CORS policy configuration, input validation |
| **Full-Stack Integration** | React SPA consuming RESTful APIs, client-side form validation (Zod) mirroring server-side validation, role-aware UI rendering, real-time dashboard data |
| **Payment Systems** | Razorpay SDK integration with order lifecycle management, payment creation and verification, idempotent transaction handling |
| **DevOps** | Vercel (frontend) + Render (backend) deployment pipeline, environment-based configuration (dev/prod profiles), database driver switching via Spring profiles |

---

## 🎯 Portfolio Positioning

Cranberry demonstrates production-grade backend engineering, applied AI integration, and scalable multi-vendor marketplace architecture. The system covers the full stack — from relational schema design and secure REST APIs to LLM-powered search and payment processing — reflecting the scope and technical depth expected in backend engineering, AI engineering, and full-stack software engineering roles. The architectural decisions (stateless auth, layered services, self-hosted inference, multi-tenant data modeling) are deliberate trade-offs documented with engineering rationale, representative of the systems thinking evaluated in graduate-level computer science programs and industry engineering interviews.

---

<div align="center">

**Built by [Aryan Gaikwad](https://github.com/aryangaikwad-966)**

[![GitHub](https://img.shields.io/badge/GitHub-aryangaikwad--966-181717?style=flat-square&logo=github)](https://github.com/aryangaikwad-966)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>