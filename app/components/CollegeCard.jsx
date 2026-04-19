"use client";

import React from "react";
import { MapPin, Home, GraduationCap, BookOpen, Star, BarChart2, CheckCircle2 } from "lucide-react";

// ─── Preset badge colors by facility keyword ──────────────────────────────────
const facilityColor = (f) => {
  const k = f.toLowerCase();
  if (k.includes("hostel"))   return { bg: "oklch(0.72 0.18 260 / 0.12)", color: "oklch(0.80 0.14 260)", border: "oklch(0.72 0.18 260 / 0.25)" };
  if (k.includes("placement")) return { bg: "oklch(0.637 0.237 275 / 0.12)", color: "oklch(0.78 0.18 275)", border: "oklch(0.637 0.237 275 / 0.25)" };
  if (k.includes("wifi"))      return { bg: "oklch(0.65 0.25 290 / 0.12)", color: "oklch(0.80 0.18 290)", border: "oklch(0.65 0.25 290 / 0.25)" };
  return { bg: "oklch(0.15 0.018 275 / 0.70)", color: "oklch(0.60 0.08 275)", border: "oklch(0.25 0.030 275)" };
};

export default function CollegeCard({ college, onSelect, isSelected, onToggleFavorite }) {
  const programs   = college.programs   ? college.programs.split(",").map((p) => p.trim())   : [];
  const facilities = college.facilities ? college.facilities.split(",").map((f) => f.trim()) : [];

  return (
    <div
      className="relative flex flex-col w-72 shrink-0 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "oklch(0.10 0.015 275 / 0.90)",
        backdropFilter: "blur(20px)",
        border: isSelected
          ? "1px solid oklch(0.637 0.237 275 / 0.60)"
          : "1px solid oklch(0.22 0.030 275)",
        boxShadow: isSelected
          ? "0 0 0 1px oklch(0.637 0.237 275 / 0.30), 0 8px 32px oklch(0.637 0.237 275 / 0.18)"
          : "0 4px 20px oklch(0 0 0 / 0.35)",
      }}
    >
      {/* shimmer top */}
      <div className="absolute inset-x-0 top-0 h-px" style={{
        background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.40), transparent)",
      }} />

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Name + Favourite */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{
              background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
              boxShadow: "0 4px 12px oklch(0.637 0.237 275 / 0.40)",
            }}>
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
              {college.name}
            </h3>
          </div>
          {typeof onToggleFavorite === "function" && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(college); }}
              className="shrink-0 h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                background: college.favorite
                  ? "oklch(0.80 0.22 80 / 0.15)"
                  : "oklch(0.15 0.018 275 / 0.60)",
                border: college.favorite
                  ? "1px solid oklch(0.80 0.22 80 / 0.35)"
                  : "1px solid oklch(0.25 0.030 275)",
              }}
            >
              <Star
                className="h-3.5 w-3.5 transition-colors duration-150"
                style={{ color: college.favorite ? "oklch(0.82 0.20 80)" : "oklch(0.55 0.06 275)" }}
                fill={college.favorite ? "oklch(0.82 0.20 80)" : "none"}
              />
            </button>
          )}
        </div>

        {/* Address + distances */}
        <div className="space-y-1.5">
          {college.address && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{college.address}</span>
            </div>
          )}
          {typeof college.distance === "number" && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.78 0.18 275)" }}>
              <div className="h-3 w-3 rounded-full shrink-0" style={{ background: "oklch(0.637 0.237 275)" }} />
              <span>{college.distance.toFixed(1)} km from you</span>
            </div>
          )}
          {college.homeDistance !== undefined && typeof college.homeDistance === "number" && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.65 0.12 275)" }}>
              <Home className="h-3 w-3 shrink-0" />
              <span>{college.homeDistance.toFixed(1)} km from home</span>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Eligibility", value: college.eligibility || "—", icon: BookOpen },
            { label: "Cut-off",     value: college.cut_off     || "—", icon: BarChart2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-2.5 rounded-xl" style={{
              background: "oklch(0.07 0.010 275 / 0.60)",
              border: "1px solid oklch(0.20 0.025 275)",
            }}>
              <div className="flex items-center gap-1 mb-1">
                <Icon className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug">{value}</p>
            </div>
          ))}
        </div>

        {/* Programs */}
        {programs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {programs.slice(0, 3).map((p) => (
              <span key={p} className="text-xs px-2 py-0.5 rounded-md font-medium" style={{
                background: "oklch(0.637 0.237 275 / 0.10)",
                border: "1px solid oklch(0.637 0.237 275 / 0.22)",
                color: "oklch(0.78 0.18 275)",
              }}>
                {p}
              </span>
            ))}
            {programs.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-md text-muted-foreground" style={{
                background: "oklch(0.14 0.015 275)",
                border: "1px solid oklch(0.22 0.028 275)",
              }}>
                +{programs.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {facilities.slice(0, 4).map((f) => {
              const { bg, color, border } = facilityColor(f);
              return (
                <span key={f} className="text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1" style={{
                  background: bg, border: `1px solid ${border}`, color,
                }}>
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  {f}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Action button ── */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect?.(college); }}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          style={isSelected ? {
            background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
            boxShadow: "0 4px 14px oklch(0.637 0.237 275 / 0.35)",
            color: "white",
          } : {
            background: "oklch(0.637 0.237 275 / 0.10)",
            border: "1px solid oklch(0.637 0.237 275 / 0.28)",
            color: "oklch(0.78 0.18 275)",
          }}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Comparing
            </>
          ) : (
            <>
              <BarChart2 className="h-3.5 w-3.5" />
              Compare
            </>
          )}
        </button>
      </div>
    </div>
  );
}