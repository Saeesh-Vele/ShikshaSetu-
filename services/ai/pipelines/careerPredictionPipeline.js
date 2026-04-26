import { safeFetch, safeParse } from "../utils";
import { generateGroqCompletion } from "../llmClient";
import { evaluateOutput } from "./evaluator";

// ─── RELIABILITY LAYER ──────────────────────────────────────────
async function withRetry(operation, maxRetries = 2) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw lastError;
}

async function callGemini(prompt, model = "gemini-2.0-flash") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");
  const response = await safeFetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1024 } }),
  });
  if (!response || !response.ok) throw new Error("Gemini API failed");
  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ─── DATA GENERATION PIPELINE ───────────────────────────────────
function normalizeInput(answers) {
  if (!Array.isArray(answers)) return "";
  return answers.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" | ").replace(/\s+/g, ' ').trim();
}

async function extractProfile(normalizedInput) {
  const prompt = `Analyze this student's input: "${normalizedInput}". Extract profile to strict JSON: {"coreInterests": [], "impliedStrengths": [], "preferredWorkStyle": "string"}`;
  const responseText = await withRetry(() => generateGroqCompletion([{ role: "user", content: prompt }], "llama-3.1-8b-instant", 0.1));
  return safeParse(responseText) || { coreInterests: [], impliedStrengths: [], preferredWorkStyle: "unknown" };
}

function clusterSkillsAndMapCareers(profile) {
  const allKeywords = [...(profile.coreInterests || []), ...(profile.impliedStrengths || [])].join(" ").toLowerCase();
  let primaryCluster = "General Studies", baselineCareers = ["Business Administration", "Project Management", "Consulting"];
  if (/code|software|tech|compute|data|logic|program/i.test(allKeywords)) { primaryCluster = "Technology & Computer Science"; baselineCareers = ["Software Engineer", "Data Scientist", "Systems Analyst"]; }
  else if (/art|design|creative|draw|visual/i.test(allKeywords)) { primaryCluster = "Design & Creative Arts"; baselineCareers = ["Graphic Designer", "UX/UI Designer", "Art Director"]; }
  else if (/health|medic|bio|care|patient|doctor/i.test(allKeywords)) { primaryCluster = "Healthcare & Medicine"; baselineCareers = ["Doctor", "Biomedical Researcher", "Healthcare Administrator"]; }
  else if (/finance|money|number|math|economy/i.test(allKeywords)) { primaryCluster = "Finance & Economics"; baselineCareers = ["Financial Analyst", "Accountant", "Investment Banker"]; }
  return { primaryCluster, baselineCareers };
}

async function generateReasoning(profile, hybridMapping) {
  const prompt = `You are a Principal Career Architect.
Profile: ${JSON.stringify(profile)}
Domain Match: ${hybridMapping.primaryCluster}
Baselines: ${hybridMapping.baselineCareers.join(", ")}

Write a deep, personalized 2-paragraph reasoning explaining exactly WHY this specific domain fits the student's unique profile, and suggest 3 highly specific, modern career roles that align with their strengths. Just plain text.`;
  return await withRetry(() => callGemini(prompt, "gemini-2.0-flash"));
}

async function structureFinalOutput(profile, hybridMapping, reasoningText) {
  const prompt = `Convert this reasoning into a structured JSON output.
Reasoning: "${reasoningText}"
Domain: "${hybridMapping.primaryCluster}"

Return EXACTLY this JSON structure:
{"careerField": "Domain", "topCareers": ["Career 1", "Career 2", "Career 3"], "subjects": ["Sub 1", "Sub 2"], "strengths": ${JSON.stringify(profile.impliedStrengths || ["Adaptability"])}, "insights": "summary"}`;
  const responseText = await withRetry(() => generateGroqCompletion([{ role: "user", content: prompt }], "llama-3.1-8b-instant", 0.1));
  const parsed = safeParse(responseText);
  if (parsed && parsed.careerField && Array.isArray(parsed.topCareers)) {
    parsed.insights = reasoningText; 
    return parsed;
  }
  return null; 
}

// ─── TASK 2 & 3: TARGETED CORRECTION STRATEGY (DIFF-BASED) ─────

async function fixStructure(output, issues) {
  const prompt = `Fix the structure of this JSON object.
Issues to fix: ${JSON.stringify(issues.map(i => i.msg))}
Current Output: ${JSON.stringify(output)}

Do NOT rewrite the content or reasoning. Only fix the structural issues (e.g., missing fields, bad types, removing placeholders).
Return EXACTLY valid JSON matching the schema.`;
  const responseText = await withRetry(() => generateGroqCompletion([{ role: "user", content: prompt }], "llama-3.1-8b-instant", 0.1));
  return safeParse(responseText) || output;
}

async function fixLogic(output, profile, issues) {
  const prompt = `Fix the logical contradictions in this career prediction.
Student Profile: ${JSON.stringify(profile)}
Issues to fix: ${JSON.stringify(issues.map(i => i.msg))}
Current Output: ${JSON.stringify(output)}

Do NOT rewrite the entire response. Preserve correct parts. ONLY fix the logical flaws in the 'insights' and adjust 'topCareers' if they contradict the reasoning.
Return EXACTLY valid JSON matching the current structure.`;
  const responseText = await withRetry(() => callGemini(prompt, "gemini-2.0-flash"));
  return safeParse(responseText) || output;
}

async function fixRelevance(output, profile, issues) {
  const prompt = `Fix the relevance of this career prediction.
Student Profile: ${JSON.stringify(profile)}
Issues to fix: ${JSON.stringify(issues.map(i => i.msg))}
Current Output: ${JSON.stringify(output)}

Do NOT rewrite the entire response. Preserve the structure. Re-align the 'careerField' and 'topCareers' to perfectly match the student profile.
Return EXACTLY valid JSON matching the current structure.`;
  const responseText = await withRetry(() => callGemini(prompt, "gemini-2.0-flash"));
  return safeParse(responseText) || output;
}

// ─── TASK 5 & 7: OUTPUT COMPARISON & CONFIDENCE ENGINE ────────

function compareOutputs(attempts) {
  if (attempts.length === 0) return null;
  
  attempts.forEach((attempt, index) => {
    const retryPenalty = index * 0.15; // De-weight heavily modified answers
    // 0.5 * EvalScore + 0.3 * RuleMatch + 0.2 * PenaltyWeight
    attempt.confidence = (0.5 * attempt.evaluation.score) + (0.3 * attempt.evaluation.ruleMatch) + (0.2 * Math.max(0, 1 - retryPenalty));
  });

  // Sort descending by confidence
  attempts.sort((a, b) => b.confidence - a.confidence);
  return attempts[0]; // Returns highest confidence attempt
}

// ─── TASK 8: ORCHESTRATION LAYER ───────────────────────────────
export async function runCareerPredictionPipeline(answers) {
  const pipelineState = { extractedProfile: null, hybridMapping: null };
  let currentOutput = null;
  let attempts = []; // Task 4: Store multiple outputs

  try {
    const normalizedInput = normalizeInput(answers);
    pipelineState.extractedProfile = await extractProfile(normalizedInput);
    pipelineState.hybridMapping = clusterSkillsAndMapCareers(pipelineState.extractedProfile);

    // Initial Generation
    const reasoning = await generateReasoning(pipelineState.extractedProfile, pipelineState.hybridMapping);
    currentOutput = await structureFinalOutput(pipelineState.extractedProfile, pipelineState.hybridMapping, reasoning);
    
    if (!currentOutput) {
       currentOutput = { careerField: pipelineState.hybridMapping.primaryCluster, insights: reasoning };
    }

    let evalResult = await evaluateOutput(pipelineState.extractedProfile, currentOutput, true);
    
    attempts.push({ 
      output: JSON.parse(JSON.stringify(currentOutput)), 
      evaluation: evalResult 
    });

    const MAX_RETRIES = 2; // Task 5: Safety Limits
    let attemptCount = 0;

    // Task 3: Decision-Aware Self-Correction Loop
    while (!evalResult.isValid && attemptCount < MAX_RETRIES) {
      attemptCount++;
      const errorType = evalResult.errorType;
      let correctedOutput;

      // Classify and dispatch to targeted correction
      if (errorType === "STRUCTURE" || errorType === "FORMAT") {
         correctedOutput = await fixStructure(currentOutput, evalResult.issues);
      } else if (errorType === "LOGIC") {
         correctedOutput = await fixLogic(currentOutput, pipelineState.extractedProfile, evalResult.issues);
      } else if (errorType === "RELEVANCE") {
         correctedOutput = await fixRelevance(currentOutput, pipelineState.extractedProfile, evalResult.issues);
      } else {
         break; // Unknown error type
      }

      // Re-evaluate
      const newEval = await evaluateOutput(pipelineState.extractedProfile, correctedOutput, true);

      // Task 6: Regression Protection
      if (newEval.score < evalResult.score) {
          console.warn("[Regression Protected] Retry yielded lower score, discarding new output.");
          break; // Stop retrying if we are making it worse
      }

      currentOutput = correctedOutput;
      evalResult = newEval;
      
      attempts.push({ 
          output: JSON.parse(JSON.stringify(currentOutput)), 
          evaluation: evalResult 
      });

      if (evalResult.isValid) break;
    }

    // Task 5 & 7: Compare and Select Best
    const bestAttempt = compareOutputs(attempts);

    return {
      data: bestAttempt.output,
      confidence: bestAttempt.confidence,
      attempts: attempts.length,
      errorHistory: attempts.map(a => a.evaluation.issues)
    };

  } catch (error) {
    console.error("❌ [Pipeline Error] Core failure:", error);
    
    // Final fallback guarantee
    const fallbackData = {
        careerField: pipelineState.hybridMapping?.primaryCluster || "General Career Exploration",
        topCareers: pipelineState.hybridMapping?.baselineCareers || ["Undecided - Needs deeper analysis"],
        subjects: ["General Studies"],
        strengths: pipelineState.extractedProfile?.impliedStrengths || ["Willingness to learn"],
        insights: "Our advanced AI pipeline encountered an issue. We recommend speaking to a human counselor."
    };

    return {
      data: fallbackData,
      confidence: 0.1, // extremely low confidence
      attempts: attempts.length,
      errorHistory: [[{ msg: "Fatal pipeline crash", type: "CRASH" }]]
    };
  }
}
