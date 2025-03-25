// Define the structure of your bloodPressure JSON field
export interface BloodPressure {
    systolic: number
    diastolic: number
  }
  
  // Define the structure of your airQuality JSON field
  export interface AirQuality {
    // Add appropriate properties based on your data structure
    aqi?: number
    pollutants?: {
      pm25?: number
      pm10?: number
      // other pollutants
    }
  }
  
  // Define the full Health type with proper typing for JSON fields
  export interface HealthData {
    id: string
    userId: string
    weight?: number | null
    foodCalories?: number | null
    steps?: number | null
    heartRate?: number | null
    sleepTime?: number | null
    bloodPressure?: BloodPressure | null
    temperature?: number | null
    airQuality?: AirQuality | null
    lastUpdated: Date
    createdAt: Date
    updatedAt: Date
    datedAt: Date
  }
  
  // Helper function to ensure we're passing a plain object to Prisma
  export function toJsonValue<T>(data: T): T {
    return JSON.parse(JSON.stringify(data))
  }
  
  