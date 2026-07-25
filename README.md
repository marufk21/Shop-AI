# ShopAI

AI-first e-commerce SaaS platform with an admin dashboard, AI-powered product tools, RAG chatbot, document management, analytics, and a customer storefront.

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (Turbopack) |
| **UI Library** | React 19 |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui (Mira/taupe theme) |
| **Server State** | TanStack Query v5 |
| **Forms** | react-hook-form + Zod |
| **Charts** | Recharts |
| **Motion** | Framer Motion |
| **Icons** | Phosphor Icons |
| **Backend** | FastAPI (Python 3.12) |
| **ORM** | SQLAlchemy 2.0 (async) |
| **Database** | PostgreSQL + pgvector |
| **AI** | Gemini (2.5 Flash + embedding-001) |
| **AI Framework** | LangChain |
| **Image Storage** | Cloudinary |
| **Validation** | Pydantic v2 |
| **Package Manager** | pnpm (Turborepo) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.33
- **Python** >= 3.12
- **PostgreSQL** with [pgvector](https://github.com/pgvector/pgvector) extension

### Install

```bash
pnpm install
```

### Environment Variables

**Server** — create `apps/server/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
APP_NAME=ShopAI
APP_DEBUG=false
GEMINI_API_KEY="your-gemini-api-key"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
CLOUDINARY_API_SECRET="your-api-secret"
FRONTEND_URL="http://localhost:3000"   # optional — for CORS
```

### Develop

```bash
pnpm dev          # client :3000, server :8000 (Turborepo parallel)
```

Or run individually:

```bash
cd apps/client && pnpm dev     # Next.js + Turbopack → http://localhost:3000
cd apps/server && pnpm dev     # FastAPI + uvicorn → http://localhost:8000
```

---

## Project Structure

```
shopai/
├── apps/
│   ├── client/                       Next.js 16 (Turbopack)
│   │   ├── app/
│   │   │   ├── (admin)/admin/        dashboard, products, documents, chatbot, analytics, settings
│   │   │   └── (store)/store/        storefront home, product listing/detail, category, cart
│   │   ├── components/
│   │   │   ├── store/                storefront: cart, navbar, product cards, home sections, footer
│   │   │   ├── layout/               app-sidebar, app-header
│   │   │   ├── shared/               data-table, command-menu, theme-provider
│   │   │   └── chatbot/              chatbot-wrapper, floating-chatbot (SSE streaming)
│   │   ├── hooks/
│   │   │   ├── admin/                use-products, use-documents, use-chat
│   │   │   └── store/                use-products, use-recently-viewed
│   │   ├── server/                   axios client + API fetchers
│   │   └── types/                    product.ts, document.ts, chat.ts
│   │
│   └── server/                       FastAPI
│       ├── api/admin/                products, upload, ai, documents, chat
│       ├── api/store/                products, categories
│       ├── controllers/              admin + store business logic
│       ├── db/                       product, document, vector repositories
│       ├── models/                   SQLAlchemy + pgvector models
│       ├── schemas/                  Pydantic request/response schemas
│       ├── core/                     config, database, DI
│       └── utils/                    ai_generator, chunker, cloudinary, document_parser, embedding, slug
│
└── packages/
    ├── ui/                           shadcn/ui components (33 components on @base-ui/react)
    ├── eslint-config/                shared ESLint configs
    └── typescript-config/            shared TS configs
```

---

## Features

### Admin Dashboard

| Page | Description |
|---|---|
| **Dashboard** | Overview and quick actions |
| **Products** | Full CRUD with Cloudinary image upload, AI-powered name/description improvement |
| **Documents** | Upload PDFs, parse, chunk, embed, and index into pgvector for RAG |
| **Chatbot** | RAG-powered chat with SSE streaming, source citations, and context-aware responses |
| **Analytics** | Charts and metrics dashboard (Recharts) |
| **Settings** | Application configuration |

### Storefront

- **Home page** — hero carousel, category icon grid, flash deals section, offer cards strip, promo banner, newsletter signup, product rows by category
- **Product listing** — grid layout with category filter
- **Product detail** — image gallery, quantity selector, add-to-cart, wishlist, trust badges, bank offers, tabbed specs/reviews
- **Category pages** — slug-based routing with filtered product grids
- **All products** — paginated browse-all page
- **Cart** — slide-out drawer with quantity controls, persistent across sessions
- **Quick view** — modal product preview from listing cards
- **Recently viewed** — localStorage-backed product history
- **Related products** — category-based suggestions on detail pages
- **Responsive** — announcement bar, sticky category bar, mobile bottom nav bar, store footer with search

### AI Pipeline

1. **Document ingestion:** Upload → parse text → split into chunks → generate embeddings (Gemini `embedding-001`) → store in pgvector
2. **RAG chat:** Embed user query → cosine similarity search (`<=>`) → build context from matching chunks → stream Gemini 2.5 Flash response via SSE (`text/event-stream`) → emit `token` events, `sources` citations, then `[DONE]`
3. **Text improvement:** AI-powered product name and description enhancer (Gemini 2.5 Flash)

---

## API Reference

All endpoints are prefixed with `/api/v1/`. The server runs on `http://localhost:8000`.

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/products` | Create product (multipart: JSON + optional image) |
| `GET` | `/products` | List products (`?status=`, `?search=`, `?skip=`, `?limit=`) |
| `GET` | `/products/:id` | Get product by UUID |
| `PUT` | `/products/:id` | Update product (multipart) |
| `DELETE` | `/products/:id` | Delete product |
| `POST` | `/upload/image` | Upload image to Cloudinary |
| `POST` | `/ai/improve` | AI-improve product name or description |
| `POST` | `/documents/upload` | Upload document for RAG ingestion |
| `GET` | `/documents` | List documents |
| `DELETE` | `/documents/:id` | Delete document + chunks |
| `POST` | `/chat/message` | RAG chat (SSE stream) |

### Store

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/store/products` | List published products (`?category=`, `?skip=`, `?limit=`) |
| `GET` | `/store/products/:slug` | Get product by slug |
| `GET` | `/store/categories` | List distinct product categories |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |

---

## Quality Gates

Run from repo root (Turborepo):

```bash
pnpm typecheck     # tsc --noEmit + mypy (strict)
pnpm lint          # ESLint + Ruff
pnpm format        # Prettier + Ruff format
```

Or scope to one app:

```bash
cd apps/client && pnpm typecheck
cd apps/server && pnpm typecheck
```

---

## UI Components

33 shadcn/ui components built on `@base-ui/react`, available in `packages/ui/`. Import from `@workspace/ui/components/<name>`:

`accordion` · `avatar` · `badge` · `breadcrumb` · `button` · `card` · `carousel` · `checkbox` · `collapsible` · `command` · `dialog` · `drawer` · `dropdown-menu` · `hover-card` · `input` · `input-group` · `label` · `navigation-menu` · `popover` · `progress` · `radio-group` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `switch` · `table` · `tabs` · `textarea` · `tooltip`

Add new components:

```bash
pnpm dlx shadcn@latest add <component> -c packages/ui
```

---

## Design

**Design language:** Modern, minimal, premium, AI-native.

- **Colors:** OKLCH semantic tokens (Taupe/Mira theme), dark mode via `next-themes`
- **Fonts:** Lora (headings), Raleway (body), Geist Mono (code)
- **Motion:** Framer Motion for transitions, hovers, streaming, loading states
- **Layout:** Fixed collapsible sidebar + card-driven responsive grid

---

## License

MIT
