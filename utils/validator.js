// ─── INPUT VALIDATOR ──────────────────────────────────────────────────────────
// Lightweight schema validation for API inputs.
// No external dependencies (no Zod/Joi). Focused on the specific shapes
// this application needs.

import { ApiError } from "./errorHandler";

// ─── PRIMITIVE VALIDATORS ─────────────────────────────────────────────────────

function isString(v) { return typeof v === "string" && v.trim().length > 0; }
function isArray(v) { return Array.isArray(v) && v.length > 0; }
function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
function isOneOf(v, options) { return options.includes(v); }

// ─── SCHEMA DEFINITIONS ──────────────────────────────────────────────────────

/**
 * Validates the subject advisor evaluate request body.
 * @throws {ApiError} if validation fails
 */
export function validateEvaluateInput(body) {
  if (!isObject(body)) {
    throw new ApiError("Request body must be a JSON object", 400);
  }

  if (!isArray(body.answers)) {
    throw new ApiError("'answers' must be a non-empty array", 400);
  }

  // Validate each answer has question + selected
  for (let i = 0; i < body.answers.length; i++) {
    const answer = body.answers[i];
    if (!isObject(answer)) {
      throw new ApiError(`answers[${i}] must be an object`, 400);
    }
    if (!isString(answer.question)) {
      throw new ApiError(`answers[${i}].question must be a non-empty string`, 400);
    }
    if (!isString(answer.selected)) {
      throw new ApiError(`answers[${i}].selected must be a non-empty string`, 400);
    }
  }

  // classLevel is optional with default, but if provided must be valid
  if (body.classLevel !== undefined && !isOneOf(body.classLevel, ["10th", "12th"])) {
    throw new ApiError("classLevel must be '10th' or '12th'", 400);
  }

  return body;
}

/**
 * Validates the career prediction request body.
 */
export function validateCareerPredictionInput(body) {
  if (!isObject(body)) {
    throw new ApiError("Request body must be a JSON object", 400);
  }

  if (!isArray(body.answers)) {
    throw new ApiError("'answers' must be a non-empty array", 400);
  }

  return body;
}

/**
 * Validates the chatbot request body.
 */
export function validateChatbotInput(body) {
  if (!isObject(body)) {
    throw new ApiError("Request body must be a JSON object", 400);
  }

  if (!isString(body.message)) {
    throw new ApiError("'message' must be a non-empty string", 400);
  }

  // Prevent excessively long messages (4000 chars max)
  if (body.message.length > 4000) {
    throw new ApiError("Message exceeds maximum length of 4000 characters", 400);
  }

  return body;
}

/**
 * Validates the career guidance request body.
 */
export function validateCareerGuidanceInput(body) {
  if (!isObject(body)) {
    throw new ApiError("Request body must be a JSON object", 400);
  }

  if (!body.answers || !isObject(body.answers)) {
    throw new ApiError("'answers' must be a non-empty object", 400);
  }

  return body;
}
