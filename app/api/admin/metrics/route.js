// ─── METRICS API ──────────────────────────────────────────────────────────────
// GET /api/admin/metrics
//
// Returns observability metrics including:
//   - Per-endpoint request counts, error rates, latency percentiles
//   - AI model usage stats
//   - Cache hit/miss rates
//   - Global analytics

import { NextResponse } from "next/server";
import { getMetricsSnapshot } from "@/services/observability/metricsCollector";
import { getGlobalMetrics } from "@/services/analytics/usageTracker";

export async function GET() {
  try {
    const metrics = {
      observability: getMetricsSnapshot(),
      analytics: getGlobalMetrics(),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
