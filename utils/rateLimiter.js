// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
// In-memory sliding-window rate limiter for API routes.
// Zero dependencies. Works per-IP for serverless Next.js functions.
//
// Note: In production with multiple instances, use Redis-backed rate limiting.
// This provides per-instance protection against abuse.

import { logger } from "@/utils/logger";

const TAG = "middleware:rate-limiter";

/**
 * In-memory store: Map<string, { count, windowStart }>
 * Auto-cleans expired entries every 5 minutes to prevent memory leaks.
 */
const store = new Map();

// Periodic cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.windowStart > entry.windowMs * 2) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Creates a rate limiter middleware config.
 * @param {object} options
 * @param {number} options.maxRequests - Max requests per window (default: 20)
 * @param {number} options.windowMs - Window duration in ms (default: 60000 = 1 min)
 * @returns {{ check: (identifier: string) => { allowed: boolean, remaining: number, resetMs: number } }}
 */
export function createRateLimiter({ maxRequests = 20, windowMs = 60 * 1000 } = {}) {
  return {
    /**
     * Check if a request should be allowed.
     * @param {string} identifier - Usually IP address or userId
     * @returns {{ allowed: boolean, remaining: number, resetMs: number }}
     */
    check(identifier) {
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || (now - entry.windowStart > windowMs)) {
        // New window
        store.set(identifier, { count: 1, windowStart: now, windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetMs: windowMs };
      }

      if (entry.count >= maxRequests) {
        const resetMs = windowMs - (now - entry.windowStart);
        logger.warn(TAG, "Rate limit exceeded", { identifier, count: entry.count });
        return { allowed: false, remaining: 0, resetMs };
      }

      // Increment
      entry.count += 1;
      const remaining = maxRequests - entry.count;
      const resetMs = windowMs - (now - entry.windowStart);
      return { allowed: true, remaining, resetMs };
    },
  };
}

// ─── PRE-CONFIGURED LIMITERS ────────────────────────────────────────────────

/** Chatbot: 30 requests per minute (conversational pace) */
export const chatbotLimiter = createRateLimiter({ maxRequests: 30, windowMs: 60 * 1000 });

/** AI evaluation: 10 requests per minute (expensive LLM calls) */
export const evaluateLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60 * 1000 });

/** Career prediction: 5 requests per minute (multi-step pipeline) */
export const predictionLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60 * 1000 });

/** Career guidance: 10 requests per minute */
export const guidanceLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60 * 1000 });

/**
 * Extracts a client identifier from a Next.js request.
 * Uses forwarded IP → connection IP → fallback.
 */
export function getClientIdentifier(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}
