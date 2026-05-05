import { NextResponse } from "next/server";
import { withMiddleware } from "@/utils/apiMiddleware";
import { chatbotLimiter } from "@/utils/rateLimiter";
import { handleChatbot } from "@/services/ai/aiController";
import { logger } from "@/utils/logger";

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