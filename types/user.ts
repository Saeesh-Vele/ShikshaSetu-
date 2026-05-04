// ─── USER API CONTRACT TYPES ──────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "nonbinary" | "prefer_not";
  location: string;
  highestQualification: "10th" | "12th" | "graduate";
  collegeName: string;
  tenthPercentage: number | null;
  twelfthPercentage: number | null;
  graduationField: string | null;
}

export interface OnboardingRequest extends UserProfile {}
