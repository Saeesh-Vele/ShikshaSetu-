import { NextResponse } from "next/server";

// ─── FIXED QUESTIONS: CLASS 10 ────────────────────────────────────────────────
const QUESTIONS_10TH = [
  {
    id: 1,
    question: "When you have free time, what do you naturally choose to do?",
    type: "single",
    category: "Interest",
    options: [
      "Solve puzzles or logical problems",
      "Think about business ideas or money",
      "Create art, write, or design",
      "Explore science or how things work",
    ],
  },
  {
    id: 2,
    question: "Which subject feels most intuitive to you?",
    type: "single",
    category: "Aptitude",
    options: ["Mathematics", "Business / Economics", "Languages / Humanities", "Science"],
  },
  {
    id: 3,
    question: "What type of problems excite you the most?",
    type: "single",
    category: "Personality",
    options: [
      "Logical and analytical",
      "Financial or strategic",
      "Creative and expressive",
      "Experimental and scientific",
    ],
  },
  {
    id: 4,
    question: "What kind of content do you usually consume?",
    type: "single",
    category: "Interest",
    options: [
      "Tech, coding, puzzles",
      "Business, finance, startups",
      "Art, storytelling, media",
      "Science, experiments, discovery",
    ],
  },
  {
    id: 5,
    question: "Which activity would you willingly spend hours on?",
    type: "single",
    category: "Personality",
    options: [
      "Solving complex problems",
      "Planning or managing money",
      "Creating something artistic",
      "Experimenting or researching",
    ],
  },
  {
    id: 6,
    question: "How do you approach solving problems?",
    type: "single",
    category: "Aptitude",
    options: [
      "Step-by-step logic",
      "Cost-benefit analysis",
      "Creative thinking",
      "Trial and experimentation",
    ],
  },
  {
    id: 7,
    question: "In group projects, your role is usually:",
    type: "single",
    category: "Scenario",
    options: [
      "Technical/problem-solving",
      "Planning/management",
      "Creative/design",
      "Research/analysis",
    ],
  },
  {
    id: 8,
    question: "Which environment suits you best?",
    type: "single",
    category: "Personality",
    options: [
      "Structured technical setup",
      "Business/office setting",
      "Creative workspace",
      "Research/lab environment",
    ],
  },
  {
    id: 9,
    question: "What gives you the most satisfaction?",
    type: "single",
    category: "Scenario",
    options: [
      "Solving a difficult problem",
      "Making a smart decision",
      "Creating something unique",
      "Discovering something new",
    ],
  },
  {
    id: 10,
    question: "What motivates you the most?",
    type: "single",
    category: "Personality",
    options: [
      "Building or inventing",
      "Earning or managing money",
      "Expressing ideas creatively",
      "Exploring and discovering",
    ],
  },
];

// ─── FIXED QUESTIONS: CLASS 12 ────────────────────────────────────────────────
const QUESTIONS_12TH = [
  {
    id: 1,
    question: "Which type of work interests you most?",
    type: "single",
    category: "Interest",
    options: [
      "Building systems or technology",
      "Helping people with health",
      "Managing business operations",
      "Creating designs or content",
    ],
  },
  {
    id: 2,
    question: "Which subject are you strongest in?",
    type: "single",
    category: "Aptitude",
    options: ["Math / Physics", "Biology", "Business / Economics", "Arts / Design"],
  },
  {
    id: 3,
    question: "What kind of challenges do you enjoy?",
    type: "single",
    category: "Personality",
    options: [
      "Technical problem solving",
      "Understanding health and biology",
      "Strategic decision-making",
      "Creative problem solving",
    ],
  },
  {
    id: 4,
    question: "Which activity would you spend extra time mastering?",
    type: "single",
    category: "Interest",
    options: [
      "Coding or engineering",
      "Medical or health topics",
      "Business strategies",
      "Design or creative tools",
    ],
  },
  {
    id: 5,
    question: "How do you prefer to learn?",
    type: "single",
    category: "Aptitude",
    options: [
      "Logical and structured",
      "Practical and observation-based",
      "Strategic and analytical",
      "Visual and creative",
    ],
  },
  {
    id: 6,
    question: "What kind of work environment suits you?",
    type: "single",
    category: "Personality",
    options: [
      "Tech or engineering firm",
      "Hospital or lab",
      "Corporate/business setting",
      "Creative studio",
    ],
  },
  {
    id: 7,
    question: "What motivates you the most?",
    type: "single",
    category: "Personality",
    options: [
      "Innovation and technology",
      "Helping people",
      "Financial growth",
      "Creative expression",
    ],
  },
  {
    id: 8,
    question: "Which skill defines you best?",
    type: "single",
    category: "Aptitude",
    options: ["Logical thinking", "Empathy and care", "Leadership and strategy", "Creativity"],
  },
  {
    id: 9,
    question: "What kind of impact do you want to make?",
    type: "single",
    category: "Scenario",
    options: [
      "Build useful technology",
      "Improve people's health",
      "Create successful businesses",
      "Inspire through creativity",
    ],
  },
  {
    id: 10,
    question: "Which future excites you the most?",
    type: "single",
    category: "Scenario",
    options: [
      "Tech innovation",
      "Healthcare profession",
      "Entrepreneurship",
      "Creative career",
    ],
  },
];

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { classLevel } = body; // "10th" | "12th"

    if (!classLevel || !["10th", "12th"].includes(classLevel)) {
      return NextResponse.json(
        { error: "classLevel must be '10th' or '12th'" },
        { status: 400 }
      );
    }

    const questions = classLevel === "10th" ? QUESTIONS_10TH : QUESTIONS_12TH;

    return NextResponse.json({ questions, source: "fixed" });
  } catch (error) {
    console.error("subject-advisor generate-questions error:", error);
    return NextResponse.json(
      { error: "Internal server error", questions: [] },
      { status: 500 }
    );
  }
}
