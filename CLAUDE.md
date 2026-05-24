# ShopAI — CLAUDE.md

AI-first e-commerce SaaS with admin dashboard, AI product generator, RAG chatbot, product management, analytics, and customer storefront.

**Stack:** Next.js 16 · React · TypeScript (strict) · Tailwind v4 · shadcn/ui (mcp-server) · TanStack Query · Zustand · FastAPI · Python · SQLAlchemy · PostgreSQL + pgvector · Gemini/OpenAI

---

## Project State

**Done:** Next.js 16 scaffold, TypeScript strict, Tailwind v4, shadcn/ui (taupe/Mira theme), `next-themes` dark mode (toggle: `d`), fonts (Playfair Display, Geist, Geist Mono), `cn()` utility, Button component, CLAUDE.md + docs.

**Backlog:** PLP, PDP, cart, checkout, auth, search, categories, header, footer, SEO, analytics, deployment.

---

## Monorepo Structure

Two independent apps — one Python, one TypeScript. They communicate only over HTTP. Never mix concerns across the boundary.

```
shopai/
├── client/                  → Next.js 16 app
│   ├── src/
│   │   ├── app/               → (admin)/, (store)/, api/, auth/
│   │   ├── components/        → ui/, shared/, dashboard/, chatbot/, products/
│   │   ├── features/          → products/, ai/, chatbot/, analytics/, documents/
│   │   ├── hooks/             → shared hooks, api(react-query hooks)
│   │   ├── server/            → API client layer (axios-client.ts, fetchers)
│   │   ├── lib/               → cn(), config, constants
│   │   ├── store/             → Zustand stores
│   │   ├── types/             → shared TypeScript types
│   │   └── utils/             → pure utilities
│   ├── package.json
│   └── tsconfig.json
│
├── server/                    → FastAPI app
│   ├── api/routes/            → thin route handlers
│   ├── services/              → ai/, products/, chatbot/, analytics/
│   ├── rag/                   → chunking/, retrieval/, embeddings/, vectorstore/
│   ├── prompts/               → modular, version-controlled LLM prompts
│   ├── models/                → SQLAlchemy models
│   ├── schemas/               → Pydantic schemas
│   ├── core/                  → config, dependencies
│   └── repositories/          → database access layer
│   ├── requirements.txt
│   └── pyproject.toml
│
└── CLAUDE.md
```

### Boundary rules

- **Frontend** never imports from `backend/` and vice versa.
- All cross-app communication goes through the FastAPI REST API — no shared files, no symlinks, no shared config.
- Shared types (e.g. API response shapes) live in `frontend/src/types/` and are derived from the backend's Pydantic schemas, not shared directly.
- Environment variables: `frontend/.env.local` for Next.js, `backend/.env` for FastAPI. Never cross-reference.

### Running the monorepo

```bash
# Frontend
cd frontend && pnpm dev          # http://localhost:3000

# Backend
cd backend && uvicorn main:app --reload  # http://localhost:8000
```

### Patterns

- **Backend:** routes delegate to services → services use repositories. AI pipelines are isolated modules. Async-first everywhere.
- **Frontend:** server components by default, TanStack Query for all server state, Zustand for client-only UI state.

---

## Frontend Standards

### TypeScript

- Strict mode on. Zero tolerance for `any`, `as any`, `@ts-ignore`, `@ts-expect-error`.
- Prefer `type` over `interface` — use `interface` for object shapes, `type` for unions/primitives/utilities.
- Don't annotate return types TS can derive.
- Import via `@/*` path alias.

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
- Use `cn()` from `@/lib/utils` for class merging (`clsx` + `tailwind-merge`).
- Semantic tokens only: `bg-background`, `text-foreground`, `border-border`, `bg-primary`, `text-muted-foreground`.
- Mobile-first: `sm:`, `md:`, `lg:` breakpoints.
- Custom tokens via CSS variables in `globals.css` → reference via `@theme inline`.

### Imports

Ordered with a blank line between each group:

1. React / Next.js
2. Third-party
3. `@/` internal
4. Relative

### Quality Gates

Run from `frontend/` before every commit: `pnpm lint` → `pnpm format` → `pnpm typecheck`. All must pass.

---

## Backend Standards

### Python

- Type-annotate all function signatures — arguments and return types.
- Pydantic schemas for all request/response shapes. Never return raw dicts from routes.
- SQLAlchemy models stay in `models/` — never imported directly by routes.
- All I/O (DB, HTTP, AI calls) must be `async`.

### API design

- Routes are thin — validation and response shaping only. Business logic belongs in services.
- Use HTTP status codes correctly: `201` for creates, `204` for deletes, `422` for validation errors.
- Prefix all routes: `/api/v1/...`
- Return consistent error shapes: `{ "detail": "..." }`.

### AI / RAG

- Prompts live in `prompts/` — versioned, never hardcoded inline.
- RAG pipeline stages (chunking, embedding, retrieval) are independent modules — don't collapse them.
- Never call AI APIs directly from routes or repositories — always via a service.

### Quality Gates

Run from `backend/` before every commit: `ruff check .` → `ruff format .` → `mypy .`. All must pass.

---

## AI Workflow

### Before coding

1. Identify which app you're in — `frontend/` or `backend/`. Don't straddle.
2. Read the files you're modifying — never edit blind.
3. Match existing patterns in that app's codebase.
4. If touching 3+ files or making architectural decisions, enter plan mode first.

### While coding

1. **Frontend:** keep components server-side by default. Only add `"use client"` for event handlers, hooks, or browser APIs.
2. **Frontend:** add shadcn components via `npx shadcn add <component>` — never copy-paste from docs.
3. **Backend:** write a service method before wiring a route. Routes are always last.
4. No emojis in code, comments, or UI copy.
5. No comments describing what the code does — only write why for non-obvious behavior.
6. No barrel files (`index.ts` re-exports) on the frontend.

### After coding

1. **Frontend:** run `pnpm typecheck`. **Backend:** run `mypy .`. Both must pass before reporting done.
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
- **Fonts:** defined in `globals.css`.
- **Surfaces:** soft backgrounds, subtly elevated cards, low-contrast borders, soft layered shadows.
- **Motion:** subtle and smooth. Use for transitions, hovers, streaming, loading states. No flashy effects.

### Layout

Fixed collapsible sidebar (dark, icon + label) + spacious main content area (card-driven, responsive grid).

### Components

- shadcn/ui exclusively for UI primitives.
- Components must be reusable and composable — no hardcoded business logic in UI.
- Avoid: heavy shadows, neon effects, oversaturated gradients, dense typography, cluttered layouts.

### Responsive

Mobile-first. Sidebar → drawer on mobile. Tables → stacked cards. Analytics → responsive charts.