// app/onboarding/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useProfile } from "@/components/FirebaseAuthProvider";
import { createUserProfile, userProfileExists } from "@/lib/firestore";
import StepIndicator from "./components/StepIndicator";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

const C = {
  primary:  "oklch(0.637 0.237 275)",
  mid:      "oklch(0.65 0.25 290)",
  border:   "oklch(0.20 0.025 275)",
  borderHi: "oklch(0.27 0.035 275)",
  card:     "oklch(0.09 0.014 275 / 0.94)",
  muted:    "oklch(0.56 0.04 275)",
  mutedLo:  "oklch(0.42 0.03 275)",
};

const STEPS = ["Basic Info", "Education"];

const GENDER_OPTIONS = [
  { value: "male",       label: "Male" },
  { value: "female",     label: "Female" },
  { value: "nonbinary",  label: "Non-binary" },
  { value: "prefer_not", label: "Prefer not to say" },
];

const QUALIFICATION_OPTIONS = [
  { value: "10th",      label: "10th" },
  { value: "12th",      label: "12th" },
  { value: "graduate",  label: "Graduate" },
];

function validate(step, data) {
  const errors = {};
  if (step === 1) {
    if (!data.name?.trim())     errors.name     = "Full name is required.";
    if (!data.phone?.trim())    errors.phone    = "Phone number is required.";
    if (!data.gender)           errors.gender   = "Please select your gender.";
    if (!data.location?.trim()) errors.location = "City/State is required.";
  }
  if (step === 2) {
    if (!data.highestQualification) errors.highestQualification = "Please select your qualification.";
    if (!data.collegeName?.trim())  errors.collegeName           = "College/School name is required.";
    if (["10th", "12th", "graduate"].includes(data.highestQualification) && !data.tenthPercentage)
      errors.tenthPercentage = "10th percentage is required.";
    if (["12th", "graduate"].includes(data.highestQualification) && !data.twelfthPercentage)
      errors.twelfthPercentage = "12th percentage is required.";
  }
  return errors;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { refreshProfile } = useProfile();

  const [step,    setStep]    = useState(1);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [animDir, setAnimDir] = useState("forward"); // "forward" | "backward"

  const [form, setForm] = useState({
    name:                  "",
    phone:                 "",
    email:                 "",
    gender:                "",
    location:              "",
    highestQualification:  "",
    tenthPercentage:       "",
    twelfthPercentage:     "",
    graduationField:       "",
    collegeName:           "",
  });

  // Guard: redirect if not logged in or already has a profile
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.replace("/sign-in");
      return;
    }
    userProfileExists(userId).then((exists) => {
      if (exists) router.replace("/dashboard");
    });
  }, [isLoaded, userId, router]);

  // Pre-fill from Firebase auth
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:  user.fullName || user.firstName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const goNext = () => {
    const errs = validate(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setAnimDir("forward");
    setStep(s => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setAnimDir("backward");
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    const errs = validate(2, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        name:                 form.name.trim(),
        email:                form.email,
        phone:                form.phone.trim(),
        gender:               form.gender,
        location:             form.location.trim(),
        highestQualification: form.highestQualification,
        collegeName:          form.collegeName.trim(),
        tenthPercentage:
          form.tenthPercentage ? parseFloat(form.tenthPercentage) : null,
        twelfthPercentage:
          (["12th", "graduate"].includes(form.highestQualification) && form.twelfthPercentage)
            ? parseFloat(form.twelfthPercentage)
            : null,
        graduationField:
          form.highestQualification === "graduate" ? form.graduationField.trim() : null,
      };
      await createUserProfile(userId, payload);
      await refreshProfile();
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--background)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "2px solid oklch(0.22 0.03 275)",
          borderTopColor: C.primary,
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  const show10th = ["10th","12th","graduate"].includes(form.highestQualification);
  const show12th = ["12th","graduate"].includes(form.highestQualification);
  const showGrad = form.highestQualification === "graduate";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--background)",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.637 0.237 275 / 0.08) 0%, transparent 70%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: "-8%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 380, pointerEvents: "none",
        background: "radial-gradient(ellipse, oklch(0.637 0.237 275 / 0.10) 0%, transparent 70%)",
        filter: "blur(50px)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, right: "5%",
        width: 300, height: 300, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.06) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* ── Main card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: C.card,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.borderHi}`,
          borderRadius: "1.75rem",
          padding: "2.5rem",
          boxShadow: "0 28px 70px oklch(0 0 0 / 0.50), 0 0 0 1px oklch(0.637 0.237 275 / 0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer top */}
        <div style={{
          position: "absolute", inset: "0 0 auto", height: 1, pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.40), transparent)",
        }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.75rem" }}>
          <div style={{
            height: 34, width: 34, borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
            boxShadow: `0 0 16px oklch(0.637 0.237 275 / 0.45)`,
            flexShrink: 0,
          }}>
            <GraduationCap size={17} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--foreground)", lineHeight: 1.2 }}>
              ShikshaSetu
            </p>
            <p style={{ fontSize: "0.7rem", color: C.muted, lineHeight: 1 }}>Set up your profile</p>
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} currentStep={step} />

        {/* Step heading */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: C.primary, marginBottom: 4 }}>
            Step {step} of {STEPS.length}
          </p>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em",
            color: "var(--foreground)", marginBottom: "0.25rem" }}>
            {step === 1 ? "Basic Information" : "Education Details"}
          </h2>
          <p style={{ fontSize: "0.82rem", color: C.muted }}>
            {step === 1
              ? "Tell us a bit about yourself to personalise your experience."
              : "Help us understand your academic background."}
          </p>
        </div>

        {/* ─── STEP 1: Basic Info ─── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: `${animDir === "forward" ? "slideInRight" : "slideInLeft"} 0.25s ease` }}>
            <InputField
              id="ob-name"
              label="Full Name"
              placeholder="Aryan Sharma"
              value={form.name}
              onChange={set("name")}
              required
              error={errors.name}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <InputField
                id="ob-phone"
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set("phone")}
                required
                error={errors.phone}
              />
              <InputField
                id="ob-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                disabled
              />
            </div>
            <SelectField
              id="ob-gender"
              label="Gender"
              value={form.gender}
              onChange={set("gender")}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              required
              error={errors.gender}
            />
            <InputField
              id="ob-location"
              label="City / State"
              placeholder="e.g. Mumbai, Maharashtra"
              value={form.location}
              onChange={set("location")}
              required
              error={errors.location}
            />
          </div>
        )}

        {/* ─── STEP 2: Education ─── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", animation: `${animDir === "forward" ? "slideInRight" : "slideInLeft"} 0.25s ease` }}>
            <SelectField
              id="ob-qual"
              label="Highest Qualification"
              value={form.highestQualification}
              onChange={set("highestQualification")}
              options={QUALIFICATION_OPTIONS}
              placeholder="Select qualification"
              required
              error={errors.highestQualification}
            />

            {show10th && (
              <InputField
                id="ob-10th"
                label="10th Percentage (%)"
                type="number"
                placeholder="e.g. 87.5"
                value={form.tenthPercentage}
                onChange={set("tenthPercentage")}
                required
                error={errors.tenthPercentage}
              />
            )}

            {show12th && (
              <InputField
                id="ob-12th"
                label="12th Percentage (%)"
                type="number"
                placeholder="e.g. 82.0"
                value={form.twelfthPercentage}
                onChange={set("twelfthPercentage")}
                required
                error={errors.twelfthPercentage}
              />
            )}

            {showGrad && (
              <InputField
                id="ob-grad"
                label="Graduation Field (Optional)"
                placeholder="e.g. B.Tech Computer Science"
                value={form.graduationField}
                onChange={set("graduationField")}
              />
            )}

            <InputField
              id="ob-college"
              label="College / School Name"
              placeholder="e.g. Delhi Public School"
              value={form.collegeName}
              onChange={set("collegeName")}
              required
              error={errors.collegeName}
            />

            {errors.submit && (
              <p style={{ fontSize: "0.8rem", color: "oklch(0.75 0.18 30)", padding: "0.625rem 0.875rem",
                background: "oklch(0.60 0.25 30 / 0.10)", borderRadius: "0.5rem",
                border: "1px solid oklch(0.60 0.25 30 / 0.28)" }}>
                {errors.submit}
              </p>
            )}
          </div>
        )}

        {/* ─── Navigation buttons ─── */}
        <div style={{
          display: "flex", gap: "0.75rem", marginTop: "2rem",
          justifyContent: step === 1 ? "flex-end" : "space-between",
        }}>
          {step > 1 && (
            <button
              onClick={goBack}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
                border: `1px solid ${C.border}`, background: "transparent",
                color: C.muted, fontSize: "0.875rem", fontWeight: 500,
                cursor: "pointer", transition: "all 0.15s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.4)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.muted;
              }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}

          {step < STEPS.length ? (
            <button
              id="onboarding-next-btn"
              onClick={goNext}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.5rem", borderRadius: "0.75rem",
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                color: "white", fontSize: "0.875rem", fontWeight: 600,
                cursor: "pointer", border: "none",
                boxShadow: `0 4px 16px oklch(0.637 0.237 275 / 0.40)`,
                transition: "filter 0.14s ease, box-shadow 0.14s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.boxShadow = `0 6px 22px oklch(0.637 0.237 275 / 0.52)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.boxShadow = `0 4px 16px oklch(0.637 0.237 275 / 0.40)`;
              }}
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              id="onboarding-submit-btn"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.625rem 1.5rem", borderRadius: "0.75rem",
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                color: "white", fontSize: "0.875rem", fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer", border: "none",
                opacity: saving ? 0.7 : 1,
                boxShadow: `0 4px 16px oklch(0.637 0.237 275 / 0.40)`,
                transition: "filter 0.14s ease, box-shadow 0.14s ease",
              }}
            >
              {saving ? (
                <>
                  <span style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: "2px solid white", borderTopColor: "transparent",
                    display: "inline-block", animation: "spin 0.8s linear infinite",
                  }} />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Complete Setup
                </>
              )}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "1.75rem" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: "0.375rem",
          }}>
            <span style={{ fontSize: "0.68rem", color: C.mutedLo }}>Progress</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: C.primary }}>
              {Math.round((step / STEPS.length) * 100)}%
            </span>
          </div>
          <div style={{
            height: 4, borderRadius: 99,
            background: "oklch(0.16 0.02 275)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(step / STEPS.length) * 100}%`,
              background: `linear-gradient(90deg, ${C.primary}, ${C.mid})`,
              borderRadius: 99,
              transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: `0 0 8px oklch(0.637 0.237 275 / 0.5)`,
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
