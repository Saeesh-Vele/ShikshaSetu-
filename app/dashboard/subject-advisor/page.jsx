"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

import ClassSelectionScreen from "./components/ClassSelectionScreen"
import AITestScreen from "./components/AITestScreen"
import ResultDashboard from "./components/ResultDashboard"

// ─── STAGE ENUM ────────────────────────────────────────────────────────────────
const STAGES = {
  CLASS_SELECTION: "class_selection",
  LOADING_QUESTIONS: "loading_questions",
  AI_TEST: "ai_test",
  RESULTS: "results",
}

export default function SubjectAdvisorPage() {
  const [stage, setStage] = useState(STAGES.CLASS_SELECTION)
  const [classLevel, setClassLevel] = useState(null) // "10th" | "12th"
  const [questions, setQuestions] = useState([])
  const [result, setResult] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // ─── On class selected → fetch fixed questions (instant) ─────────────────────
  const handleClassSelect = useCallback(async (selectedClass) => {
    setClassLevel(selectedClass)
    setStage(STAGES.LOADING_QUESTIONS)
    setLoadError(null)

    try {
      const res = await fetch("/api/subject-advisor/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classLevel: selectedClass }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to load questions")
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions returned. Please try again.")
      }

      setQuestions(data.questions)
      setStage(STAGES.AI_TEST)
    } catch (err) {
      console.error("Question fetch error:", err)
      setLoadError(err.message || "Failed to load questions")
      setStage(STAGES.CLASS_SELECTION)
    }
  }, [])

  // ─── On quiz complete → show results ────────────────────────────────────────
  const handleTestComplete = useCallback((aiResult) => {
    setResult(aiResult)
    setStage(STAGES.RESULTS)
  }, [])

  // ─── Reset entire flow ───────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setStage(STAGES.CLASS_SELECTION)
    setClassLevel(null)
    setQuestions([])
    setResult(null)
    setLoadError(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* ── TOP ACTION BAR ────────────────────────────────────────────── */}
      <div className="flex justify-end p-2 sticky top-0 z-50 min-h-[56px] items-center">
        {stage !== STAGES.CLASS_SELECTION && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border/60 px-3 py-1.5 rounded-lg hover:border-border bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Start Over
          </motion.button>
        )}
      </div>

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Ambient background glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)",
          }}
        />

        <AnimatePresence mode="wait">
          {/* ── CLASS SELECTION ─────────────────────────────────────────── */}
          {stage === STAGES.CLASS_SELECTION && (
            <motion.div
              key="class-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {loadError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl mx-auto px-4 pt-4"
                >
                  <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
                    <span>⚠️</span>
                    <span>{loadError}. Please select your class again.</span>
                  </div>
                </motion.div>
              )}
              <ClassSelectionScreen onSelect={handleClassSelect} />
            </motion.div>
          )}

          {/* ── LOADING QUESTIONS ────────────────────────────────────────── */}
          {stage === STAGES.LOADING_QUESTIONS && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                    <Loader2 className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Loading Your Questions...
                </h3>
                <p className="text-muted-foreground text-sm">
                  Preparing 10 career assessment questions for Class {classLevel} students
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── AI TEST ──────────────────────────────────────────────────── */}
          {stage === STAGES.AI_TEST && questions.length > 0 && (
            <motion.div
              key="ai-test"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <AITestScreen
                classLevel={classLevel}
                questions={questions}
                onComplete={handleTestComplete}
              />
            </motion.div>
          )}

          {/* ── RESULTS ──────────────────────────────────────────────────── */}
          {stage === STAGES.RESULTS && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <ResultDashboard
                result={result}
                classLevel={classLevel}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
