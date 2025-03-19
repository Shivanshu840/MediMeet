"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/card"
import { Button } from "@repo/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Sparkles, AlertTriangle, CheckCircle, Info, ArrowRight, RefreshCw, Clock } from "lucide-react"

interface HealthMetric {
  status: "normal" | "low" | "high"
  suggestion: string
}

interface HealthAnalysis {
  overall?: string
  metrics?: {
    weight: HealthMetric
    foodCalories: HealthMetric
    steps: HealthMetric
    heartRate: HealthMetric
    sleepTime: HealthMetric
    bloodPressure: HealthMetric
  }
  suggestions?: string[]
  suggestion?: string
  processing?: boolean
  error?: string
}

interface HealthSuggestion {
  id: string
  content: string
  createdAt: string
}

export default function HealthAIInsights() {
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null)
  const [suggestions, setSuggestions] = useState<HealthSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [pollingCount, setPollingCount] = useState(0)

  useEffect(() => {
    fetchHealthInsights()
  }, [])

  // Poll for updates if analysis is processing
  useEffect(() => {
    if (analysis?.processing && pollingCount < 3) {
      const timer = setTimeout(() => {
        fetchHealthInsights()
        setPollingCount((prev) => prev + 1)
      }, 5000) // Poll every 5 seconds, up to 3 times

      return () => clearTimeout(timer)
    }
  }, [analysis, pollingCount])

  const fetchHealthInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/health-ai")
      if (!response.ok) {
        throw new Error("Failed to fetch health insights")
      }
      const data = await response.json()

      // If we have suggestions from the database, use those
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
      } else {
        setSuggestions([])
      }

      // If we have analysis data, use it
      if (data.analysis) {
        setAnalysis(data.analysis)
      } else {
        // Create a simple analysis object from the latest suggestion if available
        if (data.suggestions && data.suggestions.length > 0) {
          setAnalysis({
            suggestion: data.suggestions[0].content,
          })
        } else {
          setAnalysis(null)
        }
      }
    } catch (err) {
      setError("Error fetching health insights. Please try again later.")
      console.error("Error fetching health insights:", err)
      setSuggestions([])
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalysis = async () => {
    setRefreshing(true)
    setPollingCount(0) // Reset polling count
    try {
      const response = await fetch("/api/auth/health-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // This will use the latest health data from the database
      })

      if (!response.ok) {
        throw new Error("Failed to refresh health analysis")
      }

      const data = await response.json()
      if (data.analysis) {
        setAnalysis(data.analysis)

        // If analysis is still processing, we'll start polling
        if (data.analysis.processing) {
          // First poll will happen after 5 seconds via the useEffect
        }
      }

      // Fetch updated suggestions
      await fetchHealthInsights()
    } catch (err) {
      setError("Error refreshing health analysis. Please try again later.")
      console.error("Error refreshing health analysis:", err)
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-emerald-100 text-emerald-800"
      case "low":
        return "bg-amber-100 text-amber-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "low":
        return <Info className="h-4 w-4 text-amber-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-zinc-500" />
    }
  }

  if (loading) {
    return (
      <Card className="w-full bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            AI Health Insights
          </CardTitle>
          <CardDescription className="text-zinc-400">Analyzing your health data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchHealthInsights} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-white">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-500" />
            AI Health Insights
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAnalysis}
            disabled={refreshing}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <CardDescription className="text-zinc-400">
          Personalized health recommendations based on your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 bg-zinc-800">
            <TabsTrigger value="overview" className="text-zinc-300 data-[state=active]:bg-zinc-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-zinc-300 data-[state=active]:bg-zinc-700">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {analysis?.processing ? (
              <div className="space-y-4">
                <Alert className="bg-zinc-800 border-zinc-700">
                  <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                  <AlertTitle className="text-white">Analysis in Progress</AlertTitle>
                  <AlertDescription className="text-zinc-300">
                    {analysis.suggestion ||
                      "Your health data is being analyzed. Check back in a moment for personalized insights."}
                  </AlertDescription>
                </Alert>

                {suggestions.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Previous Insights</h3>
                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardContent className="py-3 text-zinc-300 text-sm">{suggestions[0].content}</CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : analysis?.suggestion ? (
              <div className="space-y-4">
                <Alert className="bg-zinc-800 border-zinc-700">
                  <Info className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-white">Health Insight</AlertTitle>
                  <AlertDescription className="text-zinc-300">{analysis.suggestion}</AlertDescription>
                </Alert>

                {suggestions.length > 1 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-zinc-400 mb-2">Previous Insights</h3>
                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardContent className="py-3 text-zinc-300 text-sm">{suggestions[1].content}</CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                <Alert className="bg-zinc-800 border-zinc-700">
                  <Info className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-white">Latest Health Insight</AlertTitle>
                  <AlertDescription className="text-zinc-300">{suggestions[0].content}</AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">
                  No health insights available yet. Click refresh to generate new insights.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions">
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-500 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-zinc-300">{suggestion.content}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(suggestion.createdAt).toLocaleDateString()} at{" "}
                          {new Date(suggestion.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">No suggestions available yet. Click refresh to generate new insights.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => (window.location.href = "/health")}
        >
          View Full Health Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

