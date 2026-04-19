import { NextResponse } from "next/server";

// ─── FALLBACK QUESTIONS PER CLASS ─────────────────────────────────────────────
const FALLBACK_10TH = [
  {
    id: 1,
    question: "Which subjects do you look forward to most in school?",
    type: "single",
    category: "Interest",
    options: [
      "Mathematics & Science",
      "History & Geography",
      "English & Literature",
      "Arts & Craft / Music",
    ],
  },
  {
    id: 2,
    question: "When you have free time, what activity do you enjoy most?",
    type: "single",
    category: "Personality",
    options: [
      "Solving puzzles or coding games",
      "Drawing, painting, or designing",
      "Reading books or writing stories",
      "Playing sports or outdoor activities",
    ],
  },
  {
    id: 3,
    question: "A friend needs help. You are most likely to help them by:",
    type: "single",
    category: "Scenario",
    options: [
      "Analyzing the problem and giving logical solutions",
      "Listening and providing emotional support",
      "Coming up with a creative plan",
      "Taking practical action immediately",
    ],
  },
  {
    id: 4,
    question: "Which type of project excites you most?",
    type: "single",
    category: "Aptitude",
    options: [
      "Building a working model or experiment",
      "Creating a short film or digital artwork",
      "Conducting a survey and presenting data",
      "Writing a story or poem collection",
    ],
  },
  {
    id: 5,
    question: "How do you prefer to learn something new?",
    type: "single",
    category: "Personality",
    options: [
      "Step-by-step logical explanation",
      "Visual diagrams and concept maps",
      "Practical hands-on experiments",
      "Group discussion and debate",
    ],
  },
  {
    id: 6,
    question: "After completing 10th, your first thought about stream selection is:",
    type: "single",
    category: "Interest",
    options: [
      "Science — I want to explore engineering or medicine",
      "Commerce — I'm interested in business and finance",
      "Arts/Humanities — I want to understand society and culture",
      "I'm not sure yet, I need more guidance",
    ],
  },
  {
    id: 7,
    question: "Which scenario feels most 'you'?",
    type: "single",
    category: "Scenario",
    options: [
      "Designing a bridge that can handle maximum load",
      "Running a startup and managing a team",
      "Writing a research paper on history or society",
      "Performing on stage or creating visual art",
    ],
  },
  {
    id: 8,
    question: "What motivates you to study hard?",
    type: "single",
    category: "Personality",
    options: [
      "Cracking a competitive entrance exam like JEE or NEET",
      "Getting a high-paying career in business or finance",
      "Making a difference in social or political issues",
      "Expressing myself through art or media",
    ],
  },
  {
    id: 9,
    question: "Your ideal career in the future looks like:",
    type: "single",
    category: "Aptitude",
    options: [
      "Working in a tech lab or research center",
      "Managing finances at a top investment firm",
      "Working for the government or public policy",
      "Creating content, films, or design for brands",
    ],
  },
  {
    id: 10,
    question: "How would your friends describe your thinking style?",
    type: "single",
    category: "Personality",
    options: [
      "Analytical and precise",
      "Creative and imaginative",
      "Empathetic and insightful",
      "Practical and action-oriented",
    ],
  },
];

const FALLBACK_12TH = [
  {
    id: 1,
    question: "Which field of study excites you the most right now?",
    type: "single",
    category: "Interest",
    options: [
      "Core Engineering (Mechanical, Civil, Electrical)",
      "Computer Science & Artificial Intelligence",
      "Medical Sciences & Biotechnology",
      "Business, Finance & Economics",
    ],
  },
  {
    id: 2,
    question: "You have 6 free months before college. You would:",
    type: "single",
    category: "Scenario",
    options: [
      "Learn programming or take an online tech course",
      "Start a side business or freelancing project",
      "Travel and understand diverse cultures",
      "Work on a creative portfolio (art, writing, film)",
    ],
  },
  {
    id: 3,
    question: "What kind of problems do you want to solve in your career?",
    type: "single",
    category: "Aptitude",
    options: [
      "Technical problems — systems, machines, code",
      "Financial problems — investment, cost optimization",
      "Human problems — healthcare, psychology, education",
      "Societal problems — policy, law, environment",
    ],
  },
  {
    id: 4,
    question: "In your current stream (11th–12th), which subject do you understand most naturally?",
    type: "single",
    category: "Aptitude",
    options: [
      "Physics & Mathematics",
      "Chemistry & Biology",
      "Accountancy & Business Studies",
      "History & Political Science",
    ],
  },
  {
    id: 5,
    question: "Where do you see yourself working 10 years from now?",
    type: "single",
    category: "Personality",
    options: [
      "In a tech company, building products used by millions",
      "Running my own business or startup",
      "In a hospital, clinic, or research lab",
      "In government, policy, or a social organisation",
    ],
  },
  {
    id: 6,
    question: "Your ideal work environment is:",
    type: "single",
    category: "Personality",
    options: [
      "A structured corporate office with clear roles",
      "A fast-paced, dynamic startup culture",
      "A lab or research institute with focused deep work",
      "A field-based or people-facing role",
    ],
  },
  {
    id: 7,
    question: "Which achievement would make you proudest?",
    type: "single",
    category: "Scenario",
    options: [
      "Launching a technology product used globally",
      "Building a successful company from scratch",
      "Discovering a cure or breakthrough in medicine",
      "Passing a top civil services or judicial exam",
    ],
  },
  {
    id: 8,
    question: "Considering competitive exams, which prep feels most aligned to you?",
    type: "single",
    category: "Aptitude",
    options: [
      "JEE / GATE — Engineering entrance",
      "NEET / AIIMS — Medical entrance",
      "CAT / GMAT — Management entrance",
      "UPSC / CLAT — Civil services or Law",
    ],
  },
  {
    id: 9,
    question: "Which skill do you consider as your biggest advantage?",
    type: "single",
    category: "Personality",
    options: [
      "Problem-solving with numbers and logic",
      "Communicating and persuading people",
      "Empathy and patient care",
      "Creative thinking and storytelling",
    ],
  },
  {
    id: 10,
    question: "A newspaper headline that would excite you most is:",
    type: "single",
    category: "Scenario",
    options: [
      "'Indian Engineer Builds Affordable Housing using AI'",
      "'Young Founder Raises $50M for EdTech Startup'",
      "'Vaccine Developed by Indian Researcher Saves 1 Million Lives'",
      "'Policy Reform Led by Young IAS Officer Transforms Rural India'",
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

    const apiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!apiKey && !groqApiKey) {
      const fallback = classLevel === "10th" ? FALLBACK_10TH : FALLBACK_12TH;
      return NextResponse.json({ questions: fallback, source: "fallback" });
    }

    const prompt =
      classLevel === "10th"
        ? `You are an expert school career counselor in India helping a student who has just completed Class 10 choose the right stream (Science PCM, Science PCB, Commerce, or Arts/Humanities) for Class 11 and 12.

Generate exactly 10 thoughtful MCQ questions to understand the student's:
- Academic interests and subject preferences
- Personality traits (introverted/extroverted, analytical/creative)
- Learning style
- Scenario-based decisions relevant to a 10th grade student
- Career aspirations appropriate for their age

Rules:
- All questions are single-choice (type: "single")
- Each question must have exactly 4 options
- Questions must feel natural and age-appropriate for a 15-16 year old Indian student
- Mix question categories: Interest, Personality, Scenario, Aptitude
- Do NOT ask about advanced topics like stock markets or college entrance
- Return ONLY a valid JSON object with a "questions" key containing the array:
{
  "questions": [
    {
      "id": 1,
      "question": "Which subjects do you enjoy most?",
      "type": "single",
      "category": "Interest",
      "options": ["Math", "Science", "Arts", "History"]
    }
  ]
}
- Return ONLY the JSON, no markdown, no explanation.`
        : `You are an expert career counselor in India helping a Class 12 student choose the right higher education path and career field after 12th grade.

Generate exactly 10 deep and insightful MCQ questions to understand the student's:
- Career field alignment (Engineering, Medicine, Commerce/MBA, Civil Services, Law, Arts, Design, etc.)
- Aptitude for specific entrance exams (JEE, NEET, CAT, UPSC, CLAT, NIFT)
- Personality and work-style preferences
- Scenario-based decision making relevant to post-12th choices
- Long-term ambitions and values

Rules:
- All questions are single-choice (type: "single")
- Each question must have exactly 4 options
- Questions must feel mature and relevant for a 17-18 year old
- Mix categories: Interest, Aptitude, Personality, Scenario
- Questions should be specifically relevant to Indian education and career context
- Return ONLY a valid JSON object with a "questions" key containing the array:
{
  "questions": [
    {
      "id": 1,
      "question": "Which field of study excites you most?",
      "type": "single",
      "category": "Interest",
      "options": ["Engineering", "Medicine", "Management", "Design"]
    }
  ]
}
- Return ONLY the JSON, no markdown, no explanation.`;

    const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let responseText = null;
    let source = "fallback";

    // ─── TRY GEMINI MODELS IN ORDER ─────────────────────────────────────────
    if (apiKey) {
      for (const model of MODELS) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
          const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 4096,
              },
            }),
          });

          if (geminiResponse.ok) {
            const geminiData = await geminiResponse.json();
            responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (responseText) {
              source = "ai";
              break;
            }
          } else {
            console.warn(`[subject-advisor] ${model} failed:`, await geminiResponse.text());
          }
        } catch (err) {
          console.error(`[subject-advisor] ${model} fetch error:`, err);
        }
      }
    }

    // ─── FAILOVER TO GROQ IF GEMINI FAILS ─────────────────────────────────────
    if (!responseText && groqApiKey) {
      console.log("[subject-advisor] Gemini failed/quota — trying Groq failover...");
      try {
        const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
        const groqResponse = await fetch(groqUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
            max_tokens: 4096,
            response_format: { type: "json_object" },
          }),
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          responseText = groqData.choices?.[0]?.message?.content;
          if (responseText) source = "groq";
        }
      } catch (err) {
        console.error("[subject-advisor] Groq failover error:", err);
      }
    }

    if (!responseText) {
      const fallback = classLevel === "10th" ? FALLBACK_10TH : FALLBACK_12TH;
      return NextResponse.json({ questions: fallback, source: "fallback" });
    }

    // Clean and extract JSON array
    let cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const arrayStart = cleaned.indexOf("[");
    const arrayEnd = cleaned.lastIndexOf("]");
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      cleaned = cleaned.substring(arrayStart, arrayEnd + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
      // Handle various wrapping formats
      if (parsed.questions) parsed = parsed.questions;
      else if (Object.values(parsed).find(v => Array.isArray(v))) {
        parsed = Object.values(parsed).find(v => Array.isArray(v));
      }
    } catch (e) {
      console.error("JSON parse failed for subject-advisor questions:", e);
      const fallback = classLevel === "10th" ? FALLBACK_10TH : FALLBACK_12TH;
      return NextResponse.json({ questions: fallback, source: "fallback" });
    }

    // Validate
    if (
      !Array.isArray(parsed) ||
      parsed.length < 5 ||
      !parsed.every(
        (q) =>
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length >= 3
      )
    ) {
      const fallback = classLevel === "10th" ? FALLBACK_10TH : FALLBACK_12TH;
      return NextResponse.json({ questions: fallback, source: "fallback" });
    }

    const finalQuestions = parsed.slice(0, 10).map((q, i) => ({
      id: i + 1,
      question: q.question,
      type: "single",
      category: q.category || "General",
      options: q.options,
    }));

    return NextResponse.json({ questions: finalQuestions, source: "ai" });
  } catch (error) {
    console.error("subject-advisor generate-questions error:", error);
    return NextResponse.json(
      { error: "Internal server error", questions: [] },
      { status: 500 }
    );
  }
}
