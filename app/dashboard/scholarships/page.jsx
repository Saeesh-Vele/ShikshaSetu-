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
} from "lucide-react"
import Link from "next/link"

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Merit-based":
        return "bg-blue-100 text-blue-800"
      case "Need-based":
        return "bg-purple-100 text-purple-800"
      case "Minority":
        return "bg-orange-100 text-orange-800"
      case "Sports":
        return "bg-green-100 text-green-800"
      case "Research":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  if (selectedScholarship) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <div className="flex px-4 py-4 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedScholarship(null)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Scholarships</span>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Scholarship Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge className={getTypeColor(selectedScholarship.type)}>{selectedScholarship.type}</Badge>
              <Badge className={getDifficultyColor(selectedScholarship.difficulty)}>
                {selectedScholarship.difficulty}
              </Badge>
              {isDeadlineNear(selectedScholarship.deadline) && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Deadline Soon</span>
                </Badge>
              )}
            </div>
            <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">{selectedScholarship.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">By {selectedScholarship.provider}</p>
            <p className="text-muted-foreground max-w-3xl">{selectedScholarship.description}</p>
          </div>

          {/* Key Information */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Scholarship Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{formatAmount(selectedScholarship.amount)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedScholarship.renewability ? "Renewable" : "One-time"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Application Deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-red-600" />
                  <span className="text-lg font-bold">
                    {new Date(selectedScholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.ceil(
                    (new Date(selectedScholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )}{" "}
                  days left
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{selectedScholarship.successRate}%</span>
                </div>
                <Progress value={selectedScholarship.successRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Awards Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{selectedScholarship.numberOfAwards.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total positions</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <Tabs defaultValue="eligibility" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="process">Application</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="eligibility" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Criteria</CardTitle>
                  <CardDescription>Check if you meet all the requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedScholarship.eligibility.map((criteria, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{criteria}</span>
                      </div>
                    ))}
                  </div>
                  {selectedScholarship.gpaRequirement && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          Minimum GPA: {selectedScholarship.gpaRequirement}/10
                        </span>
                      </div>
                    </div>
                  )}
                  {selectedScholarship.incomeRequirement && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
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
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Prepare these documents for your application</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedScholarship.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Process</CardTitle>
                  <CardDescription>Follow these steps to apply</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedScholarship.applicationProcess.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Education Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedScholarship.educationLevel.map((level) => (
                        <Badge key={level} variant="outline">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fields of Study</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedScholarship.fieldOfStudy.map((field) => (
                        <Badge key={field} variant="outline">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{selectedScholarship.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Official Website</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Official Site
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleFavorite(selectedScholarship.id)}
              className={favorites.includes(selectedScholarship.id) ? "text-red-500" : ""}
            >
              <Heart className="h-4 w-4 mr-2" />
              {favorites.includes(selectedScholarship.id) ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="lg">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Action Toolbar */}
      <div className="flex justify-end pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-x-4">
        <Button variant="outline" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          Saved ({favorites.length})
        </Button>
        <Button variant="outline" size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Applied ({applied.length})
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">Scholarship Portal</h1>
          <p className="text-lg text-muted-foreground">
            Discover scholarships and financial aid opportunities to support your educational journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships by name, provider, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
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
                  <label className="text-sm font-medium mb-2 block">Category</label>
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
                  <label className="text-sm font-medium mb-2 block">Education Level</label>
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
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
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
                  <label className="text-sm font-medium mb-2 block">Max Amount: ₹{maxAmount.toLocaleString()}</label>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="10000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(Number.parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-muted-foreground">Showing {filteredScholarships.length} scholarships</p>
          <Select defaultValue="deadline">
            <SelectTrigger className="w-48">
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

        {/* Scholarship Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
              onClick={() => setSelectedScholarship(scholarship)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTypeColor(scholarship.type)}>{scholarship.type}</Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(scholarship.id)
                      }}
                      className={favorites.includes(scholarship.id) ? "text-red-500" : ""}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {isDeadlineNear(scholarship.deadline) && (
                      <Badge variant="destructive" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{scholarship.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">By {scholarship.provider}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{formatAmount(scholarship.amount)}</span>
                    </div>
                    <Badge className={getDifficultyColor(scholarship.difficulty)}>{scholarship.difficulty}</Badge>
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(scholarship.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3" />
                      <span>{scholarship.numberOfAwards} awards</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Success Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={scholarship.successRate} className="w-16 h-2" />
                      <span className="font-medium">{scholarship.successRate}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleApplied(scholarship.id)
                        }}
                        className={applied.includes(scholarship.id) ? "bg-green-50 text-green-700" : ""}
                      >
                        {applied.includes(scholarship.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Applied
                          </>
                        ) : (
                          "Apply"
                        )}
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more scholarships.
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-16">
          <h2 className="font-serif font-bold text-2xl mb-6">Application Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Start Early</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Begin your scholarship search and applications well before deadlines to ensure you have time to gather
                  all required documents.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Prepare Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep all necessary documents ready including transcripts, certificates, and recommendation letters.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-secondary/10 border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Follow Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Read application requirements carefully and follow all instructions to avoid disqualification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
