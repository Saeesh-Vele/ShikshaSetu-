"use client"

import { useUser } from "@/components/FirebaseAuthProvider"
import Link from "next/link"
import {
  BookOpen, TrendingUp, Library, DollarSign,
  GraduationCap, ArrowRight, Sparkles, Clock,
  Target, Zap, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Data ────────────────────────────────────────────────────────────────────
const quickLinks = [
  {
    href: "/dashboard/subject-advisor",
    icon: BookOpen,
    title: "Subject Advisor",
    description: "AI-powered stream & career path recommendations",
    tag: "AI Powered",
    from: "oklch(0.637 0.237 275)",
    to:   "oklch(0.65  0.25  290)",
    tagBg:     "oklch(0.637 0.237 275 / 0.12)",
    tagBorder: "oklch(0.637 0.237 275 / 0.30)",
    tagColor:  "oklch(0.78  0.18  275)",
  },
  {
    href: "/dashboard/college-explorer",
    icon: GraduationCap,
    title: "College Explorer",
    description: "Browse 1,200+ colleges with admission & placement data",
    tag: "1,200+ Colleges",
    from: "oklch(0.65 0.25 290)",
    to:   "oklch(0.70 0.22 300)",
    tagBg:     "oklch(0.65 0.25 290 / 0.12)",
    tagBorder: "oklch(0.65 0.25 290 / 0.30)",
    tagColor:  "oklch(0.80 0.18 290)",
  },
  {
    href: "/dashboard/career-outcomes",
    icon: TrendingUp,
    title: "Career Outcomes",
    description: "Salary data, growth projections & entry requirements",
    tag: "500+ Paths",
    from: "oklch(0.72 0.18 260)",
    to:   "oklch(0.637 0.237 275)",
    tagBg:     "oklch(0.72 0.18 260 / 0.12)",
    tagBorder: "oklch(0.72 0.18 260 / 0.30)",
    tagColor:  "oklch(0.82 0.14 260)",
  },
  {
    href: "/dashboard/resources",
    icon: Library,
    title: "Resources",
    description: "Study guides, entrance exam prep & curated materials",
    tag: "Free Access",
    from: "oklch(0.637 0.237 275)",
    to:   "oklch(0.72 0.18 260)",
    tagBg:     "oklch(0.637 0.237 275 / 0.12)",
    tagBorder: "oklch(0.637 0.237 275 / 0.30)",
    tagColor:  "oklch(0.78 0.18 275)",
  },
  {
    href: "/dashboard/scholarships",
    icon: DollarSign,
    title: "Scholarships",
    description: "Find scholarships you qualify for with step-by-step guidance",
    tag: "Govt & Private",
    from: "oklch(0.65 0.25 290)",
    to:   "oklch(0.637 0.237 275)",
    tagBg:     "oklch(0.65 0.25 290 / 0.12)",
    tagBorder: "oklch(0.65 0.25 290 / 0.30)",
    tagColor:  "oklch(0.80 0.18 290)",
  },
]

const stats = [
  { icon: Target,    label: "Assessments Done", value: "0",  unit: ""    },
  { icon: Clock,     label: "Study Hours",       value: "0",  unit: "hrs" },
  { icon: Zap,       label: "Resources Viewed",  value: "0",  unit: ""    },
  { icon: Sparkles,  label: "AI Queries",        value: "0",  unit: ""    },
]

// ─── Component ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Student"

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-[calc(100vh-4rem)] relative">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 90% 50% at 50% -5%, oklch(0.637 0.237 275 / 0.11) 0%, transparent 65%)",
      }} />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none" style={{
        background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.07) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div className="relative max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-sm text-muted-foreground mb-0.5 tracking-wide">{greeting} 👋</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{
              background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.80 0.15 275) 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {firstName}
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">Here's your learning overview</p>
          </div>
          <Link href="/dashboard/subject-advisor">
            <Button size="lg" className="gap-2 shadow-[0_4px_20px_oklch(0.637_0.237_275_/_0.35)]">
              <Sparkles className="h-4 w-4" />
              Take AI Assessment
            </Button>
          </Link>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value, unit }) => (
            <div
              key={label}
              className="relative p-5 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: "oklch(0.10 0.015 275 / 0.80)",
                backdropFilter: "blur(20px)",
                border: "1px solid oklch(0.637 0.237 275 / 0.18)",
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.35)",
              }}
            >
              {/* shimmer top line */}
              <div className="absolute inset-x-0 top-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.35), transparent)",
              }} />
              <div className="h-9 w-9 rounded-xl flex items-center justify-center mb-4" style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.22), oklch(0.65 0.25 290 / 0.22))",
                border: "1px solid oklch(0.637 0.237 275 / 0.28)",
              }}>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold" style={{
                background: "linear-gradient(135deg, oklch(0.90 0.08 275), oklch(0.78 0.18 275))",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                {value}
                {unit && <span className="text-base font-medium text-muted-foreground ml-1" style={{ WebkitTextFillColor: "initial" }}>{unit}</span>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* ── CTA Hero Banner ── */}
        <div className="relative rounded-2xl overflow-hidden" style={{
          background: "linear-gradient(135deg, oklch(0.637 0.237 275) 0%, oklch(0.65 0.25 290) 60%, oklch(0.70 0.22 300) 100%)",
          boxShadow: "0 12px 40px oklch(0.637 0.237 275 / 0.40), 0 4px 12px oklch(0 0 0 / 0.3)",
        }}>
          {/* inner radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at top left, oklch(1 0 0 / 0.12) 0%, transparent 60%)",
          }} />
          {/* dot pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
            backgroundImage: "radial-gradient(circle, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{
              background: "oklch(1 0 0 / 0.18)",
              border: "1px solid oklch(1 0 0 / 0.25)",
              backdropFilter: "blur(8px)",
            }}>
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-1.5 text-white">
                Start Your AI-Powered Assessment
              </h2>
              <p className="text-white/75 text-sm leading-relaxed max-w-xl">
                Answer 10 personalised questions and let our Gemini-powered AI decode your strengths,
                interests, and ideal academic path — in under 5 minutes.
              </p>
            </div>
            <Link href="/dashboard/subject-advisor" className="shrink-0">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]" style={{
                background: "oklch(1 0 0)",
                color: "oklch(0.40 0.20 275)",
                boxShadow: "0 4px 16px oklch(0 0 0 / 0.25)",
              }}>
                Begin Assessment
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* ── Tools grid ── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4 tracking-wide uppercase text-xs" style={{
            color: "oklch(0.55 0.05 275)",
            letterSpacing: "0.08em",
          }}>
            Explore Tools
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group block">
                <div
                  className="h-full p-6 rounded-2xl flex flex-col transition-all duration-200 group-hover:-translate-y-1"
                  style={{
                    background: "oklch(0.10 0.015 275 / 0.80)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid oklch(0.22 0.030 275)",
                    boxShadow: "0 4px 16px oklch(0 0 0 / 0.30)",
                  }}
                >
                  {/* Icon */}
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110" style={{
                    background: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                    boxShadow: `0 4px 16px ${item.from.replace(")", " / 0.40)").replace("oklch(", "oklch(")}`,
                  }}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Tag */}
                  <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3" style={{
                    background: item.tagBg,
                    border: `1px solid ${item.tagBorder}`,
                    color: item.tagColor,
                  }}>
                    {item.tag}
                  </span>

                  <h3 className="font-semibold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover:gap-2.5" style={{ color: item.tagColor }}>
                    Explore
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Pro Tip ── */}
        <div className="rounded-2xl p-5 flex items-start gap-4" style={{
          background: "oklch(0.10 0.015 275 / 0.70)",
          backdropFilter: "blur(16px)",
          border: "1px solid oklch(0.637 0.237 275 / 0.18)",
        }}>
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{
            background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.25), oklch(0.65 0.25 290 / 0.25))",
            border: "1px solid oklch(0.637 0.237 275 / 0.35)",
          }}>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-1">💡 Pro Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Start with the{" "}
              <strong className="text-foreground font-semibold">Subject Advisor</strong> to get your
              personalised stream or career recommendation — it takes less than 5 minutes and unlocks a
              complete profile with entrance exam guidance.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
