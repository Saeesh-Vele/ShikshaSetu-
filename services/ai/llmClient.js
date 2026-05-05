// ─── MULTI-MODEL AI CLIENT ────────────────────────────────────────────────────
// Enhanced LLM client with:
//   - Multi-model support (Groq → Gemini fallback)
//   - Dynamic model selection based on feature flags
//   - Token capping for cost control
//   - Automatic retry with model fallback
//   - Usage tracking integration
//   - Observability metrics
//
// Replaces the original llmClient.js while maintaining backward compatibility.
// The original `generateGroqCompletion` export is preserved.

import Groq from "groq-sdk";
import { AI_CONFIG } from "@/config/ai.config";
import { isEnabled, getFlagValue } from "@/config/features";
import { capTokens } from "@/services/analytics/usageTracker";
import { recordModelUsage } from "@/services/observability/metricsCollector";
import { logger } from "@/server/logger";

const TAG = "ai:llm-client";

// ─── GROQ CLIENT ──────────────────────────────────────────────────────────────

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in environment variables");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

// ─── GEMINI CLIENT (Fallback) ─────────────────────────────────────────────────

async function callGemini(messages, temperature, maxTokens) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing for fallback");
  }

  const { gemini } = AI_CONFIG;
  const model = gemini.models.flash;
  const url = `${gemini.baseUrl}/${model}:generateContent?key=${apiKey}`;

  // Convert chat messages format to Gemini format
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  // Prepend system message as a user message if present
  const systemMsg = messages.find((m) => m.role === "system");
  if (systemMsg) {
    contents.unshift({
      role: "user",
      parts: [{ text: `[System Instructions]\n${systemMsg.content}` }],
    });
    // Gemini requires alternating roles, add a model acknowledgment
    contents.splice(1, 0, {
      role: "model",
      parts: [{ text: "Understood. I will follow these instructions." }],
    });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: temperature || gemini.defaults.temperature,
        maxOutputTokens: maxTokens || gemini.defaults.maxOutputTokens,
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  return text;
}

// ─── CORE GENERATION FUNCTION ─────────────────────────────────────────────────

/**
 * Generate a completion using the primary model, with optional fallback.
 * This is the main function all pipelines should use.
 *
 * @param {Array} messages - Chat messages [{role, content}]
 * @param {string} [model] - Groq model name (default from config)
 * @param {number} [temperature] - Temperature (default from config)
 * @param {object} [options] - Additional options
 * @param {number} [options.maxTokens] - Max tokens (will be capped by guardrails)
 * @param {boolean} [options.allowFallback] - Allow fallback to Gemini (default: true)
 * @returns {Promise<string>} Generated text
 */
export const generateGroqCompletion = async (
  messages,
  model = null,
  temperature = AI_CONFIG.groq.defaults.temperature,
  options = {}
) => {
  const useGeminiPrimary = isEnabled("GEMINI_AS_PRIMARY");
  const useFastModel = isEnabled("PREFER_FAST_MODEL");
  const allowFallback = options.allowFallback !== false && isEnabled("ENABLE_MODEL_FALLBACK");
  const maxTokens = capTokens(options.maxTokens || AI_CONFIG.groq.defaults.maxTokens);

  // Determine primary model
  const resolvedModel = model ||
    (useFastModel ? AI_CONFIG.groq.models.fast : AI_CONFIG.groq.models.versatile);

  // ─── Strategy 1: Gemini as primary ─────────────────────────
  if (useGeminiPrimary) {
    const timer = logger.startTimer(TAG, "Gemini primary call");
    try {
      const result = await callGemini(messages, temperature, maxTokens);
      const latencyMs = timer.done({ model: "gemini" });
      recordModelUsage({ model: "gemini-primary", tokens: maxTokens, latencyMs });
      return result;
    } catch (geminiErr) {
      logger.warn(TAG, "Gemini primary failed, trying Groq fallback", geminiErr.message);
      // Fall through to Groq
    }
  }

  // ─── Strategy 2: Groq as primary ──────────────────────────
  const timer = logger.startTimer(TAG, `Groq ${resolvedModel} call`);
  try {
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      model: resolvedModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content || "No response";
    const tokensUsed = completion.usage?.total_tokens || 0;
    const latencyMs = timer.done({ model: resolvedModel, tokens: tokensUsed });

    recordModelUsage({ model: resolvedModel, tokens: tokensUsed, latencyMs });
    return content;
  } catch (groqError) {
    timer.done({ model: resolvedModel, failed: true });
    recordModelUsage({ model: resolvedModel, failed: true });
    logger.error(TAG, `Groq ${resolvedModel} failed`, groqError.message);

    // ─── Strategy 3: Fallback to Gemini ────────────────────
    if (allowFallback) {
      logger.info(TAG, "Falling back to Gemini");
      const fallbackTimer = logger.startTimer(TAG, "Gemini fallback call");
      try {
        const result = await callGemini(messages, temperature, maxTokens);
        const latencyMs = fallbackTimer.done({ model: "gemini-fallback" });
        recordModelUsage({ model: "gemini-fallback", tokens: maxTokens, latencyMs });
        return result;
      } catch (geminiError) {
        fallbackTimer.done({ model: "gemini-fallback", failed: true });
        recordModelUsage({ model: "gemini-fallback", failed: true });
        logger.error(TAG, "All models failed", {
          groq: groqError.message,
          gemini: geminiError.message,
        });
        throw new Error(
          `AI generation failed across all models. Groq: ${groqError.message}. Gemini: ${geminiError.message}`
        );
      }
    }

    throw groqError;
  }
};

/**
 * Generate completion with a specific model override (for advanced use cases).
 * @param {"groq"|"gemini"} provider
 * @param {Array} messages
 * @param {object} [options]
 * @returns {Promise<string>}
 */
export async function generateCompletion(provider, messages, options = {}) {
  const temperature = options.temperature || AI_CONFIG.groq.defaults.temperature;
  const maxTokens = capTokens(options.maxTokens || AI_CONFIG.groq.defaults.maxTokens);

  if (provider === "gemini") {
    return callGemini(messages, temperature, maxTokens);
  }

  // Default to Groq
  return generateGroqCompletion(messages, options.model, temperature, {
    ...options,
    maxTokens,
  });
}
