import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatClient } from "./chat-client";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: { childId?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Resolve which child to show — from URL param or fall back to first child
  const children: { id: string; name: string }[] = await prisma.child.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  let childId: string | null = null;
  let childName: string | null = null;

  if (searchParams.childId) {
    const match = children.find((c) => c.id === searchParams.childId);
    if (match) {
      childId = match.id;
      childName = match.name;
    }
  } else if (children.length > 0) {
    childId = children[0].id;
    childName = children[0].name;
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 to-white flex flex-col">
        <header className="flex-none flex items-center gap-3 px-5 py-3.5 bg-white border-b border-neutral-100 shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-neutral-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-sm text-center space-y-5">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto border border-emerald-100">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">No Child Profile Yet</h2>
              <p className="text-neutral-500 text-sm mt-2">
                Add a child profile first so the AI Doctor can give you personalised guidance.
              </p>
            </div>
            <Link
              href="/dashboard/child/new"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              Add Child Profile →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ChatClient childId={childId} childName={childName} />;
}
