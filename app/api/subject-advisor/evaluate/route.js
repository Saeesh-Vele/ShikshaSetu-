import { NextResponse } from "next/server";

// ─── SAFE FETCH WITH ABORT CONTROLLER ─────────────────────────────────────────
async function safeFetch(url, options, timeoutMs = 20000) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    console.error("safeFetch error:", err.message || err);
    return null;
  }
}

// ─── SAFE JSON PARSER ─────────────────────────────────────────────────────────
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {}

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {}

  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");
  if (s !== -1 && e !== -1 && e > s) {
    try {
      return JSON.parse(cleaned.substring(s, e + 1));
    } catch {}
  }
  return null;
}

// ─── SMART FALLBACK ────────────────────────────────────────────────────────────
function buildFallback(classLevel, answers) {
  const answerStr = (answers || [])
    .map((a) => `${a.question}: ${a.selected}`)
    .join(" ")
    .toLowerCase();

  // 10th grade → stream recommendation
  if (classLevel === "10th") {
    let recommended_path = "Science (PCM) — Engineering & Technology";
    let reason =
      "Your responses suggest a strong affinity for logical thinking and problem-solving, which are core to fields like engineering and computer science.";
    let strengths = ["Analytical Thinking", "Logical Reasoning", "Mathematical Aptitude"];
    let interest_areas = ["Technology", "Engineering", "Mathematics"];
    let weaknesses = ["May need to develop creative expression", "Communication skills can be honed"];
    let graph_data = { Analytical: 75, Creative: 45, Social: 40, Practical: 65 };

    if (/commerce|business|finance|account|money|earning|cost|strategic|financial/i.test(answerStr)) {
      recommended_path = "Commerce — Business, Finance & Economics";
      reason = "Your entrepreneurial mindset and interest in how economies work point strongly toward Commerce, opening doors to CA, MBA, banking, and finance careers.";
      strengths = ["Business Acumen", "Financial Thinking", "Leadership"];
      interest_areas = ["Business", "Finance", "Economics"];
      graph_data = { Analytical: 60, Creative: 50, Social: 70, Practical: 80 };
    } else if (/art|creat|design|express|artistic|storytelling|media|humanit|language/i.test(answerStr)) {
      recommended_path = "Arts & Humanities — Social Sciences & Creative Fields";
      reason = "Your empathetic nature and interest in culture, society, and creative expression suggest Arts/Humanities is your ideal stream.";
      strengths = ["Empathy", "Creative Expression", "Critical Thinking"];
      interest_areas = ["Social Sciences", "Literature", "Creative Arts"];
      graph_data = { Analytical: 45, Creative: 80, Social: 85, Practical: 40 };
    } else if (/science|experiment|discover|research|biology|health|lab/i.test(answerStr)) {
      recommended_path = "Science (PCB) — Medical & Life Sciences";
      reason = "Your caring personality and interest in life sciences align perfectly with a career in medicine, biotechnology, or healthcare research.";
      strengths = ["Attention to Detail", "Empathy", "Scientific Rigor"];
      interest_areas = ["Biology", "Healthcare", "Medicine"];
      graph_data = { Analytical: 70, Creative: 40, Social: 75, Practical: 65 };
    }

    return {
      recommended_path,
      confidence_score: 72,
      strengths,
      interest_areas,
      weaknesses,
      reason,
      graph_data,
      entrance_exams: [],
    };
  }

  // 12th grade → career recommendation
  let recommended_path = "Engineering & Technology";
  let reason = "Your analytical skills and problem-solving mindset make engineering and technology an excellent fit.";
  let strengths = ["Logical Reasoning", "Technical Aptitude", "Systematic Thinking"];
  let interest_areas = ["Technology", "Engineering", "Innovation"];
  let weaknesses = ["Building communication skills will unlock leadership roles", "Explore interdisciplinary areas"];
  let entrance_exams = ["JEE Main", "JEE Advanced", "BITSAT"];
  let graph_data = { Analytical: 80, Creative: 45, Social: 40, Practical: 70 };

  if (/business|startup|entrepreneur|finance|invest|manage|corporate|financial|leadership|strategy/i.test(answerStr)) {
    recommended_path = "Business, Finance & Management";
    reason = "Your entrepreneurial thinking and comfort with numbers and people makes Business and Finance an ideal path.";
    strengths = ["Leadership", "Strategic Thinking", "Financial Literacy"];
    interest_areas = ["Business", "Finance", "Entrepreneurship"];
    entrance_exams = ["CAT", "GMAT", "NMAT", "IPMAT"];
    graph_data = { Analytical: 65, Creative: 60, Social: 80, Practical: 85 };
  } else if (/medicine|doctor|health|hospital|biology|empathy|care|helping people|healthcare/i.test(answerStr)) {
    recommended_path = "Medicine & Healthcare";
    reason = "Your empathy and interest in human well-being points toward a deeply rewarding career in medicine or healthcare research.";
    strengths = ["Empathy", "Detail Orientation", "Scientific Knowledge"];
    interest_areas = ["Healthcare", "Biology", "Research"];
    entrance_exams = ["NEET UG", "AIIMS PG", "JIPMER"];
    graph_data = { Analytical: 70, Creative: 40, Social: 80, Practical: 65 };
  } else if (/design|art|creative|content|expression|visual|studio|inspire/i.test(answerStr)) {
    recommended_path = "Design, Media & Creative Arts";
    reason = "Your creative instincts and visual thinking point strongly toward Design, Media, or Creative Arts as a career path.";
    strengths = ["Creativity", "Visual Intelligence", "Storytelling"];
    interest_areas = ["Design", "Art", "Media"];
    entrance_exams = ["NIFT", "NID", "UCEED", "NATA"];
    graph_data = { Analytical: 40, Creative: 90, Social: 65, Practical: 60 };
  }

  return {
    recommended_path,
    confidence_score: 72,
    strengths,
    interest_areas,
    weaknesses,
    reason,
    graph_data,
    entrance_exams,
  };
}

// ─── BUILD GROQ CAREER ANALYSIS PROMPT ────────────────────────────────────────
function buildGroqPrompt(classLevel, answers) {
  const formattedAnswers = (answers || [])
    .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.selected}`)
    .join("\n\n");

  return `You are an expert career counselor and psychometric analyst.

A student has answered a fixed set of career assessment questions.

Your job is to:
1. Analyze patterns in their answers
2. Identify dominant traits:
   - Logical / Analytical
   - Business / Financial
   - Creative / Artistic
   - Scientific / Research
3. Determine top 2 strongest career directions
4. Suggest:
   - Suitable career paths
   - Recommended stream (for class 10)
   - Recommended fields (for class 12)

---

IMPORTANT RULES:
- Do NOT guess randomly
- Base analysis ONLY on answers
- Be specific, not generic
- Keep output structured

---

Student is in Class: ${classLevel}

Student Answers:
${formattedAnswers}

---

Now return your analysis as a valid JSON object with this EXACT structure (no markdown, no code fences, ONLY valid JSON):

{
  "recommended_path": "The single best recommended stream/career path",
  "confidence_score": <integer 65-97>,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "interest_areas": ["Area 1", "Area 2", "Area 3"],
  "weaknesses": ["Growth area 1", "Growth area 2"],
  "reason": "A detailed 3-4 sentence professional explanation of why this path fits the student. Reference specific answers they gave. Be warm yet professional.",
  "graph_data": {
    "Analytical": <integer 0-100>,
    "Creative": <integer 0-100>,
    "Social": <integer 0-100>,
    "Practical": <integer 0-100>
  },
  "entrance_exams": ["Exam 1", "Exam 2", "Exam 3"]
}`;
}

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────────
export async function POST(request) {
  let answers = [];
  let classLevel = "12th";

  try {
    const body = await request.json();
    answers = body?.answers || [];
    classLevel = body?.classLevel || "12th";

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.warn("[subject-advisor/evaluate] GROQ_API_KEY not configured — using fallback");
      return NextResponse.json({ result: buildFallback(classLevel, answers) });
    }

    const prompt = buildGroqPrompt(classLevel, answers);

    // ─── CALL GROQ LLM ─────────────────────────────────────────────────
    console.log("[subject-advisor/evaluate] Sending answers to Groq for analysis...");

    const groqResponse = await safeFetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    }, 20000);

    if (!groqResponse || !groqResponse.ok) {
      const errText = groqResponse ? await groqResponse.text().catch(() => "unreadable") : "Network failure";
      console.error("[subject-advisor/evaluate] Groq API failed:", errText);
      return NextResponse.json({ result: buildFallback(classLevel, answers) });
    }

    const groqData = await groqResponse.json();
    const responseText = groqData.choices?.[0]?.message?.content;

    if (!responseText) {
      console.error("[subject-advisor/evaluate] Empty response from Groq");
      return NextResponse.json({ result: buildFallback(classLevel, answers) });
    }

    console.log("[subject-advisor/evaluate] Groq raw response received, parsing...");

    const parsed = safeParse(responseText);

    if (
      parsed &&
      parsed.recommended_path &&
      parsed.confidence_score &&
      parsed.graph_data
    ) {
      // Normalize and validate all required fields
      const result = {
        recommended_path: parsed.recommended_path,
        confidence_score: Math.min(97, Math.max(60, parseInt(parsed.confidence_score) || 75)),
        strengths: parsed.strengths || [],
        interest_areas: parsed.interest_areas || [],
        weaknesses: parsed.weaknesses || [],
        reason: parsed.reason || "",
        graph_data: {
          Analytical: parsed.graph_data?.Analytical || 50,
          Creative: parsed.graph_data?.Creative || 50,
          Social: parsed.graph_data?.Social || 50,
          Practical: parsed.graph_data?.Practical || 50,
        },
        entrance_exams: parsed.entrance_exams || [],
      };

      console.log("[subject-advisor/evaluate] Successfully parsed Groq analysis:", result.recommended_path);
      return NextResponse.json({ result });
    }

    console.warn("[subject-advisor/evaluate] Parsed result missing expected fields, using fallback");
    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  } catch (error) {
    console.error("subject-advisor evaluate error:", error);
    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  }
}
