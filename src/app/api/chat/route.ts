import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const SYSTEM_PROMPT = `You are the "AI Doctor Assistant" inside a pediatric autism screening and therapy-tracking app. You help parents and caregivers of children aged 4-11 think through developmental concerns, autism screening results, and therapy plans.

Be warm, clear, and practical. Use short paragraphs and markdown (lists, bold) where it helps readability. Always make clear you are not a substitute for a qualified healthcare professional, and encourage consulting one for diagnosis or treatment decisions. Do not provide a diagnosis yourself.`;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to use the assistant." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    message?: unknown;
    history?: unknown;
    childContext?: { childId?: unknown };
  } | null;

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  const history = Array.isArray(body?.history)
    ? body.history.filter(
        (m): m is { role: "user" | "ai"; content: string } =>
          !!m &&
          (m.role === "user" || m.role === "ai") &&
          typeof m.content === "string"
      )
    : [];

  const childId = typeof body?.childContext?.childId === "string" ? body.childContext.childId : null;
  const child = childId
    ? await prisma.child.findFirst({
        where: { id: childId, userId: session.user.id },
        include: {
          screenings: { orderBy: { completedAt: "desc" }, take: 1 },
          therapyPlans: { where: { status: "Active" }, take: 3 },
        },
      })
    : null;

  const context = child
    ? `Child profile in view: ${child.name}, age ${child.age}. Latest screening risk level: ${
        child.screenings[0]?.riskLevel ?? "none recorded"
      }. Active therapy plans: ${child.therapyPlans.map((p) => p.therapyType).join(", ") || "none"}.`
    : "No child profile is currently selected.";

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The AI assistant is not configured. Please set ANTHROPIC_API_KEY on the server." },
      { status: 500 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const completion = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}\n\n${context}`,
      messages: [
        ...history.map((m) => ({
          role: (m.role === "ai" ? "assistant" : "user") as "assistant" | "user",
          content: m.content,
        })),
        { role: "user" as const, content: message },
      ],
    });

    const text = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    const response = text || "I'm sorry, I couldn't generate a response. Please try again.";

    await prisma.chatMessage.create({
      data: { userId: session.user.id, childId: child?.id ?? null, message, response },
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Anthropic chat error:", error);
    return NextResponse.json(
      { error: "I'm having trouble reaching the assistant right now. Please try again shortly." },
      { status: 502 }
    );
  }
}
