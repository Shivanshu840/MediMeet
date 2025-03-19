import { EmailData } from "../emailTypes";

export const welcomeEmail = ({ name }: EmailData) => ({
  subject: "🎉 Welcome to Our Platform!",
  body: `<h1>Hi ${name},</h1><p>Thank you for signing up! 🚀</p>`,
});
