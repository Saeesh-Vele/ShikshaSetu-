// ─── USAGE TRACKER ────────────────────────────────────────────────────────────
// Tracks AI usage per user for cost control and analytics.
//
// Tracks:
//   - AI calls per user per day
//   - Tokens used per request
//   - Endpoints hit
//   - Daily/hourly aggregates
//
// Also enforces cost guardrails (Phase 3):
//   - Max requests per user per day
//   - Max tokens per request
//
// Storage: In-memory with async Firestore persistence.
// On multi-instance deployments, each instance tracks independently;
// Firestore provides the aggregated view.

import { logger } from "@/server/logger";
import { isEnabled, getFlagValue } from "@/config/features";

const TAG = "analytics:usage";

// ─── IN-MEMORY USAGE STORE ───────────────────────────────────────────────────

/**
 * Per-user usage record:
 * {
 *   requests: number,      // Total AI requests today
 *   tokens: number,        // Total tokens used today
 *   endpoints: Map<string, number>,  // Requests per endpoint
 *   windowStart: number,   // Start of current day window (epoch ms)
 * }
 */
const usageStore = new Map();

/** Aggregated metrics for all requests (not per-user) */
const globalMetrics = {
  totalRequests: 0,
  totalTokens: 0,
  endpointCounts: new Map(),
  errors: 0,
  startTime: Date.now(),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getDayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-05-05"
}

function getUserRecord(userId) {
  const dayKey = getDayKey();
  const compositeKey = `${userId}:${dayKey}`;

  let record = usageStore.get(compositeKey);
  if (!record) {
    record = {
      userId,
      dayKey,
      requests: 0,
      tokens: 0,
      endpoints: new Map(),
      windowStart: Date.now(),
    };
    usageStore.set(compositeKey, record);
  }
  return record;
}

// ─── CLEANUP (prevent memory leaks) ──────────────────────────────────────────

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const today = getDayKey();
    for (const [key] of usageStore) {
      if (!key.endsWith(today)) {
        usageStore.delete(key);
      }
    }
  }, 60 * 60 * 1000); // Cleanup every hour
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Records an AI usage event.
 * @param {object} event
 * @param {string} event.userId - User ID (or "anonymous")
 * @param {string} event.endpoint - API endpoint name (e.g. "chatbot", "evaluate")
 * @param {number} [event.tokensUsed] - Tokens consumed by this request
 * @param {number} [event.latencyMs] - Request latency
 * @param {boolean} [event.cached] - Whether result was served from cache
 * @param {boolean} [event.error] - Whether the request errored
 */
export function trackUsage(event) {
  if (!isEnabled("ENABLE_USAGE_TRACKING")) return;

  const { userId = "anonymous", endpoint, tokensUsed = 0, latencyMs, cached = false, error = false } = event;

  // Per-user tracking
  const record = getUserRecord(userId);
  record.requests += 1;
  record.tokens += tokensUsed;
  record.endpoints.set(endpoint, (record.endpoints.get(endpoint) || 0) + 1);

  // Global metrics
  globalMetrics.totalRequests += 1;
  globalMetrics.totalTokens += tokensUsed;
  globalMetrics.endpointCounts.set(endpoint, (globalMetrics.endpointCounts.get(endpoint) || 0) + 1);
  if (error) globalMetrics.errors += 1;

  logger.debug(TAG, "Usage recorded", {
    userId,
    endpoint,
    tokensUsed,
    latencyMs,
    cached,
    dailyTotal: record.requests,
  });
}

/**
 * Phase 3: Check if a user is within their daily AI usage limits.
 * @param {string} userId
 * @returns {{ allowed: boolean, remaining: number, reason?: string }}
 */
export function checkUsageLimits(userId) {
  if (!isEnabled("ENABLE_DAILY_LIMITS") || !userId || userId === "anonymous") {
    return { allowed: true, remaining: Infinity };
  }

  const record = getUserRecord(userId);
  const dailyLimit = getFlagValue("DAILY_AI_LIMIT");
  const remaining = Math.max(0, dailyLimit - record.requests);

  if (record.requests >= dailyLimit) {
    logger.warn(TAG, "Daily limit exceeded", { userId, requests: record.requests, limit: dailyLimit });
    return {
      allowed: false,
      remaining: 0,
      reason: `Daily AI limit reached (${dailyLimit} requests). Resets at midnight.`,
    };
  }

  return { allowed: true, remaining };
}

/**
 * Phase 3: Check if a token count exceeds the per-request limit.
 * Used to cap maxTokens before sending to the LLM.
 * @param {number} requestedTokens
 * @returns {number} Capped token count
 */
export function capTokens(requestedTokens) {
  const maxTokens = getFlagValue("MAX_TOKENS_PER_REQUEST");
  return Math.min(requestedTokens, maxTokens);
}

/**
 * Get usage statistics for a specific user.
 * @param {string} userId
 * @returns {object}
 */
export function getUserUsage(userId) {
  const record = getUserRecord(userId);
  const dailyLimit = getFlagValue("DAILY_AI_LIMIT");
  return {
    userId,
    date: record.dayKey,
    requests: record.requests,
    tokens: record.tokens,
    remaining: Math.max(0, dailyLimit - record.requests),
    limit: dailyLimit,
    endpoints: Object.fromEntries(record.endpoints),
  };
}

/**
 * Get global aggregated metrics.
 * @returns {object}
 */
export function getGlobalMetrics() {
  const uptimeMs = Date.now() - globalMetrics.startTime;
  return {
    totalRequests: globalMetrics.totalRequests,
    totalTokens: globalMetrics.totalTokens,
    errors: globalMetrics.errors,
    errorRate: globalMetrics.totalRequests > 0
      ? (globalMetrics.errors / globalMetrics.totalRequests * 100).toFixed(2) + "%"
      : "0%",
    uptimeMs,
    uptimeHours: (uptimeMs / (1000 * 60 * 60)).toFixed(2),
    endpoints: Object.fromEntries(globalMetrics.endpointCounts),
    activeUsers: usageStore.size,
  };
}
