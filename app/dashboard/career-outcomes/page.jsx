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
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <main className="relative z-10 flex justify-center p-6 lg:p-10">
        <div className="w-full max-w-6xl animate-fade-in">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 mb-5 rounded-2xl bg-primary/10 border border-primary/20 shadow-glow-sm">
              <Map className="w-8 h-8 text-primary" />
            </div>
            <h1 className="heading-xl gradient-text mb-4">Career Pathways</h1>
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
              Explore structured academic and professional journeys. Select a course below to map out your future career possibilities.
            </p>
          </div>

          {/* Controls Section */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <GraduationCap className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full appearance-none bg-card/50 backdrop-blur-xl border border-border/50 text-foreground text-base rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm cursor-pointer hover:bg-card/80"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id} className="bg-card text-foreground">
                    {course.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Flowchart Section */}
          <div className="glass-card p-2 md:p-6 shadow-xl relative overflow-hidden">
             {/* Subtle Inner Glow */}
             <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none rounded-xl" />
             <div className="relative z-10">
                <CourseFlowchart course={selectedCourse} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}