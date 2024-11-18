'use client'

import { useState, useEffect } from "react"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog"

// Define the HealthData interface
interface HealthData {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
  health?: {
    weight?: number
    foodCalories?: number
    steps?: number
    heartRate?: number
    sleepTime?: number
    bloodPressure?: { systolic: number; diastolic: number }
    temperature?: number
    airQuality?: { aqi: number; status: string }
    lastUpdated?: string
  }
}

// Component to display a single health report in a dialog
function PatientHealthMonitor({ healthData }: { healthData: HealthData }) {
  const { user, health } = healthData;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>
            {user.firstName} {user.lastName}'s Health Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400">Weight</h4>
              <p className="text-2xl font-bold">{health?.weight ?? 'N/A'} kg</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400">Calories</h4>
              <p className="text-2xl font-bold">{health?.foodCalories ?? 'N/A'} kcal</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400">Steps</h4>
              <p className="text-2xl font-bold">{health?.steps ?? 'N/A'}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-slate-400">Heart Rate</h4>
              <p className="text-2xl font-bold">{health?.heartRate ?? 'N/A'} bpm</p>
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-slate-400">Blood Pressure</h4>
            <p className="text-2xl font-bold">
              {health?.bloodPressure
                ? `${health.bloodPressure.systolic}/${health.bloodPressure.diastolic} mmHg`
                : 'N/A'}
            </p>
          </div>
          <div className="text-sm text-slate-400 text-right">
            Last updated: {health?.lastUpdated ? new Date(health.lastUpdated).toLocaleString() : 'N/A'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main component to fetch and display health reports
export function CheckReport() {
  const [healthReports, setHealthReports] = useState<HealthData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealthReports = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/auth/health')
        if (!response.ok) {
          throw new Error('Failed to fetch health reports')
        }
        const data = await response.json()
        setHealthReports(data)
      } catch (err) {
        setError('Error fetching health reports. Please try again.')
        console.error('Error fetching health reports:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthReports()
  }, [])

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardContent className="p-0">
        <Tabs defaultValue="new" className="w-full">
          <div className="flex items-center justify-between p-6 pb-4">
            <h3 className="text-lg font-semibold text-white">Check report</h3>
            <TabsList className="bg-slate-900">
              <TabsTrigger value="new" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">New</TabsTrigger>
              <TabsTrigger value="earlier" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Earlier</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="new" className="p-6 pt-0">
            {isLoading && <p className="text-center text-slate-400">Loading health reports...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!isLoading && !error && healthReports.length === 0 && (
              <p className="text-center text-slate-400">No health reports available.</p>
            )}
            <div className="space-y-4">
              {healthReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{report.user.firstName} {report.user.lastName}</div>
                    <div className="text-sm text-slate-400">
                      Last updated: {report.health?.lastUpdated 
                        ? new Date(report.health.lastUpdated).toLocaleDateString() 
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <PatientHealthMonitor healthData={report} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="earlier" className="p-6 pt-0">
            <div className="text-center text-slate-400">No earlier reports available.</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
