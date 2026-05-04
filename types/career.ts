// ─── CAREER API CONTRACT TYPES ────────────────────────────────────────────────

export interface CareerGuidanceRequest {
  answers: Record<string, string | string[]>;
}

export interface CareerGuidanceResult {
  careerField: string;
  recommendedSubjects: string[];
  suggestedCareers: string[];
  personalityStrengths: string[];
  counselorInsight: string;
  confidenceScore: number;
}

export interface CareerGuidanceResponse {
  result: CareerGuidanceResult;
}
