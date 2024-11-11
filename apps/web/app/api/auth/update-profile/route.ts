import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from "@repo/db/clients"
import { authOption } from '../../../lib/action'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName, phone, address, gender, dob, image } = await req.json()

    console.log('Updating user with data:', { firstName, lastName, phone, address, gender, dob, image })

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        address: address || null,
        gender: gender || null,
        dob: dob || null,
        image: image || null,
      },
    })

    console.log('Updated user in database:', updatedUser)

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOption)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Retrieved user from database:', user)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}