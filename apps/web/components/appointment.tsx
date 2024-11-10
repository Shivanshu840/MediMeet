'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui/card"
import { Calendar } from "@repo/ui/calender"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"

export default function NewAppointment() {
    const router = useRouter()
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedDoctor, setSelectedDoctor] = useState("")
  
    const doctors = [
      { id: '1', name: 'Dr. Emilia Winson', specialty: 'Physiotherapy', image: '/placeholder.svg?height=48&width=48' },
      { id: '2', name: 'Dr. John Smith', specialty: 'Cardiology', image: '/placeholder.svg?height=48&width=48' },
      { id: '3', name: 'Dr. Sarah Johnson', specialty: 'Neurology', image: '/placeholder.svg?height=48&width=48' },
    ]
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault()
      router.push('/')
    }
  
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (date) {
        const [hours, minutes] = e.target.value.split(':').map(Number)
        if (hours && minutes) {
          const newDate = new Date(date)
          newDate.setHours(hours)
          newDate.setMinutes(minutes)
          setDate(newDate)
        }
      }
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 bg-emerald-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl font-bold">New Appointment</CardTitle>
            <CardDescription className="text-emerald-100">
              Schedule a new appointment with our specialists
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Appointment Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter reason for visit" 
                  className="w-full"
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                  <SelectTrigger id="doctor" className="w-full">
                    <SelectValue placeholder="Choose your specialist" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem 
                        key={doctor.id} 
                        value={doctor.id}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={doctor.image}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{doctor.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {doctor.specialty}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="datetime">Appointment Date and Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="datetime"
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP 'at' p") : <span>Pick a date and time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                    />
                    <div className="p-3 border-t">
                      <Label htmlFor="appt-time">Time</Label>
                      <div className="relative mt-2">
                        <Input
                          id="appt-time"
                          type="time"
                          className="w-full pl-10"
                          onChange={handleTimeChange}
                        />
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 justify-end bg-gray-50/50 p-6 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Book Appointment
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }