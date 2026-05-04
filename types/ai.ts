// ─── AI API CONTRACT TYPES ────────────────────────────────────────────────────
// TypeScript interfaces defining request/response shapes for all AI endpoints.

// ─── Subject Advisor ──────────────────────────────────────────────────────────

export interface EvaluateRequest {
  answers: Array<{ question: string; selected: string }>;
  classLevel: "10th" | "12th";
}

export interface GraphData {
  Analytical: number;
  Creative: number;
  Social: number;
  Practical: number;
}

export interface Class10Result {
  recommended_streams: string[];
  secondary_options: string[];
  dominant_traits: string[];
  confidence_score: number;
  confidence_level: "High" | "Good" | "Moderate";
  strengths: string[];
  interest_areas: string[];
  weaknesses: string[];
  reasoning: string;
  graph_data: GraphData;
}

export interface Class12Result {
  recommended_path: string;
  confidence_score: number;
  strengths: string[];
  interest_areas: string[];
  weaknesses: string[];
  reason: string;
  graph_data: GraphData;
  entrance_exams: string[];
}

export interface EvaluateResponse {
  result: Class10Result | Class12Result;
}

// ─── Career Prediction ────────────────────────────────────────────────────────

export interface CareerPredictionRequest {
  answers: string[];
}

export interface CareerPredictionResult {
  careerField: string;
  topCareers: string[];
  subjects: string[];
  strengths: string[];
  insights: string;
}

export interface CareerPredictionResponse {
  result: CareerPredictionResult;
  metadata: {
    confidence: number;
    attempts: number;
    errorHistory: Array<Array<{ msg: string; type: string }>>;
  };
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  reply: string;
}
