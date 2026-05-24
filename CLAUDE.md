# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

AI-first e-commerce SaaS with admin dashboard, AI product generator, RAG chatbot, product management, analytics, and customer storefront.

**Stack:** Next.js 16 · React · TypeScript (strict) · Tailwind v4 · shadcn/ui · TanStack Query · Zustand · FastAPI · Python · SQLAlchemy · PostgreSQL + pgvector · Gemini/OpenAI

---

## Project State

**Done:** Next.js 16 scaffold, TypeScript strict, Tailwind v4, shadcn/ui (taupe/Mira theme), `next-themes` dark mode (toggle: `d`), fonts (Playfair Display, Geist, Geist Mono), `cn()` utility, admin product CRUD, store product listing, Neon PostgreSQL connected.

**Backlog:** PLP, PDP, cart, checkout, auth, search, categories, header, footer, SEO, analytics, deployment.

---

## Workspace Setup

Turborepo + pnpm workspace (`pnpm@10.33.4`, `node >= 20`). Workspace packages: `apps/*` and `packages/*`.

```bash
# Install all deps (root)
pnpm install

# Run both apps in dev (Turborepo parallel)
pnpm dev                   # → turborepo: client :3000, server :8000
```

### Individual apps

```bash
# Frontend (Next.js + Turbopack)
cd apps/client && pnpm dev          # http://localhost:3000

# Backend (FastAPI)
cd apps/server && pnpm dev          # http://localhost:8000
```

---

## Monorepo Structure

Two independent apps — Python and TypeScript. They communicate only over HTTP.

```
shopai/
├── apps/
│   ├── client/                     → Next.js 16 app (Turbopack)
│   │   ├── app/
│   │   │   ├── (admin)/admin/        → dashboard, products, ai-generator, analytics, chatbot, settings
│   │   │   ├── (store)/store/        → storefront, product listing/detail, profile
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── layout/               → app-sidebar, app-header
│   │   │   ├── shared/               → data-table, command-menu
│   │   │   ├── chatbot/              → chatbot-wrapper, floating-chatbot
│   │   │   ├── providers.tsx          → QueryClient, Theme, Sidebar, Tooltip, Toaster
│   │   │   └── theme-provider.tsx
│   │   ├── hooks/
│   │   │   ├── admin/                → use-products (TanStack Query hooks)
│   │   │   └── store/                → use-products
│   │   ├── server/                   → axios-client, product-fetchers
│   │   ├── types/                    → product.ts (shared TS types)
│   │   └── lib/                      → cn(), config, constants
│   │
│   └── server/                     → FastAPI app
│       ├── api/                      → product_routes.py, store_routes.py
│       ├── controllers/              → product_controller.py (business logic)
│       ├── db/                       → product_repository.py (data access)
│       ├── models/                   → product_model.py (SQLAlchemy)
│       ├── schemas/                  → product_schema.py (Pydantic)
│       ├── core/                     → config.py, database.py, dependencies.py
│       ├── utils/                    → slug.py
│       └── main.py                   → app entry, CORS, lifespan
│
├── packages/
│   ├── ui/                          → shared shadcn/ui components (@workspace/ui)
│   │   └── src/components/           → 31 components (button, dialog, table, etc.)
│   ├── eslint-config/               → base.js, next.js, react-internal.js
│   └── typescript-config/           → base.json, nextjs.json, react-library.json
│
├── turbo.json
├── pnpm-workspace.yaml
└── .prettierrc
```

### Boundary rules

- Frontend never imports from `apps/server/` and vice versa.
- All cross-app communication goes through the FastAPI REST API — no shared files, no symlinks.
- Shared TypeScript types live in `apps/client/types/`, derived from the backend's Pydantic schemas.
- Environment variables: `apps/client/.env.local` for Next.js, `apps/server/.env` for FastAPI. Never cross-reference.
- shadcn/ui components live in `packages/ui/src/components/` — import from `@workspace/ui/components/<name>`.
- Add shadcn components via `pnpm dlx shadcn@latest add <component> -c packages/ui`.

### Patterns

- **Backend:** routes are thin → controllers have business logic → db/repositories access data. Async-first everywhere. Thin `__init__.py` files use `importlib.import_module()` to re-export from underscore-named modules.
- **Frontend:** server components by default, TanStack Query for all server state, Zustand for client-only UI state.

---

## Frontend Standards

### TypeScript

- Strict mode on. Zero tolerance for `any`, `@ts-ignore`, `@ts-expect-error`.
- Prefer `type` over `interface` — use `interface` for object shapes, `type` for unions/primitives/utilities.
- Don't annotate return types TS can derive.
- Import via `@/*` path alias (maps to `apps/client/`).
- Import shadcn/ui via `@workspace/ui/components/<name>`.

### Components

- **Default exports** for pages/layouts (`page.tsx`, `layout.tsx`) — Next.js requirement.
- **Named exports** for everything else.
- Filenames: `kebab-case.tsx`. Functions: `PascalCase`.
- One component per file. Co-locate sub-components only if they're not reused elsewhere.
- Props: named interface, destructured in signature with defaults.

```tsx
export function ProductCard({ price, currency = "USD" }: ProductCardProps) { ... }
```

### Styling

- Tailwind utility classes only — no inline styles, CSS modules, or `style={{}}`.
- Use `cn()` from `@workspace/ui/lib/utils` for class merging (`clsx` + `tailwind-merge`).
- Semantic tokens only: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`.
- Mobile-first: `sm:`, `md:`, `lg:` breakpoints.
- Custom tokens via CSS variables in `packages/ui/src/styles/globals.css` → reference via `@theme inline`.

### Imports

Ordered with a blank line between each group:

1. React / Next.js
2. Third-party
3. `@/` internal
4. Relative

### Quality Gates

All run from repo root via Turborepo:

```bash
pnpm typecheck     # tsc --noEmit across all packages
pnpm lint          # ESLint across all packages
pnpm format        # Prettier across all packages
```

Or within `apps/client/`: `pnpm typecheck`, `pnpm lint`, `pnpm format`.

---

## Backend Standards

### Python

- Type-annotate all function signatures — arguments and return types.
- Pydantic schemas for all request/response shapes. Never return raw dicts from routes.
- SQLAlchemy models stay in `models/` — never imported directly by routes.
- All I/O (DB, HTTP, AI calls) must be `async`.
- Module filenames use **underscores** (`product_routes.py`), never hyphens (`product-routes.py`).

### API design

- Routes are thin — validation and response shaping only. Business logic belongs in controllers.
- Use HTTP status codes correctly: `201` for creates, `204` for deletes, `422` for validation errors.
- Prefix all routes: `/api/v1/...`
- Return consistent error shapes: `{ "detail": "..." }`.

### Quality Gates

```bash
cd apps/server && pnpm lint       # ruff check
cd apps/server && pnpm format     # ruff format
cd apps/server && pnpm typecheck  # mypy (strict mode)
```

---

## AI Workflow

### Before coding

1. Identify which app you're in — `apps/client/` or `apps/server/`. Don't straddle.
2. Read the files you're modifying — never edit blind.
3. Match existing patterns in that app's codebase.
4. If touching 3+ files or making architectural decisions, enter plan mode first.

### While coding

1. **Frontend:** keep components server-side by default. Only add `"use client"` for event handlers, hooks, or browser APIs.
2. **Frontend:** add shadcn components via `pnpm dlx shadcn@latest add <component> -c packages/ui` — never copy-paste from docs.
3. **Backend:** write controller logic before wiring a route. Routes are always last.
4. No emojis in code, comments, or UI copy.
5. No comments describing what the code does — only write why for non-obvious behavior.
6. No barrel files (`index.ts` re-exports) on the frontend.

### After coding

1. **Frontend:** run `pnpm typecheck`. **Backend:** run `pnpm typecheck`. Both must pass before reporting done.
2. For UI changes, start the dev server and verify in browser.

### Do not

- Cross the frontend/backend boundary with imports, shared files, or env vars.
- Add new dependencies (npm or pip) without asking.
- Add `"use client"` at the page or layout level — wrap client parts in leaf components.
- Create barrel files on the frontend.
- Preemptively optimize — no `useMemo`, `useCallback`, or `React.memo` until profiling shows need.
- Add error boundaries, suspense boundaries, or loading states before a feature needs them.
- Expand scope — no refactors, abstractions, or new features beyond the task.

---

## UI/UX

**Design language:** Modern, minimal, premium, AI-native. Think Shopify + Perplexity + Linear.

### Tokens

- **Colors:** semantic tokens only (see Styling above).
- **Fonts:** Playfair Display (headings), Geist (body), Geist Mono (code) — defined in `packages/ui/src/styles/globals.css`.
- **Surfaces:** soft backgrounds, subtly elevated cards, low-contrast borders, soft layered shadows.
- **Motion:** subtle and smooth. Use for transitions, hovers, streaming, loading states. No flashy effects.

### Layout

Fixed collapsible sidebar (dark, icon + label) + spacious main content area (card-driven, responsive grid).

### Components

- shadcn/ui exclusively for UI primitives, imported from `@workspace/ui/components/<name>`.
- Components must be reusable and composable — no hardcoded business logic in UI.
- Avoid: heavy shadows, neon effects, oversaturated gradients, dense typography, cluttered layouts.

### Responsive

Mobile-first. Sidebar → drawer on mobile. Tables → stacked cards. Analytics → responsive charts.
