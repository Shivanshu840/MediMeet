import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOption } from "../../../lib/action";

export async function GET() {
  const session = await getServerSession(authOption);

  return NextResponse.json({
    session,
  });
}
