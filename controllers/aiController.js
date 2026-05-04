// ─── AI CONTROLLER ────────────────────────────────────────────────────────────
// Orchestration layer: Route → Controller → Cache → Pipeline → Persist
//
// Controllers handle:
//   - Input validation (via validator)
//   - Cache lookups (L1 memory → pipeline)
//   - Calling the right pipeline
//   - Persisting results to Firestore
//   - Shaping the response envelope
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
import { validateEvaluateInput, validateCareerPredictionInput, validateChatbotInput } from "@/utils/validator";
import { ApiError } from "@/utils/errorHandler";
import { logger } from "@/utils/logger";

const TAG = "controller:ai";

/**
 * Handles subject advisor evaluation requests.
 * Flow: Validate → Cache check → Pipeline → Cache set → Persist → Return
 */
export async function handleEvaluate(body, userId = null) {
  // Phase 6: Input validation
  validateEvaluateInput(body);

  const answers = body.answers;
  const classLevel = body.classLevel || "12th";

  // Phase 4: Cache check
  const cacheKey = generateCacheKey("evaluate", { answers, classLevel });
  const cached = evaluateCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Evaluate cache hit", { classLevel, userId });
    return cached;
  }

  // Execute pipeline
  const response = await runEvaluatePipeline({ answers, classLevel });

  // Phase 4: Cache set
  evaluateCache.set(cacheKey, response);

  // Phase 2: Persist result
  if (userId) {
    saveQuizResult(userId, "evaluate", response.result, {
      classLevel,
      answersCount: answers.length,
    }).catch((err) => logger.warn(TAG, "Failed to persist evaluate result", err.message));
  }

  return response;
}

/**
 * Handles career prediction requests.
 */
export async function handleCareerPrediction(body, userId = null) {
  validateCareerPredictionInput(body);

  const answers = body.answers;

  // Cache check
  const cacheKey = generateCacheKey("prediction", { answers });
  const cached = predictionCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Prediction cache hit", { userId });
    return cached;
  }

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

  // Persist
  if (userId) {
    saveQuizResult(userId, "career-prediction", prediction.data, {
      confidence: prediction.confidence,
      answersCount: answers.length,
    }).catch((err) => logger.warn(TAG, "Failed to persist prediction result", err.message));
  }

  return response;
}

/**
 * Handles chatbot message requests.
 */
export async function handleChatbot(body, userId = null) {
  validateChatbotInput(body);

  const { message } = body;

  // Cache check (exact message match for common queries)
  const cacheKey = generateCacheKey("chat", { message: message.toLowerCase().trim() });
  const cached = chatCache.get(cacheKey);
  if (cached) {
    logger.info(TAG, "Chat cache hit", { userId });
    return cached;
  }

  const reply = await runChatbotPipeline(message);
  const response = { reply };

  // Cache set
  chatCache.set(cacheKey, response);

  // Persist chat exchange
  if (userId) {
    saveChatMessage(userId, message, reply)
      .catch((err) => logger.warn(TAG, "Failed to persist chat message", err.message));
  }

  return response;
}
