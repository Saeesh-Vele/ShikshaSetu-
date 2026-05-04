// ─── STREAM SCORING ENGINE ────────────────────────────────────────────────────
// Sanitizes and validates AI-generated stream/career recommendations
// against known valid Indian education system streams.
//
// This is the guardrail: "Flexible options, but within real-world education systems."

import { AI_CONFIG } from "@/config/ai.config";

// ─── VALID STREAMS (CLASS 10) ─────────────────────────────────────────────────
export const VALID_STREAMS = {
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

export const ALL_VALID_STREAMS = [
  ...VALID_STREAMS.core,
  ...VALID_STREAMS.flexible,
  ...VALID_STREAMS.optional,
];

// ─── SAFETY MAPPING ──────────────────────────────────────────────────────────
// Maps unexpected AI outputs to the closest valid stream.
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
 * Uses exact match → safety map → fuzzy substring → keyword regex → fallback.
 * @param {string} raw - Raw stream name from AI output
 * @param {string} fallback - Fallback if no match found
 * @returns {string} Valid stream name
 */
export function sanitizeStream(raw, fallback = "Science PCM") {
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

  console.warn(`[scoring-engine] Could not map stream "${raw}", using fallback: ${fallback}`);
  return fallback;
}

/**
 * Sanitizes an array of stream names, deduplicating results.
 * @param {string[]} arr - Array of raw stream names
 * @returns {string[]} Array of valid, unique stream names
 */
export function sanitizeStreams(arr) {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map((s) => sanitizeStream(s)))];
}

/**
 * Clamps a confidence score to the valid range.
 * @param {number|string} raw - Raw confidence score
 * @returns {number} Clamped confidence score
 */
export function clampConfidence(raw) {
  const { minConfidence, maxConfidence, defaultConfidence } = AI_CONFIG.scoring;
  return Math.min(maxConfidence, Math.max(minConfidence, parseInt(raw) || defaultConfidence));
}

/**
 * Derives a confidence level label from a numeric score.
 * @param {number} score - Confidence score
 * @returns {string} "High" | "Good" | "Moderate"
 */
export function getConfidenceLevel(score) {
  if (score >= 85) return "High";
  if (score >= 70) return "Good";
  return "Moderate";
}
