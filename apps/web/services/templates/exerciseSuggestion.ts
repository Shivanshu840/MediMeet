import { EmailData } from "../emailTypes";

export const exerciseSuggestionEmail = ({ name, exercisePlan }: EmailData) => ({
  subject: "🏋️ Your Personalized Exercise Suggestions",
  body: `<h1>Hi ${name},</h1>
         <p>Based on your health data, here are some exercise suggestions:</p>
         <p>${exercisePlan}</p>`,
});
