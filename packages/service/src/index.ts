import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient();

async function updateLeads() {
  try {
    // Fetch all UserCurrentData
    const userDataList = await prisma.userCurrentData.findMany();

    for (const userData of userDataList) {
      const score =
        (userData.totalApiHits || 0) * 1 +
        (userData.formSubmissions || 0) * 5 +
        (userData.whatsappMessages || 0) * 3 +
        (userData.emailResponses || 0) * 2 +
        (userData.smsResponses || 0) * 2 +
        (userData.appointmentBookings || 0) * 10;

      // Update Lead table
      await prisma.lead.upsert({
        where: { userId: userData.userId },
        update: { score },
        create: {
          userId: userData.userId,
          score,
        },
      });
    }

    console.log("Lead table updated successfully.");
  } catch (error) {
    console.error("Error updating leads:", error);
  }
}


setInterval(async()=>{
    updateLeads();
},10000);
