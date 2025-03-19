import { EmailData } from "../emailTypes";

export const feedbackFormEmail = ({ name, feedbackUrl }: EmailData) => ({
  subject: "📝 We Value Your Feedback",
  body: `<h1>Hi ${name},</h1>
         <p>We would love to hear your thoughts.</p>
         <p>Click <a href="${feedbackUrl}">here</a> to provide your feedback.</p>`,
});
