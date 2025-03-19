export type EmailType = "WELCOME" | "PASSWORD_RESET"|"HEALTH_REPORT"|"FEEDBACK_FORM"|"EXERCISE_SUGGESTION"|"BALANCED_DIET"|"UPDATE_PROFILE"|"HEALTH_UPDATE"|"APPOINTMENT"|"APPOINTMENT_DOC";

export interface EmailData {
    name: string;
    data?:string
    resetLink?: string;
    reportUrl?: string;
    feedbackUrl?: string;
    exercisePlan?: string;
    dietPlan?: string;
  }