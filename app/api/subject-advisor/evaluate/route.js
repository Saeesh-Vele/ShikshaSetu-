import { NextResponse } from "next/server";
import { withMiddleware } from "@/server/middleware/apiMiddleware";
import { evaluateLimiter } from "@/server/middleware/rateLimiter";
import { handleEvaluate } from "@/services/ai/aiController";
import { logger } from "@/server/logger";

async function handler(request) {
  let answers = [];
  let classLevel = "12th";

  try {
    const body = await request.json();
    answers = body?.answers || [];
    classLevel = body?.classLevel || "12th";

    const response = await handleEvaluate(body, request._userId);
    return NextResponse.json(response);
  } catch (error) {
    logger.error("api:subject-advisor/evaluate", "Request failed", {
      requestId: request._requestId,
      error: error.message,
    });

    if (error.statusCode === 400) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Always return a usable result — never crash the UI
    const { runEvaluatePipeline } = await import("@/services/ai/pipelines/evaluatePipeline");
    const fallback = await runEvaluatePipeline({ answers, classLevel });
    return NextResponse.json(fallback);
  }
}

export const POST = withMiddleware(handler, {
  rateLimiter: evaluateLimiter,
  requireAuth: false,
});
