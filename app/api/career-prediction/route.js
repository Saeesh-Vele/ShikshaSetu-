import { NextResponse } from "next/server";

// ─── FETCH GROQ INSIGHTS ──────────────────────────────────────────────────
async function fetchGroqInsights(answers) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.warn("[career-prediction] GROQ_API_KEY is not configured in .env.local");
    return "AI response could not be structured. Showing a recommendation based on your answers.";
  }

  const prompt = `Act as a professional career counselor with 20+ years of experience.
Analyze the following student's answers and provide a detailed explanation and personality insights of why certain career fields fit them.
Provide ONLY the insights text. Do not use markdown formatting.

STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}`;

  try {
    const res = await safeFetch('https://api.groq.com/openai/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Use llama-3.1-8b-instant for fast text generation
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    }, 15000);

    if (res && res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } else {
      console.warn("[career-prediction] Groq fetch failed:", res ? await res.text() : "Network failure");
    }
  } catch (err) {
    console.error("[career-prediction] fetchGroqInsights error:", err);
  }
  
  return "AI response could not be structured. Showing a recommendation based on your answers.";
}

// ─── STEP 2: SAFE FETCH WITH TIMEOUT + ABORT ────────────────────────────────
async function safeFetch(url, options, timeoutMs = 10000) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return res;
  } catch (err) {
    console.error("safeFetch failed:", err.message || err);
    return null;
  }
}

// ─── STEP 5: ROBUST JSON PARSING ────────────────────────────────────────────
function safeParse(text) {
  // Attempt 1: parse as-is
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }

  // Attempt 2: strip markdown fences
  console.warn("safeParse: raw JSON.parse failed, attempting cleanup…");
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  // Attempt 3: extract the first { … } block
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
    } catch {
      // continue
    }
  }

  // All attempts failed
  return null;
}

// ─── STEP 6: INTELLIGENT FALLBACK (ANSWER-AWARE) ────────────────────────────
function buildSmartFallback(answers, rawText) {
  // Try to infer something useful from the answers themselves
  const answerStr = (answers || [])
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ")
    .toLowerCase();

  let careerField = "General Analysis";
  let topCareers = ["Engineering", "Business", "Design"];
  let subjects = ["Mathematics", "Communication"];
  let strengths = ["Problem Solving", "Adaptability"];

  // Simple keyword heuristics to make the fallback smarter than "Try again"
  if (/code|program|software|tech|computer/i.test(answerStr)) {
    careerField = "Technology & Software";
    topCareers = ["Software Engineer", "Data Scientist", "Web Developer"];
    subjects = ["Computer Science", "Mathematics", "Data Structures"];
    strengths = ["Logical Thinking", "Problem Solving", "Analytical Skills"];
  } else if (/art|design|creat|draw|visual/i.test(answerStr)) {
    careerField = "Creative Arts & Design";
    topCareers = ["Graphic Designer", "UX Designer", "Art Director"];
    subjects = ["Visual Arts", "Design Thinking", "Digital Media"];
    strengths = ["Creativity", "Visual Thinking", "Attention to Detail"];
  } else if (/medicine|doctor|health|bio|patient/i.test(answerStr)) {
    careerField = "Healthcare & Medicine";
    topCareers = ["Doctor", "Biomedical Engineer", "Pharmacist"];
    subjects = ["Biology", "Chemistry", "Anatomy"];
    strengths = ["Empathy", "Attention to Detail", "Perseverance"];
  } else if (/business|manage|lead|entrepreneur|market/i.test(answerStr)) {
    careerField = "Business & Management";
    topCareers = ["Business Analyst", "Marketing Manager", "Entrepreneur"];
    subjects = ["Economics", "Business Studies", "Statistics"];
    strengths = ["Leadership", "Strategic Thinking", "Communication"];
  } else if (/law|justice|rights|legal/i.test(answerStr)) {
    careerField = "Law & Public Policy";
    topCareers = ["Lawyer", "Policy Analyst", "Legal Consultant"];
    subjects = ["Political Science", "Ethics", "Constitutional Law"];
    strengths = ["Critical Thinking", "Argumentation", "Research"];
  } else if (/teach|educat|school|mentor/i.test(answerStr)) {
    careerField = "Education & Research";
    topCareers = ["Teacher", "Education Consultant", "Research Scholar"];
    subjects = ["Pedagogy", "Psychology", "Communication"];
    strengths = ["Patience", "Communication", "Mentorship"];
  }

  return {
    careerField,
    topCareers,
    subjects,
    strengths,
    insights:
      rawText ||
      "AI response could not be structured. Showing a recommendation based on your answers.",
  };
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
export async function POST(request) {
  let answers = [];
  let groqPromise = null;

  try {
    const body = await request.json();
    answers = body?.answers;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request. Answers array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured in .env.local");
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // ── STEP 1: MODEL FAILOVER LIST ─────────────────────────────────────────
    const MODELS = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
    ];

    // ── START GROQ FETCH IN PARALLEL ────────────────────────────────────────
    groqPromise = fetchGroqInsights(answers);

    // ── STEP 3: STRICT JSON-ONLY PROMPT ────────────────────────────────────
    const prompt = `Act as a professional career counselor with 20+ years of experience.

Analyze the student's answers and provide:

1. Best career field
2. Top 3 career options
3. Recommended subjects
4. Key strengths
5. Personality insights
6. Detailed explanation of why this career fits

Be accurate, realistic, and structured.

STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}

Return structured JSON EXACTLY matching this format:
{
  "careerField": "...",
  "topCareers": ["...", "...", "..."],
  "subjects": ["...", "..."],
  "strengths": ["...", "..."],
  "insights": "..."
}

Return ONLY valid JSON.
Do NOT include explanations.
Do NOT include markdown.
Do NOT include text outside JSON.
Do NOT wrap in code fences.`;

    // ── STEP 2: RETRY LOOP WITH TIMEOUT + MODEL FAILOVER ───────────────────
    let response = null;
    let lastError = null;

    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const MAX_RETRIES = model === MODELS[0] ? 3 : 2;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        console.log(`[career-prediction] ${model} attempt ${attempt}/${MAX_RETRIES}`);

        response = await safeFetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (response && response.ok) {
          console.log(`[career-prediction] Success on ${model}, attempt ${attempt}`);
          break;
        }

        // Log non-ok responses
        if (response && !response.ok) {
          const errBody = await response.text().catch(() => "unreadable");
          lastError = `${model} HTTP ${response.status}: ${errBody.substring(0, 200)}`;
          console.warn(`[career-prediction] ${model} attempt ${attempt}:`, lastError);
        } else {
          lastError = `${model}: Network/timeout failure`;
          console.warn(`[career-prediction] ${model} attempt ${attempt}:`, lastError);
        }

        // Exponential backoff: 1s, 2s, 4s
        if (attempt < MAX_RETRIES) {
          const waitMs = 1000 * Math.pow(2, attempt - 1);
          console.log(`[career-prediction] Retrying in ${waitMs}ms…`);
          await new Promise((r) => setTimeout(r, waitMs));
        }

        response = null;
      }

      // If we got a successful response, stop trying other models
      if (response && response.ok) break;

      console.warn(`[career-prediction] All retries exhausted for ${model}, trying next model…`);
    }

    // ── STEP 4: SAFE RESPONSE EXTRACTION ───────────────────────────────────
    if (!response) {
      console.error("[career-prediction] All models and retries failed. Last error:", lastError);
      // STEP 6: Smart fallback instead of throwing
      const fb = buildSmartFallback(answers, null);
      if (groqPromise) fb.insights = await groqPromise;
      return NextResponse.json({
        result: fb,
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error("[career-prediction] Could not parse Gemini HTTP response as JSON:", jsonErr.message);
      const fb = buildSmartFallback(answers, null);
      if (groqPromise) fb.insights = await groqPromise;
      return NextResponse.json({
        result: fb,
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ── STEP 8: DEBUG LOGGING ──────────────────────────────────────────────
    console.log("[career-prediction] RAW GEMINI:", text);

    if (!text) {
      console.warn("[career-prediction] Empty text from Gemini. Candidate data:", JSON.stringify(data?.candidates?.[0] || data, null, 2));
      const fb = buildSmartFallback(answers, null);
      if (groqPromise) fb.insights = await groqPromise;
      return NextResponse.json({
        result: fb,
      });
    }

    // ── STEP 5: ROBUST JSON PARSING ────────────────────────────────────────
    const parsed = safeParse(text);

    // ── STEP 8: DEBUG LOGGING ──────────────────────────────────────────────
    console.log("[career-prediction] PARSED:", parsed);

    if (parsed && parsed.careerField) {
      // ── STEP 7: ALWAYS RETURN USABLE DATA ──────────────────────────────
      if (groqPromise) parsed.insights = await groqPromise;
      return NextResponse.json({ result: parsed });
    }

    // Parsing succeeded but structure is wrong, or parsing failed entirely
    console.warn("[career-prediction] Parsed result missing expected fields, using smart fallback");
    const fbFallback = buildSmartFallback(answers, text);
    if (groqPromise) fbFallback.insights = await groqPromise;
    return NextResponse.json({
      result: fbFallback,
    });
  } catch (error) {
    // ── STEP 7: NEVER THROW HARD ERROR ─────────────────────────────────────
    console.error("[career-prediction] Unexpected top-level error:", error);
    const fb = buildSmartFallback(answers, null);
    try {
      if (groqPromise) fb.insights = await groqPromise;
    } catch (e) {
      console.error("[career-prediction] Error fetching groq inside catch block", e);
    }
    return NextResponse.json({
      result: fb,
    });
  }
}
