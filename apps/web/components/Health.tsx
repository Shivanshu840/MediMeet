'use client'

import { useState, useEffect } from 'react'
import { Card } from "@repo/ui/card"
import { Progress } from "@repo/ui/progress"
import { Input } from "@repo/ui/input"
import { Button } from "@repo/ui/button"
import { Heart, TreesIcon as Lungs, Thermometer, ArrowUpRight, TrendingDown, Wind, Moon } from 'lucide-react'

export default function HealthMonitor() {
  const [weight, setWeight] = useState(74.2)
  const [foodCalories, setFoodCalories] = useState(254)
  const [steps, setSteps] = useState(7425)
  const [heartRate, setHeartRate] = useState(124)
  const [bloodPressure, setBloodPressure] = useState({ systolic: 102, diastolic: 70 })
  const [temperature, setTemperature] = useState(37.1)
  const [airQuality, setAirQuality] = useState({ aqi: 0, status: 'Loading...' })
  const [location, setLocation] = useState('')
  const [sleepTime, setSleepTime] = useState(7.5)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (location) {
      fetchAirQuality(location)
    }
  }, [location])

  const fetchAirQuality = async (city: string) => {
    try {
      const response = await fetch(`https://api.waqi.info/feed/${city}/?token=YOUR_API_TOKEN`)
      const data = await response.json()
      if (data.status === 'ok') {
        setAirQuality({
          aqi: data.data.aqi,
          status: getAirQualityStatus(data.data.aqi)
        })
      } else {
        throw new Error('Failed to fetch air quality data')
      }
    } catch (error) {
      console.error('Error fetching air quality:', error)
      setAirQuality({ aqi: 0, status: 'Error fetching data' })
    }
  }

  const getAirQualityStatus = (aqi: number) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(parseFloat(e.target.value))
  }

  const handleBloodPressureChange = (type: 'systolic' | 'diastolic') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBloodPressure(prev => ({ ...prev, [type]: parseInt(e.target.value) }))
  }

  const HeartRateVisualizer = ({ rate }: { rate: number }) => {
    return (
      <div className="relative h-[200px] mt-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className={`h-32 w-32 text-red-500 transition-transform duration-200 ${rate > 100 ? 'scale-110' : 'scale-100'}`} />
        </div>
        <svg className="w-full h-full" viewBox="0 0 400 100">
          <path
            d={`M0,50 Q100,${50 - rate/2} 200,50 T400,${50 + rate/2}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-red-500"
          />
        </svg>
      </div>
    )
  }

  const getSleepStatus = (hours: number) => {
    return hours >= 8 ? { status: 'Good', emoji: '😊' } : { status: 'Insufficient', emoji: '😴' }
  }

  const updateAllHealthData = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/auth/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight,
          foodCalories,
          steps,
          heartRate,
          sleepTime,
          bloodPressure,
          temperature,
          airQuality,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update health data')
      }

      const result = await response.json()
      console.log('Health data updated successfully', result)
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000) // Hide popup after 3 seconds
    } catch (error) {
      console.error('Error updating health data:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800/90 to-emerald-900/40 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Weight Card */}
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400">Weight</h3>
                  <p className="text-2xl font-bold text-white">{weight.toFixed(1)}<span className="text-sm text-zinc-400 ml-1">kg</span></p>
                </div>
                <span className="flex items-center text-emerald-500 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Lost 0.4kg
                </span>
              </div>
              <Progress 
                value={74.2} 
                className="h-2 bg-zinc-800 dark:bg-zinc-700"
              />
              <Input
                type="number"
                value={weight}
                onChange={handleInputChange(setWeight)}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                step="0.1"
              />
            </div>
          </Card>

          {/* Food Card */}
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Food</h3>
              <p className="text-2xl font-bold text-white">{foodCalories}<span className="text-sm text-zinc-400 ml-1">/1,342 kCal</span></p>
              <Progress 
                value={(foodCalories / 1342) * 100} 
                className="h-2 bg-zinc-800 dark:bg-zinc-700"
              />
              <Input
                type="number"
                value={foodCalories}
                onChange={handleInputChange(setFoodCalories)}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </Card>

          {/* Steps Card */}
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-zinc-400">Daily Steps</h3>
                <p className="text-3xl font-bold text-white">{steps.toLocaleString()}</p>
                <p className="text-sm text-zinc-400">Goal: 10,000 Steps</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-zinc-800 dark:text-zinc-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-emerald-500"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - steps / 10000)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                  {Math.round((steps / 10000) * 100)}%
                </div>
              </div>
            </div>
            <Input
              type="number"
              value={steps}
              onChange={handleInputChange(setSteps)}
              className="mt-4 bg-zinc-800 border-zinc-700 text-white"
            />
          </Card>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Heart Rate Card */}
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800 col-span-1 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-400">Heart Rate</h3>
                <p className="text-2xl font-bold text-white">{heartRate} <span className="text-sm text-zinc-400">bpm</span></p>
              </div>
              <button className="text-zinc-400 hover:text-white">
                <ArrowUpRight className="h-5 w-5" />
              </button>
            </div>
            <HeartRateVisualizer rate={heartRate} />
            <Input
              type="number"
              value={heartRate}
              onChange={handleInputChange(setHeartRate)}
              className="mt-4 bg-zinc-800 border-zinc-700 text-white"
            />
          </Card>

          {/* Sleep Time Card */}
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Sleep Time</h3>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{sleepTime.toFixed(1)} <span className="text-sm text-zinc-400">hrs</span></p>
                <Moon className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-zinc-400">
                Status: {getSleepStatus(sleepTime).status} {getSleepStatus(sleepTime).emoji}
              </p>
              <Input
                type="number"
                value={sleepTime}
                onChange={handleInputChange(setSleepTime)}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                step="0.1"
              />
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="flex items-center justify-between">
              <Heart className="h-8 w-8 text-red-500" />
              <ArrowUpRight className="h-5 w-5 text-zinc-400" />
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="flex items-center justify-between">
              <Lungs className="h-8 w-8 text-blue-400" />
              <ArrowUpRight className="h-5 w-5 text-zinc-400" />
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Blood Status</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{bloodPressure.systolic}</p>
                <span className="text-zinc-400 ml-1">/{bloodPressure.diastolic}</span>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={bloodPressure.systolic}
                  onChange={handleBloodPressureChange('systolic')}
                  className="w-1/2 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Systolic"
                />
                <Input
                  type="number"
                  value={bloodPressure.diastolic}
                  onChange={handleBloodPressureChange('diastolic')}
                  className="w-1/2 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Diastolic"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Temperature</h3>
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-zinc-400 mr-2" />
                <p className="text-2xl font-bold text-white">{temperature.toFixed(1)}°</p>
              </div>
              <Input
                type="number"
                value={temperature}
                onChange={handleInputChange(setTemperature)}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                step="0.1"
              />
            </div>
          </Card>

          <Card className="p-6 bg-zinc-900/80 backdrop-blur-sm border-zinc-800">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-zinc-400">Air Quality</h3>
              <div className="flex items-center">
                <Wind className="h-5 w-5 text-zinc-400 mr-2" />
                <p className="text-2xl font-bold text-white">{airQuality.aqi}</p>
              </div>
              <p className="text-sm text-zinc-400">{airQuality.status}</p>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                placeholder="Enter city for air quality"
              />
              <Button 
                onClick={() => fetchAirQuality(location)}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Fetch Air Quality
              </Button>
            </div>
          </Card>
        </div>

        {/* Update All Data Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={updateAllHealthData}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-200"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update All Health Data'}
          </Button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg">
            Health data updated successfully
          </div>
        </div>
      )}
    </div>
  )
}