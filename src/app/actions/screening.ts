"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const ScreeningSchema = z.object({
  childId: z.string(),
  a1Score: z.number(),
  a2Score: z.number(),
  a3Score: z.number(),
  a4Score: z.number(),
  a5Score: z.number(),
  a6Score: z.number(),
  a7Score: z.number(),
  a8Score: z.number(),
  a9Score: z.number(),
  a10Score: z.number(),
});

export async function submitScreeningAction(values: z.infer<typeof ScreeningSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = ScreeningSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid screening data" };
  const v = parsed.data;

  const totalScore = 
    v.a1Score + v.a2Score + v.a3Score + v.a4Score + 
    v.a5Score + v.a6Score + v.a7Score + v.a8Score + 
    v.a9Score + v.a10Score;

  let riskLevel = "Low";
  if (totalScore >= 7) riskLevel = "High";
  else if (totalScore >= 4) riskLevel = "Medium";

  const child = await prisma.child.findFirst({
    where: { id: v.childId, userId: session.user.id },
  });

  if (!child) return { error: "Child not found" };

  // Call ML API
  let aiPrediction = totalScore >= 7 ? "YES" : "NO";
  let confidence = 80.0 + (totalScore * 2);
  let mlModelUsed = false;

  try {
    const mlApiUrl = process.env.ML_API_URL ?? "http://localhost:5000";
    const predictResponse = await fetch(`${mlApiUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...v,
        age: child.age,
        gender: child.gender,
        jundice: child.bornWithJaundice ? 1 : 0,
        austim: child.familyASDHistory ? 1 : 0,
      }),
    });

    if (predictResponse.ok) {
      const result = await predictResponse.json();
      aiPrediction = result.prediction;
      confidence = result.confidence;
      mlModelUsed = true;
    }
  } catch {
    console.error("ML API call failed, falling back to rule-based prediction");
  }

  try {
    const screening = await prisma.screening.create({
      data: {
        ...v,
        totalScore,
        riskLevel,
        aiPrediction,
        confidence: Math.min(confidence, 99.9),
        mlModelUsed,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/results/${screening.id}`);
    
    return { success: "Screening completed!", screeningId: screening.id };
  } catch (error) {
    console.error("Screening submission error:", error);
    return { error: "Something went wrong! Could not save screening results." };
  }
}
