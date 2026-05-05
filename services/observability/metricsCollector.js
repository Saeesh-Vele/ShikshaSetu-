// ─── OBSERVABILITY: METRICS COLLECTOR ─────────────────────────────────────────
// Collects and aggregates real-time metrics for the application:
//   - Request counts per endpoint
//   - Error rates
//   - Latency histograms (p50, p95, p99)
//   - Cache hit/miss rates
//   - AI model usage
//
// Designed for integration with external monitoring (Prometheus, Datadog, etc.)
// but works standalone with periodic log output.
//
// No external dependencies — pure in-memory with structured log export.

import { logger } from "@/server/logger";
import { isEnabled, getFlagValue } from "@/config/features";

const TAG = "observability:metrics";

// ─── METRIC STORES ────────────────────────────────────────────────────────────

const requestMetrics = new Map();    // endpoint → { count, errors, latencies[] }
const modelMetrics = new Map();      // model → { calls, tokens, failures }
const cacheMetrics = { hits: 0, misses: 0 };
const systemStartTime = Date.now();

// ─── LATENCY HISTOGRAM ───────────────────────────────────────────────────────

function computePercentiles(latencies) {
  if (latencies.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0 };

  const sorted = [...latencies].sort((a, b) => a - b);
  const len = sorted.length;

  return {
    p50: sorted[Math.floor(len * 0.5)] || 0,
    p95: sorted[Math.floor(len * 0.95)] || 0,
    p99: sorted[Math.floor(len * 0.99)] || 0,
    avg: Math.round(sorted.reduce((a, b) => a + b, 0) / len),
    min: sorted[0],
    max: sorted[len - 1],
    count: len,
  };
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Record a request metric.
 * @param {object} data
 * @param {string} data.endpoint - API endpoint name
 * @param {number} data.latencyMs - Request duration
 * @param {number} data.status - HTTP status code
 * @param {boolean} [data.error] - Whether request failed
 */
export function recordRequest(data) {
  if (!isEnabled("ENABLE_METRICS")) return;

  const { endpoint, latencyMs, status, error = false } = data;

  let metrics = requestMetrics.get(endpoint);
  if (!metrics) {
    metrics = { count: 0, errors: 0, latencies: [], statuses: new Map() };
    requestMetrics.set(endpoint, metrics);
  }

  metrics.count++;
  if (error || status >= 400) metrics.errors++;

  // Keep last 1000 latencies for percentile calculation
  if (isEnabled("ENABLE_LATENCY_TRACKING")) {
    metrics.latencies.push(latencyMs);
    if (metrics.latencies.length > 1000) {
      metrics.latencies = metrics.latencies.slice(-500); // Keep recent 500
    }
  }

  // Track status code distribution
  const statusKey = String(status);
  metrics.statuses.set(statusKey, (metrics.statuses.get(statusKey) || 0) + 1);
}

/**
 * Record AI model usage.
 * @param {object} data
 * @param {string} data.model - Model name
 * @param {number} [data.tokens] - Tokens consumed
 * @param {boolean} [data.failed] - Whether the call failed
 * @param {number} [data.latencyMs] - Call latency
 */
export function recordModelUsage(data) {
  if (!isEnabled("ENABLE_METRICS")) return;

  const { model, tokens = 0, failed = false, latencyMs } = data;

  let metrics = modelMetrics.get(model);
  if (!metrics) {
    metrics = { calls: 0, tokens: 0, failures: 0, latencies: [] };
    modelMetrics.set(model, metrics);
  }

  metrics.calls++;
  metrics.tokens += tokens;
  if (failed) metrics.failures++;
  if (latencyMs) metrics.latencies.push(latencyMs);
}

/**
 * Record a cache event.
 * @param {boolean} hit
 */
export function recordCacheEvent(hit) {
  if (!isEnabled("ENABLE_METRICS")) return;
  if (hit) cacheMetrics.hits++;
  else cacheMetrics.misses++;
}

/**
 * Get a full metrics snapshot.
 * @returns {object}
 */
export function getMetricsSnapshot() {
  const uptimeMs = Date.now() - systemStartTime;

  // Build endpoint metrics
  const endpoints = {};
  for (const [endpoint, metrics] of requestMetrics) {
    endpoints[endpoint] = {
      totalRequests: metrics.count,
      errors: metrics.errors,
      errorRate: metrics.count > 0
        ? (metrics.errors / metrics.count * 100).toFixed(2) + "%"
        : "0%",
      latency: computePercentiles(metrics.latencies),
      statusCodes: Object.fromEntries(metrics.statuses),
    };
  }

  // Build model metrics
  const models = {};
  for (const [model, metrics] of modelMetrics) {
    models[model] = {
      totalCalls: metrics.calls,
      totalTokens: metrics.tokens,
      failures: metrics.failures,
      failureRate: metrics.calls > 0
        ? (metrics.failures / metrics.calls * 100).toFixed(2) + "%"
        : "0%",
      latency: computePercentiles(metrics.latencies),
    };
  }

  // Cache metrics
  const totalCache = cacheMetrics.hits + cacheMetrics.misses;
  const cache = {
    hits: cacheMetrics.hits,
    misses: cacheMetrics.misses,
    hitRate: totalCache > 0
      ? (cacheMetrics.hits / totalCache * 100).toFixed(2) + "%"
      : "N/A",
  };

  return {
    timestamp: new Date().toISOString(),
    uptime: {
      ms: uptimeMs,
      hours: (uptimeMs / (1000 * 60 * 60)).toFixed(2),
    },
    endpoints,
    models,
    cache,
  };
}

/**
 * Reset all metrics (useful for testing or periodic resets).
 */
export function resetMetrics() {
  requestMetrics.clear();
  modelMetrics.clear();
  cacheMetrics.hits = 0;
  cacheMetrics.misses = 0;
}

// ─── PERIODIC METRIC LOGGING ──────────────────────────────────────────────────

if (typeof setInterval !== "undefined" && isEnabled("ENABLE_METRICS")) {
  const logInterval = getFlagValue("METRICS_LOG_INTERVAL_MS") || 60000;
  setInterval(() => {
    const snapshot = getMetricsSnapshot();
    const totalRequests = Object.values(snapshot.endpoints)
      .reduce((sum, ep) => sum + ep.totalRequests, 0);

    if (totalRequests > 0) {
      logger.info(TAG, "Metrics snapshot", {
        uptime: snapshot.uptime.hours + "h",
        totalRequests,
        cacheHitRate: snapshot.cache.hitRate,
        endpoints: Object.keys(snapshot.endpoints).length,
      });
    }
  }, logInterval);
}
