"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@repo/ui/button"
import { Card, CardContent } from "@repo/ui/card"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import { useRouter } from "next/navigation"

type Appointment = {
  id: string
  title: string
  dateTime: string
  user: {
    firstName: string | null
    lastName: string | null
  }
}

export default function VirtualVisit() {
  const { data: session, status } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60) 

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()

    const days = Array(firstDay - 1).fill(null)
    for (let i = 1; i <= lastDate; i++) {
      days.push(i)
    }
    setCalendarDays(days)
  }, [currentDate])

  useEffect(() => {
    async function fetchAppointments() {
      if (status !== "authenticated") return

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/auth/appointment')
        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
        const data = await response.json()
        setAppointments(data)
      } catch (err) {
        setError('Error fetching appointments. Please try again later.')
        console.error('Error fetching appointments:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [status])

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const isAppointmentNow = (appointmentTime: string) => {
    const now = new Date()
    const appTime = new Date(appointmentTime)
    return Math.abs(now.getTime() - appTime.getTime()) <= 5 * 60 * 1000 // Within 5 minutes
  }

  const getTimeLeft = (appointmentTime: string) => {
    const now = new Date()
    const appTime = new Date(appointmentTime)
    const diff = appTime.getTime() - now.getTime()

    if (diff <= 0) return "Appointment is now"

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Access Denied</div>
  }

  return (
    <Card className="col-span-2 bg-slate-950 border-slate-800">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">Virtual visit</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-slate-400">{day}</div>
              ))}
              {calendarDays.map((day, i) => (
                <Button
                  key={i}
                  variant={day === currentDate.getDate() ? "default" : "ghost"}
                  className={`h-8 w-8 p-0 ${
                    day === currentDate.getDate() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  disabled={day === null}
                >
                  {day !== null ? day : ''}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">My queue</h3>
              <div className="space-x-2 text-sm">
                <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0">My queue</Button>
                <Button variant="link" className="text-slate-400 hover:text-slate-300 p-0">Sent request</Button>
              </div>
            </div>
            {isLoading ? (
              <p className="text-slate-400">Loading appointments...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-400">
                    <th className="pb-2">DATE & TIME</th>
                    <th className="pb-2">NAME</th>
                    <th className="pb-2">TYPE</th>
                    <th className="pb-2">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-t border-slate-800">
                      <td className="py-2 text-slate-300">
                        {new Date(appointment.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2 text-slate-300">
                        {`${appointment.user.firstName} ${appointment.user.lastName}`}
                      </td>
                      <td className="py-2 text-slate-300">{appointment.title}</td>
                      <td className="py-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className={`h-6 px-2 ${
                                isAppointmentNow(appointment.dateTime)
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                              disabled={!isAppointmentNow(appointment.dateTime)}
                              onClick={() => router.push("/sender")}
                            >
                              Launch
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border-slate-800">
                            <DialogHeader>
                              <DialogTitle className="text-white">Appointment Status</DialogTitle>
                              <DialogDescription className="text-slate-300">
                                {getTimeLeft(appointment.dateTime)}
                              </DialogDescription>
                            </DialogHeader>
                            {isAppointmentNow(appointment.dateTime) && (
                              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                                Join Video Call
                              </Button>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}