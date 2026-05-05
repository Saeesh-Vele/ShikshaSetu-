// ─── AI CONTROLLER ────────────────────────────────────────────────────────────
// Orchestration layer: Route → Controller → Cache → Pipeline → Persist
//
// Controllers handle:
//   - Input validation (via validator)
//   - Cache lookups (L1 memory → L2 Firestore)
//   - Usage tracking & cost guardrails
//   - Personalization context injection
//   - Calling the right pipeline
//   - Persisting results via async queue
//   - Shaping the response envelope
//   - Observability metrics
//
// Controllers do NOT handle:
//   - HTTP request/response (route's job)
//   - Rate limiting / auth (middleware's job)
//   - AI prompts / LLM calls (pipeline's job)

import { runEvaluatePipeline } from "@/services/ai/pipelines/evaluatePipeline";
import { runCareerPredictionPipeline } from "@/services/ai/pipelines/careerPredictionPipeline";
import { runChatbotPipeline } from "@/services/ai/pipelines/chatbotPipeline";
import { saveQuizResult, saveChatMessage } from "@/services/db/firestoreService";
import { chatCache, evaluateCache, predictionCache, generateCacheKey } from "@/services/cache/memoryCache";
import { validateEvaluateInput, validateCareerPredictionInput, validateChatbotInput } from "@/server/middleware/validator";
import { ApiError } from "@/server/middleware/errorHandler";
import { logger } from "@/server/logger";

// ─── New Infrastructure Imports ──────────────────────────────────────────────
import { trackUsage, checkUsageLimits } from "@/services/analytics/usageTracker";
import { getChatPersonalization, getCareerPersonalization } from "@/services/personalization/contextBuilder";
import { deferPersist } from "@/services/queue/jobQueue";
import { recordRequest, recordCacheEvent } from "@/services/observability/metricsCollector";

const TAG = "controller:ai";

// ─── USAGE GUARD ──────────────────────────────────────────────────────────────

/**
 * Checks daily usage limits. Throws ApiError(429) if exceeded.
 */
function enforceUsageLimits(userId) {
  const { allowed, remaining, reason } = checkUsageLimits(userId);
  if (!allowed) {
    throw new ApiError(reason, 429);
  }
  return remaining;
}

// ─── EVALUATE ─────────────────────────────────────────────────────────────────

/**
 * Handles subject advisor evaluation requests.
 * Flow: Validate → Limits → Cache check → Personalize → Pipeline → Cache set → Track → Persist → Return
 */
export async function handleEvaluate(body, userId = null) {
  const startTime = Date.now();

  // Input validation
  validateEvaluateInput(body);

  // Cost guardrails
  if (userId) enforceUsageLimits(userId);

  const answers = body.answers;
  const classLevel = body.classLevel || "12th";

  // Cache check (L1 sync, L2 async)
  const cacheKey = generateCacheKey("evaluate", { answers, classLevel });

  // Try L1 first (sync)
  let cached = evaluateCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Evaluate L1 cache hit", { classLevel, userId });
    recordCacheEvent(true);
    recordRequest({ endpoint: "evaluate", latencyMs: Date.now() - startTime, status: 200 });
    trackUsage({ userId, endpoint: "evaluate", cached: true });
    return cached;
  }

  // Try L2 (async Firestore)
  cached = await evaluateCache.getAsync(cacheKey);
  if (cached) {
    logger.info(TAG, "Evaluate L2 cache hit", { classLevel, userId });
    recordCacheEvent(true);
    recordRequest({ endpoint: "evaluate", latencyMs: Date.now() - startTime, status: 200 });
    trackUsage({ userId, endpoint: "evaluate", cached: true });
    return cached;
  }

  recordCacheEvent(false);

  // Execute pipeline
  const response = await runEvaluatePipeline({ answers, classLevel });

  // Cache set (L1 immediate, L2 async)
  evaluateCache.set(cacheKey, response);

  const latencyMs = Date.now() - startTime;

  // Track usage
  trackUsage({ userId, endpoint: "evaluate", latencyMs });
  recordRequest({ endpoint: "evaluate", latencyMs, status: 200 });

  // Persist result (deferred via queue)
  if (userId) {
    deferPersist("evaluate", () =>
      saveQuizResult(userId, "evaluate", response.result, {
        classLevel,
        answersCount: answers.length,
      })
    );
  }

  return response;
}

// ─── CAREER PREDICTION ───────────────────────────────────────────────────────

/**
 * Handles career prediction requests.
 */
export async function handleCareerPrediction(body, userId = null) {
  const startTime = Date.now();

  validateCareerPredictionInput(body);

  // Cost guardrails
  if (userId) enforceUsageLimits(userId);

  const answers = body.answers;

  // Cache check
  const cacheKey = generateCacheKey("prediction", { answers });

  let cached = predictionCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Prediction L1 cache hit", { userId });
    recordCacheEvent(true);
    recordRequest({ endpoint: "career-prediction", latencyMs: Date.now() - startTime, status: 200 });
    trackUsage({ userId, endpoint: "career-prediction", cached: true });
    return cached;
  }

  cached = await predictionCache.getAsync(cacheKey);
  if (cached) {
    logger.info(TAG, "Prediction L2 cache hit", { userId });
    recordCacheEvent(true);
    recordRequest({ endpoint: "career-prediction", latencyMs: Date.now() - startTime, status: 200 });
    trackUsage({ userId, endpoint: "career-prediction", cached: true });
    return cached;
  }

  recordCacheEvent(false);

  const prediction = await runCareerPredictionPipeline(answers);

  const response = {
    result: prediction.data,
    metadata: {
      confidence: prediction.confidence,
      attempts: prediction.attempts,
      errorHistory: prediction.errorHistory,
    },
  };

  // Cache set
  predictionCache.set(cacheKey, response);

  const latencyMs = Date.now() - startTime;
  trackUsage({ userId, endpoint: "career-prediction", latencyMs });
  recordRequest({ endpoint: "career-prediction", latencyMs, status: 200 });

  // Persist (deferred)
  if (userId) {
    deferPersist("career-prediction", () =>
      saveQuizResult(userId, "career-prediction", prediction.data, {
        confidence: prediction.confidence,
        answersCount: answers.length,
      })
    );
  }

  return response;
}

// ─── CHATBOT ──────────────────────────────────────────────────────────────────

/**
 * Handles chatbot message requests.
 * Enhanced with personalization context.
 */
export async function handleChatbot(body, userId = null) {
  const startTime = Date.now();

  validateChatbotInput(body);

  // Cost guardrails
  if (userId) enforceUsageLimits(userId);

  const { message } = body;

  // Cache check (exact message match for common queries)
  const cacheKey = generateCacheKey("chat", { message: message.toLowerCase().trim() });

  let cached = chatCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Chat L1 cache hit", { userId });
    recordCacheEvent(true);
    recordRequest({ endpoint: "chatbot", latencyMs: Date.now() - startTime, status: 200 });
    trackUsage({ userId, endpoint: "chatbot", cached: true });
    return cached;
  }

  recordCacheEvent(false);

  // Phase 4: Personalization — inject user context into pipeline
  let personalizationContext = null;
  if (userId) {
    try {
      personalizationContext = await getChatPersonalization(userId);
    } catch (err) {
      logger.warn(TAG, "Personalization failed, proceeding without", err.message);
    }
  }

  // Execute pipeline (personalization context passed alongside message)
  const reply = await runChatbotPipeline(message, personalizationContext);
  const response = { reply };

  // Cache set
  chatCache.set(cacheKey, response);

  const latencyMs = Date.now() - startTime;
  trackUsage({ userId, endpoint: "chatbot", latencyMs });
  recordRequest({ endpoint: "chatbot", latencyMs, status: 200 });

  // Persist chat exchange (deferred)
  if (userId) {
    deferPersist("chat-message", () =>
      saveChatMessage(userId, message, reply)
    );
  }

  return response;
}
