import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../lib/action";
import prisma from "@repo/db/clients";

export async function GET(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's health suggestions
    const suggestions = await prisma.healthSuggestion.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json({
      message: "Health suggestions retrieved successfully",
      suggestions: suggestions || [],
    });
  } catch (error) {
    console.error("Error fetching health suggestions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch health suggestions",
        suggestions: [],
      },
      { status: 200 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Suggestion content is required" },
        { status: 400 },
      );
    }

    // Create a new health suggestion
    const suggestion = await prisma.healthSuggestion.create({
      data: {
        userId: session.user.id,
        content,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Health suggestion created successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Error creating health suggestion:", error);
    return NextResponse.json(
      { error: "Failed to create health suggestion" },
      { status: 500 },
    );
  }
}
