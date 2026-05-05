// ─── FEATURE FLAGS ────────────────────────────────────────────────────────────
// Centralized feature toggle system for controlling AI models, caching behavior,
// rate limits, and experimental features at runtime.
//
// All flags can be overridden via environment variables using the pattern:
//   FF_<FLAG_NAME>=true|false|<value>
//
// Usage:
//   import { featureFlags, isEnabled } from "@/config/features";
//   if (isEnabled("USE_REDIS_CACHE")) { ... }

import { logger } from "@/server/logger";

const TAG = "config:features";

// ─── FLAG DEFINITIONS ─────────────────────────────────────────────────────────

const FLAG_DEFAULTS = {
  // ─── Cache Strategy ──────────────────────────────────────────
  USE_FIRESTORE_CACHE: true,        // Use Firestore as L2 cache (fallback from memory)
  CACHE_TTL_MULTIPLIER: 1,          // Multiply all TTLs by this factor (e.g. 2 = double TTL)

  // ─── AI Models ───────────────────────────────────────────────
  ENABLE_MODEL_FALLBACK: true,      // Fall back to Gemini if Groq fails
  PREFER_FAST_MODEL: false,         // Use 8B instant model for chatbot (cheaper)
  GEMINI_AS_PRIMARY: false,         // Use Gemini as primary model instead of Groq

  // ─── Cost Guardrails ─────────────────────────────────────────
  ENABLE_USAGE_TRACKING: true,      // Track AI usage per user
  ENABLE_DAILY_LIMITS: true,        // Enforce daily request limits per user
  DAILY_AI_LIMIT: 50,               // Max AI requests per user per day
  MAX_TOKENS_PER_REQUEST: 2000,     // Max tokens to request per AI call

  // ─── Personalization ──────────────────────────────────────────
  ENABLE_PERSONALIZATION: true,     // Use user history for context enrichment
  MAX_HISTORY_CONTEXT: 5,           // Number of past results to include in context

  // ─── Background Processing ────────────────────────────────────
  ENABLE_QUEUE: true,               // Use async job queue for deferred tasks
  QUEUE_FLUSH_INTERVAL_MS: 5000,    // Flush queue every N ms

  // ─── Observability ────────────────────────────────────────────
  ENABLE_METRICS: true,             // Collect request metrics
  ENABLE_LATENCY_TRACKING: true,    // Track per-endpoint latency
  METRICS_LOG_INTERVAL_MS: 60000,   // Log aggregated metrics every N ms

  // ─── Feature Gates ────────────────────────────────────────────
  ENABLE_CHATBOT: true,
  ENABLE_COLLEGE_EXPLORER: true,
  ENABLE_SUBJECT_ADVISOR: true,
  ENABLE_CAREER_PREDICTION: true,
  ENABLE_CAREER_GUIDANCE: true,
};

// ─── FLAG RESOLVER ────────────────────────────────────────────────────────────

/**
 * Resolves a flag value. Priority: env var → default.
 * Env var format: FF_FLAG_NAME
 */
function resolveFlag(flagName) {
  const envKey = `FF_${flagName}`;
  const envVal = process.env[envKey];

  if (envVal !== undefined) {
    // Parse booleans
    if (envVal === "true") return true;
    if (envVal === "false") return false;
    // Parse numbers
    const num = Number(envVal);
    if (!isNaN(num)) return num;
    // Return raw string
    return envVal;
  }

  return FLAG_DEFAULTS[flagName];
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/** Lazily resolved feature flags object */
export const featureFlags = new Proxy(FLAG_DEFAULTS, {
  get(target, prop) {
    if (typeof prop === "string" && prop in target) {
      return resolveFlag(prop);
    }
    return undefined;
  },
});

/**
 * Check if a boolean feature flag is enabled.
 * @param {string} flagName
 * @returns {boolean}
 */
export function isEnabled(flagName) {
  const val = featureFlags[flagName];
  if (val === undefined) {
    logger.warn(TAG, `Unknown feature flag: ${flagName}`);
    return false;
  }
  return Boolean(val);
}

/**
 * Get a numeric feature flag value.
 * @param {string} flagName
 * @returns {number}
 */
export function getFlagValue(flagName) {
  const val = featureFlags[flagName];
  if (val === undefined) {
    logger.warn(TAG, `Unknown feature flag: ${flagName}`);
    return 0;
  }
  return Number(val);
}

/**
 * Returns all resolved flag values (useful for debugging / admin dashboards).
 */
export function getAllFlags() {
  const resolved = {};
  for (const key of Object.keys(FLAG_DEFAULTS)) {
    resolved[key] = resolveFlag(key);
  }
  return resolved;
}
