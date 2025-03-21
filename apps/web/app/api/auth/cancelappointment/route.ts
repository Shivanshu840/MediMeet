import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOption } from '../../../lib/action'
import prisma from "@repo/db/clients"

export async function POST(request: Request) {
  const session = await getServerSession(authOption)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    const { appointmentId } = await request.json()

    if (!appointmentId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        userId: userId,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found or does not belong to the user' }, { status: 404 })
    }

    // Check if the appointment is in the future
    if (new Date(appointment.dateTime) <= new Date()) {
      return NextResponse.json({ error: 'Cannot cancel past appointments' }, { status: 400 })
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    })

    return NextResponse.json({ message: 'Appointment successfully canceled and removed' })
  } catch (error) {
    console.error('Error canceling appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}