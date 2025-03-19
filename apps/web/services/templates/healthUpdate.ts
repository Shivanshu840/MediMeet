import { EmailData } from "../emailTypes";

export const healthUpdateEmail = ({ data }: EmailData) => ({
    
  subject: "🩺 Your Latest Health Update",
  body: data,
});
