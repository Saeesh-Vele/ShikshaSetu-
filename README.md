# ShikshaSetu

AI-powered career guidance and education advisory platform for Indian students (Classes 10–12 and beyond).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/JSX with TypeScript type definitions
- **Auth & DB:** Firebase (Authentication, Firestore)
- **AI:** Google Gemini, Groq (LLaMA via groq-sdk)
- **UI:** Tailwind CSS v4, shadcn/ui (Radix primitives), Framer Motion
- **Maps:** Leaflet + React Leaflet (college explorer)

## Project Structure

```
app/                  → Next.js pages and API routes
features/             → Client-side feature modules (components, hooks, services)
components/           → Shared UI components (shadcn/ui, providers, FeatureFlag)
lib/firebase/         → Firebase SDK setup, auth helpers, domain-specific Firestore ops
services/             → Server-side business logic (AI pipelines, caching, analytics)
server/               → API middleware (rate limiting, auth, validation, error handling)
config/               → Feature flags, AI model configuration
types/                → TypeScript interface definitions (API contracts)
middleware.js         → Edge route protection (cookie-based auth guard)
```

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_FIREBASE_*` — Firebase project configuration (7 keys)
   - `GEMINI_API_KEY` — Google Gemini API key
   - `GROQ_API_KEY` — Groq API key for LLaMA models

3. Run the dev server:
   ```bash
   npm run dev
   ```

## Architecture Rules (Important)

- **Feature isolation:** Each feature lives in `features/<name>/` with `components/`, `hooks/`, `services/`, and `data/` subfolders. Cross-feature imports go through `index.js` barrel exports only.
- **Client vs server boundary:** `features/*/services/` contains client-side fetch wrappers. `services/` (root) contains server-side logic called only from `app/api/` routes. Never import from `services/` or `server/` in client components.
- **Adding a new feature:** Create `features/<name>/` with the standard subfolder structure, add a barrel `index.js`, and gate it behind a flag in `config/features.js` using the `<FeatureFlag>` component.
- **Type definitions** live in `types/`. JS files use JSDoc `@typedef` for IDE hints. New files should prefer `.ts`.
