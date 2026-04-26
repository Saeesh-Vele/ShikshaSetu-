"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, loginWithGoogle } from '@/lib/firebase/auth';
import { userProfileExists } from '@/lib/firebase/firestore';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, Eye, EyeOff,
  Brain, Map, TrendingUp, Sparkles, CheckCircle2,
} from "lucide-react";

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  primary:  "oklch(0.637 0.237 275)",
  mid:      "oklch(0.65 0.25 290)",
  blue:     "oklch(0.72 0.18 260)",
  border:   "oklch(0.20 0.025 275)",
  borderHi: "oklch(0.27 0.035 275)",
  card:     "oklch(0.09 0.014 275 / 0.94)",
  muted:    "oklch(0.56 0.04 275)",
  mutedLo:  "oklch(0.42 0.03 275)",
};

const BENEFITS = [
  { icon: Brain,      text: "AI-powered career assessment in 5 minutes" },
  { icon: Map,        text: "Explore 1,200+ colleges with full profiles"  },
  { icon: TrendingUp, text: "500+ career paths with real salary data"    },
  { icon: Sparkles,   text: "Personalised scholarship recommendations"   },
];

// Smart redirect: check Firestore profile to decide where to send the user
async function smartRedirect(uid, router) {
  try {
    const exists = await userProfileExists(uid);
    router.push(exists ? "/dashboard" : "/onboarding");
  } catch {
    router.push("/dashboard");
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      await smartRedirect(user.uid, router);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      await smartRedirect(user.uid, router);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const anyLoading = loading || googleLoading;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "var(--background)",
        backgroundImage: "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.637 0.237 275 / 0.07) 0%, transparent 65%)",
      }}
    >
      {/* Ambient orbs */}
      <div style={{
        position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: 700, height: 420, pointerEvents: "none",
        background: "radial-gradient(ellipse, oklch(0.637 0.237 275 / 0.11) 0%, transparent 68%)",
        filter: "blur(50px)",
      }} />
      <div style={{
        position: "absolute", bottom: "0%", left: "8%",
        width: 340, height: 340, pointerEvents: "none", borderRadius: "50%",
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.07) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "5%",
        width: 300, height: 300, pointerEvents: "none", borderRadius: "50%",
        background: "radial-gradient(ellipse, oklch(0.72 0.18 260 / 0.07) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, oklch(0.637 0.237 275 / 0.35) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        opacity: 0.055,
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
      }} />

      {/* ══ Main card ══ */}
      <div
        className="relative w-full flex overflow-hidden"
        style={{
          maxWidth: 880,
          background: C.card,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.borderHi}`,
          borderRadius: "1.75rem",
          boxShadow: "0 28px 70px oklch(0 0 0 / 0.55), 0 0 0 1px oklch(0.637 0.237 275 / 0.06)",
        }}
      >
        {/* Shimmer top */}
        <div style={{
          position: "absolute", inset: "0 0 auto", height: 1,
          background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.40), transparent)",
          pointerEvents: "none",
        }} />
        {/* Left accent bar */}
        <div style={{
          position: "absolute", left: 0, top: "12%", bottom: "12%",
          width: 3, borderRadius: 99,
          background: `linear-gradient(180deg, ${C.primary}, ${C.mid})`,
          boxShadow: `0 0 14px ${C.primary}`,
        }} />

        {/* ─── LEFT PANEL ─── */}
        <div
          className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
          style={{
            width: 340, flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            background: "oklch(0.07 0.012 275 / 0.60)",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 60% at 0% 0%, oklch(0.637 0.237 275 / 0.08) 0%, transparent 65%)",
          }} />

          <div className="relative">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-12">
              <div style={{
                height: 34, width: 34, borderRadius: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                boxShadow: `0 0 16px oklch(0.637 0.237 275 / 0.45)`,
              }}>
                <GraduationCap size={17} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--foreground)" }}>
                ShikshaSetu
              </span>
            </div>

            {/* Headline */}
            <div className="mb-8">
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
                textTransform: "uppercase", color: C.primary, marginBottom: 10,
              }}>
                Welcome back
              </p>
              <h2 style={{
                fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.035em",
                lineHeight: 1.2, color: "var(--foreground)", marginBottom: "0.7rem",
              }}>
                Your future guidance{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                  WebkitBackgroundClip: "text", backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  awaits you
                </span>.
              </h2>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.65, color: C.muted }}>
                Sign back in to continue exploring your personalised college, career and scholarship recommendations.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3.5">
              {BENEFITS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div style={{
                    height: 28, width: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "oklch(0.637 0.237 275 / 0.12)",
                    border: "1px solid oklch(0.637 0.237 275 / 0.22)",
                  }}>
                    <Icon size={13} color={C.primary} strokeWidth={1.8} />
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "oklch(0.64 0.04 275)", lineHeight: 1.55 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative mt-10">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 99,
              background: "oklch(0.637 0.237 275 / 0.08)",
              border: "1px solid oklch(0.637 0.237 275 / 0.22)",
            }}>
              <CheckCircle2 size={12} color={C.primary} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.primary }}>
                Free · 10,000+ students guided
              </span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: FORM ─── */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden">
            <div style={{
              height: 32, width: 32, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
              boxShadow: `0 0 14px oklch(0.637 0.237 275 / 0.40)`,
            }}>
              <GraduationCap size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--foreground)" }}>ShikshaSetu</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 style={{
              fontSize: "1.55rem", fontWeight: 800,
              letterSpacing: "-0.03em", color: "var(--foreground)", marginBottom: "0.3rem",
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "0.85rem", color: C.muted }}>
              Sign in to your ShikshaSetu account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 text-sm py-3 px-4 rounded-xl" style={{
              background: "oklch(0.60 0.25 30 / 0.10)",
              border: "1px solid oklch(0.60 0.25 30 / 0.28)",
              color: "oklch(0.75 0.18 30)",
            }}>
              {error}
            </div>
          )}

          {/* Google Sign-In button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogle}
            disabled={anyLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium mb-5 transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
            style={{
              border: `1px solid ${C.borderHi}`,
              background: "oklch(0.11 0.015 275 / 0.80)",
              color: "var(--foreground)",
            }}
            onMouseEnter={e => {
              if (!anyLoading) {
                e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.45)";
                e.currentTarget.style.background = "oklch(0.637 0.237 275 / 0.06)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.borderHi;
              e.currentTarget.style.background = "oklch(0.11 0.015 275 / 0.80)";
            }}
          >
            {googleLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5 flex items-center">
            <div className="flex-1" style={{ height: 1, background: C.border }} />
            <span className="px-3 text-xs" style={{ color: C.mutedLo }}>
              or sign in with email
            </span>
            <div className="flex-1" style={{ height: 1, background: C.border }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" style={{ fontSize: "0.8rem", fontWeight: 600, color: "oklch(0.72 0.04 275)" }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" style={{ fontSize: "0.8rem", fontWeight: 600, color: "oklch(0.72 0.04 275)" }}>
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs transition-colors duration-150"
                  style={{ color: C.primary }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                  style={{ color: C.mutedLo }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                  onMouseLeave={e => (e.currentTarget.style.color = C.mutedLo)}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="email-signin-btn"
              type="submit"
              disabled={anyLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                boxShadow: `0 4px 18px oklch(0.637 0.237 275 / 0.40)`,
                transition: "filter 0.14s ease, box-shadow 0.14s ease",
              }}
              onMouseEnter={e => {
                if (!anyLoading) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.boxShadow = `0 6px 26px oklch(0.637 0.237 275 / 0.52)`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.boxShadow = `0 4px 18px oklch(0.637 0.237 275 / 0.40)`;
              }}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Sign-up link */}
          <div className="relative my-6 flex items-center">
            <div className="flex-1" style={{ height: 1, background: C.border }} />
            <span className="px-3 text-xs" style={{ color: C.mutedLo }}>
              New to ShikshaSetu?
            </span>
            <div className="flex-1" style={{ height: 1, background: C.border }} />
          </div>

          <Link href="/sign-up">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]"
              style={{
                border: `1px solid ${C.border}`,
                color: C.muted,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.42)";
                e.currentTarget.style.color = "var(--foreground)";
                e.currentTarget.style.background = "oklch(0.637 0.237 275 / 0.06)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.color = C.muted;
                e.currentTarget.style.background = "transparent";
              }}
            >
              Create a Free Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}