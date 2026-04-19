import { NextResponse } from "next/server";

// ─── SAFE FETCH WITH ABORT CONTROLLER ─────────────────────────────────────────
async function safeFetch(url, options, timeoutMs = 15000) {
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

    if (/commerce|business|finance|account/i.test(answerStr)) {
      recommended_path = "Commerce — Business, Finance & Economics";
      reason = "Your entrepreneurial mindset and interest in how economies work point strongly toward Commerce, opening doors to CA, MBA, banking, and finance careers.";
      strengths = ["Business Acumen", "Financial Thinking", "Leadership"];
      interest_areas = ["Business", "Finance", "Economics"];
      graph_data = { Analytical: 60, Creative: 50, Social: 70, Practical: 80 };
    } else if (/art|creat|histor|social|law|civil|cultur|humanit/i.test(answerStr)) {
      recommended_path = "Arts & Humanities — Social Sciences & Creative Fields";
      reason = "Your empathetic nature and interest in culture, society, and creative expression suggest Arts/Humanities is your ideal stream.";
      strengths = ["Empathy", "Creative Expression", "Critical Thinking"];
      interest_areas = ["Social Sciences", "Literature", "Creative Arts"];
      graph_data = { Analytical: 45, Creative: 80, Social: 85, Practical: 40 };
    } else if (/medicine|doctor|biology|health|neet/i.test(answerStr)) {
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

  if (/business|startup|entrepreneur|finance|invest|cafe|manage/i.test(answerStr)) {
    recommended_path = "Business, Finance & Management";
    reason = "Your entrepreneurial thinking and comfort with numbers and people makes Business and Finance an ideal path.";
    strengths = ["Leadership", "Strategic Thinking", "Financial Literacy"];
    interest_areas = ["Business", "Finance", "Entrepreneurship"];
    entrance_exams = ["CAT", "GMAT", "NMAT", "IPMAT"];
    graph_data = { Analytical: 65, Creative: 60, Social: 80, Practical: 85 };
  } else if (/medicine|doctor|health|hospital|cure|patient|neet/i.test(answerStr)) {
    recommended_path = "Medicine & Healthcare";
    reason = "Your empathy and interest in human well-being points toward a deeply rewarding career in medicine or healthcare research.";
    strengths = ["Empathy", "Detail Orientation", "Scientific Knowledge"];
    interest_areas = ["Healthcare", "Biology", "Research"];
    entrance_exams = ["NEET UG", "AIIMS PG", "JIPMER"];
    graph_data = { Analytical: 70, Creative: 40, Social: 80, Practical: 65 };
  } else if (/upsc|civil|policy|law|government|ias|judge|justice/i.test(answerStr)) {
    recommended_path = "Civil Services & Public Policy";
    reason = "Your passion for social change and governance ambitions suggest a powerful fit for Civil Services or Law.";
    strengths = ["Critical Thinking", "Communication", "Leadership"];
    interest_areas = ["Governance", "Law", "Social Impact"];
    entrance_exams = ["UPSC CSE", "CLAT", "State PSC"];
    graph_data = { Analytical: 65, Creative: 55, Social: 90, Practical: 70 };
  } else if (/design|art|creative|film|content|media|nift/i.test(answerStr)) {
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

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────────
export async function POST(request) {
  let answers = [];
  let classLevel = "12th";
  let responseData = null; // Defined here for scope
  const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];

  try {
    const body = await request.json();
    answers = body?.answers || [];
    classLevel = body?.classLevel || "12th";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ result: buildFallback(classLevel, answers) });
    }

    const contextFor10th = `The student is currently in Class 10 and is deciding which stream to choose for Class 11 & 12 in India. 
Streams available: Science (PCM — Physics, Chemistry, Mathematics), Science (PCB — Physics, Chemistry, Biology), Commerce (Accountancy, Business Studies, Economics), Arts/Humanities (History, Geography, Political Science, Psychology).
Your recommendation must be ONE of these four streams.
Also provide relevant entrance exams for that stream (e.g. JEE for PCM, NEET for PCB, CA Foundation for Commerce, etc.)`;

    const contextFor12th = `The student is in Class 12 in India and is deciding their higher education and career path.
Your recommendation must be a specific career field (e.g., "Software Engineering & AI", "Medicine & Healthcare", "Business Management & Finance", "Civil Services & Law", "Design & Creative Arts", "Research & Academia", etc.)
Also provide top 3 relevant entrance exams (JEE, NEET, CAT, UPSC, CLAT, NIFT, NID, GATE, etc.)`;

    const prompt = `Act as an elite career counselor and academic strategist with 25+ years of experience in the Indian education sector.

${classLevel === "10th" ? contextFor10th : contextFor12th}

Your task is to analyze the student's psychological profile, academic preferences, and aspirations to provide a premium, deep-dive recommendation.

STUDENT CLASS: ${classLevel}
STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}

Requirements for your response:
1. "reason": Provide a sophisticated, human-like, yet high-end explanation (3-4 sentences). Avoid generic phrases like "you like math". Instead, connect their specific interest in logic or practical scenarios to a professional growth trajectory.
2. "strengths": Identify niche, high-value skills hinted at by their choices.
3. "weaknesses": Suggest constructive "Areas for Growth" that feel helpful and professional.
4. "graph_data": Carefully weigh the scores based on their specific answers.

Return ONLY a valid JSON object matching this structure (no markdown, no fences):
{
  "recommended_path": "...",
  "confidence_score": <integer 65-97>,
  "strengths": ["...", "...", "..."],
  "interest_areas": ["...", "...", "..."],
  "weaknesses": ["...", "..."],
  "reason": "...",
  "graph_data": {
    "Analytical": <integer 0-100>,
    "Creative": <integer 0-100>,
    "Social": <integer 0-100>,
    "Practical": <integer 0-100>
  },
  "entrance_exams": ["...", "...", "..."]
}`;

    const groqApiKey = process.env.GROQ_API_KEY;

    for (const model of MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await safeFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (res && res.ok) {
        try {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            responseData = text;
            break;
          }
        } catch {}
      }
    }

    // ─── FAILOVER TO GROQ IF GEMINI FAILS ─────────────────────────────────────
    if (!responseData && groqApiKey) {
      console.log("[subject-advisor/evaluate] Gemini failed/quota — trying Groq failover...");
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
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: "json_object" },
          }),
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const content = groqData.choices?.[0]?.message?.content;
          if (content) {
            console.log("[subject-advisor/evaluate] Success with Groq failover");
            responseData = content;
          }
        }
      } catch (err) {
        console.error("[subject-advisor/evaluate] Groq failover error:", err);
      }
    }

    if (!responseData) {
      return NextResponse.json({ result: buildFallback(classLevel, answers) });
    }

    const parsed = safeParse(responseData);

    if (
      parsed &&
      parsed.recommended_path &&
      parsed.confidence_score &&
      parsed.graph_data
    ) {
      // Ensure all required fields exist
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
      return NextResponse.json({ result });
    }

    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  } catch (error) {
    console.error("subject-advisor evaluate error:", error);
    return NextResponse.json({ result: buildFallback(classLevel, answers) });
  }
}
