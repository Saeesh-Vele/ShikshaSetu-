// ─── HEALTH CHECK API ─────────────────────────────────────────────────────────
// GET /api/admin/health
//
// Returns system health status including:
//   - Cache stats (L1/L2)
//   - Queue stats
//   - Feature flags
//   - Uptime
//
// No authentication required (health checks are public by design).

import { NextResponse } from "next/server";
import { getAllCacheStats } from "@/services/cache/memoryCache";
import { getQueueStats } from "@/services/queue/jobQueue";
import { getAllFlags } from "@/config/features";

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
      cache: getAllCacheStats(),
      queue: getQueueStats(),
      features: getAllFlags(),
      uptime: process.uptime ? `${Math.floor(process.uptime())}s` : "N/A",
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: error.message },
      { status: 500 }
    );
  }
}
