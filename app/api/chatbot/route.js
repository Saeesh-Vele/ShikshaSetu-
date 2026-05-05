import { NextResponse } from "next/server";
import { withMiddleware } from "@/server/middleware/apiMiddleware";
import { chatbotLimiter } from "@/server/middleware/rateLimiter";
import { handleChatbot } from "@/services/ai/aiController";
import { logger } from "@/server/logger";

async function handler(req) {
  try {
    const body = await req.json();
    const result = await handleChatbot(body, req._userId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error("api:chatbot", "Request failed", {
      requestId: req._requestId,
      error: error.message,
    });
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch response" },
      { status: error.statusCode || 500 }
    );
  }
}

export const POST = withMiddleware(handler, {
  rateLimiter: chatbotLimiter,
  requireAuth: false,
});