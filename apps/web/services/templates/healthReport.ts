import { EmailData } from "../emailTypes";

export const healthReportEmail = ({ name, reportUrl }: EmailData) => ({
  subject: "📊 Your Latest Health Report",
  body: `<h1>Hi ${name},</h1>
         <p>Your latest health report is now available.</p>
         <p>Click <a href="${reportUrl}">here</a> to view your report.</p>`,
});
