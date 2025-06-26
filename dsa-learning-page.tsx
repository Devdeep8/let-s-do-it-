"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Code, BookOpen, ExternalLink, Clock, Users, Zap } from "lucide-react"

interface DSAProgress {
  step1: {
    fundamentals: boolean
    taskManagementAPI: boolean
    leetcodeProblems: boolean
  }
  step2: {
    intermediateTopics: boolean
    urlShortener: boolean
    systemDesign: boolean
  }
  step3: {
    advancedTopics: boolean
    recommendationSystem: boolean
    openSource: boolean
  }
  step4: {
    portfolio: boolean
    interviews: boolean
    networking: boolean
  }
  overallProgress: number
}

interface DSALearningPageProps {
  onBack: () => void
}

export default function DSALearningPage({ onBack }: DSALearningPageProps) {
  const [progress, setProgress] = useState<DSAProgress>({
    step1: {
      fundamentals: false,
      taskManagementAPI: false,
      leetcodeProblems: false,
    },
    step2: {
      intermediateTopics: false,
      urlShortener: false,
      systemDesign: false,
    },
    step3: {
      advancedTopics: false,
      recommendationSystem: false,
      openSource: false,
    },
    step4: {
      portfolio: false,
      interviews: false,
      networking: false,
    },
    overallProgress: 0,
  })

  useEffect(() => {
    loadProgress()
  }, [])

  useEffect(() => {
    calculateOverallProgress()
    saveProgress()
  }, [progress.step1, progress.step2, progress.step3, progress.step4])

  const loadProgress = () => {
    const stored = localStorage.getItem("dsaProgress")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setProgress(data)
      } catch (error) {
        console.error("Error loading DSA progress:", error)
      }
    }
  }

  const saveProgress = () => {
    localStorage.setItem("dsaProgress", JSON.stringify(progress))
  }

  const calculateOverallProgress = () => {
    const allTasks = [
      ...Object.values(progress.step1),
      ...Object.values(progress.step2),
      ...Object.values(progress.step3),
      ...Object.values(progress.step4),
    ]
    const completedTasks = allTasks.filter(Boolean).length
    const totalTasks = allTasks.length
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    setProgress((prev) => ({
      ...prev,
      overallProgress: percentage,
    }))
  }

  const updateStepProgress = (step: keyof Omit<DSAProgress, "overallProgress">, task: string, completed: boolean) => {
    setProgress((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [task]: completed,
      },
    }))
  }

  const getStepProgress = (step: keyof Omit<DSAProgress, "overallProgress">) => {
    const tasks = Object.values(progress[step])
    const completed = tasks.filter(Boolean).length
    return (completed / tasks.length) * 100
  }

  const resources = [
    { name: "LeetCode", url: "https://leetcode.com/problemset/", description: "Practice coding problems" },
    { name: "NeetCode", url: "https://neetcode.io/", description: "Curated problem patterns" },
    { name: "AlgoExpert", url: "https://www.algoexpert.io/", description: "Structured learning path" },
    {
      name: "System Design Primer",
      url: "https://github.com/donnemartin/system-design-primer",
      description: "System design concepts",
    },
    {
      name: "Designing Data-Intensive Applications",
      url: "https://dataintensive.net/",
      description: "Advanced system design book",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Data Structures & Algorithms</h1>
            <p className="text-blue-300">6-Month Learning Roadmap for Real-World Development</p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Completion</span>
                <span className="text-white">{progress.overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={progress.overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Step 1: Fundamentals */}
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Step 1: Fundamentals
                </CardTitle>
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">1-2 months</Badge>
              </div>
              <Progress value={getStepProgress("step1")} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step1.fundamentals}
                  onCheckedChange={(checked) => updateStepProgress("step1", "fundamentals", checked as boolean)}
                />
                <span className="text-sm text-white">Master core DSA (arrays, linked lists, trees, hash maps)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step1.taskManagementAPI}
                  onCheckedChange={(checked) => updateStepProgress("step1", "taskManagementAPI", checked as boolean)}
                />
                <span className="text-sm text-white">Build Task Management API with TypeScript & Prisma</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step1.leetcodeProblems}
                  onCheckedChange={(checked) => updateStepProgress("step1", "leetcodeProblems", checked as boolean)}
                />
                <span className="text-sm text-white">Solve 50+ LeetCode problems (easy/medium)</span>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Project:</strong> Task Management API with priority queues, trie-based search, and hash map
                  categorization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Intermediate */}
          <Card className="bg-black/50 border-blue-400/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  Step 2: Intermediate
                </CardTitle>
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">2-3 months</Badge>
              </div>
              <Progress value={getStepProgress("step2")} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step2.intermediateTopics}
                  onCheckedChange={(checked) => updateStepProgress("step2", "intermediateTopics", checked as boolean)}
                />
                <span className="text-sm text-white">Advanced DSA (graphs, DP, tries, segment trees)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step2.urlShortener}
                  onCheckedChange={(checked) => updateStepProgress("step2", "urlShortener", checked as boolean)}
                />
                <span className="text-sm text-white">Build URL Shortener with Redis & rate limiting</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step2.systemDesign}
                  onCheckedChange={(checked) => updateStepProgress("step2", "systemDesign", checked as boolean)}
                />
                <span className="text-sm text-white">Learn system design & caching strategies</span>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Project:</strong> URL Shortener with consistent hashing, sliding window rate limiting, and
                  Redis caching
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Advanced */}
          <Card className="bg-black/50 border-blue-300/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Step 3: Advanced
                </CardTitle>
                <Badge className="bg-blue-700/20 text-blue-300 border-blue-600/30">2-3 months</Badge>
              </div>
              <Progress value={getStepProgress("step3")} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step3.advancedTopics}
                  onCheckedChange={(checked) => updateStepProgress("step3", "advancedTopics", checked as boolean)}
                />
                <span className="text-sm text-white">Master graph algorithms & complex DP patterns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step3.recommendationSystem}
                  onCheckedChange={(checked) => updateStepProgress("step3", "recommendationSystem", checked as boolean)}
                />
                <span className="text-sm text-white">Build Recommendation System with Neo4j & graphs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step3.openSource}
                  onCheckedChange={(checked) => updateStepProgress("step3", "openSource", checked as boolean)}
                />
                <span className="text-sm text-white">Contribute to open source projects</span>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Project:</strong> Recommendation System using graph algorithms, BFS/DFS, and distributed
                  caching
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Portfolio & Jobs */}
          <Card className="bg-black/50 border-slate-500/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Step 4: Portfolio & Jobs
                </CardTitle>
                <Badge className="bg-slate-600/20 text-slate-300 border-slate-500/30">1-2 months</Badge>
              </div>
              <Progress value={getStepProgress("step4")} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step4.portfolio}
                  onCheckedChange={(checked) => updateStepProgress("step4", "portfolio", checked as boolean)}
                />
                <span className="text-sm text-white">Deploy projects & create portfolio documentation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step4.interviews}
                  onCheckedChange={(checked) => updateStepProgress("step4", "interviews", checked as boolean)}
                />
                <span className="text-sm text-white">Practice system design & coding interviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={progress.step4.networking}
                  onCheckedChange={(checked) => updateStepProgress("step4", "networking", checked as boolean)}
                />
                <span className="text-sm text-white">Network & apply for high-impact roles</span>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  <strong>Goal:</strong> Land a high-paying remote role (10+ LPA) with strong DSA & system design skills
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 6-Month Timeline */}
        <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              6-Month Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">Months 1-2</h4>
                <p className="text-sm text-white">Core DSA + Task Management API</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Arrays, linked lists, stacks, queues</li>
                  <li>• Hash maps, trees, basic sorting</li>
                  <li>• TypeScript + Prisma project</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">Months 3-4</h4>
                <p className="text-sm text-white">Intermediate DSA + URL Shortener</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Graphs, DP, advanced trees</li>
                  <li>• System design concepts</li>
                  <li>• Redis + rate limiting</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">Months 5-6</h4>
                <p className="text-sm text-white">Advanced + Job Preparation</p>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Complex algorithms</li>
                  <li>• Recommendation system</li>
                  <li>• Portfolio + interviews</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="bg-black/50 border-blue-400/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-500/10 rounded border border-blue-500/20 hover:bg-blue-500/20 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-300 group-hover:text-blue-200">{resource.name}</h4>
                    <ExternalLink className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-slate-300">{resource.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
