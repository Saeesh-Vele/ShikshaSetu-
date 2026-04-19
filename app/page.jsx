"use client";

import Link from "next/link";
import {
  ArrowRight, GraduationCap, BookOpen, TrendingUp,
  Library, DollarSign, Sparkles, Brain, BarChart2,
  CheckCircle, ChevronRight, Target, Map, Zap,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI Career Assessment",
    description: "Answer 10 targeted questions. Our Gemini-powered engine decodes your strengths, personality and interests in under 5 minutes.",
    accent: "oklch(0.637 0.237 275)",
    accentMid: "oklch(0.65 0.25 290)",
  },
  {
    icon: BookOpen,
    title: "Subject Advisor",
    description: "Science, Commerce or Arts? Get a stream recommendation tailored to your Class 10 or 12 profile — not someone else's guess.",
    accent: "oklch(0.65 0.25 290)",
    accentMid: "oklch(0.70 0.22 300)",
  },
  {
    icon: Map,
    title: "College Explorer",
    description: "Browse 1,200+ colleges with profiles covering admission cut-offs, fee structures, hostel availability and placement records.",
    accent: "oklch(0.72 0.18 260)",
    accentMid: "oklch(0.637 0.237 275)",
  },
  {
    icon: TrendingUp,
    title: "Career Outcomes",
    description: "Explore 500+ career paths. Understand salary ranges, growth projections and the exact qualifications each path requires.",
    accent: "oklch(0.637 0.237 275)",
    accentMid: "oklch(0.72 0.18 260)",
  },
  {
    icon: DollarSign,
    title: "Scholarship Finder",
    description: "Discover government and private scholarships matched to your profile. Step-by-step application guides included.",
    accent: "oklch(0.65 0.25 290)",
    accentMid: "oklch(0.637 0.237 275)",
  },
  {
    icon: BarChart2,
    title: "Dashboard Insights",
    description: "Track your assessments, saved colleges, and career preferences. Your personal command centre for every decision.",
    accent: "oklch(0.72 0.18 260)",
    accentMid: "oklch(0.65 0.25 290)",
  },
];

const STEPS = [
  {
    n: "01", icon: Target,
    title: "Take the Assessment",
    body: "Answer 10 AI-generated questions tailored to your class level. Takes about 5 minutes — no prep needed.",
  },
  {
    n: "02", icon: Brain,
    title: "Get Your Analysis",
    body: "Receive a breakdown of your strengths, learning style and recommended academic streams personalised to you.",
  },
  {
    n: "03", icon: CheckCircle,
    title: "Explore Your Path",
    body: "Browse matched colleges, career options and scholarships — all filtered and ranked for your unique profile.",
  },
];

const STATS = [
  { value: "10,000+", label: "Students Guided" },
  { value: "1,200+",  label: "Colleges Listed"  },
  { value: "500+",    label: "Career Paths"      },
  { value: "Free",    label: "No Credit Card"    },
];

const TESTIMONIALS = [
  {
    quote: "Helped me pick Science with CS when everyone said Commerce. Now I'm at IIT Delhi.",
    name: "Aryan Sharma", role: "IIT Delhi, CSE", i: "A",
    accent: "oklch(0.637 0.237 275)", accentMid: "oklch(0.65 0.25 290)",
  },
  {
    quote: "The scholarship finder saved me ₹2 lakh. I had no idea these opportunities even existed.",
    name: "Priya Iyer", role: "BITS Pilani, EEE", i: "P",
    accent: "oklch(0.65 0.25 290)", accentMid: "oklch(0.70 0.22 300)",
  },
  {
    quote: "Like having a personal counsellor at 2 AM before my JEE exam — calm, accurate, instant.",
    name: "Rahul Nair", role: "NIT Trichy, Mechanical", i: "R",
    accent: "oklch(0.72 0.18 260)", accentMid: "oklch(0.637 0.237 275)",
  },
];

// ─── Shared tokens ────────────────────────────────────────────────────────────
const C = {
  primary:  "oklch(0.637 0.237 275)",
  mid:      "oklch(0.65 0.25 290)",
  blue:     "oklch(0.72 0.18 260)",
  border:   "oklch(0.20 0.025 275)",
  borderHi: "oklch(0.27 0.035 275)",
  card:     "oklch(0.09 0.014 275 / 0.92)",
  muted:    "oklch(0.56 0.04 275)",
  mutedLo:  "oklch(0.42 0.03 275)",
};

// ─── Section label ────────────────────────────────────────────────────────────
function Kicker({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div style={{
        width: 4, height: 20, borderRadius: 99,
        background: `linear-gradient(180deg, ${C.primary}, ${C.mid})`,
        flexShrink: 0,
      }} />
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.09em",
        textTransform: "uppercase", color: C.primary,
      }}>
        {Icon && <Icon size={11} />}
        {children}
      </span>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: "clamp(1.65rem, 4vw, 2.35rem)",
      fontWeight: 800, letterSpacing: "-0.03em",
      lineHeight: 1.15, color: "var(--foreground)",
      marginBottom: "0.55rem",
    }}>
      {children}
    </h2>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, accent, accentMid }) {
  return (
    <div
      className="group flex flex-col gap-5 p-6 rounded-2xl cursor-default relative overflow-hidden"
      style={{
        background: C.card,
        backdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        boxShadow: "0 1px 8px oklch(0 0 0 / 0.30)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = `0 8px 28px oklch(0 0 0 / 0.38), 0 0 0 1px ${accent.replace(")", " / 0.28)")}`;
        el.style.borderColor = accent.replace(")", " / 0.38)");
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 1px 8px oklch(0 0 0 / 0.30)";
        el.style.borderColor = C.border;
      }}
    >
      {/* Static shimmer top */}
      <div style={{
        position: "absolute", inset: "0 0 auto",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${accent.replace(")", " / 0.28)")}, transparent)`,
      }} />

      {/* Icon */}
      <div style={{
        height: 48, width: 48, borderRadius: 16, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${accent.replace(")", " / 0.15)")}, ${accentMid.replace(")", " / 0.10)")})`,
        border: `1px solid ${accent.replace(")", " / 0.22)")}`,
      }}>
        <Icon size={22} color={accent} strokeWidth={1.7} />
      </div>

      {/* Text */}
      <div>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.45rem", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: C.muted }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ n, icon: Icon, title, body }) {
  return (
    <div className="flex-1 flex flex-col gap-4 p-7 rounded-2xl relative overflow-hidden" style={{
      background: C.card,
      backdropFilter: "blur(20px)",
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 8px oklch(0 0 0 / 0.28)",
    }}>
      {/* Decorative step number — large watermark */}
      <div style={{
        position: "absolute", right: 20, top: 12,
        fontSize: "4.5rem", fontWeight: 900, lineHeight: 1,
        color: "oklch(0.637 0.237 275 / 0.06)",
        letterSpacing: "-0.06em",
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
        pointerEvents: "none",
      }}>
        {n}
      </div>
      {/* Shimmer top */}
      <div style={{
        position: "absolute", inset: "0 0 auto", height: 1,
        background: `linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.22), transparent)`,
      }} />

      {/* Step indicator row */}
      <div className="flex items-center gap-3">
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: C.primary }}>
          STEP {n}
        </span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <div style={{
          height: 32, width: 32, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "oklch(0.637 0.237 275 / 0.12)",
          border: "1px solid oklch(0.637 0.237 275 / 0.22)",
        }}>
          <Icon size={16} color={C.primary} strokeWidth={1.8} />
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: C.muted }}>
          {body}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: "var(--background)",
      backgroundImage: "radial-gradient(ellipse 90% 40% at 50% 0%, oklch(0.637 0.237 275 / 0.055) 0%, transparent 70%)",
    }}>

      {/* ══ NAV ══ */}
      <nav className="sticky top-0 z-50" style={{
        background: "oklch(0.04 0.01 275 / 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{
              height: 30, width: 30, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
              boxShadow: `0 0 14px oklch(0.637 0.237 275 / 0.38)`,
            }}>
              <GraduationCap size={15} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em", color: "var(--foreground)" }}>
              ShikshaSetu
            </span>
          </Link>

          {/* Nav right */}
          <div className="flex items-center gap-2">
            <Link href="/sign-in">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{ color: C.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
              >
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                  boxShadow: `0 2px 12px oklch(0.637 0.237 275 / 0.38)`,
                  transition: "filter 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.12)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}
              >
                Get Started
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative py-24 md:py-36 px-5 text-center overflow-hidden">
        {/* Soft centered desk glow */}
        <div style={{
          position: "absolute", top: "0%", left: "50%",
          transform: "translateX(-50%)",
          width: 760, height: 420, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, oklch(0.637 0.237 275 / 0.13) 0%, transparent 68%)",
          filter: "blur(4px)",
        }} />

        <div className="relative max-w-2xl mx-auto">
          {/* Kicker badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7" style={{
            background: "oklch(0.637 0.237 275 / 0.08)",
            border: "1px solid oklch(0.637 0.237 275 / 0.28)",
          }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: C.primary }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: C.primary }} />
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.primary }}>
              AI-Powered Education Guidance
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "var(--foreground)",
            marginBottom: "1.35rem",
          }}>
            Make Smarter Decisions{" "}
            <span style={{
              background: `linear-gradient(135deg, ${C.primary} 0%, ${C.mid} 55%, ${C.blue} 100%)`,
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              About Your Future
            </span>
          </h1>

          {/* Subtext */}
          <p style={{
            fontSize: "1rem", lineHeight: 1.75,
            color: C.muted, maxWidth: "32rem", margin: "0 auto 2.4rem",
          }}>
            ShikshaSetu helps Class 10 and 12 students choose the right stream,
            college and career — using AI to personalise every recommendation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/dashboard">
              <button
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.97]"
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                  boxShadow: `0 4px 20px oklch(0.637 0.237 275 / 0.42)`,
                  transition: "filter 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.boxShadow = `0 6px 28px oklch(0.637 0.237 275 / 0.55)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = "none";
                  e.currentTarget.style.boxShadow = `0 4px 20px oklch(0.637 0.237 275 / 0.42)`;
                }}
              >
                Start for Free
                <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/sign-in">
              <button
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-medium active:scale-[0.97]"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "oklch(0.637 0.237 275 / 0.45)";
                  e.currentTarget.style.color = "var(--foreground)";
                  e.currentTarget.style.background = "oklch(0.637 0.237 275 / 0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.muted;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Sign In
              </button>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center justify-center gap-0">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-center">
                {i > 0 && (
                  <div style={{ width: 1, height: 28, background: C.border, margin: "0 20px" }} />
                )}
                <div className="text-center">
                  <div style={{
                    fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.03em",
                    background: `linear-gradient(135deg, oklch(0.92 0.06 275), oklch(0.78 0.20 275))`,
                    WebkitBackgroundClip: "text", backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    {value}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: C.mutedLo, marginTop: 1, letterSpacing: "0.01em" }}>
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 w-full">
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
      </div>

      {/* ══ FEATURES ══ */}
      <section className="py-20 md:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Kicker icon={Sparkles}>Platform Features</Kicker>
            <SectionHeading>
              Everything You Need,{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                In One Place
              </span>
            </SectionHeading>
            <p style={{ fontSize: "0.9rem", color: C.muted, lineHeight: 1.65, maxWidth: "30rem", marginTop: "0.4rem" }}>
              Six tools built specifically for Indian students navigating post-10th and post-12th decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 w-full">
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 md:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Kicker icon={Target}>How It Works</Kicker>
            <SectionHeading>
              From Assessment{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                to Action
              </span>
            </SectionHeading>
            <p style={{ fontSize: "0.9rem", color: C.muted, lineHeight: 1.65, marginTop: "0.4rem" }}>
              Three simple steps — no experience or expertise required.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center gap-3 flex-1 min-w-0">
                <StepCard {...s} />
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex shrink-0">
                    <ChevronRight size={18} color={C.borderHi} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 w-full">
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 md:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Kicker icon={Sparkles}>Student Stories</Kicker>
            <SectionHeading>Trusted by Students Across India</SectionHeading>
            <p style={{ fontSize: "0.9rem", color: C.muted, lineHeight: 1.65, marginTop: "0.4rem" }}>
              Real outcomes from students who made their decisions with ShikshaSetu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="relative flex flex-col gap-5 p-7 rounded-2xl overflow-hidden" style={{
                background: C.card,
                backdropFilter: "blur(20px)",
                border: `1px solid ${C.border}`,
                boxShadow: "0 1px 8px oklch(0 0 0 / 0.28)",
              }}>
                {/* Top accent line */}
                <div style={{
                  position: "absolute", inset: "0 0 auto", height: 1,
                  background: `linear-gradient(90deg, transparent, ${t.accent.replace(")", " / 0.35)")}, transparent)`,
                }} />
                {/* Decorative quote */}
                <div style={{
                  position: "absolute", right: 20, top: 8,
                  fontSize: "6rem", lineHeight: 1,
                  fontFamily: "Georgia, serif",
                  color: "oklch(0.637 0.237 275 / 0.07)",
                  userSelect: "none", pointerEvents: "none",
                }}>"</div>

                {/* Quote text */}
                <p style={{ fontSize: "0.85rem", lineHeight: 1.7, color: "oklch(0.70 0.04 275)", flex: 1, position: "relative" }}>
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div style={{
                    height: 34, width: 34, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 800, color: "white",
                    background: `linear-gradient(135deg, ${t.accent}, ${t.accentMid})`,
                    boxShadow: `0 2px 10px ${t.accent.replace(")", " / 0.32)")}`,
                  }}>
                    {t.i}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontSize: "0.74rem", color: C.mutedLo }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-5 sm:px-6 w-full">
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />
      </div>

      {/* ══ CTA ══ */}
      <section className="py-20 md:py-24 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 md:p-14 rounded-2xl overflow-hidden" style={{
            background: C.card,
            backdropFilter: "blur(24px)",
            border: `1px solid ${C.borderHi}`,
            boxShadow: "0 4px 32px oklch(0 0 0 / 0.35)",
          }}>
            {/* Left accent stripe */}
            <div style={{
              position: "absolute", left: 0, top: "15%", bottom: "15%",
              width: 3, borderRadius: 99,
              background: `linear-gradient(180deg, ${C.primary}, ${C.mid})`,
              boxShadow: `0 0 12px ${C.primary}`,
            }} />
            {/* Shimmer top */}
            <div style={{
              position: "absolute", inset: "0 0 auto", height: 1,
              background: `linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.30), transparent)`,
            }} />
            {/* Subtle inner glow */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              background: "radial-gradient(ellipse 60% 80% at 0% 50%, oklch(0.637 0.237 275 / 0.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />

            {/* Left text */}
            <div className="relative pl-4">
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.primary, marginBottom: 10 }}>
                Get Started Free
              </p>
              <h2 style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                fontWeight: 800, letterSpacing: "-0.03em",
                color: "var(--foreground)", marginBottom: 8,
              }}>
                Start your journey today.
              </h2>
              <p style={{ fontSize: "0.88rem", color: C.muted, lineHeight: 1.65, maxWidth: "28rem" }}>
                No credit card required. Join 10,000+ students who've already found clarity on their academic path.
              </p>
            </div>

            {/* Right buttons */}
            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/sign-up">
                <button
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
                    boxShadow: `0 4px 18px oklch(0.637 0.237 275 / 0.40)`,
                    transition: "filter 0.14s ease, box-shadow 0.14s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = "brightness(1.1)";
                    e.currentTarget.style.boxShadow = `0 6px 26px oklch(0.637 0.237 275 / 0.52)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.boxShadow = `0 4px 18px oklch(0.637 0.237 275 / 0.40)`;
                  }}
                >
                  Create Free Account
                  <ArrowRight size={14} />
                </button>
              </Link>
              <Link href="/sign-in">
                <button
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-medium whitespace-nowrap active:scale-[0.97]"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.muted,
                    transition: "border-color 0.14s ease, color 0.14s ease, background 0.14s ease",
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
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="mt-auto py-8 px-5 sm:px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div style={{
              height: 24, width: 24, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${C.primary}, ${C.mid})`,
            }}>
              <GraduationCap size={13} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.85rem", letterSpacing: "-0.02em", color: "var(--foreground)" }}>
              ShikshaSetu
            </span>
          </div>
          <p style={{ fontSize: "0.78rem", color: C.mutedLo }}>
            © {new Date().getFullYear()} ShikshaSetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}