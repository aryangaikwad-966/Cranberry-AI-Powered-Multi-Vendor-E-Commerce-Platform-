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

Cranberry is a multi-vendor e-commerce platform with a natively integrated AI layer. The system supports three distinct user roles — **Customer**, **Vendor**, and **Admin** — each backed by dedicated APIs, dashboards, and access-controlled workflows. A self-hosted LLM (Ollama) is embedded directly into the service layer, providing semantic product search, conversational support, pricing intelligence, and personalized recommendations without reliance on external AI APIs or per-request billing.

Built on Spring Boot 3.4, React 18, and a layered monolithic architecture with clean seams for microservice decomposition.

---

## 🧠 Problem Statement

Multi-vendor marketplaces face compounding engineering challenges as they scale:

- **Search relevance degrades** — Keyword-only search fails on natural language queries, reducing conversion rates across vendor catalogs.
- **Vendor pricing lacks intelligence** — Independent sellers have no visibility into competitive positioning, resulting in suboptimal pricing and lost revenue.
- **Customer support scales linearly** — Without automation, support cost grows proportionally with user base — an unsustainable operational model.
- **Recommendation cold-start** — Traditional recommendation engines require large training datasets; new marketplaces cannot generate meaningful suggestions.
- **AI cost predictability** — Per-token API billing (OpenAI, Anthropic) introduces unpredictable variable cost that scales with every search, chat, and recommendation request.

**Engineering response:**

Cranberry addresses these constraints through a self-hosted inference runtime (Ollama) that converts AI from a variable per-request cost into a fixed infrastructure cost. An intent-detection pipeline classifies and routes queries to specialized handlers. A multi-axis relevance scoring engine combines token overlap, category matching, and price proximity — no external ML pipeline or training data required. Stateless JWT authentication and strict layered architecture support horizontal scaling from day one.

---

## ✨ Key Features

### Customer Features
- Semantic product search with natural language query decomposition
- Multi-turn AI chatbot — product discovery, order tracking, deal surfacing, general Q&A
- Personalized recommendations derived from purchase history and category affinity
- Persistent cart and wishlist with server-side state management
- Razorpay-integrated checkout with full order lifecycle tracking (placed → confirmed → shipped → delivered)
- Responsive interface across desktop and mobile viewports

### Vendor Features
- Real-time sales analytics dashboard with revenue metrics
- AI-powered price suggestion engine with market positioning analysis
- Product catalog CRUD with image upload management
- Order fulfillment workflow with explicit status transitions
- Performance metrics scoped to vendor-owned inventory

### Admin Features
- Platform-wide analytics and aggregated business intelligence
- Vendor approval and moderation pipeline
- Product and category management with activation/deactivation controls
- User management with role-based access enforcement
- AI-generated order insights summarizing platform-level trends

### AI Features
- **Conversational AI** — Multi-turn chatbot with intent classification across 5 intent types (product search, order tracking, deals, help, general)
- **Semantic Search** — Query decomposition → keyword/price/category extraction → multi-axis relevance scoring → ranked results
- **Recommendation Engine** — Category-weighted collaborative filtering with purchase frequency analysis and diversity constraints
- **Price Intelligence** — Real-time market statistics computation + LLM-generated competitive pricing rationale for vendors
- **Order Analytics** — Aggregated order data pipeline with AI-summarized business insights for admin dashboards

---

## 🏗️ System Architecture

Cranberry uses a **layered monolithic architecture** with strict separation of concerns across four tiers:

```
Controller Layer  →  Service Layer  →  Repository Layer  →  Database
     (REST API)      (Business Logic)    (Data Access)       (MySQL / PostgreSQL)
```

Cross-cutting concerns — JWT authentication, CORS enforcement, and request validation — are handled by dedicated filters in the Spring Security filter chain, executed before any controller logic.

The AI module operates as an independent vertical within the application layer. It maintains its own controller (`AiController`), service classes (`AiService`, `OrderInsightsService`, `RecommendationService`), and a dedicated non-blocking HTTP client (`AiProviderClient`) that interfaces with the Ollama runtime. This design isolates AI complexity from core business logic while allowing direct repository access for real-time data retrieval.

### Architecture Diagram

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
│   (Origin whitelist)   (Token extraction,    (Spring Security       │
│                         claim verification,   authentication        │
│                         role injection)        context setup)        │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ Authenticated SecurityContext
┌──────────────────────────────▼──────────────────────────────────────┐
│                      APPLICATION LAYER                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   CONTROLLERS (11)                           │    │
│  │  Auth · Product · Order · Cart · Wishlist · Payment          │    │
│  │  Vendor · Admin · User · Health · AI                         │    │
│  └───────────────────────────┬─────────────────────────────────┘    │
│                              │                                      │
│  ┌───────────────────────────▼──────────┐  ┌────────────────────┐  │
│  │         SERVICE LAYER (10)           │  │    AI MODULE        │  │
│  │                                      │  │                    │  │
│  │  AuthService    ProductService       │  │  AiService         │  │
│  │  OrderService   CartService          │  │  AiProviderClient  │  │
│  │  PaymentService VendorService        │  │  RecommendationSvc │  │
│  │  AdminService   WishlistService      │  │  OrderInsightsSvc  │  │
│  └───────────────────────────┬──────────┘  └─────────┬──────────┘  │
│                              │                       │              │
│  ┌───────────────────────────▼───────┐  ┌────────────▼──────────┐  │
│  │     REPOSITORY LAYER (10)         │  │   OLLAMA RUNTIME      │  │
│  │   Spring Data JPA / Hibernate     │  │   llama3.2 · gemma3   │  │
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

### Simplified Request Flow

```
Client (React SPA)
       ↓
Spring Boot API Gateway (JWT Security Filter Chain)
       ↓
Service Layer (Business Logic + Validation)
       ↓
AI Module (Ollama)  +  Repository Layer (JPA/Hibernate)
       ↓                        ↓
LLM Inference           MySQL / PostgreSQL
```

`[INSERT SYSTEM ARCHITECTURE DIAGRAM HERE]`

---

## 🔐 Authentication & Authorization Flow

### JWT Lifecycle

1. **Login** — Client sends credentials to `POST /api/auth/login`.
2. **Token Generation** — `JwtUtil.generateToken()` creates a signed JWT containing `email`, `userId`, and `role` claims. Algorithm: HMAC-SHA256. Expiry: 24 hours.
3. **Token Storage** — Client persists the JWT in local storage and attaches it to every subsequent request via the `Authorization: Bearer <token>` header.
4. **Filter Validation** — On each request, `JwtFilter` extracts the token, validates signature and expiry via `JwtUtil`, and injects the authenticated principal into Spring's `SecurityContext`.
5. **Role-Based Authorization** — Controllers receive pre-authenticated requests. Endpoint access is enforced at both the filter level and the controller level based on the `role` claim.

### Request Authentication Sequence

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

### Role-Based Access Matrix

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

### Security Implementation Details

- **Stateless sessions** — `SessionCreationPolicy.STATELESS` enforced globally; zero server-side session storage.
- **CORS** — Explicit origin, method, and header whitelisting via `CorsConfig`.
- **Password hashing** — BCrypt via Spring Security's `BCryptPasswordEncoder`.
- **Input validation** — Bean Validation (`@Valid`) on all request DTOs with Zod schema validation on the client.
- **SQL injection prevention** — Parameterized queries enforced through JPA/Hibernate.

`[INSERT AUTH FLOW DIAGRAM HERE]`

---

## 🤖 AI Architecture

The AI subsystem is implemented as a dedicated module at `com.cranberry.marketplace.ai` with four core components that integrate directly into the service layer via constructor injection.

### Component Map

| Component | Class | Responsibility |
|-----------|-------|----------------|
| **LLM Client** | `AiProviderClient` | HTTP interface to Ollama runtime. Handles prompt construction, response parsing, model fallback (llama3.2 → gemma3), and health checking. |
| **Core AI Service** | `AiService` | Intent detection, semantic search, recommendation orchestration, price suggestions. Coordinates LLM calls with live database queries. |
| **Recommendation Engine** | `RecommendationService` | Category-weighted collaborative filtering. Analyses purchase history, applies diversity constraints, and generates personalized product sets. |
| **Order Intelligence** | `OrderInsightsService` | Aggregates order metrics across the platform and generates AI-summarized business intelligence for admin dashboards. |

### Intent Detection & Routing Pipeline

Every chatbot message passes through a multi-stage classification and routing pipeline:

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

1. **Query Decomposition** — Extract keywords, min/max price constraints, and category signals from natural language input using regex-based heuristics.
2. **Candidate Retrieval** — JPA queries against the product table using extracted filters.
3. **Multi-Axis Relevance Scoring** — Each candidate is scored across three dimensions:
   - Token overlap between query terms and product `name + description` (weight: 0.5)
   - Category match against extracted category signal (weight: 0.3)
   - Price proximity to query constraints (weight: 0.2)
4. **Ranking & Response** — Sort by composite score, return top-N results with LLM-generated search insight.

### Recommendation Algorithms

| Mode | Input | Algorithm |
|------|-------|-----------|
| **Similar Products** | `productId` | Retrieve same-category products → rank by price proximity + name token similarity → exclude source product |
| **Personalized** | `userId` | Analyse order history → extract category frequency distribution → retrieve unseen products weighted by purchase frequency → apply diversity cap per category |

### AI Price Suggestion Engine

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

### Integration Model

The AI module is **not** a standalone microservice. It is a first-class citizen within the service layer. `AiService` directly depends on `ProductRepository` and `OrderRepository` via constructor injection, enabling:

- Live product data queries for search and recommendations
- Order history access for personalisation
- Real-time market statistics computation for pricing
- Aggregated order data for business intelligence

This tight integration avoids inter-service communication latency while maintaining clean separation through the dedicated `ai` package boundary. The module is designed for future extraction into an independent service with minimal refactoring — repository dependencies map directly to REST API contracts.

`[INSERT AI ARCHITECTURE DIAGRAM HERE]`

---

## ⚙️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Vite 7.3, TailwindCSS 3.4, Radix UI + shadcn/ui, React Router 7.5, React Hook Form + Zod |
| **Backend** | Java 17, Spring Boot 3.4.2, Spring Security 6.x, Spring Data JPA / Hibernate |
| **AI** | Ollama (self-hosted), llama3.2, gemma3, Spring WebFlux WebClient (non-blocking HTTP) |
| **Database** | PostgreSQL 16 (production), MySQL 8.0 (development) |
| **Payments** | Razorpay Java SDK 1.4.7 |
| **Tools / Environment** | Maven, Vercel (frontend CDN), Render (backend containers), Git |

---

## 📊 Engineering Decisions & Scalability

### Architectural Rationale

| Decision | Rationale |
|----------|-----------|
| **Spring Boot 3.4** | Production-proven framework with auto-configuration, native JPA/Security/Validation support, and a clear upgrade path to Spring Cloud for future microservice decomposition. |
| **Stateless JWT** | Eliminates server-side session storage. Any backend instance can validate any request independently — a prerequisite for horizontal scaling behind a load balancer without sticky sessions or session replication. |
| **Layered Architecture** | `Controller → Service → Repository` enforces single-responsibility at each tier. Services are independently testable. Repository interfaces are swappable. Clean seams exist for future bounded context extraction. |
| **Multi-Vendor Data Model** | `Vendor` is a first-class entity with product ownership, order visibility, and analytics scoping. Tenant isolation is enforced at the service layer via vendor ID filtering from day one. |
| **Self-Hosted LLM (Ollama)** | Eliminates per-request API cost (OpenAI charges $0.01–$0.06/1K tokens). Full control over model selection, prompt templates, and inference latency. AI features become a fixed infrastructure cost, not a variable per-user cost. Zero vendor lock-in. |
| **WebClient (Non-Blocking)** | Ollama API calls use Spring WebFlux's `WebClient` instead of `RestTemplate`. Non-blocking I/O prevents LLM inference latency (typically 2–10s) from consuming servlet threads. |

### Scalability Posture

- **Stateless APIs** — No server-side session state. Horizontal scaling requires only a load balancer and additional instances.
- **Service Separation** — Business logic is isolated per domain (auth, product, order, payment, AI). Each service can be extracted into an independent deployment unit without schema changes.
- **Horizontal Scaling Readiness** — JWT validation is CPU-only (no shared state). Database connection pooling via HikariCP. AI inference is offloaded to a dedicated Ollama process.

---

## 🚀 Future Engineering Roadmap

| Priority | Area | Implementation | Expected Impact |
|----------|------|----------------|-----------------|
| **P0** | Caching | Redis cache for product catalogue, search results, and vendor analytics. Write-through invalidation on product mutations. | ~60% reduction in database read load |
| **P0** | CI/CD | GitHub Actions: lint → test → build → Docker image → staged deployment | Automated quality gates, zero-downtime deployments |
| **P1** | Event-Driven Processing | Kafka topics for `order.created`, `payment.verified`, `order.shipped`. Consumers handle inventory updates, notification dispatch, analytics ingestion. | Decoupled order pipeline, async processing, retry semantics |
| **P1** | Microservices Decomposition | Extract bounded contexts: `ai-service`, `payment-service`, `order-service`. Inter-service communication via REST + Kafka events. | Independent scaling, isolated failure domains, team-parallel development |
| **P1** | Containerisation | Dockerfile per service, `docker-compose.yml` for local stack, Kubernetes manifests for production. | Environment parity, reproducible builds, orchestration readiness |
| **P2** | Vector Search | pgvector extension for product description embeddings. Replace keyword scoring with cosine similarity on dense vectors. | True semantic similarity, ~3x relevance improvement on ambiguous queries |
| **P2** | Observability | Structured logging (ELK), distributed tracing (OpenTelemetry), metrics (Prometheus + Grafana). | Production debugging, SLA monitoring, performance profiling |
| **P2** | AI Personalisation | User behaviour embeddings (click, cart, purchase signals). Real-time feature store for recommendation model input. | Context-aware recommendations, reduced cold-start, improved conversion |

---

## 🧪 Local Setup

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aryangaikwad-966/Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-.git
   cd Cranberry-AI-Powered-Multi-Vendor-E-Commerce-Platform-/Cranberry-Backend
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Set: DB_URL, DB_USERNAME, DB_PASSWORD, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
   ```

3. Start the backend:
   ```bash
   ./mvnw spring-boot:run
   # Starts on http://localhost:8080
   ```

### Frontend Setup

1. Install dependencies and start the dev server:
   ```bash
   cd Cranberry-Frontend
   npm install
   npm run dev
   # Starts on http://localhost:5173
   ```

### AI Setup (Optional)

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2
ollama pull gemma3
curl http://localhost:11434/api/tags   # Verify models are available
```

### Verification

| Service | Endpoint | Expected |
|---------|----------|----------|
| Frontend | `http://localhost:5173` | React application loads |
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

`[AI Chatbot Screenshot — TODO]`

---

## 📈 Engineering Skills Demonstrated

| Domain | Demonstrated Capability |
|--------|------------------------|
| **System Design** | Multi-tenant data model with 11 entities, role-based access control, layered service architecture with clean package boundaries, API contract design across 11 controllers. |
| **Backend Architecture** | Spring Boot application with JPA entity relationships (1:1, 1:N, M:N), transactional service logic, custom Spring Security filter chain, stateless session management, and 28 request/response DTOs. |
| **Secure Authentication** | JWT lifecycle implementation (generation, validation, claim extraction), RBAC with endpoint-level access control, BCrypt password hashing, CORS policy configuration, input validation pipeline. |
| **AI Integration** | LLM integration via non-blocking HTTP client, prompt engineering for intent detection and insight generation, semantic search with multi-axis relevance scoring, recommendation algorithm with diversity constraints. |
| **Full-Stack Coordination** | React SPA consuming RESTful APIs, client-side form validation (Zod) mirroring server-side validation, role-aware UI rendering, real-time dashboard data binding. |
| **Payment Systems** | Razorpay SDK integration with order lifecycle management, payment creation and signature verification, idempotent transaction handling. |

---

## 🎯 Portfolio Positioning

This project demonstrates production-grade backend engineering, applied AI system design, and scalable multi-vendor marketplace architecture. The system covers the full vertical — from relational schema design and secure REST APIs to LLM-powered semantic search and payment processing — reflecting the technical depth expected in backend engineering, AI engineering, and full-stack software engineering roles. Architectural decisions (stateless authentication, layered services, self-hosted inference, multi-tenant data modelling) are deliberate trade-offs documented with engineering rationale, representative of the systems thinking evaluated in graduate-level computer science programmes and industry engineering interviews.

---

<div align="center">

**Built by [Aryan Gaikwad](https://github.com/aryangaikwad-966)**

[![GitHub](https://img.shields.io/badge/GitHub-aryangaikwad--966-181717?style=flat-square&logo=github)](https://github.com/aryangaikwad-966)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>