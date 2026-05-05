// features/subject-advisor/services/subjectAdvisorApi.js
// Client-side API fetch layer for the Subject Advisor feature.
// Wraps authFetch calls to the subject-advisor endpoints.

/** @typedef {import('@/types/ai').EvaluateRequest} EvaluateRequest */
/** @typedef {import('@/types/ai').EvaluateResponse} EvaluateResponse */

import { authFetch } from "@/lib/firebase/authFetch";

/**
 * Fetches assessment questions for the given class level.
 * @param {"10th" | "12th"} classLevel
 * @returns {Promise<{ questions: Array, source: string }>}
 */
export async function fetchQuestions(classLevel) {
  const res = await authFetch("/api/subject-advisor/generate-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ classLevel }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load questions");
  }

  if (!data.questions || data.questions.length === 0) {
    throw new Error("No questions returned. Please try again.");
  }

  return data;
}

/**
 * Submits quiz answers for AI evaluation.
 * @param {{ answers: Array<{ question: string, selected: string, category: string }>, classLevel: string }} payload
 * @returns {Promise<{ result: object }>}
 */
export async function submitEvaluation({ answers, classLevel }) {
  const res = await authFetch("/api/subject-advisor/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, classLevel }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Evaluation failed");
  }

  return data;
}
