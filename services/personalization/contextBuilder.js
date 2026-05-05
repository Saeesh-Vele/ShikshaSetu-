// ─── PERSONALIZATION SERVICE ──────────────────────────────────────────────────
// Enhances AI responses with user context from stored data:
//   - Previous quiz results
//   - Chat history
//   - Onboarding preferences
//
// Used to enrich prompts sent to AI models for more relevant, personalized
// career guidance, chatbot responses, and subject recommendations.
//
// Design: Non-blocking, graceful degradation. If user data can't be loaded,
// the system falls back to generic context.

import { getQuizResults, getChatHistory } from "@/services/db/firestoreService";
import { isEnabled, getFlagValue } from "@/config/features";
import { logger } from "@/server/logger";

const TAG = "service:personalization";

// ─── CONTEXT BUILDER ──────────────────────────────────────────────────────────

/**
 * Builds a personalization context object for a user.
 * This context can be injected into AI prompts to make responses more relevant.
 *
 * @param {string} userId - Firebase auth UID
 * @returns {Promise<object>} Personalization context
 */
export async function buildUserContext(userId) {
  if (!userId || !isEnabled("ENABLE_PERSONALIZATION")) {
    return { hasContext: false, summary: null };
  }

  try {
    const maxHistory = getFlagValue("MAX_HISTORY_CONTEXT") || 5;

    // Fetch user data in parallel
    const [quizResults, chatHistory] = await Promise.all([
      getQuizResults(userId, null, maxHistory).catch(() => []),
      getChatHistory(userId, maxHistory * 2).catch(() => []),
    ]);

    if (quizResults.length === 0 && chatHistory.length === 0) {
      return { hasContext: false, summary: null };
    }

    // Extract key insights from quiz results
    const quizInsights = quizResults.map((result) => {
      const { quizType, result: data } = result;
      if (quizType === "career-prediction" && data) {
        return {
          type: "career-prediction",
          careers: data.topCareers || data.suggestedCareers || [],
          confidence: data.confidence || data.confidenceScore,
        };
      }
      if (quizType === "career-guidance" && data) {
        return {
          type: "career-guidance",
          field: data.careerField,
          strengths: data.personalityStrengths || [],
          subjects: data.recommendedSubjects || [],
        };
      }
      if (quizType === "evaluate" && data) {
        return {
          type: "subject-evaluation",
          analysis: data.analysis || data.summary,
        };
      }
      return { type: quizType };
    });

    // Extract recent topics from chat history
    const recentTopics = chatHistory
      .slice(-5)
      .map((msg) => msg.userMessage)
      .filter(Boolean);

    const context = {
      hasContext: true,
      quizInsights,
      recentTopics,
      totalQuizzes: quizResults.length,
      totalChats: chatHistory.length,
    };

    // Build a natural language summary for prompt injection
    context.summary = buildContextSummary(context);

    logger.debug(TAG, "User context built", {
      userId,
      quizzes: quizResults.length,
      chats: chatHistory.length,
    });

    return context;
  } catch (err) {
    logger.warn(TAG, "Failed to build user context", err.message);
    return { hasContext: false, summary: null };
  }
}

/**
 * Builds a natural language summary of user context for prompt injection.
 * @param {object} context
 * @returns {string}
 */
function buildContextSummary(context) {
  const parts = [];

  // Career guidance insights
  const guidanceResults = context.quizInsights.filter((q) => q.type === "career-guidance");
  if (guidanceResults.length > 0) {
    const latest = guidanceResults[0];
    if (latest.field) {
      parts.push(`The student has previously shown strong alignment with ${latest.field}.`);
    }
    if (latest.strengths?.length > 0) {
      parts.push(`Their key strengths include: ${latest.strengths.join(", ")}.`);
    }
    if (latest.subjects?.length > 0) {
      parts.push(`Recommended subjects from past assessments: ${latest.subjects.join(", ")}.`);
    }
  }

  // Career prediction insights
  const predictionResults = context.quizInsights.filter((q) => q.type === "career-prediction");
  if (predictionResults.length > 0) {
    const latest = predictionResults[0];
    if (latest.careers?.length > 0) {
      parts.push(`Previous career predictions suggested: ${latest.careers.slice(0, 3).join(", ")}.`);
    }
  }

  // Recent interests from chat
  if (context.recentTopics?.length > 0) {
    parts.push(
      `Recent topics the student has been exploring: "${context.recentTopics.slice(-3).join('", "')}".`
    );
  }

  if (parts.length === 0) return null;

  return (
    "STUDENT CONTEXT (from previous interactions):\n" +
    parts.join("\n") +
    "\n\nUse this context to provide more personalized and relevant guidance. " +
    "Reference their past results where appropriate."
  );
}

/**
 * Enhances chatbot messages with user personalization context.
 * Returns an augmented system prompt segment.
 *
 * @param {string} userId
 * @returns {Promise<string|null>} Context string to append to system prompt, or null
 */
export async function getChatPersonalization(userId) {
  const context = await buildUserContext(userId);
  return context.summary;
}

/**
 * Enhances career suggestion prompts with user history.
 *
 * @param {string} userId
 * @returns {Promise<string|null>} Context string for career prompts
 */
export async function getCareerPersonalization(userId) {
  const context = await buildUserContext(userId);
  if (!context.hasContext) return null;

  const parts = [];

  if (context.quizInsights.length > 0) {
    parts.push(
      `This student has completed ${context.totalQuizzes} assessment(s) previously.`
    );
  }

  if (context.summary) {
    parts.push(context.summary);
  }

  parts.push(
    "Consider their history when making career recommendations. " +
    "Show consistency with previous guidance while expanding their options."
  );

  return parts.join("\n");
}
