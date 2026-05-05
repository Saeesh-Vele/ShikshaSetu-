"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useSubjectAdvisor } from "@/features/subject-advisor/hooks/useSubjectAdvisor"
import ClassSelectionScreen from "@/features/subject-advisor/components/ClassSelectionScreen"
import AITestScreen from "@/features/subject-advisor/components/AITestScreen"
import ResultDashboard from "@/features/subject-advisor/components/ResultDashboard"

export default function SubjectAdvisorPage() {
  const {
    stage,
    classLevel,
    questions,
    result,
    loadError,
    handleClassSelect,
    handleTestComplete,
    handleReset,
    STAGES,
  } = useSubjectAdvisor()

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
