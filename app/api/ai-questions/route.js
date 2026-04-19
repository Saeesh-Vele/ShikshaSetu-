import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────
// Static fallback questions (used if Gemini fails)
// ─────────────────────────────────────────────────
const FALLBACK_QUESTIONS = [
  {
    question: "Which subjects do you find most interesting?",
    type: "multi",
    options: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "Economics",
      "Psychology",
      "English Literature",
      "History",
      "Geography",
    ],
  },
  {
    question: "What type of career are you most interested in?",
    type: "single",
    options: [
      "Engineering & Technology",
      "Medical & Healthcare",
      "Business & Management",
      "Arts & Creative Fields",
      "Research & Academia",
      "Government & Civil Services",
      "Law & Legal Services",
      "Teaching & Education",
    ],
  },
  {
    question: "What are your key strengths?",
    type: "multi",
    options: [
      "Analytical Thinking",
      "Creative Problem Solving",
      "Communication Skills",
      "Leadership Abilities",
      "Technical Aptitude",
      "Research Skills",
      "Teamwork",
      "Attention to Detail",
    ],
  },
  {
    question: "How do you prefer to learn?",
    type: "single",
    options: [
      "Hands-on & Practical",
      "Theoretical & Conceptual",
      "Visual & Graphical",
      "Discussion & Debate",
    ],
  },
  {
    question: "Which activities do you enjoy in your free time?",
    type: "multi",
    options: [
      "Reading books & articles",
      "Building or tinkering with things",
      "Playing sports or outdoor activities",
      "Drawing, painting, or designing",
      "Coding or working on tech projects",
      "Volunteering or community service",
    ],
  },
  {
    question: "What kind of work environment do you prefer?",
    type: "single",
    options: [
      "Office with structured routines",
      "Lab or research setting",
      "Creative studio or co-working space",
      "Outdoors or fieldwork",
      "Remote / Work from anywhere",
    ],
  },
  {
    question: "Which personality traits best describe you?",
    type: "multi",
    options: [
      "Curious & inquisitive",
      "Organized & disciplined",
      "Empathetic & caring",
      "Ambitious & competitive",
      "Imaginative & artistic",
      "Logical & methodical",
    ],
  },
  {
    question: "How do you approach solving problems?",
    type: "single",
    options: [
      "I analyze data and look for patterns",
      "I brainstorm creative ideas",
      "I talk to others and collaborate",
      "I research and study existing solutions",
      "I experiment with trial and error",
    ],
  },
  {
    question: "What motivates you the most in your studies?",
    type: "single",
    options: [
      "Getting top grades and recognition",
      "Understanding how things work",
      "Making a positive impact on society",
      "Financial success and stability",
      "Creative expression and self-fulfillment",
    ],
  },
  {
    question: "Which of these future goals resonate with you?",
    type: "multi",
    options: [
      "Start my own business",
      "Work in a top company",
      "Pursue higher education / PhD",
      "Join government / civil services",
      "Become an expert in a niche field",
      "Work internationally",
    ],
  },
];

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!apiKey && !groqApiKey) {
      console.warn("No AI API keys set — returning fallback questions");
      return NextResponse.json({ questions: FALLBACK_QUESTIONS, source: "fallback" });
    }

    const prompt = `Act as an elite career counselor with 25+ years of experience.
Generate exactly 10 high-impact career assessment questions for a comprehensive student profile evaluation.

Rules for your response:
1. Mix of multi-select and single-select questions.
2. Questions must reveal: Hidden Talents, Practical Aspirations, Cognitive Preferences, and Personality Drivers.
3. Return ONLY a valid JSON object with a "questions" key containing the array.
4. Return ONLY the JSON, no markdown, no fences.`;

    const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let response = null;
    let lastError = null;

    for (const model of MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      try {
        response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
            },
          }),
        });

        if (response.ok) break;
        
        lastError = await response.text();
        console.warn(`Gemini ${model} failed:`, lastError);
      } catch (err) {
        lastError = err.message;
        console.error(`Fetch error for ${model}:`, err);
      }
    }

    // ─── FAILOVER TO GROQ IF GEMINI FAILS ─────────────────────────────────────
    if ((!response || !response.ok) && groqApiKey) {
      console.log("Gemini failed or quota exceeded — trying Groq failover...");
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
          const content = groqData.choices?.[0]?.message?.content;
          if (content) {
            console.log("Success with Groq failover");
            let parsedGroq;
            try {
              // Groq with json_object might return { "questions": [...] } or just [...]
              const tempParsed = JSON.parse(content);
              parsedGroq = tempParsed.questions || tempParsed;
              
              if (Array.isArray(parsedGroq)) {
                return NextResponse.json({ questions: parsedGroq.slice(0, 10), source: "groq" });
              }
            } catch (pErr) {
              console.error("Groq JSON parse error:", pErr);
            }
          }
        } else {
          console.warn("Groq failover failed:", await groqResponse.text());
        }
      } catch (gErr) {
        console.error("Groq fetch error:", gErr);
      }
    }

    if (!response || !response.ok) {
      console.error("All Gemini models failed (ai-questions):", lastError);
      return NextResponse.json({ questions: FALLBACK_QUESTIONS, source: "fallback" });
    }

    const geminiData = await response.json();
    const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Empty Gemini response (ai-questions):", JSON.stringify(geminiData));
      return NextResponse.json({ questions: FALLBACK_QUESTIONS, source: "fallback" });
    }

    // Clean and parse
    let cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const arrayStart = cleaned.indexOf("[");
    const arrayEnd = cleaned.lastIndexOf("]");
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      cleaned = cleaned.substring(arrayStart, arrayEnd + 1);
    }

    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (
      !Array.isArray(parsed) ||
      parsed.length < 5 ||
      !parsed.every(
        (q) =>
          typeof q.question === "string" &&
          (q.type === "single" || q.type === "multi") &&
          Array.isArray(q.options) &&
          q.options.length >= 3
      )
    ) {
      console.error("Invalid question structure from Gemini — using fallback");
      return NextResponse.json({ questions: FALLBACK_QUESTIONS, source: "fallback" });
    }

    // Ensure exactly 10 questions
    const finalQuestions = parsed.slice(0, 10);

    return NextResponse.json({ questions: finalQuestions, source: "ai" });
  } catch (error) {
    console.error("ai-questions API error:", error);
    return NextResponse.json({ questions: FALLBACK_QUESTIONS, source: "fallback" });
  }
}
