"use client";

import { useEffect } from "react";
import { GraduationCap, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Log to console in all environments
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div
        className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl"
        style={{
          background: "oklch(0.10 0.015 275 / 0.80)",
          border: "1px solid oklch(0.22 0.030 275)",
        }}
      >
        <div
          className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, oklch(0.45 0.15 25), oklch(0.55 0.18 30))",
          }}
        >
          <AlertTriangle className="h-7 w-7 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while loading this section.
            Your data is safe — try refreshing or come back shortly.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <pre
            className="text-xs text-left text-red-400/80 bg-red-950/20 rounded-lg p-3 overflow-auto max-h-32"
            style={{ border: "1px solid oklch(0.40 0.15 25 / 0.3)" }}
          >
            {error?.message || "Unknown error"}
          </pre>
        )}

        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
