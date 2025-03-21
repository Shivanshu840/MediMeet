"use client"

import { useState } from "react"
import { Card } from "@repo/ui/card"
import { Heart } from "lucide-react"

interface HealthMetric {
  date: string
  heartRate: number
  steps: number
  sleepHours: number
}

interface PatientActivityChartProps {
  healthData?: HealthMetric[]
}

export default function PatientActivityChart({ healthData = defaultHealthData }: PatientActivityChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"heartRate" | "steps" | "sleepHours">("heartRate")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Patient activities</h3>
        <select
          className="bg-transparent border-0 text-sm text-zinc-600 focus:ring-0"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as any)}
        >
          <option value="heartRate">Heart Rate</option>
          <option value="steps">Steps</option>
          <option value="sleepHours">Sleep Hours</option>
        </select>
      </div>

      {/* Simple Line Chart */}
      <div className="h-48 bg-white rounded-lg p-4 border border-emerald-100">
        <div className="flex items-end h-full gap-2">
          {healthData.map((data, index) => {
            // Calculate height based on selected metric
            let value = 0
            let maxValue = 100

            if (selectedMetric === "heartRate") {
              value = data.heartRate
              maxValue = 100
            } else if (selectedMetric === "steps") {
              value = data.steps / 150 // Scale down steps
              maxValue = 100
            } else if (selectedMetric === "sleepHours") {
              value = data.sleepHours * 10 // Scale up sleep hours
              maxValue = 100
            }

            const heightPercentage = (value / maxValue) * 100

            return (
              <div key={data.date} className="flex-1 flex flex-col items-center">
                <div className="w-full h-full relative flex flex-col justify-end">
                  {index > 0 && (
                    <div
                      className="absolute h-0.5 bg-emerald-300 z-0"
                      style={{
                        width: "100%",
                        bottom: `${heightPercentage}%`,
                        left: "-50%",
                        transform: `rotate(${
                          Math.atan2(
                            (healthData[index].heartRate - healthData[index - 1].heartRate) *
                              (selectedMetric === "heartRate" ? 1 : 0) +
                              (healthData[index].steps / 150 - healthData[index - 1].steps / 150) *
                                (selectedMetric === "steps" ? 1 : 0) +
                              (healthData[index].sleepHours * 10 - healthData[index - 1].sleepHours * 10) *
                                (selectedMetric === "sleepHours" ? 1 : 0),
                            100,
                          ) *
                          (180 / Math.PI)
                        }deg)`,
                        transformOrigin: "left bottom",
                      }}
                    />
                  )}
                  <div
                    className="w-3 h-3 rounded-full bg-emerald-500 z-10 relative"
                    style={{ marginBottom: `${heightPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-600 mt-2">{data.date}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Good Conditions Card */}
      <Card className="p-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
        <button className="w-full flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Good conditions</h4>
              <p className="text-sm text-zinc-600">Anxiety & wellness</p>
            </div>
          </div>
          <svg
            className="w-5 h-5 text-zinc-400 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Card>
    </div>
  )
}

// Default data if none is provided
const defaultHealthData: HealthMetric[] = [
  { date: "Mon", heartRate: 72, steps: 5200, sleepHours: 7.2 },
  { date: "Tue", heartRate: 75, steps: 6800, sleepHours: 6.8 },
  { date: "Wed", heartRate: 70, steps: 7500, sleepHours: 7.5 },
  { date: "Thu", heartRate: 74, steps: 9200, sleepHours: 8.1 },
  { date: "Fri", heartRate: 78, steps: 8400, sleepHours: 7.0 },
  { date: "Sat", heartRate: 68, steps: 10500, sleepHours: 8.5 },
  { date: "Sun", heartRate: 65, steps: 4800, sleepHours: 9.2 },
]

