import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../lib/action";
import prisma from "@repo/db/clients";
import ollama from "ollama"; // Import Ollama

const HEALTH_RANGES = {
  weight: { min: 45, max: 100, unit: "kg" },
  foodCalories: { min: 1200, max: 2500, unit: "kcal" },
  steps: { min: 5000, max: 10000, unit: "steps" },
  heartRate: { min: 60, max: 100, unit: "bpm" },
  sleepTime: { min: 7, max: 9, unit: "hours" },
  bloodPressure: {
    systolic: { min: 90, max: 120, unit: "mmHg" },
    diastolic: { min: 60, max: 80, unit: "mmHg" },
  },
  temperature: { min: 36.1, max: 37.2, unit: "°C" },
  airQuality: { min: 0, max: 50, unit: "AQI" },
};

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

/**
 * Generate AI-powered personalized email content for health updates.
 */
export const generateAIEmailContent = async (healthData: string): Promise<string> => {
  try {
    console.log("inside the ai function");
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