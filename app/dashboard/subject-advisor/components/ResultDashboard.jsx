"use client"

import { motion } from "framer-motion"
import {
  RotateCcw,
  Target,
  Zap,
  Brain,
  TrendingUp,
  BookOpen,
  Star,
  AlertCircle,
  Award,
  ArrowRight,
  Home,
  Compass,
  Lightbulb,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// ─── CONFIDENCE COLOR ──────────────────────────────────────────────────────────
function getConfidenceColor(score) {
  if (score >= 85) return "text-emerald-400"
  if (score >= 70) return "text-indigo-400"
  return "text-amber-400"
}

function getConfidenceLabel(score, level) {
  if (level) return level
  if (score >= 85) return "High Confidence"
  if (score >= 70) return "Good Match"
  return "Possible Match"
}

// ─── STREAM EMOJI MAP ─────────────────────────────────────────────────────────
const STREAM_EMOJI = {
  "Science PCM": "🔬",
  "Science PCB": "🧬",
  "Science PCMB": "🧪",
  "Commerce": "📊",
  "Arts / Humanities": "🎨",
  "Commerce with Mathematics": "📈",
  "Arts with Psychology / Social Sciences": "🧠",
  "Science with Computer Science": "💻",
  "Diploma / Polytechnic": "🛠️",
  "Skill-based / Vocational": "⚡",
}

function getStreamEmoji(stream) {
  return STREAM_EMOJI[stream] || "📚"
}

// ─── CUSTOM RADAR TOOLTIP ──────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/60 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="font-medium text-foreground">{payload[0].payload.trait}</p>
        <p className="text-primary font-bold">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

// ─── RESULT DASHBOARD ─────────────────────────────────────────────────────────
export default function ResultDashboard({ result, classLevel, onReset }) {
  if (!result) return null

  // Detect Class 10 (stream-based) vs Class 12 (career-based)
  const isClass10 = classLevel === "10th" && result.recommended_streams

  // ── Class 10: Stream-based result ──
  if (isClass10) {
    return <StreamResultView result={result} classLevel={classLevel} onReset={onReset} />
  }

  // ── Class 12: Career-based result (unchanged) ──
  return <CareerResultView result={result} classLevel={classLevel} onReset={onReset} />
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CLASS 10: STREAM-BASED RESULT VIEW ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function StreamResultView({ result, classLevel, onReset }) {
  const {
    recommended_streams = [],
    secondary_options = [],
    dominant_traits = [],
    confidence_score = 72,
    confidence_level,
    strengths = [],
    interest_areas = [],
    weaknesses = [],
    reasoning,
    graph_data = {},
  } = result

  const radarData = Object.entries(graph_data).map(([trait, value]) => ({
    trait,
    value,
    fullMark: 100,
  }))

  const confidenceColor = getConfidenceColor(confidence_score)
  const confidenceLabel = getConfidenceLabel(confidence_score, confidence_level)

  return (
    <div className="min-h-[calc(100vh-72px)] py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ─── HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))", boxShadow: "0 12px 40px oklch(0.637 0.237 275 / 0.45)" }}
          >
            <Compass className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span style={{ background: "linear-gradient(135deg, oklch(0.75 0.20 275), oklch(0.78 0.22 290), oklch(0.80 0.18 260))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Recommended Stream
            </span>
          </h2>
          <p className="text-muted-foreground">
            Your ideal academic path after Class {classLevel}
          </p>
        </motion.div>

        {/* ─── PRIMARY STREAM CARDS ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div
            className="rounded-2xl overflow-hidden p-8 md:p-12 text-center relative"
            style={{
              background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.18) 0%, oklch(0.65 0.25 290 / 0.14) 50%, oklch(0.637 0.237 275 / 0.10) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.637 0.237 275 / 0.25)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.637 0.237 275 / 0.14) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Recommended Stream for Class {classLevel}
                </span>
              </div>

              {/* Primary streams */}
              <div className="space-y-3 mb-6">
                {recommended_streams.map((stream, idx) => (
                  <motion.div
                    key={stream}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.15 }}
                  >
                    <h3
                      className="text-3xl md:text-5xl font-bold leading-tight"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.85 0.15 275), oklch(0.82 0.18 290), oklch(0.88 0.12 260))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {getStreamEmoji(stream)} {stream}
                    </h3>
                    {idx === 0 && recommended_streams.length > 1 && (
                      <div className="text-xs text-muted-foreground mt-2 mb-1">— or —</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Dominant Traits Pills */}
              {dominant_traits.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {dominant_traits.map((trait, i) => (
                    <motion.span
                      key={trait}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{
                        background: "oklch(0.637 0.237 275 / 0.12)",
                        border: "1px solid oklch(0.637 0.237 275 / 0.30)",
                        color: "oklch(0.78 0.18 275)",
                      }}
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Confidence Score */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${confidenceColor}`}>
                    {confidence_score}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{confidenceLabel}</div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "oklch(0.16 0.02 275)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence_score}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── SECONDARY STREAM (Small Card) ─────────────────────────── */}
        {secondary_options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.08) 0%, oklch(0 0 0 / 0.30) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 290)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Also Worth Considering</h4>
                  <p className="text-xs text-muted-foreground">Secondary suggestion based on your profile</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {secondary_options.map((stream, i) => (
                  <motion.div
                    key={stream}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                    style={{
                      background: "oklch(0.65 0.25 290 / 0.10)",
                      border: "1px solid oklch(0.65 0.25 290 / 0.25)",
                    }}
                  >
                    <span className="text-lg">{getStreamEmoji(stream)}</span>
                    <span className="font-medium text-sm" style={{ color: "oklch(0.82 0.16 290)" }}>
                      {stream}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── REASON / AI EXPLANATION ──────────────────────────────────── */}
        {reasoning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-semibold text-lg">Why This Stream Fits You</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                &ldquo;{reasoning}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── RADAR CHART ──────────────────────────────────────────────── */}
        {radarData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                <h4 className="font-semibold text-lg">Your Trait Profile</h4>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(99,102,241,0.2)" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }}
                  />
                  <Radar
                    name="Profile"
                    dataKey="value"
                    stroke="oklch(0.637 0.237 275)"
                    fill="oklch(0.637 0.237 275)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>

              {/* Trait bars */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {radarData.map((d, i) => {
                  const barColors = [
                    "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
                    "linear-gradient(90deg, oklch(0.65 0.25 290), oklch(0.72 0.18 260))",
                    "linear-gradient(90deg, oklch(0.72 0.18 260), oklch(0.637 0.237 275))",
                    "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.72 0.18 260))",
                  ]
                  return (
                    <div key={d.trait}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">{d.trait}</span>
                        <span className="text-xs font-bold text-foreground">{d.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.16 0.02 275)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: barColors[i % barColors.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── INSIGHT CARDS GRID ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-sm">Your Strengths</h4>
              </div>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Interest Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Star className="h-4 w-4 text-indigo-400" />
                </div>
                <h4 className="font-semibold text-sm">Interest Areas</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {interest_areas.map((area, i) => (
                  <motion.span
                    key={area}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Areas to Grow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                </div>
                <h4 className="font-semibold text-sm">Areas to Grow</h4>
              </div>
              <div className="space-y-2">
                {weaknesses.map((w, i) => (
                  <motion.div
                    key={w}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{w}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── CTA BUTTONS ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
        >
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>

          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 w-full">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CLASS 12: CAREER-BASED RESULT VIEW (Original — Unchanged) ────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function CareerResultView({ result, classLevel, onReset }) {
  const {
    recommended_path,
    confidence_score,
    strengths = [],
    interest_areas = [],
    weaknesses = [],
    reason,
    graph_data = {},
    entrance_exams = [],
  } = result

  const radarData = Object.entries(graph_data).map(([trait, value]) => ({
    trait,
    value,
    fullMark: 100,
  }))

  const confidenceColor = getConfidenceColor(confidence_score)
  const confidenceLabel = getConfidenceLabel(confidence_score)

  return (
    <div className="min-h-[calc(100vh-72px)] py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ─── HEADER ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))", boxShadow: "0 12px 40px oklch(0.637 0.237 275 / 0.45)" }}
          >
            <Award className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span style={{ background: "linear-gradient(135deg, oklch(0.75 0.20 275), oklch(0.78 0.22 290), oklch(0.80 0.18 260))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Your AI Analysis
            </span>
          </h2>
          <p className="text-muted-foreground">
            Personalized insights crafted specifically for Class {classLevel} students
          </p>
        </motion.div>

        {/* ─── HERO CARD: Recommended Path + Confidence ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div
            className="rounded-2xl overflow-hidden p-8 md:p-12 text-center relative"
            style={{
              background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.18) 0%, oklch(0.65 0.25 290 / 0.14) 50%, oklch(0.637 0.237 275 / 0.10) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.637 0.237 275 / 0.25)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.637 0.237 275 / 0.14) 0%, transparent 70%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Recommended for Class {classLevel}
                </span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold mb-5 leading-tight" style={{ background: "linear-gradient(135deg, oklch(0.85 0.15 275), oklch(0.82 0.18 290), oklch(0.88 0.12 260))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {recommended_path}
              </h3>

              {/* Confidence Score */}
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${confidenceColor}`}>
                    {confidence_score}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{confidenceLabel}</div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "oklch(0.16 0.02 275)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence_score}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── REASON / AI EXPLANATION ──────────────────────────────────── */}
        {reason && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-semibold text-lg">Why This Path Is Perfect for You</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                &ldquo;{reason}&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── RADAR CHART ──────────────────────────────────────────────── */}
        {radarData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                <h4 className="font-semibold text-lg">Your Trait Profile</h4>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(99,102,241,0.2)" />
                  <PolarAngleAxis
                    dataKey="trait"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 500 }}
                  />
                  <Radar
                    name="Profile"
                    dataKey="value"
                    stroke="oklch(0.637 0.237 275)"
                    fill="oklch(0.637 0.237 275)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>

              {/* Trait bars */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {radarData.map((d, i) => {
                  const barColors = [
                    "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
                    "linear-gradient(90deg, oklch(0.65 0.25 290), oklch(0.72 0.18 260))",
                    "linear-gradient(90deg, oklch(0.72 0.18 260), oklch(0.637 0.237 275))",
                    "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.72 0.18 260))",
                  ]
                  return (
                    <div key={d.trait}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">{d.trait}</span>
                        <span className="text-xs font-bold text-foreground">{d.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.16 0.02 275)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: barColors[i % barColors.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${d.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── INSIGHT CARDS GRID ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-sm">Your Strengths</h4>
              </div>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Interest Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Star className="h-4 w-4 text-indigo-400" />
                </div>
                <h4 className="font-semibold text-sm">Interest Areas</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {interest_areas.map((area, i) => (
                  <motion.span
                    key={area}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Areas to Grow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="h-full rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                </div>
                <h4 className="font-semibold text-sm">Areas to Grow</h4>
              </div>
              <div className="space-y-2">
                {weaknesses.map((w, i) => (
                  <motion.div
                    key={w}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{w}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── ENTRANCE EXAMS ───────────────────────────────────────────── */}
        {entrance_exams && entrance_exams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-6"
          >
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.06) 0%, oklch(0 0 0 / 0.35) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.25 0.035 275)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-violet-400" />
                </div>
                <h4 className="font-semibold text-lg">Relevant Entrance Exams</h4>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {entrance_exams.map((exam, i) => (
                  <motion.div
                    key={exam}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-3 text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">#{i + 1}</div>
                    <div className="font-semibold text-sm text-violet-200">{exam}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CTA BUTTONS ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
        >
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>

          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 w-full">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Link href="/dashboard/college-explorer">
            <Button className="gap-2 w-full sm:w-auto">
              Explore Colleges
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
