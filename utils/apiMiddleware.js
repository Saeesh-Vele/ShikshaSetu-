// ─── API MIDDLEWARE ────────────────────────────────────────────────────────────
// Composable middleware for Next.js API routes.
// Provides: rate limiting, auth verification, request ID injection, latency tracking.
//
// Usage in routes:
//   import { withMiddleware } from "@/utils/apiMiddleware";
//   export const POST = withMiddleware(handler, { rateLimiter, requireAuth: false });

import { NextResponse } from "next/server";
import { getClientIdentifier } from "./rateLimiter";
import { logger } from "./logger";

/**
 * Generates a unique request ID for tracing.
 */
function generateRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Extracts userId from the Authorization header (Firebase ID token).
 * In a client-side Firebase app, the frontend sends the ID token in the
 * Authorization: Bearer <token> header. We decode the payload to get the uid.
 *
 * NOTE: This is a lightweight decode (no verification) suitable for identifying
 * users. For security-critical operations, use firebase-admin to verify the token.
 */
function extractUserIdFromToken(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    // JWT payload is the second part, base64url encoded
    const payload = token.split(".")[1];
    if (!payload) return null;

    // Decode base64url
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    );
    return decoded.user_id || decoded.sub || null;
  } catch {
    return null;
  }
}

/**
 * Wraps a Next.js API route handler with production middleware.
 *
 * @param {Function} handler - async (request, context) => NextResponse
 * @param {object} options
 * @param {object} [options.rateLimiter] - Rate limiter instance (from rateLimiter.js)
 * @param {boolean} [options.requireAuth=false] - Reject unauthenticated requests
 * @returns {Function} Enhanced route handler
 */
export function withMiddleware(handler, { rateLimiter = null, requireAuth = false } = {}) {
  return async function (request, routeContext) {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const clientIp = getClientIdentifier(request);

    // ─── Rate Limiting ──────────────────────────────────────────
    if (rateLimiter) {
      const { allowed, remaining, resetMs } = rateLimiter.check(clientIp);
      if (!allowed) {
        logger.warn("middleware:rate-limit", "Request rejected", { requestId, clientIp });
        return NextResponse.json(
          { success: false, error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(resetMs / 1000)),
              "X-RateLimit-Remaining": "0",
              "X-Request-Id": requestId,
            },
          }
        );
      }

      // Attach rate limit headers to response later
      request._rateLimitRemaining = remaining;
    }

    // ─── Auth Extraction ────────────────────────────────────────
    const userId = extractUserIdFromToken(request);

    if (requireAuth && !userId) {
      logger.warn("middleware:auth", "Unauthenticated request rejected", { requestId, clientIp });
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401, headers: { "X-Request-Id": requestId } }
      );
    }

    // ─── Inject Context ─────────────────────────────────────────
    // Attach metadata to the request for downstream use
    request._requestId = requestId;
    request._userId = userId;
    request._clientIp = clientIp;

    // ─── Execute Handler ────────────────────────────────────────
    try {
      const response = await handler(request, routeContext);
      const latencyMs = Date.now() - startTime;

      logger.info("middleware:request", "Completed", {
        requestId,
        userId: userId || "anonymous",
        method: request.method,
        url: request.url,
        latencyMs,
        status: response.status,
      });

      // Inject tracking headers into the response
      response.headers.set("X-Request-Id", requestId);
      response.headers.set("X-Response-Time", `${latencyMs}ms`);
      if (request._rateLimitRemaining !== undefined) {
        response.headers.set("X-RateLimit-Remaining", String(request._rateLimitRemaining));
      }

      return response;
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      logger.error("middleware:request", "Unhandled error", {
        requestId,
        userId: userId || "anonymous",
        latencyMs,
        error: error.message,
      });

      return NextResponse.json(
        { success: false, error: error.message || "Internal Server Error" },
        { status: error.statusCode || 500, headers: { "X-Request-Id": requestId } }
      );
    }
  };
}
