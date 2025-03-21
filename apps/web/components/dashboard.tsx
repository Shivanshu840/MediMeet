"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { Progress } from "@repo/ui/progress"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  User2,
  VideoIcon,
  Bell,
  X,
  Menu,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { signOut } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import HealthSuggestionCard from "./health-suggestion-card"
import PatientActivityChart from "./patient-activity-chart"
import LeftBar from "./sidebar"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  gender?: string | null
  birthday?: string | null
  phone?: string | null
  address?: string | null
  id?: string | null
}

interface Appointment {
  id: string
  title: string
  dateTime: string
  doctor: {
    firstName: string
    lastName: string
    spiciality: string
    image: string
  }
}

interface HealthData {
  weight: number
  foodCalories: number
  steps: number
  heartRate: number
  sleepTime: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  temperature: number
  airQuality: {
    aqi: number
    status: string
  }
}

interface DashboardProps {
  user: User
  healthData?: HealthData
}

export default function Dashboard({ user, healthData }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeView, setActiveView] = useState("monthly")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHealthSuggestion, setShowHealthSuggestion] = useState(true)
  const router = useRouter()

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleLogout = async () => {
    setShowLogoutConfirmation(true)
  }

  const confirmLogout = async () => {
    await signOut({ redirect: false })
    router.push("/signin")
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const isAppointmentActive = (appointmentTime: string) => {
    const now = new Date()
    const appTime = new Date(appointmentTime)
    const timeDifference = now.getTime() - appTime.getTime()
    return timeDifference >= 0 && timeDifference <= 90 * 60 * 1000 // 1 hour and 30 minutes
  }

  const isAppointmentStartingSoon = (appointmentTime: string) => {
    const now = new Date()
    const appTime = new Date(appointmentTime)
    const timeDifference = appTime.getTime() - now.getTime()
    return timeDifference > 0 && timeDifference <= 2 * 60 * 1000 // 2 minutes before start
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function fetchAppointments() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/auth/appointment")
        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }
        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        setError("Error fetching appointments. Please try again later.")
        console.error("Error fetching appointments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Mobile Sidebar Toggle */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleSidebar}>
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      {/* Main Content */}
      <div className="lg:pl-16 flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="w-full lg:w-80 bg-emerald-50/50 p-6 border-r border-emerald-100">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-200 overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-full h-full p-2 text-emerald-600" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-zinc-600">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Check your condition</h3>
              <p className="text-sm text-zinc-600">Check your every situation and your activities</p>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => router.push("/health")}
              >
                Check it Now
              </Button>
            </div>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Hi, {user.name || "Patient"}</h1>
                <p className="text-zinc-600">Let's track your health daily!</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">
                    2
                  </div>
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Upcoming Appointment */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Upcoming appointment</h3>
              {isLoading ? (
                <p>Loading appointments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : appointments.length === 0 ? (
                <p>No upcoming appointments</p>
              ) : (
                <div>
                  {appointments.slice(0, 1).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Image
                          src={appointment.doctor.image || "/placeholder-doctor.jpg"}
                          alt="Doctor"
                          width={60}
                          height={60}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </p>
                          <p className="text-sm text-zinc-600">{appointment.doctor.spiciality}</p>
                        </div>
                      </div>
                      <div>
                        <Button
                          className={
                            isAppointmentActive(appointment.dateTime)
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : isAppointmentStartingSoon(appointment.dateTime)
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }
                          onClick={() => {
                            if (isAppointmentActive(appointment.dateTime)) {
                              router.push("/reciever")
                            }
                          }}
                          disabled={
                            !isAppointmentActive(appointment.dateTime) &&
                            !isAppointmentStartingSoon(appointment.dateTime)
                          }
                        >
                          <VideoIcon className="h-4 w-4 mr-2" />
                          {isAppointmentActive(appointment.dateTime)
                            ? "Join Video..."
                            : isAppointmentStartingSoon(appointment.dateTime)
                              ? "Starting Soon"
                              : "Wait for Appointment"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 text-sm text-zinc-600 mt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {appointments[0] && new Date(appointments[0].dateTime).toLocaleDateString()}
                    </div>
                    <div>
                      {appointments[0] &&
                        new Date(appointments[0].dateTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Patient Activities */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <PatientActivityChart
                healthData={[
                  { date: "Mon", heartRate: 72, steps: 5200, sleepHours: 7.2 },
                  { date: "Tue", heartRate: 75, steps: 6800, sleepHours: 6.8 },
                  { date: "Wed", heartRate: 70, steps: 7500, sleepHours: 7.5 },
                  { date: "Thu", heartRate: 74, steps: 9200, sleepHours: 8.1 },
                  { date: "Fri", heartRate: 78, steps: 8400, sleepHours: 7.0 },
                  { date: "Sat", heartRate: 68, steps: 10500, sleepHours: 8.5 },
                  { date: "Sun", heartRate: 65, steps: 4800, sleepHours: 9.2 },
                ]}
              />

              {/* Daily Progress Card */}
              <Card className="p-6 bg-emerald-50">
                <h3 className="text-lg font-semibold mb-2">Daily progress</h3>
                <p className="text-sm text-zinc-600 mb-6">Keep improving the quality of your health</p>
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">80%</span>
                  </div>
                  <Progress
                    value={80}
                    className="h-32 w-32 rounded-full [&>div]:bg-emerald-500 [&>div]:transition-all [&>div]:duration-500"
                  />
                </div>
              </Card>
            </div>

            {/* AI Health Insights Card */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold">AI Health Insights</h3>
              </div>
              <p className="text-zinc-600 mb-4">Get personalized health recommendations based on your data</p>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => router.push("/health")}
              >
                View Health Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-80 p-6 border-t lg:border-l lg:border-t-0 border-emerald-100">
          <div className="flex gap-2 mb-6">
            <Button
              variant="ghost"
              className={
                activeView === "monthly"
                  ? "flex-1 bg-emerald-100 text-emerald-700"
                  : "flex-1 hover:bg-emerald-50 hover:text-emerald-600"
              }
              onClick={() => setActiveView("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant="ghost"
              className={
                activeView === "daily"
                  ? "flex-1 bg-emerald-100 text-emerald-700"
                  : "flex-1 hover:bg-emerald-50 hover:text-emerald-600"
              }
              onClick={() => setActiveView("daily")}
            >
              Daily
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-zinc-600 font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                return (
                  <Button
                    key={day}
                    variant="ghost"
                    className={`h-8 w-8 p-0 ${isToday ? "bg-emerald-100 text-emerald-700" : ""}`}
                  >
                    {day}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold mb-2">Other Appointments</h3>
            {isLoading ? (
              <p>Loading appointments...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : appointments.length <= 1 ? (
              <p>No other appointments</p>
            ) : (
              appointments.slice(1).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      isAppointmentStartingSoon(appointment.dateTime) ? "bg-emerald-100" : "bg-blue-100"
                    } flex items-center justify-center`}
                  >
                    <VideoIcon
                      className={`h-5 w-5 ${
                        isAppointmentStartingSoon(appointment.dateTime) ? "text-emerald-500" : "text-blue-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <p className="text-sm text-zinc-600">
                      {new Date(appointment.dateTime).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {isAppointmentStartingSoon(appointment.dateTime) ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700"
                      onClick={() => router.push("/reciever")}
                    >
                      Join
                    </Button>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-zinc-400" />
                  )}
                </div>
              ))
            )}
            <Button variant="link" className="w-full text-emerald-600" onClick={() => router.push("/totalapp")}>
              See More Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Health Suggestion Card */}
      {showHealthSuggestion && (
        <div className="fixed bottom-6 right-6 w-80 z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-zinc-800 text-white z-10"
              onClick={() => setShowHealthSuggestion(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            <HealthSuggestionCard />
          </div>
        </div>
      )}
    </div>
  )
}

