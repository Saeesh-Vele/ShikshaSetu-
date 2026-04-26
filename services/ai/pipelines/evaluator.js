import { generateGroqCompletion } from "../llmClient";
import { safeParse } from "../utils";

// ─── TASK 1: ERROR CLASSIFICATION SYSTEM ────────────────────────

export function validateSchema(output) {
  const issues = [];
  
  if (!output || typeof output !== 'object') {
    issues.push({ msg: "Output is not a valid JSON object.", type: "STRUCTURE" });
    return issues;
  }
  if (!output.careerField || typeof output.careerField !== 'string') {
    issues.push({ msg: "Missing or invalid 'careerField'", type: "STRUCTURE" });
  }
  if (!Array.isArray(output.topCareers) || output.topCareers.length === 0) {
    issues.push({ msg: "Missing or invalid 'topCareers'", type: "STRUCTURE" });
  }
  if (!Array.isArray(output.subjects) || output.subjects.length === 0) {
    issues.push({ msg: "Missing or invalid 'subjects'", type: "STRUCTURE" });
  }
  if (!Array.isArray(output.strengths) || output.strengths.length === 0) {
    issues.push({ msg: "Missing or invalid 'strengths'", type: "STRUCTURE" });
  }
  if (!output.insights || typeof output.insights !== 'string' || output.insights.length < 20) {
    issues.push({ msg: "Missing or weak 'insights'", type: "FORMAT" });
  }

  return issues;
}

export function checkRelevance(profile, output) {
  const issues = [];
  
  if (output.careerField && output.careerField.includes("Broad domain name")) {
    issues.push({ msg: "Placeholder text found in careerField.", type: "FORMAT" });
  }
  if (output.topCareers && output.topCareers.some(c => c.includes("Career 1"))) {
    issues.push({ msg: "Placeholder text found in topCareers.", type: "FORMAT" });
  }

  return issues;
}

export async function llmEvaluate(profile, output) {
  const prompt = `You are a strict QA AI evaluating a career prediction.
Student Profile: ${JSON.stringify(profile)}
Prediction Output: ${JSON.stringify(output)}

Evaluate the prediction based on:
1. Relevance: Do the careers make sense for the student's interests and strengths?
2. Logic: Are there any glaring logical errors or contradictions?

Return EXACTLY this JSON structure:
{
  "isValid": boolean,
  "score": number, // 0.0 to 1.0
  "issues": [
    { "msg": "Description of issue", "type": "LOGIC" },
    { "msg": "Another issue", "type": "RELEVANCE" }
  ]
}
Valid types: "LOGIC", "RELEVANCE". Use empty array if no issues.`;

  try {
    const responseText = await generateGroqCompletion([{ role: "user", content: prompt }], "llama-3.1-8b-instant", 0.1);
    const parsed = safeParse(responseText);
    
    if (parsed && typeof parsed.isValid === 'boolean') {
      return parsed;
    }
  } catch (error) {
    console.warn("LLM Evaluation failed:", error);
  }
  
  return { isValid: true, score: 0.8, issues: [] };
}

// ─── MAIN EVALUATION ─────────────────────────────────────────

export async function evaluateOutput(profile, output, useLLM = false) {
  const allIssues = [];
  
  // Rule checks
  const schemaIssues = validateSchema(output);
  allIssues.push(...schemaIssues);
  
  const relevanceIssues = checkRelevance(profile, output);
  allIssues.push(...relevanceIssues);
  
  // Base rule match score
  let ruleMatch = allIssues.length === 0 ? 1.0 : (1.0 - (allIssues.length * 0.2));
  if (ruleMatch < 0) ruleMatch = 0;
  
  let score = ruleMatch;
  let isValid = allIssues.length === 0;

  // Task 7: Performance Optimization
  // Skip LLM deep check if basic structure is completely broken
  if (isValid && useLLM) {
    const llmResult = await llmEvaluate(profile, output);
    if (!llmResult.isValid || llmResult.score < 0.7) {
      isValid = false;
      score = (score * 0.3) + (llmResult.score * 0.7); // Weighted score
      allIssues.push(...(llmResult.issues || []));
    } else {
      score = llmResult.score; // High confidence
    }
  }

  // Determine primary error type
  let primaryErrorType = null;
  if (!isValid && allIssues.length > 0) {
    const types = allIssues.map(i => i.type);
    if (types.includes("STRUCTURE")) primaryErrorType = "STRUCTURE";
    else if (types.includes("FORMAT")) primaryErrorType = "FORMAT";
    else if (types.includes("LOGIC")) primaryErrorType = "LOGIC";
    else if (types.includes("RELEVANCE")) primaryErrorType = "RELEVANCE";
  }

  return {
    isValid,
    score,
    issues: allIssues,
    errorType: primaryErrorType,
    ruleMatch
  };
}
