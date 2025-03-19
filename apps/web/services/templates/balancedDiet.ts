import { EmailData } from "../emailTypes";

export const balancedDietEmail = ({ name, dietPlan }: EmailData) => ({
  subject: "🥗 Your Balanced Diet Plan",
  body: `<h1>Hi ${name},</h1>
         <p>Here’s a personalized balanced diet plan for you:</p>
         <p>${dietPlan}</p>`,
});
