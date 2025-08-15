import { NextResponse } from 'next/server';
import prisma from '@repo/db/clients';
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`; 
    return NextResponse.json({ status: 'Database is awake' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
