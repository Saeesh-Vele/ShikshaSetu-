// ─── STRUCTURED LOGGER ────────────────────────────────────────────────────────
// Centralized logging with context tags for debugging AI pipelines.
// All logs go through here for consistent formatting and future extensibility
// (e.g., external log aggregation, log levels, redaction).
//
// Supports:
//   - Tagged log levels (DEBUG, INFO, WARN, ERROR)
//   - Request context (requestId, userId, latency)
//   - Pipeline-specific helpers
//   - Timer utilities for latency measurement

const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

// Set via env: LOG_LEVEL=DEBUG|INFO|WARN|ERROR (default: INFO)
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

function formatMessage(level, tag, message, data) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}] [${tag}]`;
  if (data !== undefined) {
    return { prefix, message, data };
  }
  return { prefix, message };
}

export const logger = {
  debug(tag, message, data) {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      const { prefix, ...rest } = formatMessage("DEBUG", tag, message, data);
      console.debug(prefix, rest.message, rest.data ?? "");
    }
  },

  info(tag, message, data) {
    if (currentLevel <= LOG_LEVELS.INFO) {
      const { prefix, ...rest } = formatMessage("INFO", tag, message, data);
      console.log(prefix, rest.message, rest.data ?? "");
    }
  },

  warn(tag, message, data) {
    if (currentLevel <= LOG_LEVELS.WARN) {
      const { prefix, ...rest } = formatMessage("WARN", tag, message, data);
      console.warn(prefix, rest.message, rest.data ?? "");
    }
  },

  error(tag, message, data) {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      const { prefix, ...rest } = formatMessage("ERROR", tag, message, data);
      console.error(prefix, rest.message, rest.data ?? "");
    }
  },

  /** Log an AI pipeline step with timing */
  pipeline(pipelineName, step, data) {
    this.info(`pipeline:${pipelineName}`, step, data);
  },

  /**
   * Log an API request with full context.
   * @param {string} tag - Route tag (e.g., "api:chatbot")
   * @param {string} action - What happened (e.g., "Request completed")
   * @param {object} context - { requestId, userId, latencyMs, status, ... }
   */
  request(tag, action, context = {}) {
    const { requestId, userId, latencyMs, ...rest } = context;
    this.info(tag, action, {
      reqId: requestId || "unknown",
      uid: userId || "anonymous",
      latency: latencyMs !== undefined ? `${latencyMs}ms` : undefined,
      ...rest,
    });
  },

  /**
   * Creates a timer that logs elapsed time on completion.
   * Usage:
   *   const timer = logger.startTimer("pipeline:evaluate", "Groq LLM call");
   *   // ... do work ...
   *   timer.done({ tokens: 1500 }); // logs with latency
   */
  startTimer(tag, operation) {
    const start = Date.now();
    return {
      done(extraData = {}) {
        const latencyMs = Date.now() - start;
        logger.info(tag, `${operation} completed`, { latencyMs, ...extraData });
        return latencyMs;
      },
      elapsed() {
        return Date.now() - start;
      },
    };
  },
};
