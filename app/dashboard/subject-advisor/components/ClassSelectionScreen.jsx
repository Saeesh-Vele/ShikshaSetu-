"use client"

import { motion } from "framer-motion"
import { BookOpen, TrendingUp, Sparkles, ArrowRight, Clock, Brain, CheckCircle } from "lucide-react"

// ─── Card data ────────────────────────────────────────────────────────────────
const CLASS_CARDS = [
  {
    id: "10th",
    label: "I'm in Class 10th",
    subtitle: "Choose the right stream for Class 11 & 12",
    description:
      "Science, Commerce, or Arts? Discover which stream aligns best with your personality, interests, and future ambitions.",
    icon: BookOpen,
    gradient:   "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
    glow:       "oklch(0.637 0.237 275 / 0.45)",
    glowLight:  "oklch(0.637 0.237 275 / 0.10)",
    borderHover:"oklch(0.637 0.237 275 / 0.45)",
    tagColor:   "oklch(0.78 0.18 275)",
    tagBg:      "oklch(0.637 0.237 275 / 0.12)",
    tagBorder:  "oklch(0.637 0.237 275 / 0.28)",
    tags: ["Science PCM", "Science PCB", "Commerce", "Arts"],
  },
  {
    id: "12th",
    label: "I'm in Class 12th",
    subtitle: "Find your ideal career path after 12th",
    description:
      "Engineering, Medicine, Business, Law, or Design? Let AI decode your strengths and map your perfect career trajectory.",
    icon: TrendingUp,
    gradient:   "linear-gradient(135deg, oklch(0.65 0.25 290), oklch(0.72 0.18 260))",
    glow:       "oklch(0.65 0.25 290 / 0.45)",
    glowLight:  "oklch(0.65 0.25 290 / 0.10)",
    borderHover:"oklch(0.65 0.25 290 / 0.45)",
    tagColor:   "oklch(0.80 0.18 290)",
    tagBg:      "oklch(0.65 0.25 290 / 0.12)",
    tagBorder:  "oklch(0.65 0.25 290 / 0.28)",
    tags: ["Engineering", "Medicine", "Business", "Design"],
  },
]

const processSteps = [
  { icon: Brain,        label: "10 personalised questions" },
  { icon: Clock,        label: "~5 minutes to complete"    },
  { icon: CheckCircle,  label: "95%+ accuracy"             },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function ClassSelectionScreen({ onSelect }) {
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-4 py-16">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center mb-12 max-w-2xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: "oklch(0.637 0.237 275 / 0.10)",
            border: "1px solid oklch(0.637 0.237 275 / 0.30)",
            boxShadow: "0 0 20px oklch(0.637 0.237 275 / 0.15)",
            color: "oklch(0.78 0.18 275)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI-Powered Academic Advisor</span>
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-none">
          <span style={{
            background: "linear-gradient(135deg, oklch(0.75 0.20 275) 0%, oklch(0.78 0.22 290) 50%, oklch(0.82 0.18 260) 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Find Your
          </span>{" "}
          <span className="text-foreground">Perfect Path</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Answer 10 carefully crafted questions tailored to your grade level. Our AI counselor will
          decode your unique strengths and recommend the best academic stream or career field.
        </p>

        {/* Process steps row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
          {processSteps.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2" style={{ color: "oklch(0.65 0.12 275)" }}>
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{
                background: "oklch(0.637 0.237 275 / 0.12)",
                border: "1px solid oklch(0.637 0.237 275 / 0.25)",
              }}>
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Cards ── */}
      <div className="grid md:grid-cols-2 gap-5 w-full max-w-4xl">
        {CLASS_CARDS.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.12 }}
              whileHover={{ scale: 1.022, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(card.id)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.10 0.018 275 / 0.85)",
                backdropFilter: "blur(24px)",
                border: "1px solid oklch(0.22 0.030 275)",
                boxShadow: "0 4px 24px oklch(0 0 0 / 0.35)",
              }}
            >
              {/* Top shimmer */}
              <div className="absolute inset-x-0 top-0 h-px" style={{
                background: `linear-gradient(90deg, transparent, ${card.glow.replace(" / 0.45", " / 0.55")}, transparent)`,
              }} />

              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 60px ${card.glowLight}`,
                  background: `radial-gradient(ellipse at 50% 0%, ${card.glowLight} 0%, transparent 65%)`,
                }}
              />

              {/* Hover border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `0 0 0 1px ${card.borderHover}, 0 8px 40px ${card.glow}` }}
              />

              <div className="relative p-8 md:p-10 flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [-2, 2, -2, 0], transition: { duration: 0.4 } }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: card.gradient,
                    boxShadow: `0 8px 28px ${card.glow}`,
                  }}
                >
                  <Icon className="h-7 w-7 text-white" />
                </motion.div>

                {/* Text */}
                <h2 className="text-2xl md:text-3xl font-bold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300">
                  {card.label}
                </h2>
                <p className="text-sm font-semibold mb-4" style={{ color: card.tagColor }}>
                  {card.subtitle}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {card.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: card.tagBg,
                        border: `1px solid ${card.tagBorder}`,
                        color: card.tagColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm"
                  style={{
                    background: card.gradient,
                    boxShadow: `0 4px 20px ${card.glow}`,
                  }}
                  whileHover={{ boxShadow: `0 6px 32px ${card.glow}`, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start My Assessment
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Bottom stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-4 gap-4 w-full max-w-xl mt-12"
      >
        {[
          { label: "Questions",  value: "10"      },
          { label: "Duration",   value: "~5 min"  },
          { label: "Powered by", value: "Groq AI" },
          { label: "Accuracy",   value: "95%+"    },
        ].map((s) => (
          <div
            key={s.label}
            className="text-center p-3.5 rounded-xl"
            style={{
              background: "oklch(0.10 0.015 275 / 0.70)",
              border: "1px solid oklch(0.22 0.028 275)",
            }}
          >
            <div className="text-lg font-bold" style={{
              background: "linear-gradient(135deg, oklch(0.80 0.18 275), oklch(0.75 0.20 275))",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
