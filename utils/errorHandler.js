// ─── STANDARDIZED API ERROR HANDLER ───────────────────────────────────────────
// All API routes should use this for consistent error responses.
// Format: { success: false, error: "message" }

import { NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Wraps an API route handler with standardized error handling.
 * @param {string} routeName - Name for logging (e.g. "chatbot", "career-prediction")
 * @param {Function} handler - Async function (request) => { data, status? }
 * @returns {Function} Next.js route handler
 */
export function withErrorHandler(routeName, handler) {
  return async function (request) {
    try {
      const result = await handler(request);

      // If handler returns a NextResponse directly, pass it through
      if (result instanceof NextResponse) {
        return result;
      }

      // Standard success envelope
      return NextResponse.json(
        { success: true, ...result },
        { status: result.status || 200 }
      );
    } catch (error) {
      logger.error(`api:${routeName}`, "Unhandled error", {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });

      return NextResponse.json(
        {
          success: false,
          error: error.message || "An unexpected error occurred. Please try again.",
        },
        { status: error.statusCode || 500 }
      );
    }
  };
}

/**
 * Creates a typed API error with status code.
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

/**
 * Validates that required fields exist in the request body.
 * Throws ApiError(400) if validation fails.
 */
export function validateBody(body, requiredFields) {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      throw new ApiError(`Missing required field: ${field}`, 400);
    }
  }
  return body;
}
