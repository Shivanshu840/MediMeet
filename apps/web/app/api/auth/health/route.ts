import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOption } from '../../../lib/action'
import prisma from '@repo/db/clients'

export async function GET(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const healthData = await prisma.health.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!healthData) {
      return NextResponse.json({ error: 'Health data not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Health data retrieved successfully', data: healthData });
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      weight,
      foodCalories,
      steps,
      heartRate,
      sleepTime,
      bloodPressure,
      temperature,
      airQuality
    } = await req.json();

    const updatedHealth = await prisma.health.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        weight,
        foodCalories,
        steps,
        heartRate,
        sleepTime,
        bloodPressure,
        temperature,
        airQuality,
        lastUpdated: new Date(),
      },
      create: {
        userId: session.user.id,
        weight,
        foodCalories,
        steps,
        heartRate,
        sleepTime,
        bloodPressure,
        temperature,
        airQuality,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({ message: 'Health data updated successfully', data: updatedHealth });
  } catch (error) {
    console.error('Error updating health data:', error);
    return NextResponse.json({ error: 'Failed to update health data' }, { status: 500 });
  }
}