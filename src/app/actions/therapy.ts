"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const SessionSchema = z.object({
  therapyPlanId: z.string().min(1, "Please select a therapy plan"),
  sessionDate: z.coerce.date(),
  duration: z.coerce.number().min(1, "Duration is required"),
  notes: z.string().optional(),
  improvementScore: z.coerce.number().min(1).max(10),
});

const PlanSchema = z.object({
  childId: z.string().min(1, "Please select a child"),
  therapyType: z.string().min(1, "Therapy type is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.coerce.date(),
});

export async function logTherapySessionAction(values: z.infer<typeof SessionSchema>) {
  const userSession = await auth();
  if (!userSession?.user?.id) return { error: "Unauthorized" };

  const validatedFields = SessionSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const plan = await prisma.therapyPlan.findFirst({
    where: {
      id: validatedFields.data.therapyPlanId,
      child: { userId: userSession.user.id },
    },
    include: { child: true },
  });

  if (!plan) return { error: "Therapy plan not found or access denied." };

  try {
    await prisma.therapySession.create({
      data: validatedFields.data,
    });

    const score = validatedFields.data.improvementScore;
    const improving = score >= 6;
    await prisma.progressReport.create({
      data: {
        childId: plan.childId,
        overallScore: score,
        milestones: JSON.stringify({
          source: "therapy_session",
          therapyPlanId: plan.id,
          feedbackAgent: improving ? "continue_plan" : "adjust_therapy",
          recordedAt: new Date().toISOString(),
        }),
        concerns: improving
          ? null
          : "Feedback agent: recent session scores suggest reviewing pacing, goals, or activity mix with your care team.",
      },
    });

    revalidatePath("/monitoring");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/therapy");
    revalidatePath(`/dashboard/child/${plan.childId}`);
    return { success: "Therapy session logged successfully!" };
  } catch {
    return { error: "Something went wrong! Could not log session." };
  }
}

export async function createTherapyPlanAction(values: z.infer<typeof PlanSchema>) {
  const userSession = await auth();
  if (!userSession?.user?.id) return { error: "Unauthorized" };

  const validatedFields = PlanSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const child = await prisma.child.findFirst({
    where: { id: validatedFields.data.childId, userId: userSession.user.id },
    include: { screenings: { orderBy: { completedAt: "desc" }, take: 1 } },
  });

  if (!child) return { error: "Child not found or access denied." };

  try {
    const plan = await prisma.therapyPlan.create({
      data: {
        ...validatedFields.data,
        screeningId: child.screenings[0]?.id ?? null,
        status: "Active",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/therapy");
    revalidatePath(`/dashboard/child/${child.id}`);
    revalidatePath("/monitoring");
    return { success: "Therapy plan created!", planId: plan.id };
  } catch {
    return { error: "Something went wrong!" };
  }
}

export async function updateTherapyPlanStatusAction(planId: string, status: "Active" | "Paused" | "Completed") {
  const userSession = await auth();
  if (!userSession?.user?.id) return { error: "Unauthorized" };

  const plan = await prisma.therapyPlan.findFirst({
    where: { id: planId, child: { userId: userSession.user.id } },
  });
  if (!plan) return { error: "Plan not found or access denied." };

  await prisma.therapyPlan.update({ where: { id: planId }, data: { status } });
  revalidatePath("/dashboard/therapy");
  revalidatePath("/dashboard");
  return { success: true };
}

const GameFeedbackSchema = z.object({
  childId: z.string().min(1),
  gameSlug: z.string().min(1),
  score: z.coerce.number().min(1).max(10),
  roundsCorrect: z.coerce.number().min(0).optional(),
  roundsTotal: z.coerce.number().min(1).optional(),
});

export async function submitInteractiveGameFeedbackAction(values: z.infer<typeof GameFeedbackSchema>) {
  const userSession = await auth();
  if (!userSession?.user?.id) return { error: "Unauthorized" };

  const parsed = GameFeedbackSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid game payload." };

  const child = await prisma.child.findFirst({
    where: { id: parsed.data.childId, userId: userSession.user.id },
  });
  if (!child) return { error: "Child not found or access denied." };

  const improving = parsed.data.score >= 6;
  try {
    await prisma.progressReport.create({
      data: {
        childId: child.id,
        overallScore: parsed.data.score,
        milestones: JSON.stringify({
          source: "interactive_game",
          game: parsed.data.gameSlug,
          roundsCorrect: parsed.data.roundsCorrect,
          roundsTotal: parsed.data.roundsTotal,
          feedbackAgent: improving ? "continue_plan" : "adjust_therapy",
          recordedAt: new Date().toISOString(),
        }),
        concerns: improving
          ? null
          : "Feedback agent: game performance suggests shorter rounds or a different activity next session.",
      },
    });
    revalidatePath("/monitoring");
    revalidatePath(`/therapy/${child.id}`);
    revalidatePath(`/dashboard/child/${child.id}`);
    return { success: true, feedback: improving ? "continue_plan" : "adjust_therapy" as const };
  } catch {
    return { error: "Could not save game feedback." };
  }
}
