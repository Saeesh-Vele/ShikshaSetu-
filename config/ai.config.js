// ─── AI MODEL & PIPELINE CONFIGURATION ────────────────────────────────────────
// Central source of truth for all AI model parameters.
// Change values here to update ALL pipelines simultaneously.

export const AI_CONFIG = {
  // ─── Groq Models ─────────────────────────────────────────────
  groq: {
    apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    models: {
      versatile: "llama-3.3-70b-versatile",
      fast: "llama-3.1-8b-instant",
    },
    defaults: {
      temperature: 0.7,
      maxTokens: 1500,
      lowTemperature: 0.1,   // For structured/JSON output
    },
  },

  // ─── Gemini Models ───────────────────────────────────────────
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    models: {
      flash: "gemini-2.0-flash",
      flashLatest: "gemini-2.5-flash",
    },
    defaults: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  },

  // ─── Pipeline Limits ─────────────────────────────────────────
  pipelines: {
    maxRetries: 2,
    fetchTimeoutMs: 20000,
    retryBackoffMs: 1000,
  },

  // ─── Scoring Constraints ─────────────────────────────────────
  scoring: {
    minConfidence: 60,
    maxConfidence: 97,
    defaultConfidence: 75,
    fallbackConfidence: 72,
  },
};
