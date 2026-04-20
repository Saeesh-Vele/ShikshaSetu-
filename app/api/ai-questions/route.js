import { NextResponse } from "next/server";

// ─── FIXED CAREER ASSESSMENT QUESTIONS ────────────────────────────────────────
// These are used by any legacy endpoints that still call /api/ai-questions
const FIXED_QUESTIONS = [
  {
    question: "When you have free time, what do you naturally choose to do?",
    type: "single",
    options: [
      "Solve puzzles or logical problems",
      "Think about business ideas or money",
      "Create art, write, or design",
      "Explore science or how things work",
    ],
  },
  {
    question: "Which subject feels most intuitive to you?",
    type: "single",
    options: ["Mathematics", "Business / Economics", "Languages / Humanities", "Science"],
  },
  {
    question: "What type of problems excite you the most?",
    type: "single",
    options: [
      "Logical and analytical",
      "Financial or strategic",
      "Creative and expressive",
      "Experimental and scientific",
    ],
  },
  {
    question: "What kind of content do you usually consume?",
    type: "single",
    options: [
      "Tech, coding, puzzles",
      "Business, finance, startups",
      "Art, storytelling, media",
      "Science, experiments, discovery",
    ],
  },
  {
    question: "Which activity would you willingly spend hours on?",
    type: "single",
    options: [
      "Solving complex problems",
      "Planning or managing money",
      "Creating something artistic",
      "Experimenting or researching",
    ],
  },
  {
    question: "How do you approach solving problems?",
    type: "single",
    options: [
      "Step-by-step logic",
      "Cost-benefit analysis",
      "Creative thinking",
      "Trial and experimentation",
    ],
  },
  {
    question: "In group projects, your role is usually:",
    type: "single",
    options: [
      "Technical/problem-solving",
      "Planning/management",
      "Creative/design",
      "Research/analysis",
    ],
  },
  {
    question: "Which environment suits you best?",
    type: "single",
    options: [
      "Structured technical setup",
      "Business/office setting",
      "Creative workspace",
      "Research/lab environment",
    ],
  },
  {
    question: "What gives you the most satisfaction?",
    type: "single",
    options: [
      "Solving a difficult problem",
      "Making a smart decision",
      "Creating something unique",
      "Discovering something new",
    ],
  },
  {
    question: "What motivates you the most?",
    type: "single",
    options: [
      "Building or inventing",
      "Earning or managing money",
      "Expressing ideas creatively",
      "Exploring and discovering",
    ],
  },
];

export async function GET() {
  return NextResponse.json({ questions: FIXED_QUESTIONS, source: "fixed" });
}
