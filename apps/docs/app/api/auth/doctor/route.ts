import { NextResponse } from "next/server";
import prisma from "@repo/db/clients";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const doctor = await prisma.doctor.create({
      data: body,
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const doctors = await prisma.doctor.findMany();

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
