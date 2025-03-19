import { EmailData } from "../emailTypes";

export const passwordReset = ({ name, resetLink }: EmailData) => ({
  subject: "🔑 Reset Your Password",
  body: `<h1>Hi ${name},</h1>
         <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
});
