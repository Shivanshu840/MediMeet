import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptionDoctor } from '../../../../lib/authoption'
import prisma from '@repo/db/clients'

export async function GET() {
  try {
    const session = await getServerSession(authOptionDoctor)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { email: session.user.email },
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error('Error fetching doctor profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptionDoctor)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const updatedDoctor = await prisma.doctor.update({
      where: { email: session.user.email },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        spiciality: data.spiciality,
        experience: data.experience,
        education: data.education,
        fee: data.fee,
        address: data.address,
        about: data.about,
        image: data.image,
      },
    })

    return NextResponse.json({ doctor: updatedDoctor })
  } catch (error) {
    console.error('Error updating doctor profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}