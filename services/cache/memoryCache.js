// ─── IN-MEMORY CACHE ──────────────────────────────────────────────────────────
// Fast, zero-dependency in-memory cache with TTL for AI responses.
// Used as L1 cache before Firestore (L2). Survives only within a single
// server process — perfect for Next.js serverless functions within a warm instance.
//
// Design: LRU-inspired with TTL eviction. Max entries prevents memory leaks.

import { logger } from "@/utils/logger";

const TAG = "cache:memory";

class MemoryCache {
  constructor({ maxEntries = 200, defaultTtlMs = 15 * 60 * 1000 } = {}) {
    this._store = new Map();
    this._maxEntries = maxEntries;
    this._defaultTtlMs = defaultTtlMs;
  }

  /**
   * Get a cached value. Returns null if expired or missing.
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      logger.debug(TAG, "Entry expired", { key });
      return null;
    }

    // Move to end (most recently accessed)
    this._store.delete(key);
    this._store.set(key, entry);

    logger.debug(TAG, "Cache hit", { key });
    return entry.value;
  }

  /**
   * Set a cached value with optional TTL override.
   */
  set(key, value, ttlMs) {
    // Evict oldest entries if at capacity
    if (this._store.size >= this._maxEntries) {
      const oldestKey = this._store.keys().next().value;
      this._store.delete(oldestKey);
      logger.debug(TAG, "Evicted oldest entry", { key: oldestKey });
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs || this._defaultTtlMs),
      createdAt: Date.now(),
    });
  }

  /**
   * Check if a key exists and is not expired.
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Delete a specific key.
   */
  delete(key) {
    return this._store.delete(key);
  }

  /**
   * Clear all entries.
   */
  clear() {
    this._store.clear();
  }

  /**
   * Get cache statistics.
   */
  stats() {
    return {
      size: this._store.size,
      maxEntries: this._maxEntries,
    };
  }
}

// ─── SINGLETON INSTANCES ──────────────────────────────────────────────────────
// Separate caches for different concerns with appropriate TTLs.

/** Cache for chatbot responses — short TTL since conversations evolve */
export const chatCache = new MemoryCache({
  maxEntries: 100,
  defaultTtlMs: 10 * 60 * 1000, // 10 minutes
});

/** Cache for evaluation/quiz results — longer TTL since answers don't change */
export const evaluateCache = new MemoryCache({
  maxEntries: 50,
  defaultTtlMs: 30 * 60 * 1000, // 30 minutes
});

/** Cache for career prediction results — longest TTL */
export const predictionCache = new MemoryCache({
  maxEntries: 50,
  defaultTtlMs: 60 * 60 * 1000, // 1 hour
});

/**
 * Generates a deterministic cache key from an object.
 * Uses JSON.stringify with sorted keys for consistency.
 */
export function generateCacheKey(prefix, data) {
  const sorted = JSON.stringify(data, Object.keys(data).sort());
  // Simple hash using string reduction
  let hash = 0;
  for (let i = 0; i < sorted.length; i++) {
    const char = sorted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${prefix}:${Math.abs(hash).toString(36)}`;
}
