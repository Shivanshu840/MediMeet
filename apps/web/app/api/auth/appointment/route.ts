import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../lib/action";
import prisma from "@repo/db/clients";

export async function GET(request: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        dateTime: {
          gte: new Date(),
        },
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            spiciality: true,
            image: true,
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
