// ─── ASYNC JOB QUEUE ──────────────────────────────────────────────────────────
// Lightweight in-process job queue for deferred, non-critical tasks.
//
// Use cases:
//   - Deferred Firestore persistence (don't block the response)
//   - Analytics/usage flushing
//   - Post-response logging
//   - Async cache warming
//
// This is NOT a distributed job queue (no Redis/RabbitMQ). It's designed for
// Next.js serverless functions where each instance processes its own queue.
// For true distributed processing, swap with Bull/BullMQ when Redis is added.
//
// Design:
//   - Jobs are added to a FIFO queue
//   - A background flush processes jobs in batches
//   - Failed jobs are retried with exponential backoff (max 3 attempts)
//   - Dead-lettered jobs are logged but not lost

import { logger } from "@/utils/logger";
import { isEnabled, getFlagValue } from "@/config/features";

const TAG = "queue:jobs";

// ─── JOB STORE ────────────────────────────────────────────────────────────────

const pendingJobs = [];
const deadLetterQueue = [];
let isProcessing = false;
let processedCount = 0;
let failedCount = 0;

const MAX_RETRIES = 3;
const MAX_QUEUE_SIZE = 500;
const MAX_DEAD_LETTERS = 100;

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

/**
 * Enqueue a job for background processing.
 *
 * @param {string} name - Job name (e.g. "persist:quiz-result", "analytics:flush")
 * @param {Function} handler - Async function to execute
 * @param {object} [options]
 * @param {number} [options.priority=0] - Higher = processed first
 * @param {number} [options.delayMs=0] - Delay before processing
 * @param {object} [options.metadata] - Extra context for logging
 * @returns {string} Job ID
 */
export function enqueue(name, handler, options = {}) {
  if (!isEnabled("ENABLE_QUEUE")) {
    // Queue disabled — execute synchronously (fire-and-forget)
    handler().catch((err) =>
      logger.warn(TAG, `Direct execution failed: ${name}`, err.message)
    );
    return "sync";
  }

  if (pendingJobs.length >= MAX_QUEUE_SIZE) {
    logger.warn(TAG, "Queue full — dropping job", { name, queueSize: pendingJobs.length });
    return null;
  }

  const job = {
    id: `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    handler,
    priority: options.priority || 0,
    delayMs: options.delayMs || 0,
    metadata: options.metadata || {},
    attempts: 0,
    createdAt: Date.now(),
    executeAfter: Date.now() + (options.delayMs || 0),
  };

  pendingJobs.push(job);

  // Sort by priority (higher first), then by creation time
  pendingJobs.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);

  logger.debug(TAG, "Job enqueued", { id: job.id, name, queueSize: pendingJobs.length });

  // Trigger processing if not already running
  scheduleFlush();

  return job.id;
}

/**
 * Convenience: Enqueue a deferred persistence operation.
 * @param {string} label
 * @param {Function} persistFn
 */
export function deferPersist(label, persistFn) {
  return enqueue(`persist:${label}`, persistFn, { priority: -1 });
}

/**
 * Get queue statistics.
 */
export function getQueueStats() {
  return {
    pending: pendingJobs.length,
    processed: processedCount,
    failed: failedCount,
    deadLettered: deadLetterQueue.length,
    isProcessing,
  };
}

/**
 * Get dead-lettered jobs for inspection.
 */
export function getDeadLetters() {
  return deadLetterQueue.map((j) => ({
    id: j.id,
    name: j.name,
    attempts: j.attempts,
    error: j.lastError,
    createdAt: new Date(j.createdAt).toISOString(),
  }));
}

// ─── INTERNAL: PROCESSING ENGINE ──────────────────────────────────────────────

let flushTimer = null;

function scheduleFlush() {
  if (flushTimer) return;
  const interval = getFlagValue("QUEUE_FLUSH_INTERVAL_MS") || 5000;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    processQueue();
  }, Math.min(interval, 1000)); // Process quickly, at most 1s delay
}

async function processQueue() {
  if (isProcessing || pendingJobs.length === 0) return;
  isProcessing = true;

  const batchSize = 10;
  const now = Date.now();

  try {
    // Process up to batchSize jobs that are ready
    let processed = 0;
    while (pendingJobs.length > 0 && processed < batchSize) {
      const job = pendingJobs[0];

      // Check delay
      if (job.executeAfter > now) break;

      pendingJobs.shift();
      processed++;

      try {
        await job.handler();
        processedCount++;
        logger.debug(TAG, "Job completed", { id: job.id, name: job.name });
      } catch (err) {
        job.attempts++;
        job.lastError = err.message;

        if (job.attempts < MAX_RETRIES) {
          // Retry with exponential backoff
          job.executeAfter = Date.now() + Math.pow(2, job.attempts) * 1000;
          pendingJobs.push(job);
          logger.warn(TAG, `Job failed, retry ${job.attempts}/${MAX_RETRIES}`, {
            id: job.id,
            name: job.name,
            error: err.message,
          });
        } else {
          // Dead-letter
          failedCount++;
          if (deadLetterQueue.length < MAX_DEAD_LETTERS) {
            deadLetterQueue.push(job);
          }
          logger.error(TAG, "Job dead-lettered", {
            id: job.id,
            name: job.name,
            attempts: job.attempts,
            error: err.message,
          });
        }
      }
    }
  } finally {
    isProcessing = false;

    // Schedule next flush if there are remaining jobs
    if (pendingJobs.length > 0) {
      scheduleFlush();
    }
  }
}
