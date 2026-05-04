// ─── TRAIT ANALYZER ───────────────────────────────────────────────────────────
// Sanitizes and validates personality trait labels from AI output
// against a fixed taxonomy of dominant traits.

// ─── VALID DOMINANT TRAITS ────────────────────────────────────────────────────
export const VALID_TRAITS = [
  "Logical / Analytical",
  "Scientific / Research",
  "Business / Financial",
  "Creative / Artistic",
];

// ─── TRAIT FUZZY MAP ──────────────────────────────────────────────────────────
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

/**
 * Sanitizes an array of trait labels.
 * Uses exact match then fuzzy keyword matching.
 * @param {string[]} arr - Raw trait labels from AI output
 * @returns {string[]} Valid, unique trait labels
 */
export function sanitizeTraits(arr) {
  if (!Array.isArray(arr)) return [];

  const result = [];
  for (const trait of arr) {
    if (!trait || typeof trait !== "string") continue;

    // Exact match
    if (VALID_TRAITS.includes(trait)) {
      result.push(trait);
      continue;
    }

    // Fuzzy keyword match
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
