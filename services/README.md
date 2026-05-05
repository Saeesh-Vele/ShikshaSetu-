# services/

Server-side business logic called exclusively from Next.js API routes (`app/api/`). Nothing here should be imported by client components.

## Database Layer Boundary

Two Firestore layers exist by design:

- **`lib/firebase/db/`** — Low-level, domain-specific CRUD for top-level Firestore collections (`users`). Used by both client and server code for profile management.
- **`services/db/firestoreService.js`** — Server-side persistence for AI results, quiz history, chat logs, and response caching. Operates on subcollections (`users/{uid}/quiz_results`, `users/{uid}/chat_history`) and standalone collections (`ai_cache`). Only called from API routes and AI pipelines.

**Rule:** Use `lib/firebase/db/users.js` for user profile operations. Use `services/db/firestoreService.js` for saving AI/quiz results and chat history.

## Structure

- `ai/` — AI orchestration (`aiController.js`), LLM client, and multi-step pipelines
- `ai/pipelines/` — Isolated processing pipelines (evaluate, chatbot, career prediction)
- `cache/` — Two-tier memory + Firestore cache
- `db/` — Firestore persistence for AI results and user interaction data
- `analytics/` — Usage tracking and cost guardrails
- `observability/` — Request metrics collection
- `personalization/` — Context enrichment from user history
- `queue/` — Async job queue for deferred persistence
