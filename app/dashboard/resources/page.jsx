"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, CheckCircle, Bell, ArrowLeft, Download, Eye, Share2, Star, Clock, Filter, Search, BookOpen, Play, FileText, GraduationCap, Users } from "lucide-react"
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "E-book":
        return <BookOpen className="h-4 w-4" />
      case "Video":
        return <Play className="h-4 w-4" />
      case "Article":
        return <FileText className="h-4 w-4" />
      case "Course":
        return <GraduationCap className="h-4 w-4" />
      case "Test":
        return <FileText className="h-4 w-4" />
      case "Guide":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SectionWrapper>
      {/* Favorites Toolbar */}
      <div className="flex justify-end pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Button variant="outline" size="sm" className="glass">
          <Heart className="h-4 w-4 mr-2 text-red-500" />
          Favorites ({favorites.length})
        </Button>
      </div>

      <PageHeader 
        badgeText="Resource Library" 
        badgeIcon={BookOpen} 
        title="Educational Resources" 
        description="Access free e-books, study materials, skill development courses, and educational resources to support your learning journey." 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass input-glow"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto glass">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="text-sm font-medium mb-2 block">Subject</label>
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
                  <label className="text-sm font-medium mb-2 block">Level</label>
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
            </Card>
          )}
        </div>

        {/* Resource Categories Tabs */}
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
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {filteredResources.length} resources</p>
              <Select defaultValue="popular">
                <SelectTrigger className="w-48">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden glass-card-hover border-transparent">
                  <div className="relative">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                    {resource.isPremium && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">Premium</Badge>
                    )}
                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        {getTypeIcon(resource.type)}
                        <span>{resource.type}</span>
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getLevelColor(resource.level)}>{resource.level}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(resource.id)}
                        className={favorites.includes(resource.id) ? "text-red-500" : ""}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>By {resource.author}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{resource.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{resource.type === "Video" || resource.type === "Course" ? "Access" : "Download"}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents would filter by type */}
          <TabsContent value="ebooks" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter((r) => r.type === "E-book")
                .map((resource) => (
                  <Card key={resource.id} className="overflow-hidden glass-card-hover border-transparent">
                    <div className="p-4">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more resources.
            </p>
          </div>
        )}

        {/* Featured Resources Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card-hover border-transparent">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>JEE Preparation Kit</span>
                </CardTitle>
                <CardDescription>Complete study materials for JEE Main & Advanced</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">25 Resources</span>
                  <Button size="sm">Explore</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-hover border-transparent">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Skill Development Hub</span>
                </CardTitle>
                <CardDescription>Essential skills for career success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">18 Resources</span>
                  <Button size="sm">Explore</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-hover border-transparent">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Career Guidance Library</span>
                </CardTitle>
                <CardDescription>Expert advice for career planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">12 Resources</span>
                  <Button size="sm">Explore</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
