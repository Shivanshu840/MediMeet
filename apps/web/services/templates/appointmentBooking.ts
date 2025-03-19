import { EmailData } from "../emailTypes";

export const appointment = ({ name}: EmailData) => ({
  subject: "🏋️ Your Personalized Exercise Suggestions",
  body: `<h1>Hi ${name},</h1>
         <p>Based on your health data, here are some exercise suggestions:</p>
         <p></p>`,
});
