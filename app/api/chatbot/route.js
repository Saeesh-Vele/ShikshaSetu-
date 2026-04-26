import { NextResponse } from "next/server";
import { runChatbotPipeline } from "@/services/ai/pipelines/chatbotPipeline";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const reply = await runChatbotPipeline(message);

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}