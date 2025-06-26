"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, Plus, CheckCircle, Code, BookOpen, Calendar, Droplets, ExternalLink } from "lucide-react"
import DSALearningPage from "./dsa-learning-page"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

interface Task {
  id: string
  text: string
  completed: boolean
  category: "development" | "learning" | "personal" | "other"
  createdAt: string
  completedAt?: string
}

interface WaterEntry {
  id: string
  amount: number
  timestamp: string
}

interface DailyData {
  date: string
  tasks: Task[]
  notes: string
  completedTasks: number
  totalTasks: number
  waterIntake: WaterEntry[]
  totalWater: number
  waterGoal: number
}

const achieverQuotes = [
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  {
    quote:
      "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
  },
  {
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    author: "Robert Greene",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
]

const developmentSkills = [
  { name: "JavaScript/TypeScript", clickable: false },
  { name: "React/Next.js", clickable: false },
  { name: "Node.js", clickable: false },
  { name: "Database Design", clickable: false },
  { name: "System Design", clickable: false },
  { name: "Data Structures", clickable: true },
  { name: "Algorithms", clickable: false },
  { name: "Git/Version Control", clickable: false },
  { name: "Testing", clickable: false },
  {
    name: "DevOps/CI/CD",
    clickable: true,
    isExternal: true,
    url: "https://app.eraser.io/workspace/Q8CsIzdL4RfBVO6aK5BN",
  },
  { name: "API Design", clickable: false },
  { name: "Security Best Practices", clickable: false },
]

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
  })
  const [isClient, setIsClient] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [currentPage, setCurrentPage] = useState<"dashboard" | "dsa">("dashboard")
  const [dailyData, setDailyData] = useState<DailyData>({
    date: "",
    tasks: [],
    notes: "",
    completedTasks: 0,
    totalTasks: 0,
    waterIntake: [],
    totalWater: 0,
    waterGoal: 2000, // 2 liters in ml
  })
  const [newTask, setNewTask] = useState("")
  const [taskCategory, setTaskCategory] = useState<Task["category"]>("development")
  const [waterAmount, setWaterAmount] = useState("250")

  const today = new Date().toDateString()

  useEffect(() => {
    setIsClient(true)
    loadDailyData()

    const startDate = new Date("2025-06-22T23:40:00+05:30")
    const getTargetDate = () => {
      const stored = localStorage.getItem("disciplineTarget")
      if (stored) return new Date(stored)
      const targetIST = new Date("2028-11-08T00:00:00+05:30")
      localStorage.setItem("disciplineTarget", targetIST.toISOString())
      return targetIST
    }

    const targetDate = getTargetDate()

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      const totalDuration = targetDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()
      const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
      setProgressPercentage(progress)

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return {
          days,
          hours,
          minutes,
          seconds,
          totalHours: Math.floor(difference / (1000 * 60 * 60)),
          totalMinutes: Math.floor(difference / (1000 * 60)),
          totalSeconds: Math.floor(difference / 1000),
        }
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0 }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % achieverQuotes.length)
    }, 15000)

    return () => {
      clearInterval(timer)
      clearInterval(quoteTimer)
    }
  }, [])

  const loadDailyData = () => {
    const stored = localStorage.getItem(`dailyData_${today}`)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setDailyData(data)
      } catch (error) {
        console.error("Error loading daily data:", error)
        initializeNewDay()
      }
    } else {
      initializeNewDay()
    }
  }

  const initializeNewDay = () => {
    const newData: DailyData = {
      date: today,
      tasks: [],
      notes: "",
      completedTasks: 0,
      totalTasks: 0,
      waterIntake: [],
      totalWater: 0,
      waterGoal: 2000,
    }
    setDailyData(newData)
    saveDailyData(newData)
  }

  const saveDailyData = (data: DailyData) => {
    try {
      localStorage.setItem(`dailyData_${today}`, JSON.stringify(data))
      setDailyData(data)
    } catch (error) {
      console.error("Error saving daily data:", error)
    }
  }

  const addTask = () => {
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      category: taskCategory,
      createdAt: new Date().toISOString(),
    }

    const updatedData = {
      ...dailyData,
      tasks: [...dailyData.tasks, task],
      totalTasks: dailyData.totalTasks + 1,
    }

    saveDailyData(updatedData)
    setNewTask("")
  }

  const toggleTask = (taskId: string) => {
    const updatedTasks = dailyData.tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        }
        return updatedTask
      }
      return task
    })

    const completedCount = updatedTasks.filter((task) => task.completed).length
    const updatedData = {
      ...dailyData,
      tasks: updatedTasks,
      completedTasks: completedCount,
    }

    saveDailyData(updatedData)
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = dailyData.tasks.filter((task) => task.id !== taskId)
    const completedCount = updatedTasks.filter((task) => task.completed).length

    const updatedData = {
      ...dailyData,
      tasks: updatedTasks,
      completedTasks: completedCount,
      totalTasks: updatedTasks.length,
    }

    saveDailyData(updatedData)
  }

  const addWater = () => {
    const amount = Number.parseInt(waterAmount)
    if (isNaN(amount) || amount <= 0) return

    const waterEntry: WaterEntry = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date().toISOString(),
    }

    const updatedData = {
      ...dailyData,
      waterIntake: [...dailyData.waterIntake, waterEntry],
      totalWater: dailyData.totalWater + amount,
    }

    saveDailyData(updatedData)
    setWaterAmount("250")
  }

  const updateNotes = (notes: string) => {
    const updatedData = { ...dailyData, notes }
    saveDailyData(updatedData)
  }

  const handleSkillClick = (skill: (typeof developmentSkills)[0]) => {
    if (!skill.clickable) return

    if (skill.isExternal && skill.url) {
      window.open(skill.url, "_blank", "noopener,noreferrer")
    } else if (skill.name === "Data Structures") {
      setCurrentPage("dsa")
    }
  }

  const getCategoryIcon = (category: Task["category"]) => {
    switch (category) {
      case "development":
        return <Code className="h-4 w-4" />
      case "learning":
        return <BookOpen className="h-4 w-4" />
      case "personal":
        return <Target className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Task["category"]) => {
    switch (category) {
      case "development":
        return "bg-blue-600/20 text-blue-300 border-blue-500/30"
      case "learning":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30"
      case "personal":
        return "bg-blue-700/20 text-blue-300 border-blue-600/30"
      default:
        return "bg-slate-600/20 text-slate-300 border-slate-500/30"
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-7xl bg-black/50 border-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center text-white">Loading your daily focus dashboard...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentPage === "dsa") {
    return <DSALearningPage onBack={() => setCurrentPage("dashboard")} />
  }

  const taskCompletionRate = dailyData.totalTasks > 0 ? (dailyData.completedTasks / dailyData.totalTasks) * 100 : 0
  const waterCompletionRate = (dailyData.totalWater / dailyData.waterGoal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Countdown Timer */}
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-white">Time to Prove</CardTitle>
              </div>
              <div className="text-xs text-blue-300">Target: Nov 8, 2028</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-xs text-blue-300">Days</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{timeLeft.hours.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-blue-300">Hours</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-blue-300">Minutes</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, "0")}</div>
                  <div className="text-xs text-blue-300">Seconds</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-blue-300 mb-1">
                  <span>Journey Progress</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-1" />
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card className="bg-black/50 border-blue-400/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-white">Today's Progress</CardTitle>
              </div>
              <div className="text-xs text-blue-300">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-300">Tasks Completed</span>
                    <span className="text-white">
                      {dailyData.completedTasks}/{dailyData.totalTasks}
                    </span>
                  </div>
                  <Progress value={taskCompletionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-blue-600/20 rounded p-2">
                    <div className="text-lg font-bold text-blue-300">{dailyData.completedTasks}</div>
                    <div className="text-xs text-blue-400">Completed</div>
                  </div>
                  <div className="bg-slate-600/20 rounded p-2">
                    <div className="text-lg font-bold text-slate-300">
                      {dailyData.totalTasks - dailyData.completedTasks}
                    </div>
                    <div className="text-xs text-slate-400">Remaining</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Tracker */}
          <Card className="bg-black/50 border-blue-300/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-white">Water Intake</CardTitle>
              </div>
              <div className="text-xs text-blue-300">Goal: {dailyData.waterGoal}ml</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-300">Progress</span>
                    <span className="text-white">{dailyData.totalWater}ml</span>
                  </div>
                  <Progress value={Math.min(waterCompletionRate, 100)} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="250"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white text-sm"
                  />
                  <Button onClick={addWater} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivational Quote */}
          <Card className="bg-black/50 border-slate-500/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-white">Daily Inspiration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <p className="text-sm text-white italic mb-2">"{achieverQuotes[currentQuote].quote}"</p>
                <p className="text-xs text-slate-300">— {achieverQuotes[currentQuote].author}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Task Management */}
          <Card className="bg-black/50 border-blue-500/20 backdrop-blur-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                Daily Tasks & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Add Task */}
              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="bg-slate-800/50 border-slate-600 text-white"
                  />
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as Task["category"])}
                    className="bg-slate-800/50 border border-slate-600 rounded px-3 text-white text-sm"
                  >
                    <option value="development">Development</option>
                    <option value="learning">Learning</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                  <Button onClick={addTask} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {dailyData.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600/30"
                  >
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                    <div className="flex-1">
                      <span className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-white"}`}>
                        {task.text}
                      </span>
                    </div>
                    <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(task.category)}
                        {task.category}
                      </div>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {dailyData.tasks.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No tasks yet. Add your first goal above!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Learning & Notes */}
          <div className="space-y-4 flex flex-col min-h-0">
            {/* Developer Skills */}
            <Card className="bg-black/50 border-blue-400/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Developer Skills Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {developmentSkills.slice(0, 8).map((skill, index) => (
                    <div
                      key={index}
                      onClick={() => handleSkillClick(skill)}
                      className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${
                        skill.clickable
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-pointer hover:bg-blue-500/30 hover:border-blue-400/50 transition-colors"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {skill.name}
                      {skill.isExternal && <ExternalLink className="h-3 w-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Notes */}
            <Card className="bg-black/50 border-slate-500/20 backdrop-blur-sm flex-1 min-h-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Daily Reflection & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                <Textarea
                  placeholder="What did you learn today? What challenges did you face? What will you improve tomorrow?"
                  value={dailyData.notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white resize-none flex-1 min-h-0"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
