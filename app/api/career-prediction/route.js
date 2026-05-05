import { NextResponse } from "next/server";
import { withMiddleware } from "@/server/middleware/apiMiddleware";
import { predictionLimiter } from "@/server/middleware/rateLimiter";
import { handleCareerPrediction } from "@/services/ai/aiController";
import { logger } from "@/server/logger";

async function handler(request) {
  try {
    const body = await request.json();
    const result = await handleCareerPrediction(body, request._userId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("api:career-prediction", "Request failed", {
      requestId: request._requestId,
      error: error.message,
    });
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: error.statusCode || 500 }
    );
  }
}

export const POST = withMiddleware(handler, {
  rateLimiter: predictionLimiter,
  requireAuth: false,
});
