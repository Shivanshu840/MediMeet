import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../lib/action";
import prisma from "@repo/db/clients";
import { InferenceClient } from "@huggingface/inference";
const apiKEy = process.env.HUGGINGFACE_API_KEY
const client = new InferenceClient(apiKEy);

export async function GET(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const healthData = await prisma.health.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!healthData) {
      return NextResponse.json({ error: "Health data not found" }, { status: 404 });
    }

    const suggestions = await prisma.healthSuggestion.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      message: "Health data and suggestions retrieved successfully",
      data: healthData,
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching health data:", error);
    return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let healthData = await prisma.health.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!healthData) {
      healthData = await prisma.health.create({
        data: {
          userId: session.user.id,
          weight: body.weight || 0,
          foodCalories: body.foodCalories || 0,
          steps: body.steps || 0,
          heartRate: body.heartRate || 0,
          sleepTime: body.sleepTime || 0,
          bloodPressure: {
            systolic: body.bloodPressure?.systolic || 0,
            diastolic: body.bloodPressure?.diastolic || 0,
          },
          temperature: body.temperature || 0,
          airQuality: body.airQuality || 0,
        },
      });
    } else {
      healthData = await prisma.health.update({
        where: {
          userId: session.user.id,
        },
        data: {
          weight: body.weight || healthData.weight,
          foodCalories: body.foodCalories || healthData.foodCalories,
          steps: body.steps || healthData.steps,
          heartRate: body.heartRate || healthData.heartRate,
          sleepTime: body.sleepTime || healthData.sleepTime,
          bloodPressure: {
            systolic: body.bloodPressure?.systolic || healthData.bloodPressure.systolic,
            diastolic: body.bloodPressure?.diastolic || healthData.bloodPressure.diastolic,
          },
          temperature: body.temperature || healthData.temperature,
          airQuality: body.airQuality || healthData.airQuality,
        },
      });
    }

    const analysis = await analyzeHealthData(healthData, session.user.id);

    if (analysis && analysis.error) {
      return NextResponse.json({ error: analysis.error }, { status: analysis.status || 500 });
    }

    return NextResponse.json({
      message: "Health data analyzed successfully",
      data: healthData,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing health data:", error);
    return NextResponse.json({ error: "Failed to analyze health data" }, { status: 500 });
  }
}

async function analyzeHealthData(healthData: any, userId: string) {
  try {
    const startTime = Date.now();
    console.log("Starting health analysis at:", startTime);

    const healthDataString = JSON.stringify(healthData);

    const suggestion = await generateAIEmailContent(healthDataString);

    await prisma.healthSuggestion.create({
      data: {
        userId: userId,
        content: suggestion,
        createdAt: new Date(),
      },
    });

    console.log("Health analysis completed successfully after:", Date.now() - startTime, "ms");
    return { suggestion };
  } catch (error: any) {
    console.error("Error in analyzeHealthData:", error);
    return { error: error.message || "Analysis failed", status: 500 };
  }
}

export const generateAIEmailContent = async (healthData: string): Promise<string> => {
  try {
   
      try {
      const chatCompletion = await client.chatCompletion({
        model: "mistralai/Mistral-Nemo-Instruct-2407",
          
        messages: [
          {
            role: "system",
            content: "You are a professional health assistant. Provide brief, personalized health insights, exercise tips, and diet recommendations in English. Do not include greetings, subject lines, or bullet points. Respond in short, flowing sentences, and include relevant emojis. Keep the entire response under 50 words."
          },
          {
            role: "user",
            content: `User's Health Data: ${healthData}. Extract key health metrics and provide concise personalized feedback, exercise tips, and diet recommendations in short, flowing sentences, and include emojis.`
          }
        ],
        provider: "hf-inference",
        max_tokens: 500,
      });

      return chatCompletion.choices[0]?.message.content || "Couldn't generate feedback.";
    } catch (apiError) {
      console.error("❌ HuggingFace API Error:", apiError);
      
      if (apiError instanceof Error) {
        console.error("Error message:", apiError.message);
        console.error("Error stack:", apiError.stack);
      }
      
      return "We couldn't generate feedback at this moment. API error occurred.";
    }
  } catch (error) {
    console.error("❌ Unexpected error in generateAIEmailContent:", error);
    return "We couldn't generate feedback at this moment.";
  }
};