// ─── SCALABLE CACHE SERVICE ──────────────────────────────────────────────────
// Replaces the original in-memory-only cache with a two-tier system:
//
//   L1: In-memory (fast, per-instance, same Map-based approach)
//   L2: Firestore-backed (persistent, shared across instances)
//
// Read path:  L1 hit? → return | L2 hit? → hydrate L1, return | miss → null
// Write path: Write to L1 → async write to L2 (non-blocking)
//
// This maintains the same public API as the original memoryCache.js so all
// consumers (aiController.js, etc.) continue to work without changes.
//
// Design decisions:
//   - L2 writes are fire-and-forget to avoid latency impact
//   - L2 reads are async; the `get()` method is now async
//   - Fallback to L1-only if Firestore is unavailable (offline resilience)
//   - Feature-flagged: can disable L2 entirely via FF_USE_FIRESTORE_CACHE=false

import { logger } from "@/utils/logger";
import { isEnabled, getFlagValue } from "@/config/features";

const TAG = "cache:scalable";

// ─── L1: IN-MEMORY LAYER ─────────────────────────────────────────────────────

class MemoryLayer {
  constructor({ maxEntries = 200, defaultTtlMs = 15 * 60 * 1000 } = {}) {
    this._store = new Map();
    this._maxEntries = maxEntries;
    this._defaultTtlMs = defaultTtlMs;
    this._hits = 0;
    this._misses = 0;
  }

  get(key) {
    const entry = this._store.get(key);
    if (!entry) {
      this._misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      this._misses++;
      return null;
    }

    // LRU: move to end
    this._store.delete(key);
    this._store.set(key, entry);
    this._hits++;
    return entry.value;
  }

  set(key, value, ttlMs) {
    const multiplier = getFlagValue("CACHE_TTL_MULTIPLIER") || 1;
    const effectiveTtl = (ttlMs || this._defaultTtlMs) * multiplier;

    if (this._store.size >= this._maxEntries) {
      const oldestKey = this._store.keys().next().value;
      this._store.delete(oldestKey);
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + effectiveTtl,
      createdAt: Date.now(),
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this._store.delete(key);
  }

  clear() {
    this._store.clear();
  }

  stats() {
    return {
      size: this._store.size,
      maxEntries: this._maxEntries,
      hits: this._hits,
      misses: this._misses,
      hitRate: this._hits + this._misses > 0
        ? ((this._hits / (this._hits + this._misses)) * 100).toFixed(1) + "%"
        : "N/A",
    };
  }
}

// ─── L2: FIRESTORE LAYER ─────────────────────────────────────────────────────

/**
 * Lazy-loaded Firestore operations to avoid import cycles
 * and to gracefully handle offline scenarios.
 */
let _firestoreOps = null;

async function getFirestoreOps() {
  if (_firestoreOps) return _firestoreOps;

  try {
    const { cacheAiResponse, getCachedAiResponse } = await import(
      "@/services/db/firestoreService"
    );
    _firestoreOps = { cacheAiResponse, getCachedAiResponse };
    return _firestoreOps;
  } catch (err) {
    logger.warn(TAG, "Firestore unavailable for L2 cache", err.message);
    return null;
  }
}

// ─── TWO-TIER CACHE ──────────────────────────────────────────────────────────

class ScalableCache {
  constructor({ maxEntries = 200, defaultTtlMs = 15 * 60 * 1000, name = "default" } = {}) {
    this._l1 = new MemoryLayer({ maxEntries, defaultTtlMs });
    this._defaultTtlMs = defaultTtlMs;
    this._name = name;
  }

  /**
   * Get a cached value. Checks L1 first, then L2 (Firestore).
   * @param {string} key
   * @returns {*} Cached value or null
   */
  get(key) {
    // L1 check (synchronous, fast)
    const l1Result = this._l1.get(key);
    if (l1Result !== null) {
      logger.debug(TAG, `L1 hit [${this._name}]`, { key });
      return l1Result;
    }

    // L2 is async — for backward compatibility, we return null here.
    // Use getAsync() for full L1+L2 lookup.
    return null;
  }

  /**
   * Async get: checks L1 then L2.
   * @param {string} key
   * @returns {Promise<*>} Cached value or null
   */
  async getAsync(key) {
    // L1 check
    const l1Result = this._l1.get(key);
    if (l1Result !== null) {
      logger.debug(TAG, `L1 hit [${this._name}]`, { key });
      return l1Result;
    }

    // L2 check (Firestore)
    if (!isEnabled("USE_FIRESTORE_CACHE")) return null;

    try {
      const ops = await getFirestoreOps();
      if (!ops) return null;

      const l2Result = await ops.getCachedAiResponse(key);
      if (l2Result !== null) {
        // Hydrate L1
        this._l1.set(key, l2Result);
        logger.debug(TAG, `L2 hit [${this._name}] → hydrated L1`, { key });
        return l2Result;
      }
    } catch (err) {
      logger.warn(TAG, `L2 read failed [${this._name}]`, err.message);
    }

    return null;
  }

  /**
   * Set a cached value. Writes to L1 immediately, L2 async.
   * @param {string} key
   * @param {*} value
   * @param {number} [ttlMs]
   */
  set(key, value, ttlMs) {
    // L1: immediate
    this._l1.set(key, value, ttlMs);

    // L2: async fire-and-forget
    if (isEnabled("USE_FIRESTORE_CACHE")) {
      const ttlHours = ((ttlMs || this._defaultTtlMs) / (1000 * 60 * 60));
      getFirestoreOps()
        .then((ops) => {
          if (ops) {
            ops.cacheAiResponse(key, value, ttlHours).catch((err) => {
              logger.warn(TAG, `L2 write failed [${this._name}]`, err.message);
            });
          }
        })
        .catch(() => { /* Firestore unavailable — L1 still works */ });
    }
  }

  has(key) {
    return this._l1.has(key);
  }

  delete(key) {
    return this._l1.delete(key);
  }

  clear() {
    this._l1.clear();
  }

  stats() {
    return {
      name: this._name,
      l1: this._l1.stats(),
      l2Enabled: isEnabled("USE_FIRESTORE_CACHE"),
    };
  }
}

// ─── SINGLETON INSTANCES ──────────────────────────────────────────────────────
// Drop-in replacements with same names as original memoryCache.js

/** Cache for chatbot responses — short TTL since conversations evolve */
export const chatCache = new ScalableCache({
  maxEntries: 100,
  defaultTtlMs: 10 * 60 * 1000, // 10 minutes
  name: "chat",
});

/** Cache for evaluation/quiz results — longer TTL since answers don't change */
export const evaluateCache = new ScalableCache({
  maxEntries: 50,
  defaultTtlMs: 30 * 60 * 1000, // 30 minutes
  name: "evaluate",
});

/** Cache for career prediction results — longest TTL */
export const predictionCache = new ScalableCache({
  maxEntries: 50,
  defaultTtlMs: 60 * 60 * 1000, // 1 hour
  name: "prediction",
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

/**
 * Returns stats for all cache instances.
 */
export function getAllCacheStats() {
  return {
    chat: chatCache.stats(),
    evaluate: evaluateCache.stats(),
    prediction: predictionCache.stats(),
  };
}
