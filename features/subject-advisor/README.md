# Subject Advisor

AI-powered academic stream and career path advisor. Students answer 10 assessment questions and receive personalized recommendations.

## Exports (via index.js)

- `AITestScreen` — Quiz UI with progress tracking and animated transitions
- `ClassSelectionScreen` — Class 10th/12th selection entry point
- `ResultDashboard` — AI analysis results with strengths, streams, and career paths
- `useSubjectAdvisor` — Hook orchestrating the full assessment flow
- `fetchQuestions`, `submitEvaluation` — Client-side API fetch functions

## API Routes

- `POST /api/subject-advisor/generate-questions` — Returns fixed questions for a class level
- `POST /api/subject-advisor/evaluate` — Submits answers for AI evaluation

## External Dependencies

- Groq SDK (primary AI model) with Gemini fallback
- Firebase Auth (authenticated requests)
