import ollama from "ollama";

/**
 * Generate AI-powered personalized email content for health updates.
 */
export const generateAIEmailContent = async (healthData: string): Promise<string> => {
  try {
    console.log("inside the ai function")
    const response = await ollama.chat({
      model: "mistral", // Change model if needed
      messages: [
        { role: "system", content: "You are a professional health assistant. Generate a short and concise email (15-20 words max) with quick health insights, exercise suggestions, and diet recommendations." },
        { role: "user", content: `User's Health Data: ${healthData}. Provide an email with personalized feedback, exercise tips, and diet recommendations.` },
      ],
    });

    return response.message.content || "Couldn't generate feedback.";
  } catch (error) {
    console.error("❌ Ollama Error:", error);
    return "We couldn't generate feedback at this moment.";
  }
};
