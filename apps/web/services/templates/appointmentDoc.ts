import { EmailData } from "../emailTypes";

export const appointmentdoc = ({ name}: EmailData) => ({
  subject: "🏋️ You have a new  appointment shedule",
  body: `<h1>Hi ${name},</h1>
         <p>you have a new point for the paitnet:</p>
         <p></p>`,
});
