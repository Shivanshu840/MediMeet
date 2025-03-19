import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOption } from "../../../../../lib/action"
import prisma from "@repo/db/clients"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOption)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    // Find the suggestion first to verify it belongs to the user
    const suggestion = await prisma.healthSuggestion.findUnique({
      where: {
        id,
      },
    })

    if (!suggestion) {
      return NextResponse.json({ error: "Suggestion not found" }, { status: 404 })
    }

    if (suggestion.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the suggestion to mark it as read
    const updatedSuggestion = await prisma.healthSuggestion.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    })

    return NextResponse.json({
      message: "Suggestion marked as read",
      suggestion: updatedSuggestion,
    })
  } catch (error) {
    console.error("Error marking suggestion as read:", error)
    return NextResponse.json({ error: "Failed to mark suggestion as read" }, { status: 500 })
  }
}

