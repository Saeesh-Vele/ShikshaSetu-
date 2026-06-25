"use client";
import { useState } from "react";
import courses from "@/features/career/data/courses.json";
import CourseFlowchart from '@/features/career/components/CourseFlowchart';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {GraduationCap, Map, ChevronDown} from "lucide-react"

export default function CareerOutcomesPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || null);
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* ── Ambient glow ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.637 0.237 275 / 0.10) 0%, transparent 60%)",
      }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* ── Hero Header ── */}
      <div className="relative px-4 pt-8 pb-6">
        {/* Section badge */}
        <div className="flex justify-center mb-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{
            background: "oklch(0.637 0.237 275 / 0.10)",
            border: "1px solid oklch(0.637 0.237 275 / 0.28)",
            color: "oklch(0.78 0.18 275)",
          }}>
            <Map className="h-3 w-3" />
            Career Outcomes
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 tracking-tight animate-slide-up" style={{
          background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.78 0.18 275) 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Career Pathways
        </h1>
        <p className="text-center text-muted-foreground max-w-xl mx-auto text-sm md:text-base mb-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          Explore structured academic and professional journeys. Select a course below to map out your future career possibilities.
        </p>

        {/* Controls Section */}
        <div className="max-w-md mx-auto flex items-center mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full pl-11 pr-11 py-3 rounded-xl text-sm text-foreground focus:outline-none appearance-none transition-all duration-200 cursor-pointer hover:bg-card/80"
                style={{
                  background: "oklch(0.10 0.015 275 / 0.85)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid oklch(0.22 0.030 275)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.50)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.637 0.237 275 / 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.22 0.030 275)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id} className="bg-card text-foreground">
                    {course.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
        </div>
      </div>

      {/* Flowchart Section */}
      <div className="px-4 pb-12 flex-1 flex flex-col items-center animate-slide-up" style={{ animationDelay: "300ms" }}>
        <div className="w-full max-w-6xl relative overflow-hidden rounded-2xl" style={{
          border: "1px solid oklch(0.637 0.237 275 / 0.22)",
          boxShadow: "0 8px 40px oklch(0 0 0 / 0.50), 0 0 30px oklch(0.637 0.237 275 / 0.08)",
          background: "oklch(0.08 0.012 275 / 0.5)",
          backdropFilter: "blur(12px)",
        }}>
          {/* shimmer top */}
          <div className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none" style={{
            background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.45), transparent)",
          }} />

          <div className="p-4 md:p-8 relative z-10 min-h-[500px]">
             <CourseFlowchart course={selectedCourse} />
          </div>
        </div>
      </div>
    </div>
  );
}