import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../lib/action";
import prisma from "@repo/db/clients";
import NewAppointmentForm from "../../../components/appointment";

export default async function NewAppointmentPage() {
  const session = await getServerSession(authOption);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      spiciality: true,
      image: true,
    },
  });

  async function createAppointment(formData: FormData) {
    "use server";

    const session = await getServerSession(authOption);
    if (!session?.user?.email) {
      throw new Error("You must be logged in to create an appointment");
    }

    const title = formData.get("title") as string;
    const doctorId = formData.get("doctorId") as string;
    const dateTime = formData.get("dateTime") as string;

    if (!title || !doctorId || !dateTime) {
      throw new Error("Missing required fields");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.appointment.create({
      data: {
        title,
        dateTime: new Date(dateTime),
        userId: user.id,
        doctorId,
      },
    });

    redirect("/appointment");
  }

  return (
    <NewAppointmentForm
      doctors={doctors}
      createAppointment={createAppointment}
    />
  );
}
