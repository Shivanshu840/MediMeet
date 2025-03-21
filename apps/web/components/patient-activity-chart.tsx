"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Heart } from "lucide-react"

interface HealthMetric {
  date: string
  heartRate: number
  steps: number
  sleepHours: number
}

interface ApiHealthData {
  data: {
    steps: number
    heartRate: number
    sleepTime: number
    updatedAt: string
  } | null
}

interface PatientActivityChartProps {
  healthData?: HealthMetric[] | ApiHealthData
}

export default function PatientActivityChart({ healthData = defaultHealthData }: PatientActivityChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"heartRate" | "steps" | "sleepHours">("heartRate")
  const [processedData, setProcessedData] = useState<HealthMetric[]>(defaultHealthData)

  useEffect(() => {
 
    if (healthData && "data" in healthData && healthData.data) {
   
      const apiData = healthData.data
      const formattedDate = new Date(apiData.updatedAt).toLocaleDateString("en-US", { weekday: "short" })

     
      const newData: HealthMetric[] = [
        {
          date: formattedDate,
          heartRate: apiData.heartRate,
          steps: apiData.steps,
          sleepHours: apiData.sleepTime / 60,
        },
        ...defaultHealthData.slice(1), 
      ]

      setProcessedData(newData)
    } else if (Array.isArray(healthData)) {
   
      setProcessedData(healthData)
    } else {
     
      setProcessedData(defaultHealthData)
    }
  }, [healthData])

  const getChartValue = (value: number, metric: string) => {
    if (metric === "heartRate") return ((value - 60) / 30) * 100
    if (metric === "steps") return (value / 12000) * 100
    if (metric === "sleepHours") return ((value - 6) / 4) * 100
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Patient activities</h3>
        <select
          className="bg-transparent border border-gray-200 rounded-md text-sm text-gray-600 p-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as any)}
        >
          <option value="heartRate">Heart Rate</option>
          <option value="steps">Steps</option>
          <option value="sleepHours">Sleep Hours</option>
        </select>
      </div>

      {/* Clean Line Chart */}
      <div className="bg-white rounded-lg p-6 h-48 relative">
        {/* Chart lines */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={processedData
              .map((data, index) => {
                const x = index * (100 / (processedData.length - 1))
                const y  = 100 - getChartValue(data[selectedMetric], selectedMetric)
                return `${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Data points */}
        <div className="relative h-full flex justify-between items-end">
          {processedData.map((data, index) => {
            const value = getChartValue(data[selectedMetric], selectedMetric)
            return (
              <div key={data.date} className="flex flex-col items-center justify-end h-full relative">
                <div
                  className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm z-10 mb-1"
                  style={{ marginBottom: `${value}%` }}
                />
                <span className="text-xs text-gray-500 absolute -bottom-6">{data.date}</span>
                {index === 0 && "data" in healthData && healthData.data && (
                  <span className="absolute -top-6 text-xs font-medium text-emerald-600">Latest</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Good Conditions Card */}
      <div className="p-4 bg-emerald-50/50 hover:bg-emerald-50 transition-colors rounded-lg border border-emerald-100">
        <button className="w-full flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Good conditions</h4>
              <p className="text-sm text-gray-600">Anxiety & wellness</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

const defaultHealthData: HealthMetric[] = [
  { date: "Mon", heartRate: 72, steps: 5200, sleepHours: 7.2 },
  { date: "Tue", heartRate: 75, steps: 6800, sleepHours: 6.8 },
  { date: "Wed", heartRate: 70, steps: 7500, sleepHours: 7.5 },
  { date: "Thu", heartRate: 74, steps: 9200, sleepHours: 8.1 },
  { date: "Fri", heartRate: 78, steps: 8400, sleepHours: 7.0 },
  { date: "Sat", heartRate: 68, steps: 10500, sleepHours: 8.5 },
  { date: "Sun", heartRate: 65, steps: 4800, sleepHours: 9.2 },
]

