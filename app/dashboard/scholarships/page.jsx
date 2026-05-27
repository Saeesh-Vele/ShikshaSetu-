"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  DollarSign,
  Calendar,
  Users,
  Award,
  ArrowLeft,
  GraduationCap,
  Filter,
  Clock,
  MapPin,
  BookOpen,
  Star,
  ExternalLink,
  Heart,
  Bell,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Trophy,
  Bookmark
} from "lucide-react"
import Link from "next/link"
import { SectionWrapper, PageHeader } from "@/components/ui/section-wrapper"

// Use plain JS objects, not TypeScript interfaces
const scholarships = [
  {
    id: "1",
    name: "National Merit Scholarship",
    provider: "Government of India",
    description:
      "Merit-based scholarship for students who have excelled in their academic performance and are pursuing higher education.",
    amount: 50000,
    type: "Merit-based",
    category: "Academic Excellence",
    eligibility: ["Indian citizen", "Minimum 85% in Class 12", "Family income below ₹8 lakhs"],
    requirements: ["Academic transcripts", "Income certificate", "Caste certificate (if applicable)"],
    deadline: "2024-06-30",
    applicationProcess: ["Online application", "Document verification", "Merit list publication"],
    renewability: true,
    numberOfAwards: 1000,
    location: "All India",
    educationLevel: ["Undergraduate", "Postgraduate"],
    fieldOfStudy: ["All fields"],
    gpaRequirement: 8.5,
    incomeRequirement: 800000,
    isActive: true,
    difficulty: "Medium",
    successRate: 15,
    website: "https://scholarships.gov.in",
  },
  {
    id: "2",
    name: "Inspire Scholarship for Higher Education",
    provider: "Department of Science & Technology",
    description:
      "Scholarship to attract talented students to pursue careers in science and research by providing financial support.",
    amount: 80000,
    type: "Merit-based",
    category: "Science & Technology",
    eligibility: ["Top 1% in Class 12 Science", "Pursuing BSc/BTech/Integrated MSc"],
    requirements: ["Class 12 marksheet", "Admission proof", "Bank details"],
    deadline: "2024-07-15",
    applicationProcess: ["Online registration", "Document upload", "Institute verification"],
    renewability: true,
    numberOfAwards: 10000,
    location: "All India",
    educationLevel: ["Undergraduate"],
    fieldOfStudy: ["Science", "Technology", "Mathematics"],
    gpaRequirement: 9.0,
    isActive: true,
    difficulty: "Hard",
    successRate: 8,
    website: "https://online-inspire.gov.in",
  },
  {
    id: "3",
    name: "Post Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice",
    description: "Financial assistance to Scheduled Caste students for pursuing post-matriculation studies.",
    amount: 35000,
    type: "Minority",
    category: "Social Welfare",
    eligibility: ["Scheduled Caste certificate", "Family income below ₹2.5 lakhs", "Passed Class 10"],
    requirements: ["Caste certificate", "Income certificate", "Academic documents"],
    deadline: "2024-08-31",
    applicationProcess: ["State portal application", "Document verification", "Approval process"],
    renewability: true,
    numberOfAwards: 50000,
    location: "All India",
    educationLevel: ["Undergraduate", "Postgraduate", "Diploma"],
    fieldOfStudy: ["All fields"],
    incomeRequirement: 250000,
    isActive: true,
    difficulty: "Easy",
    successRate: 65,
    website: "https://scholarships.gov.in",
  },
  {
    id: "4",
    name: "Kishore Vaigyanik Protsahan Yojana",
    provider: "Indian Institute of Science",
    description: "Fellowship program to encourage students to pursue research careers in basic sciences.",
    amount: 120000,
    type: "Research",
    category: "Research & Innovation",
    eligibility: ["Studying in Class 11/12 or 1st year of BSc", "Interest in research"],
    requirements: ["Academic records", "Research proposal", "Recommendation letters"],
    deadline: "2024-09-30",
    applicationProcess: ["Online application", "Aptitude test", "Interview"],
    renewability: true,
    numberOfAwards: 1000,
    location: "All India",
    educationLevel: ["Undergraduate", "Postgraduate"],
    fieldOfStudy: ["Physics", "Chemistry", "Biology", "Mathematics"],
    gpaRequirement: 8.0,
    isActive: true,
    difficulty: "Hard",
    successRate: 12,
    website: "https://kvpy.iisc.ernet.in",
  },
  {
    id: "5",
    name: "Pragati Scholarship for Girls",
    provider: "AICTE",
    description:
      "Scholarship to encourage girls to pursue technical education and reduce gender disparity in engineering.",
    amount: 30000,
    type: "Merit-based",
    category: "Women Empowerment",
    eligibility: ["Female students", "Pursuing Diploma/Degree in Engineering", "Family income below ₹8 lakhs"],
    requirements: ["Income certificate", "Academic transcripts", "Admission proof"],
    deadline: "2024-10-15",
    applicationProcess: ["AICTE portal registration", "Document submission", "Merit-based selection"],
    renewability: true,
    numberOfAwards: 2000,
    location: "All India",
    educationLevel: ["Diploma", "Undergraduate"],
    fieldOfStudy: ["Engineering", "Technology"],
    incomeRequirement: 800000,
    isActive: true,
    difficulty: "Medium",
    successRate: 25,
    website: "https://www.aicte-india.org",
  },
  {
    id: "6",
    name: "Sports Scholarship Scheme",
    provider: "Ministry of Youth Affairs",
    description:
      "Financial support for talented sports persons to pursue higher education while continuing their sports career.",
    amount: 75000,
    type: "Sports",
    category: "Sports Excellence",
    eligibility: ["State/National level sports achievement", "Pursuing higher education"],
    requirements: ["Sports certificates", "Academic records", "Medical fitness certificate"],
    deadline: "2024-05-31",
    applicationProcess: ["Sports authority verification", "Document submission", "Selection committee review"],
    renewability: true,
    numberOfAwards: 500,
    location: "All India",
    educationLevel: ["Undergraduate", "Postgraduate"],
    fieldOfStudy: ["All fields"],
    isActive: true,
    difficulty: "Medium",
    successRate: 30,
    website: "https://yas.nic.in",
  },
]

const types = ["All Types", "Merit-based", "Need-based", "Minority", "Sports", "Arts", "Research", "Government"]
const categories = [
  "All Categories",
  "Academic Excellence",
  "Science & Technology",
  "Social Welfare",
  "Research & Innovation",
  "Women Empowerment",
  "Sports Excellence",
]
const educationLevels = ["All Levels", "Undergraduate", "Postgraduate", "Diploma", "PhD"]
const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"]

// Premium color schemes for scholarship types
const typeStyles = {
  "Merit-based": {
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.3)",
    text: "#818cf8",
    glow: "rgba(99, 102, 241, 0.2)",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    icon: "🏆",
  },
  "Need-based": {
    bg: "rgba(168, 85, 247, 0.12)",
    border: "rgba(168, 85, 247, 0.3)",
    text: "#c084fc",
    glow: "rgba(168, 85, 247, 0.2)",
    gradient: "linear-gradient(135deg, #a855f7, #d946ef)",
    icon: "💜",
  },
  Minority: {
    bg: "rgba(251, 146, 60, 0.12)",
    border: "rgba(251, 146, 60, 0.3)",
    text: "#fb923c",
    glow: "rgba(251, 146, 60, 0.2)",
    gradient: "linear-gradient(135deg, #f97316, #fb923c)",
    icon: "🌟",
  },
  Sports: {
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.3)",
    text: "#4ade80",
    glow: "rgba(34, 197, 94, 0.2)",
    gradient: "linear-gradient(135deg, #22c55e, #10b981)",
    icon: "⚡",
  },
  Research: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    text: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.2)",
    gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    icon: "🔬",
  },
  default: {
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.3)",
    text: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.2)",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
    icon: "📋",
  },
}

const difficultyStyles = {
  Easy: {
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.35)",
    text: "#4ade80",
    label: "Easy",
  },
  Medium: {
    bg: "rgba(250, 204, 21, 0.12)",
    border: "rgba(250, 204, 21, 0.35)",
    text: "#facc15",
    label: "Medium",
  },
  Hard: {
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.35)",
    text: "#f87171",
    label: "Hard",
  },
}

export default function ScholarshipPortalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Difficulties")
  const [maxAmount, setMaxAmount] = useState(200000)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [applied, setApplied] = useState([])
  const [selectedScholarship, setSelectedScholarship] = useState(null)

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "All Types" || scholarship.type === selectedType
    const matchesCategory = selectedCategory === "All Categories" || scholarship.category === selectedCategory
    const matchesLevel = selectedLevel === "All Levels" || scholarship.educationLevel.includes(selectedLevel)
    const matchesDifficulty = selectedDifficulty === "All Difficulties" || scholarship.difficulty === selectedDifficulty
    const matchesAmount = scholarship.amount <= maxAmount

    return matchesSearch && matchesType && matchesCategory && matchesLevel && matchesDifficulty && matchesAmount
  })

  const toggleFavorite = (scholarshipId) => {
    setFavorites((prev) =>
      prev.includes(scholarshipId) ? prev.filter((id) => id !== scholarshipId) : [...prev, scholarshipId],
    )
  }

  const toggleApplied = (scholarshipId) => {
    setApplied((prev) =>
      prev.includes(scholarshipId) ? prev.filter((id) => id !== scholarshipId) : [...prev, scholarshipId],
    )
  }

  const formatAmount = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
    return `₹${amount.toLocaleString()}`
  }

  const getTypeStyle = (type) => typeStyles[type] || typeStyles.default
  const getDifficultyStyle = (difficulty) => difficultyStyles[difficulty] || difficultyStyles.Medium

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const getDaysLeft = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  // ─── Detail View ────────────────────────────
  if (selectedScholarship) {
    const typeStyle = getTypeStyle(selectedScholarship.type)
    const diffStyle = getDifficultyStyle(selectedScholarship.difficulty)

    return (
      <SectionWrapper>
        {/* Navigation */}
        <div className="flex px-4 py-4 max-w-7xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => setSelectedScholarship(null)}
            className="flex items-center space-x-2 hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Scholarships</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
          {/* Scholarship Header */}
          <div className="mb-8 scholarship-detail-header" style={{
            animation: "scholarshipSlideUp 0.5s var(--ease-out) both"
          }}>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="scholarship-type-badge" style={{
                background: typeStyle.bg,
                border: `1px solid ${typeStyle.border}`,
                color: typeStyle.text,
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: `0 0 12px ${typeStyle.glow}`,
              }}>
                <span>{typeStyle.icon}</span>
                {selectedScholarship.type}
              </span>
              <span style={{
                background: diffStyle.bg,
                border: `1px solid ${diffStyle.border}`,
                color: diffStyle.text,
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}>
                {selectedScholarship.difficulty}
              </span>
              {isDeadlineNear(selectedScholarship.deadline) && (
                <span style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  color: "#f87171",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  animation: "scholarshipPulse 2s ease-in-out infinite",
                }}>
                  <Clock className="h-3 w-3" />
                  Deadline Soon
                </span>
              )}
            </div>
            <h1 className="font-bold text-3xl md:text-4xl mb-3" style={{
              background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.78 0.18 275) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}>{selectedScholarship.name}</h1>
            <p className="text-lg text-muted-foreground mb-4" style={{ opacity: 0.8 }}>By {selectedScholarship.provider}</p>
            <p className="text-muted-foreground max-w-3xl" style={{ lineHeight: 1.7 }}>{selectedScholarship.description}</p>
          </div>

          {/* Key Information - Premium Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8" style={{
            animation: "scholarshipSlideUp 0.6s var(--ease-out) 0.1s both"
          }}>
            {[
              {
                label: "Scholarship Amount",
                value: formatAmount(selectedScholarship.amount),
                sub: selectedScholarship.renewability ? "Renewable annually" : "One-time award",
                icon: <DollarSign className="h-5 w-5" />,
                color: "#818cf8",
              },
              {
                label: "Application Deadline",
                value: new Date(selectedScholarship.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                sub: `${getDaysLeft(selectedScholarship.deadline)} days remaining`,
                icon: <Calendar className="h-5 w-5" />,
                color: "#f87171",
              },
              {
                label: "Success Rate",
                value: `${selectedScholarship.successRate}%`,
                sub: "Average acceptance",
                icon: <TrendingUp className="h-5 w-5" />,
                color: "#facc15",
                showProgress: true,
              },
              {
                label: "Awards Available",
                value: selectedScholarship.numberOfAwards.toLocaleString(),
                sub: "Total positions",
                icon: <Users className="h-5 w-5" />,
                color: "#4ade80",
              },
            ].map((stat, i) => (
              <div key={i} className="scholarship-stat-card" style={{
                background: "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                border: `1px solid ${stat.color}15`,
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-5)",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "80px",
                  height: "80px",
                  background: `radial-gradient(circle, ${stat.color}10, transparent 70%)`,
                  borderRadius: "0 var(--radius-xl) 0 0",
                }} />
                <div style={{ color: stat.color, marginBottom: "var(--space-3)" }}>
                  {stat.icon}
                </div>
                <p className="text-xs text-muted-foreground mb-1" style={{ letterSpacing: "0.03em" }}>{stat.label}</p>
                <p className="text-xl font-bold mb-1">{stat.value}</p>
                {stat.showProgress && (
                  <div style={{
                    width: "100%",
                    height: "4px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "var(--radius-full)",
                    marginBottom: "var(--space-2)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${selectedScholarship.successRate}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${stat.color}, ${stat.color}99)`,
                      borderRadius: "var(--radius-full)",
                      transition: "width 1s ease",
                    }} />
                  </div>
                )}
                <p className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Detailed Information */}
          <div style={{ animation: "scholarshipSlideUp 0.6s var(--ease-out) 0.2s both" }}>
            <Tabs defaultValue="eligibility" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="process">Application</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="eligibility" className="mt-6">
                <Card className="glass-card border-transparent">
                  <CardHeader>
                    <CardTitle>Eligibility Criteria</CardTitle>
                    <CardDescription>Check if you meet all the requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedScholarship.eligibility.map((criteria, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{
                          background: "rgba(34, 197, 94, 0.05)",
                          border: "1px solid rgba(34, 197, 94, 0.1)",
                        }}>
                          <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "#4ade80" }} />
                          <span className="text-sm">{criteria}</span>
                        </div>
                      ))}
                    </div>
                    {selectedScholarship.gpaRequirement && (
                      <div className="mt-4 p-4 rounded-xl" style={{
                        background: "rgba(99, 102, 241, 0.08)",
                        border: "1px solid rgba(99, 102, 241, 0.15)",
                      }}>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4" style={{ color: "#818cf8" }} />
                          <span className="text-sm font-medium">
                            Minimum GPA: {selectedScholarship.gpaRequirement}/10
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedScholarship.incomeRequirement && (
                      <div className="mt-3 p-4 rounded-xl" style={{
                        background: "rgba(34, 197, 94, 0.08)",
                        border: "1px solid rgba(34, 197, 94, 0.15)",
                      }}>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" style={{ color: "#4ade80" }} />
                          <span className="text-sm font-medium">
                            Maximum Family Income: ₹{selectedScholarship.incomeRequirement.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card className="glass-card border-transparent">
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                    <CardDescription>Prepare these documents for your application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedScholarship.requirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg" style={{
                          background: "rgba(251, 146, 60, 0.05)",
                          border: "1px solid rgba(251, 146, 60, 0.1)",
                        }}>
                          <FileText className="h-4 w-4 shrink-0" style={{ color: "#fb923c" }} />
                          <span className="text-sm">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="process" className="mt-6">
                <Card className="glass-card border-transparent">
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                    <CardDescription>Follow these steps to apply</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedScholarship.applicationProcess.map((step, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold shrink-0" style={{
                            background: typeStyle.gradient,
                            color: "white",
                            boxShadow: `0 0 15px ${typeStyle.glow}`,
                          }}>
                            {index + 1}
                          </div>
                          <div className="flex-1 p-3 rounded-lg" style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}>
                            <span className="text-sm">{step}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="glass-card border-transparent">
                    <CardHeader>
                      <CardTitle>Education Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedScholarship.educationLevel.map((level) => (
                          <span key={level} style={{
                            background: "rgba(99, 102, 241, 0.08)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            color: "#a5b4fc",
                            padding: "6px 14px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 500,
                          }}>
                            {level}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-transparent">
                    <CardHeader>
                      <CardTitle>Fields of Study</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedScholarship.fieldOfStudy.map((field) => (
                          <span key={field} style={{
                            background: "rgba(168, 85, 247, 0.08)",
                            border: "1px solid rgba(168, 85, 247, 0.2)",
                            color: "#c4b5fd",
                            padding: "6px 14px",
                            borderRadius: "var(--radius-full)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 500,
                          }}>
                            {field}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-transparent">
                    <CardHeader>
                      <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" style={{ color: "#818cf8" }} />
                        <span>{selectedScholarship.location}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-transparent">
                    <CardHeader>
                      <CardTitle>Official Website</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full bg-transparent hover:bg-white/5">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Official Site
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4" style={{
            animation: "scholarshipSlideUp 0.6s var(--ease-out) 0.3s both"
          }}>
            <Button size="lg" className="flex-1 scholarship-apply-btn" style={{
              background: typeStyle.gradient,
              border: "none",
              boxShadow: `0 0 20px ${typeStyle.glow}`,
              fontWeight: 600,
            }}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleFavorite(selectedScholarship.id)}
              className={`hover:bg-white/5 ${favorites.includes(selectedScholarship.id) ? "" : ""}`}
              style={favorites.includes(selectedScholarship.id) ? {
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                background: "rgba(239, 68, 68, 0.08)",
              } : {}}
            >
              <Heart className="h-4 w-4 mr-2" fill={favorites.includes(selectedScholarship.id) ? "currentColor" : "none"} />
              {favorites.includes(selectedScholarship.id) ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="lg" className="hover:bg-white/5">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </div>
      </SectionWrapper>
    )
  }

  // ─── Main List View ────────────────────────────
  return (
    <SectionWrapper>
      {/* Action Toolbar */}
      <div className="flex justify-end pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-x-3 w-full">
        <button className="scholarship-toolbar-btn" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "var(--radius-full)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          background: "rgba(239, 68, 68, 0.06)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          color: "#f87171",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}>
          <Heart className="h-4 w-4" fill={favorites.length > 0 ? "currentColor" : "none"} />
          Saved ({favorites.length})
        </button>
        <button className="scholarship-toolbar-btn" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "var(--radius-full)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          background: "rgba(34, 197, 94, 0.06)",
          border: "1px solid rgba(34, 197, 94, 0.15)",
          color: "#4ade80",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}>
          <CheckCircle className="h-4 w-4" />
          Applied ({applied.length})
        </button>
      </div>

      <PageHeader
        badgeText="Scholarships"
        badgeIcon={Award}
        title="Scholarship Portal"
        description="Discover scholarships and financial aid opportunities to support your educational journey."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">

        {/* Quick Stats Strip */}
        <div className="scholarship-stats-strip" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-3)",
          marginBottom: "var(--space-8)",
          animation: "scholarshipSlideUp 0.5s var(--ease-out) both",
        }}>
          {[
            { label: "Total Scholarships", value: scholarships.length, icon: <Award className="h-4 w-4" />, color: "#818cf8" },
            { label: "Total Value", value: "₹3.9L+", icon: <DollarSign className="h-4 w-4" />, color: "#4ade80" },
            { label: "Avg. Success Rate", value: "26%", icon: <TrendingUp className="h-4 w-4" />, color: "#facc15" },
            { label: "Open Now", value: scholarships.filter(s => s.isActive).length, icon: <Zap className="h-4 w-4" />, color: "#38bdf8" },
          ].map((stat, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              background: "var(--glass-bg)",
              backdropFilter: "var(--glass-blur)",
              border: `1px solid ${stat.color}12`,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-lg)",
                background: `${stat.color}12`,
                color: stat.color,
                flexShrink: 0,
              }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold" style={{ lineHeight: 1.2 }}>{stat.value}</p>
                <p className="text-xs text-muted-foreground" style={{ opacity: 0.7 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4" style={{
          animation: "scholarshipSlideUp 0.5s var(--ease-out) 0.1s both"
        }}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search scholarships by name, provider, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="scholarship-search-input"
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 44px",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid var(--glass-border)",
                  background: "var(--glass-bg)",
                  backdropFilter: "var(--glass-blur)",
                  color: "var(--foreground)",
                  fontSize: "var(--text-sm)",
                  outline: "none",
                  transition: "all 0.25s ease",
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="scholarship-filter-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "var(--radius-xl)",
                border: showFilters ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid var(--glass-border)",
                background: showFilters ? "rgba(99, 102, 241, 0.08)" : "var(--glass-bg)",
                backdropFilter: "var(--glass-blur)",
                color: showFilters ? "#818cf8" : "var(--foreground)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters && (
                <span style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#818cf8",
                  boxShadow: "0 0 8px rgba(99, 102, 241, 0.5)",
                }} />
              )}
            </button>
          </div>

          {showFilters && (
            <div className="scholarship-filter-panel" style={{
              padding: "var(--space-6)",
              borderRadius: "var(--radius-xl)",
              background: "var(--glass-bg)",
              backdropFilter: "var(--glass-blur)",
              border: "1px solid var(--glass-border)",
              animation: "scholarshipSlideDown 0.3s var(--ease-out) both",
            }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Education Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">
                    Max: ₹{maxAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="10000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number.parseInt(e.target.value))}
                    className="scholarship-range-input"
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      accentColor: "#818cf8",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-6 flex justify-between items-center" style={{
          animation: "scholarshipSlideUp 0.5s var(--ease-out) 0.15s both"
        }}>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredScholarships.length}</span> scholarships
          </p>
          <Select defaultValue="deadline">
            <SelectTrigger className="w-48" style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-lg)",
            }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">Sort by Deadline</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
              <SelectItem value="success">Sort by Success Rate</SelectItem>
              <SelectItem value="awards">Sort by Awards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ═══ Scholarship Cards Grid ═══ */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScholarships.map((scholarship, index) => {
            const typeStyle = getTypeStyle(scholarship.type)
            const diffStyle = getDifficultyStyle(scholarship.difficulty)
            const isFav = favorites.includes(scholarship.id)
            const isApplied = applied.includes(scholarship.id)

            return (
              <div
                key={scholarship.id}
                className="scholarship-card-wrapper"
                style={{
                  animation: `scholarshipSlideUp 0.5s var(--ease-out) ${0.05 * index}s both`,
                }}
              >
                <div
                  className="scholarship-card"
                  onClick={() => setSelectedScholarship(scholarship)}
                  style={{
                    position: "relative",
                    borderRadius: "var(--radius-xl)",
                    background: "oklch(0.10 0.015 275)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "0",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {/* Top gradient accent bar */}
                  <div style={{
                    height: "3px",
                    background: typeStyle.gradient,
                    opacity: 0.7,
                  }} />

                  {/* Card Content */}
                  <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)" }}>
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-4">
                      <span style={{
                        background: typeStyle.bg,
                        border: `1px solid ${typeStyle.border}`,
                        color: typeStyle.text,
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                      }}>
                        <span style={{ fontSize: "12px" }}>{typeStyle.icon}</span>
                        {scholarship.type}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(scholarship.id)
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "var(--radius-lg)",
                          border: "none",
                          background: isFav ? "rgba(239, 68, 68, 0.1)" : "rgba(255,255,255,0.04)",
                          color: isFav ? "#f87171" : "var(--muted-foreground)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Heart className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      marginBottom: "var(--space-1)",
                      color: "var(--foreground)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{scholarship.name}</h3>

                    {/* Provider */}
                    <p style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--muted-foreground)",
                      marginBottom: "var(--space-3)",
                      opacity: 0.7,
                    }}>By {scholarship.provider}</p>

                    {/* Description */}
                    <p style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--muted-foreground)",
                      lineHeight: 1.6,
                      marginBottom: "var(--space-4)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>{scholarship.description}</p>

                    {/* Amount + Difficulty Row */}
                    <div className="flex justify-between items-center" style={{
                      marginBottom: "var(--space-3)",
                    }}>
                      <div className="flex items-center gap-2">
                        <span style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "var(--radius-md)",
                          background: "rgba(99, 102, 241, 0.1)",
                        }}>
                          <DollarSign className="h-3.5 w-3.5" style={{ color: "#818cf8" }} />
                        </span>
                        <span style={{
                          fontSize: "var(--text-lg)",
                          fontWeight: 700,
                          background: "linear-gradient(135deg, #e2e8f0, #fff)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>{formatAmount(scholarship.amount)}</span>
                      </div>
                      <span style={{
                        background: diffStyle.bg,
                        border: `1px solid ${diffStyle.border}`,
                        color: diffStyle.text,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}>{scholarship.difficulty}</span>
                    </div>

                    {/* Meta Row */}
                    <div className="flex justify-between items-center" style={{
                      padding: "var(--space-2) 0",
                      marginBottom: "var(--space-3)",
                      fontSize: "var(--text-xs)",
                      color: "var(--muted-foreground)",
                    }}>
                      <div className="flex items-center gap-1.5" style={{ opacity: 0.7 }}>
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(scholarship.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ opacity: 0.7 }}>
                        <Award className="h-3 w-3" />
                        <span>{scholarship.numberOfAwards.toLocaleString()} awards</span>
                      </div>
                    </div>

                    {/* Success Rate */}
                    <div style={{
                      padding: "var(--space-3)",
                      borderRadius: "var(--radius-lg)",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      marginBottom: "var(--space-4)",
                    }}>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--muted-foreground)" }}>Success Rate</span>
                        <span style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 700,
                          color: scholarship.successRate >= 50 ? "#4ade80" : scholarship.successRate >= 20 ? "#facc15" : "#f87171",
                        }}>{scholarship.successRate}%</span>
                      </div>
                      <div style={{
                        width: "100%",
                        height: "6px",
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${scholarship.successRate}%`,
                          height: "100%",
                          borderRadius: "var(--radius-full)",
                          background: scholarship.successRate >= 50
                            ? "linear-gradient(90deg, #22c55e, #4ade80)"
                            : scholarship.successRate >= 20
                            ? "linear-gradient(90deg, #eab308, #facc15)"
                            : "linear-gradient(90deg, #ef4444, #f87171)",
                          boxShadow: `0 0 8px ${scholarship.successRate >= 50 ? "rgba(34,197,94,0.3)" : scholarship.successRate >= 20 ? "rgba(250,204,21,0.3)" : "rgba(239,68,68,0.3)"}`,
                          transition: "width 0.8s ease",
                        }} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleApplied(scholarship.id)
                        }}
                        style={{
                          flex: "0 0 auto",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "var(--radius-lg)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          ...(isApplied ? {
                            background: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.25)",
                            color: "#4ade80",
                          } : {
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "var(--muted-foreground)",
                          }),
                        }}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Applied
                          </>
                        ) : (
                          "Apply"
                        )}
                      </button>
                      <button
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "var(--radius-lg)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          cursor: "pointer",
                          background: typeStyle.gradient,
                          border: "none",
                          color: "white",
                          boxShadow: `0 0 15px ${typeStyle.glow}`,
                          transition: "all 0.2s ease",
                        }}
                      >
                        View Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-16" style={{
            animation: "scholarshipSlideUp 0.5s var(--ease-out) both",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              margin: "0 auto var(--space-4)",
              borderRadius: "var(--radius-2xl)",
              background: "rgba(99, 102, 241, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Award className="h-8 w-8" style={{ color: "#818cf8", opacity: 0.6 }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more scholarships.
            </p>
          </div>
        )}

        {/* ═══ Tips Section ═══ */}
        <div className="mt-16" style={{
          animation: "scholarshipSlideUp 0.5s var(--ease-out) 0.3s both",
        }}>
          <div className="flex items-center gap-3 mb-8">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
            }}>
              <Sparkles className="h-5 w-5" style={{ color: "#a78bfa" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{
                background: "linear-gradient(135deg, oklch(0.96 0.005 275) 0%, oklch(0.78 0.18 275) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Application Tips</h2>
              <p className="text-xs text-muted-foreground" style={{ opacity: 0.6 }}>Boost your chances of success</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <Clock className="h-5 w-5" />,
                title: "Start Early",
                description: "Begin your scholarship search and applications well before deadlines to ensure you have time to gather all required documents.",
                color: "#818cf8",
                gradient: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))",
                borderColor: "rgba(99,102,241,0.12)",
              },
              {
                icon: <FileText className="h-5 w-5" />,
                title: "Prepare Documents",
                description: "Keep all necessary documents ready including transcripts, certificates, and recommendation letters.",
                color: "#a78bfa",
                gradient: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))",
                borderColor: "rgba(168,85,247,0.12)",
              },
              {
                icon: <Target className="h-5 w-5" />,
                title: "Follow Instructions",
                description: "Read application requirements carefully and follow all instructions to avoid disqualification.",
                color: "#38bdf8",
                gradient: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(56,189,248,0.02))",
                borderColor: "rgba(56,189,248,0.12)",
              },
            ].map((tip, i) => (
              <div key={i} className="scholarship-tip-card" style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-xl)",
                background: tip.gradient,
                border: `1px solid ${tip.borderColor}`,
                transition: "all 0.3s ease",
                cursor: "default",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-xl)",
                  background: `${tip.color}15`,
                  color: tip.color,
                  marginBottom: "var(--space-4)",
                }}>
                  {tip.icon}
                </div>
                <h3 style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  marginBottom: "var(--space-2)",
                  color: "var(--foreground)",
                }}>{tip.title}</h3>
                <p style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.6,
                }}>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
