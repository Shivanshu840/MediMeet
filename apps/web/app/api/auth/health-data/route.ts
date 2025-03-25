import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../lib/action";
import prisma from "@repo/db/clients";

export async function GET() {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const data = await prisma.health.findFirst({
    where: {
      userId: userId,
    },
    select: {
      steps: true,
      heartRate: true,
      sleepTime: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ data: data });
}
