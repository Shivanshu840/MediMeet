import { NextResponse } from "next/server";
import prisma from "@repo/db/clients";
import { getServerSession } from "next-auth/next";
import { authOptionDoctor } from "../../../lib/authoption";

export async function GET(request: Request) {
  const session = await getServerSession(authOptionDoctor);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctorId = session.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
