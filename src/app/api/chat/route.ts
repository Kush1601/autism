import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth(); if (!session?.user?.id) return NextResponse.json({ error: "Please sign in to use the assistant." }, { status: 401 });
  const body = await request.json().catch(() => null) as { message?: unknown; childContext?: { childId?: unknown } } | null;
  const message = typeof body?.message === "string" ? body.message.trim() : ""; if (!message) return NextResponse.json({ error: "A message is required." }, { status: 400 });
  const childId = typeof body?.childContext?.childId === "string" ? body.childContext.childId : null;
  const child = childId ? await prisma.child.findFirst({ where: { id: childId, userId: session.user.id }, include: { screenings: { orderBy: { completedAt: "desc" }, take: 1 }, therapyPlans: { where: { status: "Active" }, take: 3 } } }) : null;
  const context = child ? `${child.name} is ${child.age}. Latest screening: ${child.screenings[0]?.riskLevel ?? "none"}. Active plans: ${child.therapyPlans.map((p: { therapyType: string }) => p.therapyType).join(", ") || "none"}.` : "No child profile was selected.";
  const response = `I can help you think through general developmental-support questions. ${context} For anything urgent, a diagnosis, or a treatment decision, please consult a qualified healthcare professional. What part of “${message}” would you like to explore first?`;
  await prisma.chatMessage.create({ data: { userId: session.user.id, childId: child?.id ?? null, message, response } });
  return NextResponse.json({ response });
}
