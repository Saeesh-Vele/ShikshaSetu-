// ─── USAGE API ────────────────────────────────────────────────────────────────
// GET /api/admin/usage?userId=<uid>
//
// Returns per-user usage data including:
//   - Daily request count
//   - Token consumption
//   - Remaining quota
//   - Per-endpoint breakdown

import { NextResponse } from "next/server";
import { getUserUsage, getGlobalMetrics } from "@/services/analytics/usageTracker";
import { getQueueStats, getDeadLetters } from "@/services/queue/jobQueue";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Per-user usage
      return NextResponse.json({
        user: getUserUsage(userId),
        timestamp: new Date().toISOString(),
      });
    }

    // Global overview
    return NextResponse.json({
      global: getGlobalMetrics(),
      queue: getQueueStats(),
      deadLetters: getDeadLetters(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
