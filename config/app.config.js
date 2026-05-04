// ─── APPLICATION-LEVEL CONFIGURATION ──────────────────────────────────────────

export const APP_CONFIG = {
  name: "ShikshaSetu",
  tagline: "Your Smart Career Companion",

  // ─── Feature Flags ───────────────────────────────────────────
  features: {
    enableChatbot: true,
    enableCollegeExplorer: true,
    enableSubjectAdvisor: true,
    enableCareerPrediction: true,
  },

  // ─── Supported Class Levels ──────────────────────────────────
  classLevels: ["10th", "12th"],

  // ─── API Timeouts (ms) ───────────────────────────────────────
  apiTimeouts: {
    default: 10000,
    ai: 20000,
    geocoding: 5000,
  },
};
