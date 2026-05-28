"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  CheckCircle,
  Bell,
  ArrowLeft,
  Download,
  Eye,
  Share2,
  Star,
  Clock,
  Filter,
  Search,
  BookOpen,
  Play,
  FileText,
  GraduationCap,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
  Library,
  Layers,
  Target,
} from "lucide-react"
import Link from "next/link"
import { SectionWrapper, PageHeader } from "@/components/ui/section-wrapper"

// Use plain JS objects, not TypeScript interfaces
const resources = [
  {
    id: "1",
    title: "Complete Guide to JEE Main Mathematics",
    description:
      "Comprehensive e-book covering all mathematics topics for JEE Main with solved examples and practice problems.",
    type: "E-book",
    category: "Entrance Exams",
    subject: "Mathematics",
    level: "Intermediate",
    duration: "300 pages",
    rating: 4.8,
    downloads: 15420,
    author: "Dr. Rajesh Kumar",
    publishedDate: "2024-01-15",
    tags: ["JEE", "Mathematics", "Problem Solving", "Calculus"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=JEE+Math+Guide",
    fileSize: "25 MB",
    isPremium: false,
    url: "#",
  },
  {
    id: "2",
    title: "NEET Biology Video Lectures Series",
    description:
      "Complete video lecture series covering NEET Biology syllabus with animations and visual explanations.",
    type: "Video",
    category: "Entrance Exams",
    subject: "Biology",
    level: "Intermediate",
    duration: "45 hours",
    rating: 4.9,
    downloads: 8750,
    author: "Prof. Meera Sharma",
    publishedDate: "2024-02-20",
    tags: ["NEET", "Biology", "Video Lectures", "Medical"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=NEET+Biology",
    isPremium: true,
    url: "#",
  },
  {
    id: "3",
    title: "Career Planning for Class 12 Students",
    description: "Essential guide for making informed career decisions after completing class 12th education.",
    type: "Guide",
    category: "Career Guidance",
    subject: "General",
    level: "Beginner",
    duration: "50 pages",
    rating: 4.6,
    downloads: 22100,
    author: "Career Counseling Team",
    publishedDate: "2024-03-10",
    tags: ["Career Planning", "Class 12", "Decision Making", "Future"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=Career+Planning",
    fileSize: "8 MB",
    isPremium: false,
    url: "#",
  },
  {
    id: "4",
    title: "Python Programming for Beginners",
    description: "Interactive course covering Python basics, data structures, and practical programming projects.",
    type: "Course",
    category: "Skill Development",
    subject: "Computer Science",
    level: "Beginner",
    duration: "20 hours",
    rating: 4.7,
    downloads: 12300,
    author: "Tech Academy",
    publishedDate: "2024-01-25",
    tags: ["Python", "Programming", "Coding", "Beginner"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=Python+Course",
    isPremium: true,
    url: "#",
  },
  {
    id: "5",
    title: "Financial Literacy for Students",
    description: "Learn essential financial concepts, budgeting, and investment basics for students.",
    type: "Article",
    category: "Life Skills",
    subject: "Finance",
    level: "Beginner",
    duration: "15 min read",
    rating: 4.5,
    downloads: 9800,
    author: "Finance Expert Team",
    publishedDate: "2024-02-05",
    tags: ["Finance", "Money Management", "Budgeting", "Investment"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=Financial+Literacy",
    isPremium: false,
    url: "#",
  },
  {
    id: "6",
    title: "Mock Test Series - CAT Quantitative Aptitude",
    description:
      "Practice tests for CAT quantitative aptitude section with detailed solutions and performance analysis.",
    type: "Test",
    category: "Entrance Exams",
    subject: "Mathematics",
    level: "Advanced",
    duration: "2 hours",
    rating: 4.8,
    downloads: 6750,
    author: "MBA Prep Institute",
    publishedDate: "2024-03-01",
    tags: ["CAT", "Mock Test", "Quantitative Aptitude", "MBA"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=CAT+Mock+Test",
    isPremium: true,
    url: "#",
  },
  {
    id: "7",
    title: "Communication Skills Masterclass",
    description: "Develop effective communication skills for academic and professional success.",
    type: "Video",
    category: "Life Skills",
    subject: "Communication",
    level: "Intermediate",
    duration: "8 hours",
    rating: 4.6,
    downloads: 11200,
    author: "Soft Skills Academy",
    publishedDate: "2024-01-30",
    tags: ["Communication", "Public Speaking", "Presentation", "Soft Skills"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=Communication+Skills",
    isPremium: false,
    url: "#",
  },
  {
    id: "8",
    title: "Complete Chemistry Notes for Class 12",
    description: "Comprehensive chemistry notes covering organic, inorganic, and physical chemistry for board exams.",
    type: "E-book",
    category: "Board Exams",
    subject: "Chemistry",
    level: "Intermediate",
    duration: "250 pages",
    rating: 4.7,
    downloads: 18900,
    author: "Chemistry Faculty",
    publishedDate: "2024-02-15",
    tags: ["Chemistry", "Class 12", "Board Exams", "Notes"],
    thumbnail: "/placeholder.svg?height=200&width=300&text=Chemistry+Notes",
    fileSize: "20 MB",
    isPremium: false,
    url: "#",
  },
]

const categories = [
  "All Categories",
  "Entrance Exams",
  "Career Guidance",
  "Skill Development",
  "Life Skills",
  "Board Exams",
]
const subjects = [
  "All Subjects",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Computer Science",
  "Finance",
  "Communication",
  "General",
]
const types = ["All Types", "E-book", "Video", "Article", "Course", "Test", "Guide"]
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"]

// Premium color schemes for resource types
const typeStyles = {
  "E-book": {
    bg: "rgba(99, 102, 241, 0.12)",
    border: "rgba(99, 102, 241, 0.3)",
    text: "#818cf8",
    glow: "rgba(99, 102, 241, 0.2)",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    icon: "📖",
  },
  Video: {
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#f87171",
    glow: "rgba(239, 68, 68, 0.2)",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    icon: "▶️",
  },
  Article: {
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.3)",
    text: "#4ade80",
    glow: "rgba(34, 197, 94, 0.2)",
    gradient: "linear-gradient(135deg, #22c55e, #10b981)",
    icon: "📝",
  },
  Course: {
    bg: "rgba(168, 85, 247, 0.12)",
    border: "rgba(168, 85, 247, 0.3)",
    text: "#c084fc",
    glow: "rgba(168, 85, 247, 0.2)",
    gradient: "linear-gradient(135deg, #a855f7, #d946ef)",
    icon: "🎓",
  },
  Test: {
    bg: "rgba(251, 146, 60, 0.12)",
    border: "rgba(251, 146, 60, 0.3)",
    text: "#fb923c",
    glow: "rgba(251, 146, 60, 0.2)",
    gradient: "linear-gradient(135deg, #f97316, #fb923c)",
    icon: "📋",
  },
  Guide: {
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.3)",
    text: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.2)",
    gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    icon: "📘",
  },
  default: {
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.3)",
    text: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.2)",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
    icon: "📄",
  },
}

const levelStyles = {
  Beginner: {
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.35)",
    text: "#4ade80",
  },
  Intermediate: {
    bg: "rgba(250, 204, 21, 0.12)",
    border: "rgba(250, 204, 21, 0.35)",
    text: "#facc15",
  },
  Advanced: {
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.35)",
    text: "#f87171",
  },
}

export default function ResourceLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All Categories" || resource.category === selectedCategory
    const matchesSubject = selectedSubject === "All Subjects" || resource.subject === selectedSubject
    const matchesType = selectedType === "All Types" || resource.type === selectedType
    const matchesLevel = selectedLevel === "All Levels" || resource.level === selectedLevel

    return matchesSearch && matchesCategory && matchesSubject && matchesType && matchesLevel
  })

  const toggleFavorite = (resourceId) => {
    setFavorites((prev) => (prev.includes(resourceId) ? prev.filter((id) => id !== resourceId) : [...prev, resourceId]))
  }

  const getTypeStyle = (type) => typeStyles[type] || typeStyles.default
  const getLevelStyle = (level) => levelStyles[level] || levelStyles.Intermediate

  const getTypeIcon = (type) => {
    switch (type) {
      case "E-book": return <BookOpen className="h-4 w-4" />
      case "Video": return <Play className="h-4 w-4" />
      case "Article": return <FileText className="h-4 w-4" />
      case "Course": return <GraduationCap className="h-4 w-4" />
      case "Test": return <FileText className="h-4 w-4" />
      case "Guide": return <BookOpen className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  // Helper to render a resource card (reused across tabs)
  const renderResourceCard = (resource, index) => {
    const tStyle = getTypeStyle(resource.type)
    const lStyle = getLevelStyle(resource.level)
    const isFav = favorites.includes(resource.id)

    return (
      <div
        key={resource.id}
        className="resource-card-wrapper"
        style={{
          animation: `scholarshipSlideUp 0.5s var(--ease-out) ${0.05 * index}s both`,
        }}
      >
        <div className="resource-card" style={{
          position: "relative",
          borderRadius: "var(--radius-xl)",
          background: "oklch(0.10 0.015 275)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {/* Top gradient accent bar */}
          <div style={{
            height: "3px",
            background: tStyle.gradient,
            opacity: 0.7,
          }} />

          {/* Thumbnail Area */}
          <div style={{
            position: "relative",
            height: "160px",
            background: `linear-gradient(135deg, ${tStyle.bg}, rgba(255,255,255,0.02))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {/* Decorative pattern */}
            <div style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${tStyle.text} 1px, transparent 1px), radial-gradient(circle at 80% 20%, ${tStyle.text} 1px, transparent 1px), radial-gradient(circle at 60% 80%, ${tStyle.text} 1px, transparent 1px)`,
              backgroundSize: "60px 60px, 80px 80px, 40px 40px",
            }} />
            
            {/* Large type icon in center */}
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "var(--radius-2xl)",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${tStyle.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              backdropFilter: "blur(8px)",
              boxShadow: `0 0 25px ${tStyle.glow}`,
            }}>
              {tStyle.icon}
            </div>

            {/* Premium badge */}
            {resource.isPremium && (
              <span style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#78350f",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                boxShadow: "0 0 12px rgba(245, 158, 11, 0.3)",
              }}>
                Premium
              </span>
            )}

            {/* Type badge */}
            <span style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: tStyle.bg,
              border: `1px solid ${tStyle.border}`,
              color: tStyle.text,
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backdropFilter: "blur(8px)",
            }}>
              {getTypeIcon(resource.type)}
              {resource.type}
            </span>
          </div>

          {/* Card Body */}
          <div style={{ padding: "var(--space-5) var(--space-5) var(--space-4)" }}>
            {/* Level + Favorite Row */}
            <div className="flex justify-between items-start mb-3">
              <span style={{
                background: lStyle.bg,
                border: `1px solid ${lStyle.border}`,
                color: lStyle.text,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "11px",
                fontWeight: 600,
              }}>{resource.level}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(resource.id)
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
              marginBottom: "var(--space-2)",
              color: "var(--foreground)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>{resource.title}</h3>

            {/* Description */}
            <p style={{
              fontSize: "var(--text-sm)",
              color: "var(--muted-foreground)",
              lineHeight: 1.6,
              marginBottom: "var(--space-3)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>{resource.description}</p>

            {/* Author + Rating */}
            <div className="flex items-center justify-between" style={{
              marginBottom: "var(--space-3)",
              fontSize: "var(--text-sm)",
            }}>
              <span style={{ color: "var(--muted-foreground)", opacity: 0.7 }}>By {resource.author}</span>
              <div className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" style={{ color: "#facc15", fill: "#facc15" }} />
                <span style={{ fontWeight: 600, color: "#facc15" }}>{resource.rating}</span>
              </div>
            </div>

            {/* Duration + Downloads */}
            <div className="flex items-center justify-between" style={{
              marginBottom: "var(--space-3)",
              fontSize: "var(--text-xs)",
              color: "var(--muted-foreground)",
              opacity: 0.7,
            }}>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{resource.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="h-3 w-3" />
                <span>{resource.downloads.toLocaleString()}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5" style={{ marginBottom: "var(--space-4)" }}>
              {resource.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted-foreground)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}>{tag}</span>
              ))}
              {resource.tags.length > 3 && (
                <span style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--muted-foreground)",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "11px",
                  fontWeight: 500,
                }}>+{resource.tags.length - 3}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "var(--radius-lg)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--muted-foreground)",
                transition: "all 0.2s ease",
              }}>
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
              <button style={{
                flex: "0 0 auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                padding: "8px 0",
                borderRadius: "var(--radius-lg)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--muted-foreground)",
                transition: "all 0.2s ease",
              }}>
                <Share2 className="h-3.5 w-3.5" />
              </button>
              <button style={{
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
                background: tStyle.gradient,
                border: "none",
                color: "white",
                boxShadow: `0 0 15px ${tStyle.glow}`,
                transition: "all 0.2s ease",
              }}>
                <Download className="h-3.5 w-3.5" />
                {resource.type === "Video" || resource.type === "Course" ? "Access" : "Download"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalDownloads = resources.reduce((acc, r) => acc + r.downloads, 0)
  const avgRating = (resources.reduce((acc, r) => acc + r.rating, 0) / resources.length).toFixed(1)

  return (
    <SectionWrapper>
      {/* Favorites Toolbar */}
      <div className="flex justify-end pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button className="resource-toolbar-btn" style={{
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
          Favorites ({favorites.length})
        </button>
      </div>

      <PageHeader
        badgeText="Resource Library"
        badgeIcon={BookOpen}
        title="Educational Resources"
        description="Access free e-books, study materials, skill development courses, and educational resources to support your learning journey."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">

        {/* Quick Stats Strip */}
        <div className="resource-stats-strip" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-3)",
          marginBottom: "var(--space-8)",
          animation: "scholarshipSlideUp 0.5s var(--ease-out) both",
        }}>
          {[
            { label: "Total Resources", value: resources.length, icon: <Library className="h-4 w-4" />, color: "#818cf8" },
            { label: "Downloads", value: `${(totalDownloads / 1000).toFixed(1)}K+`, icon: <Download className="h-4 w-4" />, color: "#4ade80" },
            { label: "Avg. Rating", value: avgRating, icon: <Star className="h-4 w-4" />, color: "#facc15" },
            { label: "Free Resources", value: resources.filter(r => !r.isPremium).length, icon: <Zap className="h-4 w-4" />, color: "#38bdf8" },
          ].map((stat, i) => (
            <div key={i} className="resource-stat-card" style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-lg)",
              background: "var(--glass-bg)",
              backdropFilter: "var(--glass-blur)",
              border: `1px solid ${stat.color}12`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
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
          animation: "scholarshipSlideUp 0.5s var(--ease-out) 0.1s both",
        }}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search resources by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="resource-search-input"
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
              className="resource-filter-btn"
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
            <div style={{
              padding: "var(--space-6)",
              borderRadius: "var(--radius-xl)",
              background: "var(--glass-bg)",
              backdropFilter: "var(--glass-blur)",
              border: "1px solid var(--glass-border)",
              animation: "scholarshipSlideDown 0.3s var(--ease-out) both",
            }}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  <label className="text-xs font-medium mb-2 block text-muted-foreground uppercase tracking-wider">Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resource Type Tabs */}
        <div style={{ animation: "scholarshipSlideUp 0.5s var(--ease-out) 0.15s both" }}>
          <Tabs defaultValue="all" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ebooks">E-books</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {/* Results Header */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredResources.length}</span> resources
                </p>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-48" style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                  }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="downloads">Most Downloaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResources.map((resource, index) => renderResourceCard(resource, index))}
              </div>
            </TabsContent>

            {/* Filtered tab contents */}
            {[
              { value: "ebooks", type: "E-book" },
              { value: "videos", type: "Video" },
              { value: "courses", type: "Course" },
              { value: "tests", type: "Test" },
              { value: "guides", type: "Guide" },
            ].map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredResources
                    .filter((r) => r.type === tab.type)
                    .map((resource, index) => renderResourceCard(resource, index))}
                </div>
                {filteredResources.filter((r) => r.type === tab.type).length === 0 && (
                  <div className="text-center py-16">
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
                      <BookOpen className="h-8 w-8" style={{ color: "#818cf8", opacity: 0.6 }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No {tab.type.toLowerCase()}s found</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                      Try adjusting your filters to find more resources.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {filteredResources.length === 0 && (
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
              <BookOpen className="h-8 w-8" style={{ color: "#818cf8", opacity: 0.6 }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more resources.
            </p>
          </div>
        )}

        {/* ═══ Featured Collections Section ═══ */}
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
              }}>Featured Collections</h2>
              <p className="text-xs text-muted-foreground" style={{ opacity: 0.6 }}>Curated bundles for your learning goals</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "JEE Preparation Kit",
                description: "Complete study materials for JEE Main & Advanced",
                count: "25 Resources",
                color: "#818cf8",
                gradient: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))",
                borderColor: "rgba(99,102,241,0.12)",
                btnGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              },
              {
                icon: <Users className="h-5 w-5" />,
                title: "Skill Development Hub",
                description: "Essential skills for career success",
                count: "18 Resources",
                color: "#a78bfa",
                gradient: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))",
                borderColor: "rgba(168,85,247,0.12)",
                btnGradient: "linear-gradient(135deg, #a855f7, #d946ef)",
              },
              {
                icon: <GraduationCap className="h-5 w-5" />,
                title: "Career Guidance Library",
                description: "Expert advice for career planning",
                count: "12 Resources",
                color: "#38bdf8",
                gradient: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(56,189,248,0.02))",
                borderColor: "rgba(56,189,248,0.12)",
                btnGradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
              },
            ].map((collection, i) => (
              <div key={i} className="resource-collection-card" style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-xl)",
                background: collection.gradient,
                border: `1px solid ${collection.borderColor}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-xl)",
                  background: `${collection.color}15`,
                  color: collection.color,
                  marginBottom: "var(--space-4)",
                  boxShadow: `0 0 20px ${collection.color}15`,
                }}>
                  {collection.icon}
                </div>
                <h3 style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  marginBottom: "var(--space-1)",
                  color: "var(--foreground)",
                }}>{collection.title}</h3>
                <p style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--muted-foreground)",
                  lineHeight: 1.6,
                  marginBottom: "var(--space-4)",
                }}>{collection.description}</p>
                <div className="flex items-center justify-between">
                  <span style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--muted-foreground)",
                    opacity: 0.7,
                  }}>{collection.count}</span>
                  <button style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: collection.btnGradient,
                    border: "none",
                    color: "white",
                    boxShadow: `0 0 12px ${collection.color}30`,
                    transition: "all 0.2s ease",
                  }}>
                    Explore
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
