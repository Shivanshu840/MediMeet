import transporter from "./emailConfig";
import { welcomeEmail } from "./templates/welcomeEmail";
import { passwordReset } from "./templates/passwordReset";
import { healthReportEmail } from "./templates/healthReport";
import { feedbackFormEmail } from "./templates/feedbackForm";
import { exerciseSuggestionEmail } from "./templates/exerciseSuggestion";
import { balancedDietEmail } from "./templates/balancedDiet";
import { EmailType, EmailData } from "./emailTypes";
import { healthUpdateEmail } from "./templates/healthUpdate";
import { updateProfileEmail } from "./templates/updateProfile";
import { appointment } from "./templates/appointmentBooking";
import { appointmentdoc } from "./templates/appointmentDoc";

export const sendEmail = async (emailType: EmailType, to: string, data: EmailData): Promise<void> => {
  let emailContent;
  console.log("inside the sending mail function")

  switch (emailType) {
    case "WELCOME":
      emailContent = welcomeEmail(data);
      break;
    case "PASSWORD_RESET":
      emailContent = passwordReset(data);
      break;
    case "HEALTH_REPORT":
      emailContent = healthReportEmail(data);
      break;
    case "FEEDBACK_FORM":
      emailContent = feedbackFormEmail(data);
      break;
    case "EXERCISE_SUGGESTION":
      emailContent = exerciseSuggestionEmail(data);
      break;
    case "HEALTH_UPDATE":
        emailContent=healthUpdateEmail(data);
        break;
    case "BALANCED_DIET":
      emailContent = balancedDietEmail(data);
      break;
    case "UPDATE_PROFILE":
        emailContent= updateProfileEmail(data);
        break;
    case "APPOINTMENT":
        emailContent=appointment(data);
        break;
    case "APPOINTMENT_DOC":
        emailContent=appointmentdoc(data);
        break;
    default:
      throw new Error("Invalid email type");
  }

  const mailOptions = {
    from: "nitishraigkp007@gmail.com",
    to,
    subject: emailContent.subject,
    html: emailContent.body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
