import { getServerSession } from "next-auth/next";
import { authOption } from "../../lib/action";
import { redirect } from "next/navigation";
import Dashboard from "../../../components/dashboard";
import prisma from "@repo/db/clients";
import { Session } from "next-auth";

export default async function DashboardPage() {
  const session: Session | null = await getServerSession(authOption);

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const user = session.user;

  const healthData = await prisma.health.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <>
      <Dashboard user={user}  />
    </>
  );
}
