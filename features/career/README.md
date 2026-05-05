# Career

Career assessment quiz and AI-powered career prediction with visual flowcharts.

## Exports (via index.js)

- `CareerAssessmentQuiz` — Multi-step quiz UI for career guidance
- `CareerPredictionCard` — Displays AI career prediction results
- `CourseFlowchart` — Interactive course pathway visualization (React Flow)
- `useCareerQuiz` — Hook managing quiz state and submission

## API Routes

- `POST /api/career-prediction` — Submits quiz answers, returns career analysis
- `POST /api/career-guidance` — Alternative guidance endpoint with detailed counselor insights

## External Dependencies

- Google Gemini (career guidance), Groq (career prediction)
- React Flow / XYFlow (flowchart rendering)
