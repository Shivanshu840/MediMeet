import { NextResponse } from 'next/server'
import prisma from "@repo/db/clients"
import { getServerSession } from "next-auth/next"
import { authOptionDoctor } from '../../../lib/authoption'

export async function GET(request: Request) {
  const session = await getServerSession(authOptionDoctor)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const doctorId = session.user.id

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        dateTime: {
          gte: today,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        dateTime: 'asc',
      },
    })

    const appointmentsWithHealth = await Promise.all(
      appointments.map(async (appointment:any) => {
        const health = await prisma.health.findUnique({
          where: {
            userId: appointment.user.id
          },
          select: {
            weight: true,
            foodCalories: true,
            steps: true,
            heartRate: true,
            sleepTime: true,
            bloodPressure: true,
            temperature: true,
            airQuality: true,
            lastUpdated: true,
          }
        })

        return {
          ...appointment,
          health
        }
      })
    )

    return NextResponse.json(appointmentsWithHealth)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}