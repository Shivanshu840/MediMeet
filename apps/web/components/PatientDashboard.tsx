'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  Menu
} from "lucide-react"
import doc12 from '../public/doc13.png'
import hosital from '../public/hospital.jpg'
import { signOut } from 'next-auth/react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/dialog"

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  gender?: string | null
  birthday?: string | null
  phone?: string | null
  address?: string | null
}

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeView, setActiveView] = useState('monthly')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

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
    router.push('/signin')
  }

  const monthlyData = [
    { month: 'Jul', value: 40 },
    { month: 'Aug', value: 65 },
    { month: 'Sep', value: 85 },
    { month: 'Oct', value: 55 },
    { month: 'Nov', value: 75 },
    { month: 'Dec', value: 90 },
  ]

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Left Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-zinc-900 flex flex-col items-center py-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-16`}>
        <Button variant="ghost" size="icon" className="text-emerald-500" onClick={() => router.push('/appointment')}>
          <Plus className="h-6 w-6" />
        </Button>
        <div className="space-y-4 flex-1 mt-8">
          <Button variant="ghost" size="icon" className="text-white w-full" onClick={() => router.push("/home")}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Dashboard</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 w-full" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 w-full" onClick={() => router.push("./totalapp")}>
            <Calendar className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Calendar</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 w-full">
            <Heart className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Health</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 w-full" onClick={() => router.push("/profile")}>
            <Settings className="h-5 w-5" />
            <span className="ml-2 lg:hidden">Settings</span>
          </Button>
        </div>
        <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-400 mt-auto mb-4 w-full" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="ml-2 lg:hidden">Logout</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Logout</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Are you sure you want to log out? You will be redirected to the sign-in page.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLogoutConfirmation(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancel
              </Button>
              <Button variant="default" onClick={confirmLogout} className="bg-red-500 hover:bg-red-600 text-white">
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="lg:pl-16 flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="w-full lg:w-80 bg-emerald-50/50 p-6 border-r border-emerald-100">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-200 overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
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
              <p className="text-sm text-zinc-600">
                Check your every situation and your activities
              </p>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
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
                <h1 className="text-2xl font-bold">Hi, {user.name || 'Patient'}</h1>
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
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upcoming appointment</h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                    <Image
                      src={hosital}
                      alt="Hospital"
                      width={300}
                      height={200}
                      className="w-full outline-none shadow-lg shadow-gray-400 border-none sm:w-32 h-24 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">Manggis ST Hospital</h4>
                      <p className="text-sm text-zinc-600">New York, USA</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={doc12}
                    alt="Doctor"
                    width={60}
                    height={60}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">Dr. Emilia Winson</p>
                    <p className="text-sm text-zinc-600">Physiotherapy</p>
                  </div>
                  <Button className="ml-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200" onClick={() => {router.push("/reciever")}}>
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Video call
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  28 Nov 2024
                </div>
                <div>09:00 pm</div>
              </div>
            </Card>

            {/* Patient Activities */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Patient activities</h3>
                  <select className="bg-transparent border-0 text-sm text-zinc-600 focus:ring-0">
                    <option>Month</option>
                    <option>Week</option>
                    <option>Day</option>
                  </select>
                </div>
                
                {/* Bar Chart */}
                <div className="h-48 flex items-end gap-4" role="graphics-document" aria-label="Monthly activity chart">
                  {monthlyData.map((data, index) => (
                    <div key={`${data.month}-${index}`} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-100 to-emerald-300 rounded-full transition-all duration-300 group-hover:to-emerald-400"
                          style={{ height: `${data.value}%` }}
                        >
                          <span className="sr-only">{data.value}% activity in {data.month}</span>
                        </div>
                      </div>
                      <span className="text-sm text-zinc-600">{data.month}</span>
                    </div>
                  ))}
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

              {/* Daily Progress Card */}
              <Card className="p-6 bg-emerald-50">
                <h3 className="text-lg font-semibold mb-2">Daily progress</h3>
                <p className="text-sm text-zinc-600 mb-6">
                  Keep improving the quality of your health
                </p>
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
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-80 p-6 border-t lg:border-l lg:border-t-0 border-emerald-100">
          <div className="flex gap-2 mb-6">
            <Button
              variant="ghost"
              className={`flex-1 ${
                activeView === 'monthly'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'hover:bg-emerald-50 hover:text-emerald-600'
              }`}
              onClick={() => setActiveView('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 ${
                activeView === 'daily'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'hover:bg-emerald-50 hover:text-emerald-600'
              }`}
              onClick={() => setActiveView('daily')}
            >
              Daily
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-zinc-600 font-medium">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const isToday = day === new Date().getDate() && 
                                currentDate.getMonth() === new Date().getMonth() && 
                                currentDate.getFullYear() === new Date().getFullYear()
                return (
                  <Button
                    key={day}
                    variant="ghost"
                    className={`h-8 w-8 p-0 ${isToday ? 'bg-emerald-100 text-emerald-700' : ''}`}
                  >
                    {day}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Heart className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Manage stress</h4>
                <p className="text-sm text-zinc-600">10:00pm - 12:00 pm</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <VideoIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Physiotherapy</h4>
                <p className="text-sm text-zinc-600">09:00am - 10:00 am</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-400" />
            </div>
            <Button variant="link" className="w-full text-emerald-600">
              See More Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}