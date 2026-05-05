// features/subject-advisor/index.js
// Barrel export for subject-advisor feature.

// Components
export { default as AITestScreen } from "./components/AITestScreen";
export { default as ClassSelectionScreen } from "./components/ClassSelectionScreen";
export { default as ResultDashboard } from "./components/ResultDashboard";

// Hooks
export { useSubjectAdvisor } from "./hooks/useSubjectAdvisor";

// Services
export { fetchQuestions, submitEvaluation } from "./services/subjectAdvisorApi";
