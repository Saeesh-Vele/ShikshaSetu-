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

// ─── VALID STREAMS (CLASS 10) ─────────────────────────────────────────────────
// These are the ONLY valid streams we will ever return for Class 10 students.
const VALID_STREAMS = {
  core: [
    "Science PCM",
    "Science PCB",
    "Science PCMB",
    "Commerce",
    "Arts / Humanities",
  ],
  flexible: [
    "Commerce with Mathematics",
    "Arts with Psychology / Social Sciences",
    "Science with Computer Science",
  ],
  optional: [
    "Diploma / Polytechnic",
    "Skill-based / Vocational",
  ],
};

const ALL_VALID_STREAMS = [
  ...VALID_STREAMS.core,
  ...VALID_STREAMS.flexible,
  ...VALID_STREAMS.optional,
];

// ─── SAFETY MAPPING ──────────────────────────────────────────────────────────
// Maps unexpected AI outputs to the closest valid stream.
// This is the guardrail: "Flexible options, but within real-world education systems."
const SAFETY_MAP = {
  // Science variants
  "pcm": "Science PCM",
  "science pcm": "Science PCM",
  "science (pcm)": "Science PCM",
  "science - pcm": "Science PCM",
  "physics chemistry maths": "Science PCM",
  "engineering": "Science PCM",
  "technology": "Science PCM",
  "computer science": "Science with Computer Science",
  "science with cs": "Science with Computer Science",
  "science cs": "Science with Computer Science",
  "information technology": "Science with Computer Science",
  "it": "Science with Computer Science",

  // Biology variants
  "pcb": "Science PCB",
  "science pcb": "Science PCB",
  "science (pcb)": "Science PCB",
  "science - pcb": "Science PCB",
  "physics chemistry biology": "Science PCB",
  "medical": "Science PCB",
  "medicine": "Science PCB",
  "healthcare": "Science PCB",
  "biology": "Science PCB",

  // PCMB
  "pcmb": "Science PCMB",
  "science pcmb": "Science PCMB",
  "science (pcmb)": "Science PCMB",
  "all science": "Science PCMB",

  // Commerce variants
  "commerce": "Commerce",
  "business": "Commerce",
  "finance": "Commerce",
  "economics": "Commerce",
  "accounting": "Commerce",
  "ca": "Commerce",
  "commerce with maths": "Commerce with Mathematics",
  "commerce with mathematics": "Commerce with Mathematics",
  "commerce (maths)": "Commerce with Mathematics",
  "commerce math": "Commerce with Mathematics",

  // Arts variants
  "arts": "Arts / Humanities",
  "humanities": "Arts / Humanities",
  "arts / humanities": "Arts / Humanities",
  "arts/humanities": "Arts / Humanities",
  "liberal arts": "Arts / Humanities",
  "social sciences": "Arts / Humanities",
  "arts with psychology": "Arts with Psychology / Social Sciences",
  "psychology": "Arts with Psychology / Social Sciences",
  "sociology": "Arts with Psychology / Social Sciences",
  "arts with sociology": "Arts with Psychology / Social Sciences",

  // Optional paths
  "diploma": "Diploma / Polytechnic",
  "polytechnic": "Diploma / Polytechnic",
  "iti": "Diploma / Polytechnic",
  "vocational": "Skill-based / Vocational",
  "skill-based": "Skill-based / Vocational",
  "skill based": "Skill-based / Vocational",
};

/**
 * Sanitizes a stream name to the closest valid stream.
 * If no match is found, returns the fallback.
 */
function sanitizeStream(raw, fallback = "Science PCM") {
  if (!raw || typeof raw !== "string") return fallback;

  const trimmed = raw.trim();

  // Exact match check (case-insensitive)
  const exactMatch = ALL_VALID_STREAMS.find(
    (s) => s.toLowerCase() === trimmed.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Safety map lookup
  const mapped = SAFETY_MAP[trimmed.toLowerCase()];
  if (mapped) return mapped;

  // Fuzzy: check if any valid stream is a substring of the AI output
  for (const valid of ALL_VALID_STREAMS) {
    if (trimmed.toLowerCase().includes(valid.toLowerCase())) return valid;
  }

  // Fuzzy: check if any safety map key is a substring of the AI output
  for (const [key, value] of Object.entries(SAFETY_MAP)) {
    if (trimmed.toLowerCase().includes(key)) return value;
  }

  // Last resort: keyword-based fallback
  const lower = trimmed.toLowerCase();
  if (/bio|medical|health|pcb/i.test(lower)) return "Science PCB";
  if (/comput|tech|it|software|pcm/i.test(lower)) return "Science PCM";
  if (/commerce|business|financ|account|econom/i.test(lower)) return "Commerce";
  if (/art|human|creat|design|liter|language/i.test(lower)) return "Arts / Humanities";
  if (/diploma|polytechnic|iti/i.test(lower)) return "Diploma / Polytechnic";
  if (/vocat|skill/i.test(lower)) return "Skill-based / Vocational";

  console.warn(`[safety-map] Could not map stream "${raw}", using fallback: ${fallback}`);
  return fallback;
}

/**
 * Sanitizes an array of stream names.
 */
function sanitizeStreams(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map((s) => sanitizeStream(s)))];
}

// ─── VALID DOMINANT TRAITS ────────────────────────────────────────────────────
const VALID_TRAITS = [
  "Logical / Analytical",
  "Scientific / Research",
  "Business / Financial",
  "Creative / Artistic",
];

function sanitizeTraits(arr) {
  if (!Array.isArray(arr)) return [];
  const TRAIT_MAP = {
    "logical": "Logical / Analytical",
    "analytical": "Logical / Analytical",
    "math": "Logical / Analytical",
    "scientific": "Scientific / Research",
    "research": "Scientific / Research",
    "biology": "Scientific / Research",
    "business": "Business / Financial",
    "financial": "Business / Financial",
    "commerce": "Business / Financial",
    "entrepreneurial": "Business / Financial",
    "creative": "Creative / Artistic",
    "artistic": "Creative / Artistic",
    "design": "Creative / Artistic",
    "expressive": "Creative / Artistic",
  };

  const result = [];
  for (const trait of arr) {
    if (!trait || typeof trait !== "string") continue;
    // Exact match
    if (VALID_TRAITS.includes(trait)) {
      result.push(trait);
      continue;
    }
    // Fuzzy
    const lower = trait.toLowerCase();
    for (const [key, value] of Object.entries(TRAIT_MAP)) {
      if (lower.includes(key) && !result.includes(value)) {
        result.push(value);
        break;
      }
    }
  }
  return [...new Set(result)];
}

// ─── SMART FALLBACK ────────────────────────────────────────────────────────────
function buildFallback(classLevel, answers) {
  const answerStr = (answers || [])
    .map((a) => `${a.question}: ${a.selected}`)
    .join(" ")
    .toLowerCase();

  // 10th grade → stream recommendation (NO careers, NO degrees)
  if (classLevel === "10th") {
    let recommended_streams = ["Science PCM"];
    let secondary_options = [];
    let dominant_traits = ["Logical / Analytical"];
    let reasoning = "Your responses suggest a strong affinity for logical thinking and problem-solving, which align well with the Science (PCM) stream for Class 11 & 12.";
    let strengths = ["Analytical Thinking", "Logical Reasoning", "Mathematical Aptitude"];
    let interest_areas = ["Technology", "Engineering", "Mathematics"];
    let weaknesses = ["May need to develop creative expression", "Communication skills can be honed"];
    let graph_data = { Analytical: 75, Creative: 45, Social: 40, Practical: 65 };

    if (/commerce|business|finance|account|money|earning|cost|strategic|financial/i.test(answerStr)) {
      recommended_streams = ["Commerce"];
      secondary_options = ["Commerce with Mathematics"];
      dominant_traits = ["Business / Financial"];
      reasoning = "Your entrepreneurial mindset and interest in how economies work point strongly toward Commerce. Commerce with Mathematics can also be explored if you enjoy numbers.";
      strengths = ["Business Acumen", "Financial Thinking", "Leadership"];
      interest_areas = ["Business", "Finance", "Economics"];
      graph_data = { Analytical: 60, Creative: 50, Social: 70, Practical: 80 };
    } else if (/art|creat|design|express|artistic|storytelling|media|humanit|language/i.test(answerStr)) {
      recommended_streams = ["Arts / Humanities"];
      secondary_options = ["Arts with Psychology / Social Sciences"];
      dominant_traits = ["Creative / Artistic"];
      reasoning = "Your creative nature and interest in culture, society, and self-expression suggest Arts / Humanities is your ideal stream for Class 11 & 12.";
      strengths = ["Empathy", "Creative Expression", "Critical Thinking"];
      interest_areas = ["Social Sciences", "Literature", "Creative Arts"];
      graph_data = { Analytical: 45, Creative: 80, Social: 85, Practical: 40 };
    } else if (/science|experiment|discover|research|biology|health|lab/i.test(answerStr)) {
      recommended_streams = ["Science PCB"];
      secondary_options = ["Science PCMB"];
      dominant_traits = ["Scientific / Research"];
      reasoning = "Your curiosity about the natural world and interest in life sciences align perfectly with the Science (PCB) stream. If you're also strong in math, Science PCMB could be an option.";
      strengths = ["Attention to Detail", "Empathy", "Scientific Rigor"];
      interest_areas = ["Biology", "Healthcare", "Research"];
      graph_data = { Analytical: 70, Creative: 40, Social: 75, Practical: 65 };
    } else if (/computer|coding|programming|software|tech|digital|app/i.test(answerStr)) {
      recommended_streams = ["Science with Computer Science"];
      secondary_options = ["Science PCM"];
      dominant_traits = ["Logical / Analytical"];
      reasoning = "Your passion for technology and problem-solving indicates that Science with Computer Science is an excellent stream choice. Science PCM also opens similar doors.";
      strengths = ["Logical Reasoning", "Technical Aptitude", "Problem Solving"];
      interest_areas = ["Computer Science", "Technology", "Innovation"];
      graph_data = { Analytical: 85, Creative: 50, Social: 35, Practical: 75 };
    }

    return {
      recommended_streams,
      secondary_options,
      dominant_traits,
      confidence_score: 72,
      confidence_level: "Good Match",
      strengths,
      interest_areas,
      weaknesses,
      reasoning,
      graph_data,
    };
  }

  // 12th grade → career recommendation (unchanged)
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

// ─── BUILD GROQ PROMPT (CLASS 10 — STREAM ONLY) ──────────────────────────────
function buildGroqPrompt10(answers) {
  const formattedAnswers = (answers || [])
    .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.selected}`)
    .join("\n\n");

  return `You are an expert career counselor for Class 10 students in India.

The student has completed an aptitude assessment.

Your job is to recommend the most suitable STREAMS after Class 10 — the streams they should choose in Class 11 & 12.

---

AVAILABLE STREAM TYPES:

Core:
- Science PCM
- Science PCB
- Science PCMB
- Commerce
- Arts / Humanities

Flexible (ONLY if justified by answers):
- Commerce with Mathematics
- Arts with Psychology / Social Sciences
- Science with Computer Science

Optional (ONLY if relevant):
- Diploma / Polytechnic
- Skill-based / Vocational

---

INSTRUCTIONS:

- Analyze student answers carefully
- Identify dominant traits:
  - Logical / Analytical
  - Scientific / Research
  - Business / Financial
  - Creative / Artistic
- Base analysis ONLY on answers — do NOT guess randomly
- Be specific, not generic. Reference specific answers

---

CRITICAL RULES:

- DO NOT suggest careers (no "Engineer", "Doctor", "CA", etc.)
- DO NOT suggest degrees or jobs
- ONLY recommend STREAMS or EDUCATION PATHS from the list above
- Choose MAX 2 primary stream recommendations
- Optional: 1 secondary alternative (if justified)
- Keep output structured and consistent

---

Student Answers:
${formattedAnswers}

---

OUTPUT FORMAT — Return ONLY valid JSON, no markdown, no code fences:

{
  "recommended_streams": ["Primary Stream 1", "Primary Stream 2 (if needed)"],
  "secondary_options": ["Optional alternative"],
  "dominant_traits": ["Trait 1", "Trait 2"],
  "reasoning": "A detailed 3-4 sentence professional explanation of why these streams fit the student. Reference specific answers they gave. Be warm yet professional.",
  "confidence_level": "High" | "Good" | "Moderate",
  "confidence_score": <integer 65-97>,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "interest_areas": ["Area 1", "Area 2", "Area 3"],
  "weaknesses": ["Growth area 1", "Growth area 2"],
  "graph_data": {
    "Analytical": <integer 0-100>,
    "Creative": <integer 0-100>,
    "Social": <integer 0-100>,
    "Practical": <integer 0-100>
  }
}`;
}

// ─── BUILD GROQ PROMPT (CLASS 12 — CAREER PATH) ──────────────────────────────
function buildGroqPrompt12(answers) {
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
   - Recommended fields (for class 12)

---

IMPORTANT RULES:
- Do NOT guess randomly
- Base analysis ONLY on answers
- Be specific, not generic
- Keep output structured

---

Student is in Class: 12th

Student Answers:
${formattedAnswers}

---

Now return your analysis as a valid JSON object with this EXACT structure (no markdown, no code fences, ONLY valid JSON):

{
  "recommended_path": "The single best recommended career path",
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

// ─── PROCESS CLASS 10 GROQ RESPONSE ──────────────────────────────────────────
function processClass10Response(parsed) {
  if (!parsed) return null;

  // Handle if AI returned old format with recommended_path
  if (parsed.recommended_path && !parsed.recommended_streams) {
    parsed.recommended_streams = [parsed.recommended_path];
  }

  if (!parsed.recommended_streams || !Array.isArray(parsed.recommended_streams)) {
    return null;
  }

  // Sanitize all streams through safety mapping
  const recommended_streams = sanitizeStreams(parsed.recommended_streams).slice(0, 2);
  const secondary_options = sanitizeStreams(parsed.secondary_options || []).slice(0, 1);
  const dominant_traits = sanitizeTraits(parsed.dominant_traits || []);

  if (recommended_streams.length === 0) return null;

  // Remove duplicates between primary and secondary
  const filteredSecondary = secondary_options.filter(
    (s) => !recommended_streams.includes(s)
  );

  const confidenceLevel = parsed.confidence_level || (
    parsed.confidence_score >= 85 ? "High" :
    parsed.confidence_score >= 70 ? "Good" : "Moderate"
  );

  return {
    recommended_streams,
    secondary_options: filteredSecondary,
    dominant_traits: dominant_traits.length > 0 ? dominant_traits : ["Logical / Analytical"],
    confidence_score: Math.min(97, Math.max(60, parseInt(parsed.confidence_score) || 75)),
    confidence_level: confidenceLevel,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : [],
    interest_areas: Array.isArray(parsed.interest_areas) ? parsed.interest_areas.slice(0, 4) : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : [],
    reasoning: parsed.reasoning || parsed.reason || "",
    graph_data: {
      Analytical: parsed.graph_data?.Analytical || 50,
      Creative: parsed.graph_data?.Creative || 50,
      Social: parsed.graph_data?.Social || 50,
      Practical: parsed.graph_data?.Practical || 50,
    },
  };
}

// ─── PROCESS CLASS 12 GROQ RESPONSE (unchanged) ─────────────────────────────
function processClass12Response(parsed) {
  if (
    !parsed ||
    !parsed.recommended_path ||
    !parsed.confidence_score ||
    !parsed.graph_data
  ) {
    return null;
  }

  return {
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

    // Build the class-specific prompt
    const prompt = classLevel === "10th"
      ? buildGroqPrompt10(answers)
      : buildGroqPrompt12(answers);

    // ─── CALL GROQ LLM ─────────────────────────────────────────────────
    console.log(`[subject-advisor/evaluate] Sending Class ${classLevel} answers to Groq for analysis...`);

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

    // Process based on class level
    if (classLevel === "10th") {
      const result = processClass10Response(parsed);
      if (result) {
        console.log("[subject-advisor/evaluate] Successfully parsed Class 10 stream analysis:", result.recommended_streams);
        return NextResponse.json({ result });
      }
    } else {
      const result = processClass12Response(parsed);
      if (result) {
        console.log("[subject-advisor/evaluate] Successfully parsed Class 12 career analysis:", result.recommended_path);
        return NextResponse.json({ result });
      }
    }

    console.warn("[subject-advisor/evaluate] Parsed result missing expected fields, using fallback");
    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  } catch (error) {
    console.error("subject-advisor evaluate error:", error);
    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  }
}
