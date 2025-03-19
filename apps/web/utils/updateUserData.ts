import prisma from "@repo/db/clients";

export async function updateUserCurrentData(userId: string, data: Partial<{ 
  apiHit?: boolean;
  formSubmission?: boolean;
  whatsappMessage?: boolean;
  emailResponse?: boolean;
  smsResponse?: boolean;
  appointmentBooking?: boolean;
}>) {
  if (!userId) return;

  try {
    await prisma.userCurrentData.upsert({
      where: { userId },
      update: {
        totalApiHits: data.apiHit ? { increment: 1 } : undefined,
        formSubmissions: data.formSubmission ? { increment: 1 } : undefined,
        whatsappMessages: data.whatsappMessage ? { increment: 1 } : undefined,
        emailResponses: data.emailResponse ? { increment: 1 } : undefined,
        smsResponses: data.smsResponse ? { increment: 1 } : undefined,
        appointmentBookings: data.appointmentBooking ? { increment: 1 } : undefined,
        lastActive: new Date(), // Always update last active time
      },
      create: {
        userId,
        totalApiHits: data.apiHit ? 1 : 0,
        formSubmissions: data.formSubmission ? 1 : 0,
        whatsappMessages: data.whatsappMessage ? 1 : 0,
        emailResponses: data.emailResponse ? 1 : 0,
        smsResponses: data.smsResponse ? 1 : 0,
        appointmentBookings: data.appointmentBooking ? 1 : 0,
        lastActive: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating userCurrentData:", error);
  }
}
