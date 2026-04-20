"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Loader2, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, RotateCcw } from "lucide-react"

// ─── CATEGORY PILL COLORS ──────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  Interest:    { bg: "oklch(0.637 0.237 275 / 0.12)", color: "oklch(0.78 0.18 275)", border: "oklch(0.637 0.237 275 / 0.30)" },
  Personality: { bg: "oklch(0.65 0.25 290 / 0.12)",  color: "oklch(0.80 0.18 290)", border: "oklch(0.65 0.25 290 / 0.30)"  },
  Aptitude:    { bg: "oklch(0.72 0.18 260 / 0.12)",  color: "oklch(0.82 0.14 260)", border: "oklch(0.72 0.18 260 / 0.30)"  },
  Scenario:    { bg: "oklch(0.70 0.20 320 / 0.12)",  color: "oklch(0.80 0.16 320)", border: "oklch(0.70 0.20 320 / 0.30)"  },
  General:     { bg: "oklch(0.637 0.237 275 / 0.12)", color: "oklch(0.78 0.18 275)", border: "oklch(0.637 0.237 275 / 0.30)" },
}

export default function AITestScreen({ classLevel, questions, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({}) // { [questionId]: selectedOption }
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const total = questions.length
  const currentQ = questions[currentStep]
  const progress = ((currentStep + 1) / total) * 100
  const selectedAnswer = answers[currentQ?.id]
  const isAnswered = !!selectedAnswer

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleNext = () => {
    if (currentStep < total - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formattedAnswers = questions.map((q) => ({
        question: q.question,
        selected: answers[q.id] || "No answer provided",
        category: q.category,
      }))

      const res = await fetch("/api/subject-advisor/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers, classLevel }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Evaluation failed")

      onComplete(data.result)
    } catch (err) {
      console.error("Evaluation error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  // ─── LOADING / ANALYZING STATE ──────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg text-center"
        >
          <div
            className="rounded-3xl border border-primary/20 p-14"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))", boxShadow: "0 8px 24px oklch(0.637 0.237 275 / 0.40)" }}>
                <Brain className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold mb-3" style={{ background: "linear-gradient(135deg, oklch(0.75 0.20 275), oklch(0.78 0.22 290))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI is Analyzing You...
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our AI-powered counselor is evaluating your personality, interests, and aptitude
              patterns to generate personalized recommendations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Processing with AI...</span>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── ERROR STATE ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-12">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-3">Analysis Failed</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── QUIZ SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                background: "linear-gradient(135deg, oklch(0.637 0.237 275 / 0.20), oklch(0.65 0.25 290 / 0.20))",
                border: "1px solid oklch(0.637 0.237 275 / 0.30)",
              }}>
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">
                AI Assessment — Class {classLevel}
              </span>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-card/60 border border-border/50 px-3 py-1.5 rounded-full">
              {currentStep + 1} / {total}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-card/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">{Math.round(progress)}% complete</p>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: "oklch(0.10 0.018 275 / 0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid oklch(0.22 0.030 275)",
                boxShadow: "0 4px 24px oklch(0 0 0 / 0.35)",
              }}
            >
              {/* shimmer top */}
              <div className="absolute inset-x-0 top-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, oklch(0.637 0.237 275 / 0.4), transparent)"
              }} />
              {/* Card Header */}
              <div className="px-8 pt-8 pb-5" style={{ borderBottom: "1px solid oklch(0.22 0.025 275)" }}>
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const style = CATEGORY_STYLES[currentQ?.category] || CATEGORY_STYLES.General
                    return (
                      <span className="text-xs px-2.5 py-1 rounded-full border font-semibold" style={{
                        background: style.bg,
                        color: style.color,
                        borderColor: style.border,
                      }}>
                        {currentQ?.category || "Question"}
                      </span>
                    )
                  })()}
                  <span className="text-xs text-muted-foreground">Select one answer</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground">
                  {currentQ?.question}
                </h2>
              </div>

              {/* Options */}
              <div className="p-6 space-y-3">
                {currentQ?.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelect(currentQ.id, option)}
                      className="w-full text-left p-4 rounded-xl transition-all duration-200 relative group flex items-center gap-4"
                      style={isSelected ? {
                        background: "oklch(0.637 0.237 275 / 0.12)",
                        border: "2px solid oklch(0.637 0.237 275 / 0.65)",
                        boxShadow: "0 0 16px oklch(0.637 0.237 275 / 0.18)",
                      } : {
                        background: "oklch(0.08 0.010 275 / 0.5)",
                        border: "2px solid oklch(0.20 0.025 275)",
                      }}
                    >
                      {/* Radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          isSelected
                            ? "border-primary"
                            : "border-muted-foreground/30 group-hover:border-primary/50"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="w-2.5 h-2.5 rounded-full bg-primary"
                          />
                        )}
                      </div>

                      <span
                        className={`text-sm md:text-base transition-colors duration-200 flex-1 ${
                          isSelected
                            ? "text-foreground font-medium"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {option}
                      </span>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-6 gap-4"
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border/60 text-muted-foreground text-sm font-medium hover:text-foreground hover:border-border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isAnswered
                ? "text-white shadow-lg hover:scale-[1.02] hover:brightness-110"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            style={isAnswered ? {
              background: "linear-gradient(135deg, oklch(0.637 0.237 275), oklch(0.65 0.25 290))",
              boxShadow: "0 4px 16px oklch(0.637 0.237 275 / 0.35)",
            } : {}}
          >
            {currentStep === total - 1 ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI Analysis
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>

        {/* Step Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-5 bg-primary"
                  : i < currentStep
                  ? "w-1.5 bg-primary/50"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
