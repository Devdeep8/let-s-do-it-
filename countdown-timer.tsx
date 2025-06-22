"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

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

  useEffect(() => {
    setIsClient(true)

    // Target date: November 8, 2028, 00:00:00 IST (UTC+5:30)
    const getTargetDate = () => {
      const stored = localStorage.getItem("birthdayTarget")
      if (stored) {
        return new Date(stored)
      }

      // November 8, 2028, 00:00:00 IST
      // Convert IST to UTC: subtract 5 hours 30 minutes
      const targetIST = new Date("2028-11-08T00:00:00+05:30")
      localStorage.setItem("birthdayTarget", targetIST.toISOString())
      return targetIST
    }

    const targetDate = getTargetDate()

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

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

    return () => clearInterval(timer)
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
            <Calendar className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-2xl md:text-3xl font-bold text-white">Birthday Countdown</CardTitle>
          </div>
          <CardDescription className="text-lg text-purple-200">
            {isExpired ? "🎉 Happy 25th Birthday! 🎉" : "Time left until your 25th birthday!"}
          </CardDescription>
          <div className="text-sm text-purple-300 mt-2">Target: November 8, 2028 • 12:00 AM IST</div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {!isExpired ? (
            <>
              {/* Main Countdown Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">{timeLeft.days.toLocaleString()}</div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-purple-300 text-sm md:text-base font-medium">Seconds</div>
                </div>
              </div>

              {/* Total Time Display */}
              <div className="border-t border-purple-500/20 pt-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Total Time Remaining</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalHours.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Total Hours</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalMinutes.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Total Minutes</div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4">
                    <div className="text-xl md:text-2xl font-bold text-purple-200">
                      {timeLeft.totalSeconds.toLocaleString()}
                    </div>
                    <div className="text-purple-400 text-sm">Total Seconds</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl md:text-8xl mb-4">🎂</div>
              <div className="text-2xl md:text-4xl font-bold text-white mb-4">The big day is here!</div>
              <div className="text-lg text-purple-200">Wishing you a fantastic 25th birthday!</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
