"use client";
import React, { useEffect, useState } from "react";
import ReactFlow, { Background, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { Briefcase, GraduationCap, BookOpen, Award, Lightbulb } from "lucide-react";

export default function CourseFlowchart({ course }) {
  const [perRow, setPerRow] = useState(3);

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 640) {
        setPerRow(1);
      } else if (window.innerWidth < 1024) {
        setPerRow(2);
      } else {
        setPerRow(3);
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  if (!course) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Briefcase className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
      <p className="text-lg text-muted-foreground font-medium">Please select a course to view its pathway.</p>
    </div>
  );

  const baseStyle = {
    padding: "14px 20px",
    borderRadius: "16px",
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    width: 260,
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
    fontSize: "14px",
    letterSpacing: "0.5px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  };

  const styles = {
    eligibility: { ...baseStyle, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" }, // blue
    ug: { ...baseStyle, background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 0 20px rgba(5, 150, 105, 0.4)" }, // emerald
    pg: { ...baseStyle, background: "linear-gradient(135deg, #d97706, #b45309)", boxShadow: "0 0 20px rgba(217, 119, 6, 0.4)" }, // amber
    doctoral: { ...baseStyle, background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" }, // violet
    career: { ...baseStyle, background: "linear-gradient(135deg, #e11d48, #be123c)", boxShadow: "0 0 20px rgba(225, 29, 72, 0.4)" }, // rose
  };

  // Helper to render label with icon
  const renderLabel = (text, type) => {
    return (
      <>
        <span className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1 opacity-80">{type}</span>
        <span className="font-semibold text-white leading-tight">{text}</span>
      </>
    );
  };

  // Core nodes
  const nodes = [
    { id: "1", data: { label: renderLabel(course.eligibility, "Eligibility") }, position: { x: 200, y: 0 }, style: styles.eligibility },
    { id: "2", data: { label: renderLabel(course.courses[0] || "N/A", "Undergraduate") }, position: { x: 200, y: 140 }, style: styles.ug },
    { id: "3", data: { label: renderLabel(course.courses[1] || "N/A", "Postgraduate") }, position: { x: 200, y: 280 }, style: styles.pg },
    { id: "4", data: { label: renderLabel(course.courses[2] || "Optional", "Doctoral") }, position: { x: 200, y: 420 }, style: styles.doctoral },
  ];

  // Careers in grid
  const careerNodes = course.careers.map((career, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    return {
      id: `c${index}`,
      data: { label: renderLabel(career, "Career Option") },
      position: { x: 50 + col * 290, y: 580 + row * 140 },
      style: styles.career,
    };
  });

  // Edges
  const edgeOptions = {
    animated: true,
    style: { stroke: 'oklch(0.637 0.237 275)', strokeWidth: 2, opacity: 0.8 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: 'oklch(0.637 0.237 275)',
    },
  };

  const edges = [
    { id: "e1-2", source: "1", target: "2", ...edgeOptions },
    { id: "e2-3", source: "2", target: "3", ...edgeOptions },
    { id: "e3-4", source: "3", target: "4", ...edgeOptions },
    ...careerNodes.map((node) => ({
      id: `e4-${node.id}`,
      source: "4",
      target: node.id,
      ...edgeOptions,
    })),
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center animate-fade-in">
        <Badge color="bg-blue-600" text="Eligibility" icon={<BookOpen className="w-3 h-3" />} />
        <Badge color="bg-emerald-600" text="Undergraduate" icon={<GraduationCap className="w-3 h-3" />} />
        <Badge color="bg-amber-600" text="Postgraduate" icon={<Award className="w-3 h-3" />} />
        <Badge color="bg-violet-600" text="Doctoral" icon={<Lightbulb className="w-3 h-3" />} />
        <Badge color="bg-rose-600" text="Careers" icon={<Briefcase className="w-3 h-3" />} />
      </div>

      {/* Flowchart */}
      <div className="w-full h-[600px] border border-border/30 rounded-2xl bg-card/30 backdrop-blur-sm overflow-hidden shadow-inner animate-slide-up">
        <ReactFlow
          nodes={[...nodes, ...careerNodes]}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background color="oklch(0.637 0.237 275)" gap={20} size={1} style={{ opacity: 0.2 }} />
        </ReactFlow>
      </div>
    </div>
  );
}

function Badge({ color, text, icon }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-sm font-medium shadow-sm backdrop-blur-md transition-transform hover:scale-105 cursor-default">
      <div className={`flex items-center justify-center w-5 h-5 rounded-full ${color} text-white shadow-sm`}>
        {icon}
      </div>
      <span className="text-foreground/90">{text}</span>
    </div>
  );
}