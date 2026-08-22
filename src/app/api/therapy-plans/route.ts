import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth(); if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const plans = await prisma.therapyPlan.findMany({ where: { child: { userId: session.user.id } }, include: { child: { select: { id: true, name: true } }, sessions: { orderBy: { sessionDate: "desc" } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ plans });
}
