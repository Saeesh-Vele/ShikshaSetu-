import { NextResponse } from "next/server";
import { runCareerPredictionPipeline } from "@/services/ai/pipelines/careerPredictionPipeline";

export async function POST(request) {
  try {
    const body = await request.json();
    const answers = body?.answers;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request. Answers array is required." },
        { status: 400 }
      );
    }

    const prediction = await runCareerPredictionPipeline(answers);
    
    return NextResponse.json({ 
      result: prediction.data, 
      metadata: {
        confidence: prediction.confidence,
        attempts: prediction.attempts,
        errorHistory: prediction.errorHistory
      }
    });
  } catch (error) {
    console.error("[career-prediction-route] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
