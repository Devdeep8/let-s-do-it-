"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

const disciplineQuotes = [
  "Discipline is the bridge between goals and accomplishment.",
  "Success is nothing more than a few simple disciplines practiced every day.",
  "Discipline is choosing between what you want now and what you want most.",
  "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
  "Discipline is the soul of an army. It makes small numbers formidable.",
  "Self-discipline is the magic power that makes you virtually unstoppable.",
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

  useEffect(() => {
    setIsClient(true)

    // Start date: June 22, 2025, 11:40 PM IST
    const startDate = new Date("2025-06-22T23:40:00+05:30")

    // Target date: November 8, 2028, 00:00:00 IST (UTC+5:30)
    const getTargetDate = () => {
      const stored = localStorage.getItem("disciplineTarget")
      if (stored) {
        return new Date(stored)
      }

      // November 8, 2028, 00:00:00 IST
      const targetIST = new Date("2028-11-08T00:00:00+05:30")
      localStorage.setItem("disciplineTarget", targetIST.toISOString())
      return targetIST
    }

    const targetDate = getTargetDate()

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      // Calculate progress
      const totalDuration = targetDate.getTime() - startDate.getTime()
      const elapsed = now.getTime() - startDate.getTime()
      const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
      setProgressPercentage(progress)

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        // Calculate totals
        const totalHours = Math.floor(difference / (1000 * 60 * 60))
        const totalMinutes = Math.floor(difference / (1000 * 60))
        const totalSeconds = Math.floor(difference / 1000)

        return {
          days,
          hours,
          minutes,
          seconds,
          totalHours,
          totalMinutes,
          totalSeconds,
        }
      }

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalSeconds: 0,
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Change quote every 10 seconds
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % disciplineQuotes.length)
    }, 10000)

    return () => {
      clearInterval(timer)
      clearInterval(quoteTimer)
    }
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-black/50 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center text-white">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = timeLeft.totalSeconds <= 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-black/50 border-purple-500/20 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">Time to Prove Yourself</CardTitle>
          </div>
          <CardDescription className="text-lg text-purple-200">
            {isExpired ? "🎯 The moment of truth has arrived! 🎯" : "Discipline is defining you. Every second counts."}
          </CardDescription>
          <div className="text-sm text-purple-300 mt-2">Target Achievement: November 8, 2028 • 12:00 AM IST</div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-purple-300">
              <span>Journey Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-purple-900/30" />
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {/* Discipline Quote */}
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-purple-300">Daily Discipline Reminder</span>
            </div>
            <p className="text-white font-medium text-center italic">"{disciplineQuotes[currentQuote]}"</p>
          </div>

          {!isExpired ? (
            <>
              {/* Main Countdown Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.days.toLocaleString()}</div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Days</div>
                  <div className="text-xs text-purple-400 mt-1">to prove yourself</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Hours</div>
                  <div className="text-xs text-purple-400 mt-1">of discipline</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Minutes</div>
                  <div className="text-xs text-purple-400 mt-1">of focus</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Seconds</div>
                  <div className="text-xs text-purple-400 mt-1">of commitment</div>
                </div>
              </div>

              {/* Discipline Metrics */}
              <div className="border-t border-purple-500/20 pt-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Discipline Building Time</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalHours.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Hours to Master Yourself</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalMinutes.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Minutes of Growth</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalSeconds.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Seconds of Transformation</div>
                  </div>
                </div>
              </div>

              {/* Motivational Section */}
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg border border-orange-500/30">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-orange-200 mb-2">Remember:</h4>
                  <p className="text-orange-100 text-sm">
                    Every day you choose discipline over comfort, you're building the person you're meant to become.
                    This countdown isn't just about time—it's about transformation.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl md:text-8xl mb-4">🎯</div>
              <div className="text-2xl md:text-4xl font-bold text-white mb-4">You've Proven Yourself!</div>
              <div className="text-lg text-purple-200 mb-4">
                The discipline you've built has shaped who you are today.
              </div>
              <div className="text-base text-purple-300">Now it's time to set new goals and continue growing.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
