import { EmailData } from "../emailTypes";

export const updateProfileEmail = ({ name,  }: EmailData) => ({
  subject: "🔄 Your Profile Has Been Updated",
  body: `<h1>Hi ${name},</h1>
         <p>Your profile was successfully updated.</p>
         <p>If you did not make these changes, please contact support immediately.</p>
         <p>Thank you for keeping your profile up to date!</p>`,
});
