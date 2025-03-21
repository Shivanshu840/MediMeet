import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from "@repo/db/clients"
import { authOption } from '../../../lib/action'

export async function GET(req: NextRequest) {
  try {
    console.log('GET request received')
    const session = await getServerSession(authOption)
    console.log('Session:', JSON.stringify(session, null, 2))

    if (!session || !session.user) {
      console.log('Unauthorized: No session or user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching user with ID:', session.user.id)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      console.log('User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Retrieved user from database:', JSON.stringify(user, null, 2))
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Error in GET route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST request received')
    const session = await getServerSession(authOption)
    console.log('Session:', JSON.stringify(session, null, 2))

    if (!session || !session.user) {
      console.log('Unauthorized: No session or user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName, phone, address, gender, dob, image } = await req.json()
    console.log('Updating user with data:', { firstName, lastName, phone, address, gender, dob, image })

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(gender !== undefined && { gender }),
        ...(dob !== undefined && { dob }),
        ...(image !== undefined && { image }),
      },
    })

    console.log('Updated user in database:', JSON.stringify(updatedUser, null, 2))
    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser
    }, { status: 200 })
  } catch (error) {
    console.error('Error in POST route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}