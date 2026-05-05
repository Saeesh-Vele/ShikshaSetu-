# server/

This directory contains Next.js middleware utilities and server-side infrastructure. **Nothing in this folder should ever be imported by client components** — it runs exclusively on the server.

`middleware/` holds composable API route middleware (rate limiting, auth verification, input validation, error handling). `logger.js` provides the structured logging used across all server code. The root `middleware.js` (one level up) handles edge-layer route protection.
