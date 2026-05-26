"use client"

import { useUser } from '@/components/providers/FirebaseAuthProvider'
import Link from "next/link"
import {
  BookOpen, TrendingUp, Library, DollarSign,
  GraduationCap, ArrowRight, Sparkles,
  Zap, ChevronRight, Clock, Target, Award, Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import FeatureFlag from "@/components/FeatureFlag"

// ─── Data ────────────────────────────────────────────────────────────────────
const quickLinks = [
  {
    href: "/dashboard/subject-advisor",
    icon: BookOpen,
    title: "Subject Advisor",
    description: "AI-powered stream & career path recommendations",
    tag: "AI Powered",
    from: "oklch(0.637 0.237 275)",
    to: "oklch(0.65  0.25  290)",
    tagBg: "oklch(0.637 0.237 275 / 0.12)",
    tagBorder: "oklch(0.637 0.237 275 / 0.30)",
    tagColor: "oklch(0.78  0.18  275)",
  },
  {
    href: "/dashboard/college-explorer",
    icon: GraduationCap,
    title: "College Explorer",
    description: "Browse 1,200+ colleges with admission & placement data",
    tag: "1,200+ Colleges",
    from: "oklch(0.65 0.25 290)",
    to: "oklch(0.70 0.22 300)",
    tagBg: "oklch(0.65 0.25 290 / 0.12)",
    tagBorder: "oklch(0.65 0.25 290 / 0.30)",
    tagColor: "oklch(0.80 0.18 290)",
  },
  {
    href: "/dashboard/career-outcomes",
    icon: TrendingUp,
    title: "Career Outcomes",
    description: "Salary data, growth projections & entry requirements",
    tag: "500+ Paths",
    from: "oklch(0.72 0.18 260)",
    to: "oklch(0.637 0.237 275)",
    tagBg: "oklch(0.72 0.18 260 / 0.12)",
    tagBorder: "oklch(0.72 0.18 260 / 0.30)",
    tagColor: "oklch(0.82 0.14 260)",
  },
  {
    href: "/dashboard/resources",
    icon: Library,
    title: "Resources",
    description: "Study guides, entrance exam prep & curated materials",
    tag: "Free Access",
    from: "oklch(0.637 0.237 275)",
    to: "oklch(0.72 0.18 260)",
    tagBg: "oklch(0.637 0.237 275 / 0.12)",
    tagBorder: "oklch(0.637 0.237 275 / 0.30)",
    tagColor: "oklch(0.78 0.18 275)",
  },
  {
    href: "/dashboard/scholarships",
    icon: DollarSign,
    title: "Scholarships",
    description: "Find scholarships you qualify for with step-by-step guidance",
    tag: "Govt & Private",
    from: "oklch(0.65 0.25 290)",
    to: "oklch(0.637 0.237 275)",
    tagBg: "oklch(0.65 0.25 290 / 0.12)",
    tagBorder: "oklch(0.65 0.25 290 / 0.30)",
    tagColor: "oklch(0.80 0.18 290)",
  },
]

const quickStats = [
  {
    icon: Target,
    label: "Tools Available",
    value: "5+",
    color: "oklch(0.637 0.237 275)",
  },
  {
    icon: GraduationCap,
    label: "Colleges Listed",
    value: "1,200+",
    color: "oklch(0.65 0.25 290)",
  },
  {
    icon: Award,
    label: "Career Paths",
    value: "500+",
    color: "oklch(0.72 0.18 260)",
  },
  {
    icon: Flame,
    label: "AI Assessments",
    value: "Free",
    color: "oklch(0.70 0.22 300)",
  },
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

      {/* ── Ambient background blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(ellipse, oklch(0.637 0.237 275 / 0.10) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "ambientFloat 20s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "30%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse, oklch(0.65 0.25 290 / 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "ambientFloat 25s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute",
          bottom: "0%",
          left: "40%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(ellipse, oklch(0.72 0.18 260 / 0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "ambientFloat 18s ease-in-out infinite 3s",
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 dashboard-stagger-1"
          style={{ animation: "dashboardSlideUp 0.6s ease-out both" }}
        >
          <div>
            <p className="text-sm text-muted-foreground mb-1 tracking-wide flex items-center gap-1.5">
              {greeting}{" "}
              <span className="inline-block" style={{ animation: "wave 2.5s ease-in-out infinite" }}>👋</span>
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{
              background: "linear-gradient(135deg, oklch(0.98 0.005 275) 0%, oklch(0.78 0.18 275) 50%, oklch(0.72 0.22 290) 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "textShimmer 4s ease-in-out infinite",
            }}>
              {firstName}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" style={{ color: "oklch(0.637 0.237 275)" }} />
              Here&apos;s your learning overview
            </p>
          </div>
          <Link href="/dashboard/subject-advisor">
            <Button
              size="lg"
              className="gap-2 group relative overflow-hidden"
              style={{
                boxShadow: "0 4px 24px oklch(0.637 0.237 275 / 0.40), 0 0 0 1px oklch(0.637 0.237 275 / 0.20)",
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: "linear-gradient(135deg, oklch(0.70 0.25 275 / 0.3), transparent, oklch(0.65 0.25 290 / 0.3))",
              }} />
              <Sparkles className="h-4 w-4 relative z-10" style={{ animation: "sparkle 2s ease-in-out infinite" }} />
              <span className="relative z-10">Take AI Assessment</span>
            </Button>
          </Link>
        </div>

        {/* ── Quick Stats Row ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          style={{ animation: "dashboardSlideUp 0.6s ease-out 0.1s both" }}
        >
          {quickStats.map((stat, i) => (
            <div
              key={stat.label}
              className="group relative rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "oklch(0.08 0.015 275 / 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid oklch(0.20 0.030 275 / 0.5)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center, ${stat.color.replace(")", " / 0.08)")} 0%, transparent 70%)`,
                }}
              />
              <div className="relative flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${stat.color.replace(")", " / 0.12)")}`,
                    border: `1px solid ${stat.color.replace(")", " / 0.20)")}`,
                  }}
                >
                  <stat.icon className="h-4.5 w-4.5" style={{ color: stat.color, width: "18px", height: "18px" }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Hero Banner (gated by ENABLE_SUBJECT_ADVISOR flag) ── */}
        <FeatureFlag name="ENABLE_SUBJECT_ADVISOR">
        <div
          className="relative rounded-2xl overflow-hidden group"
          style={{
            animation: "dashboardSlideUp 0.6s ease-out 0.2s both",
          }}
        >
          {/* Animated gradient border */}
          <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{
            background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290), oklch(0.72 0.18 260), oklch(0.637 0.237 275))",
            backgroundSize: "300% 300%",
            animation: "gradientRotate 6s linear infinite",
          }} />

          {/* Inner card */}
          <div className="relative rounded-[15px] m-[1px]" style={{
            background: "linear-gradient(135deg, oklch(0.637 0.237 275) 0%, oklch(0.55 0.22 280) 40%, oklch(0.50 0.20 290) 70%, oklch(0.55 0.25 275) 100%)",
          }}>
            {/* inner radial glow */}
            <div className="absolute inset-0 pointer-events-none rounded-[15px]" style={{
              background: "radial-gradient(ellipse at 20% 20%, oklch(1 0 0 / 0.15) 0%, transparent 60%)",
            }} />
            {/* Floating dot pattern */}
            <div className="absolute inset-0 pointer-events-none rounded-[15px] opacity-[0.06]" style={{
              backgroundImage: "radial-gradient(circle, oklch(1 0 0) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              animation: "patternDrift 30s linear infinite",
            }} />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 pointer-events-none rounded-[15px] opacity-30" style={{
              background: "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }} />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6 p-8 md:p-10">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0" style={{
                background: "oklch(1 0 0 / 0.15)",
                border: "1px solid oklch(1 0 0 / 0.25)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px oklch(0 0 0 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.1)",
              }}>
                <Sparkles className="h-8 w-8 text-white" style={{ animation: "sparkle 3s ease-in-out infinite" }} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-white tracking-tight">
                  Start Your AI-Powered Assessment
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                  Answer 10 personalised questions and let our AI decode your strengths,
                  interests, and ideal academic path — in under 5 minutes.
                </p>
              </div>
              <Link href="/dashboard/subject-advisor" className="shrink-0">
                <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:scale-[1.04] hover:shadow-xl active:scale-[0.98] group/btn" style={{
                  background: "oklch(1 0 0)",
                  color: "oklch(0.35 0.20 275)",
                  boxShadow: "0 4px 20px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(1 0 0 / 0.1)",
                }}>
                  Begin Assessment
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        </FeatureFlag>

        {/* ── Tools grid ── */}
        <div style={{ animation: "dashboardSlideUp 0.6s ease-out 0.3s both" }}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-semibold tracking-[0.12em] uppercase" style={{
              color: "oklch(0.55 0.05 275)",
            }}>
              Explore Tools
            </h2>
            <div className="flex-1 h-px" style={{
              background: "linear-gradient(90deg, oklch(0.25 0.03 275 / 0.6), transparent)",
            }} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((item, i) => (
              <Link key={item.href} href={item.href} className="group block">
                <div
                  className="h-full relative rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl"
                  style={{
                    animation: `dashboardSlideUp 0.5s ease-out ${0.35 + i * 0.07}s both`,
                  }}
                >
                  {/* Gradient border that appears on hover */}
                  <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: `linear-gradient(135deg, ${item.from}, ${item.to}, transparent)`,
                  }} />

                  {/* Card content */}
                  <div
                    className="relative h-full p-6 rounded-[15px] m-0 group-hover:m-[1px] flex flex-col transition-all duration-300"
                    style={{
                      background: "oklch(0.09 0.015 275 / 0.90)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid oklch(0.22 0.030 275)",
                      boxShadow: "0 4px 16px oklch(0 0 0 / 0.30)",
                    }}
                  >
                    {/* Hover glow behind icon */}
                    <div className="absolute top-4 left-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      background: `radial-gradient(circle, ${item.from.replace(")", " / 0.15)")} 0%, transparent 70%)`,
                      filter: "blur(10px)",
                    }} />

                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative" style={{
                      background: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                      boxShadow: `0 4px 16px ${item.from.replace(")", " / 0.35)").replace("oklch(", "oklch(")}`,
                    }}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Tag */}
                    <span className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-3 tracking-wide" style={{
                      background: item.tagBg,
                      border: `1px solid ${item.tagBorder}`,
                      color: item.tagColor,
                    }}>
                      {item.tag}
                    </span>

                    <h3 className="font-semibold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 group-hover:gap-3" style={{ color: item.tagColor }}>
                      Explore
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Pro Tip ── */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            animation: "dashboardSlideUp 0.6s ease-out 0.6s both",
          }}
        >
          {/* Subtle animated border */}
          <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{
            background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.25), oklch(0.65 0.25 290 / 0.15), oklch(0.637 0.237 275 / 0.25))",
            backgroundSize: "200% 200%",
            animation: "gradientRotate 8s linear infinite",
          }} />

          <div className="relative rounded-[15px] m-[1px] p-5 flex items-start gap-4" style={{
            background: "oklch(0.08 0.015 275 / 0.85)",
            backdropFilter: "blur(16px)",
          }}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{
              background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.20), oklch(0.65 0.25 290 / 0.20))",
              border: "1px solid oklch(0.637 0.237 275 / 0.30)",
              boxShadow: "0 0 20px oklch(0.637 0.237 275 / 0.15)",
            }}>
              <Zap className="h-4 w-4 text-primary" style={{ animation: "sparkle 3s ease-in-out infinite 1s" }} />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                <span style={{
                  background: "linear-gradient(135deg, oklch(0.95 0.01 275), oklch(0.78 0.15 275))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  💡 Pro Tip
                </span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start with the{" "}
                <strong className="text-foreground font-semibold">Subject Advisor</strong> to get your
                personalised stream or career recommendation — it takes less than 5 minutes and unlocks a
                complete profile with entrance exam guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />

      </div>
    </div>
  )
}
