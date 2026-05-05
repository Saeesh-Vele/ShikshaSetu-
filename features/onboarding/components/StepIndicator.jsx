// app/onboarding/components/StepIndicator.jsx
"use client";

const C = {
  primary: "oklch(0.637 0.237 275)",
  mid:     "oklch(0.65 0.25 290)",
  border:  "oklch(0.25 0.035 275)",
  muted:   "oklch(0.56 0.04 275)",
};

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full mb-8">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive    = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  transition: "all 0.3s ease",
                  ...(isCompleted
                    ? {
                        background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                        color: "white",
                        boxShadow: `0 0 12px oklch(0.637 0.237 275 / 0.4)`,
                      }
                    : isActive
                    ? {
                        background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                        color: "white",
                        boxShadow: `0 0 18px oklch(0.637 0.237 275 / 0.5)`,
                        transform: "scale(1.08)",
                      }
                    : {
                        background: "oklch(0.14 0.02 275)",
                        border: `1.5px solid ${C.border}`,
                        color: C.muted,
                      }),
                }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3.5 3.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.primary : C.muted,
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease",
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {idx < steps.length - 1 && (
              <div
                style={{
                  width: 80,
                  height: 2,
                  marginBottom: 20,
                  background: isCompleted
                    ? `linear-gradient(90deg, ${C.primary}, ${C.mid})`
                    : C.border,
                  transition: "background 0.3s ease",
                  borderRadius: 99,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
