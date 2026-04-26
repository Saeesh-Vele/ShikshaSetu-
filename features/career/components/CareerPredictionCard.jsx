"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  RotateCcw,
  Briefcase,
  BookOpen,
  TrendingUp,
  Zap,
  MessageSquareQuote,
  Target,
  ArrowRight,
  Sparkles,
  Rocket,
  Brain,
} from "lucide-react"

// ─────────────────────────────────────────────────
// Career Prediction Result Card (ENHANCED)
// ─────────────────────────────────────────────────
export default function CareerPredictionCard({ result, onReset }) {
  if (!result) return null

  const {
    careerField,
    topCareers,
    subjects,
    strengths,
    insights,
  } = result

  return (
    <div className="mt-16" id="career-results">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30"
          >
            <Target className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Career Analysis
            </span>
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights tailored just for you
          </p>
        </div>

        {/* 🎯 Main Career Field Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className="border-0 overflow-hidden mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(79,70,229,0.1) 100%)",
            }}
          >
            <CardContent className="py-10 px-8 text-center">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-0 mb-4 text-xs">
                <Target className="h-3 w-3 mr-1" />
                🎯 Recommended Career Field
              </Badge>
              <h3 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                {careerField}
              </h3>
            </CardContent>
          </Card>
        </motion.div>

        {/* 🚀 Top Career Options (NEW SECTION) */}
        {topCareers && topCareers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <Card className="border-0 bg-card/50 overflow-hidden">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-lg">
                    🚀 Top Career Options
                  </h4>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {topCareers.map((career, i) => (
                    <motion.div
                      key={career}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <div
                        className="relative rounded-xl p-4 text-center border border-indigo-500/20 overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)",
                        }}
                      >
                        <div className="text-xs text-muted-foreground mb-1.5">
                          #{i + 1}
                        </div>
                        <div className="font-semibold text-sm text-indigo-200">
                          {career}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Detail Cards Grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {/* 📚 Recommended Subjects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 bg-card/50 h-full">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-lg">
                    📚 Suggested Subjects
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(subjects || []).map((subject, i) => (
                    <motion.div
                      key={subject}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                    >
                      <Badge
                        variant="outline"
                        className="py-1.5 px-3 border-blue-500/30 text-blue-300 bg-blue-500/5"
                      >
                        {subject}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>



          {/* 💪 Your Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 bg-card/50 h-full">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-lg">💪 Your Strengths</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(strengths || []).map((strength, i) => (
                    <motion.div
                      key={strength}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                    >
                      <Badge
                        variant="outline"
                        className="py-1.5 px-3 border-amber-500/30 text-amber-300 bg-amber-500/5"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {strength}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 🧠 Expert Insight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="md:col-span-2"
          >
            <Card className="border-0 bg-card/50 h-full">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-lg">🧠 Expert Insight</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{insights}&rdquo;
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
        >
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            Explore Subject Advisor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
