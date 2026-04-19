"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"
import CareerPredictionCard from "./CareerPredictionCard"
import { predefinedQuestions } from "@/data/careerQuestions"

// ─────────────────────────────────────────────────
// Format questions for UI compatibility
// ─────────────────────────────────────────────────
const activeQuestions = predefinedQuestions.map((q) => ({
  id: `q_${q.id}`,
  question: q.question,
  trait: "general", // Added to ensure Badge renders nicely
  type: q.type,
  options: q.options.map((opt, idx) => ({
    value: `opt_${q.id}_${idx}`,
    label: opt,
  })),
}))

// ─────────────────────────────────────────────────
// Main Quiz Component
// ─────────────────────────────────────────────────
export default function CareerAssessmentQuiz() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const progress = ((currentStep + 1) / activeQuestions.length) * 100
  const currentQuestion = activeQuestions[currentStep]
  const isMultiSelect = currentQuestion?.type === "multi"

  // Check if current question is answered
  const currentAnswer = answers[currentQuestion?.id]
  const isAnswered = isMultiSelect
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer

  const handleOptionSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  // Handler for multi-select toggle
  const handleMultiToggle = (questionId, optionValue) => {
    setAnswers((prev) => {
      const current = prev[questionId] || []
      if (current.includes(optionValue)) {
        return { ...prev, [questionId]: current.filter((v) => v !== optionValue) }
      } else {
        return { ...prev, [questionId]: [...current, optionValue] }
      }
    })
  }

  const nextStep = () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      submitToAI()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const submitToAI = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const endpoint = "/api/career-prediction"

      // Include user answers with readable options rather than raw cryptic value mappings
      const formattedAnswers = activeQuestions.map((q) => {
        const selectedValues = answers[q.id]
        let selectedTexts = []
        
        if (Array.isArray(selectedValues)) {
            selectedTexts = selectedValues.map((val) => q.options.find((opt) => opt.value === val)?.label || val)
        } else if (selectedValues) {
            const label = q.options.find((opt) => opt.value === selectedValues)?.label
            selectedTexts = label ? [label] : [selectedValues]
        }
        
        return {
          question: q.question,
          selected: selectedTexts,
        }
      })

      const payload = {
        answers: formattedAnswers
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setResult(data.result)
    } catch (err) {
      console.error("Career analysis error:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentStep(0)
    setAnswers({})
    setResult(null)
    setError(null)
    setIsAnalyzing(false)
  }

  // ─── RESULT SCREEN (PRESERVED) ────────────────
  if (result) {
    return <CareerPredictionCard result={result} onReset={resetQuiz} />
  }

  // ─── LOADING / ANALYZING SCREEN (PRESERVED) ───
  if (isAnalyzing) {
    return (
      <div className="mt-16">
        <Card
          className="max-w-2xl mx-auto border-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(79,70,229,0.08) 100%)",
          }}
        >
          <CardContent className="py-20 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Brain className="h-16 w-16 text-primary" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Counselor is Analyzing...
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Our AI career counselor is evaluating your responses, detecting
              your personality traits, and predicting the best career path for
              you.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Processing with Gemini AI...
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── ERROR SCREEN (PRESERVED) ─────────────────
  if (error) {
    return (
      <div className="mt-16">
        <Card className="max-w-2xl mx-auto border-0 border-destructive/20 bg-destructive/5">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={submitToAI} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry Analysis
              </Button>
              <Button variant="outline" onClick={resetQuiz}>
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }



  // ─── START SCREEN (ENHANCED WITH AI BADGE) ────
  if (!quizStarted) {
    return (
      <div className="mt-16" id="career-assessment">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card
            className="max-w-3xl mx-auto border-0 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 50%, rgba(79,70,229,0.05) 100%)",
            }}
          >
            <CardContent className="py-16 px-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20"
              >
                <Brain className="h-10 w-10 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Career Guidance
                </span>{" "}
                Assessment
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-3">
                Discover your ideal career path with our AI-powered assessment.
                Answer 10 thoughtfully crafted questions and receive
                personalized career guidance from our intelligent counselor.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {[
                  "Interest Detection",
                  "Personality Analysis",
                  "Career Prediction",
                  "Subject Recommendation",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="rounded-xl bg-card/50 p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary">10</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div className="rounded-xl bg-card/50 p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary">AI</div>
                  <div className="text-xs text-muted-foreground">Powered</div>
                </div>
                <div className="rounded-xl bg-card/50 p-4 border border-border/50">
                  <div className="text-2xl font-bold text-primary">5 min</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setQuizStarted(true)
                }}
                className="gap-2 px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-[1.02]"
              >
                <Brain className="h-5 w-5" />
                Start AI Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ─── QUIZ SCREEN (ENHANCED: supports multi-select + single-select) ────
  return (
    <div className="mt-16" id="career-assessment">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">
                AI Career Assessment
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-indigo-500/30 text-indigo-300"
            >
              {currentStep + 1} / {activeQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="border-0 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 100%)",
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-0 text-xs">
                    {currentQuestion.trait.charAt(0).toUpperCase() +
                      currentQuestion.trait.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0.5 ${
                      isMultiSelect
                        ? "border-purple-500/30 text-purple-300"
                        : "border-emerald-500/30 text-emerald-300"
                    }`}
                  >
                    {isMultiSelect ? "Select multiple" : "Select one"}
                  </Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                {isMultiSelect && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose all that apply
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = isMultiSelect
                      ? (answers[currentQuestion.id] || []).includes(option.value)
                      : answers[currentQuestion.id] === option.value

                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          if (isMultiSelect) {
                            handleMultiToggle(currentQuestion.id, option.value)
                          } else {
                            handleOptionSelect(currentQuestion.id, option.value)
                          }
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative group ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                            : "border-border/50 bg-card/30 hover:border-primary/40 hover:bg-card/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Multi-select checkbox indicator */}
                            {isMultiSelect && (
                              <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                  </motion.div>
                                )}
                              </div>
                            )}
                            {/* Single-select radio indicator */}
                            {!isMultiSelect && (
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                  isSelected
                                    ? "border-primary"
                                    : "border-muted-foreground/30"
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
                            )}
                            <span
                              className={`text-sm md:text-base ${
                                isSelected
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {option.label}
                            </span>
                          </div>
                          {isSelected && !isMultiSelect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={!isAnswered}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {currentStep === activeQuestions.length - 1 ? (
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
          </Button>
        </div>
      </div>
    </div>
  )
}
