"use client";
import React, { useEffect, useState } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

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

  if (!course) return <p className="text-gray-500">Please select a course to view its pathway.</p>;

  const baseStyle = {
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    width: 220,
  };

  const styles = {
    eligibility: { ...baseStyle, background: "#2563eb" }, // blue
    ug: { ...baseStyle, background: "#16a34a" }, // green
    pg: { ...baseStyle, background: "#eab308" }, // yellow
    doctoral: { ...baseStyle, background: "#9333ea" }, // purple
    career: { ...baseStyle, background: "#f97316" }, // orange
  };

  // Core nodes
  const nodes = [
    { id: "1", data: { label: "Eligibility: " + course.eligibility }, position: { x: 200, y: 0 }, style: styles.eligibility },
    { id: "2", data: { label: "UG: " + (course.courses[0] || "N/A") }, position: { x: 200, y: 120 }, style: styles.ug },
    { id: "3", data: { label: "PG: " + (course.courses[1] || "N/A") }, position: { x: 200, y: 240 }, style: styles.pg },
    { id: "4", data: { label: "Doctoral: " + (course.courses[2] || "Optional") }, position: { x: 200, y: 360 }, style: styles.doctoral },
  ];

  // Careers in grid
  const careerNodes = course.careers.map((career, index) => {
    const row = Math.floor(index / perRow);
    const col = index % perRow;
    return {
      id: `c${index}`,
      data: { label: career },
      position: { x: 100 + col * 260, y: 500 + row * 120 },
      style: styles.career,
    };
  });

  // Edges
  const edges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3", animated: true },
    { id: "e3-4", source: "3", target: "4", animated: true },
    ...careerNodes.map((node) => ({
      id: `e4-${node.id}`,
      source: "4",
      target: node.id,
      animated: true,
    })),
  ];

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-600"></span> Eligibility</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-600"></span> UG</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-yellow-500"></span> PG</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-purple-600"></span> Doctoral</span>
        <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-500"></span> Careers</span>
      </div>

      {/* Flowchart */}
      <div className="w-full h-[500px] overflow-auto border rounded">
        <ReactFlow
          nodes={[...nodes, ...careerNodes]}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          {/* Removed MiniMap and Controls, only Background grid */}
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}