import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildBackLink } from "@/components/child-back-link";
import { PatternGame } from "@/components/games/pattern-game";

export default async function PatternGamePage({ params }: { params: { childId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session.user.id },
  });
  if (!child) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <ChildBackLink childId={child.id} childName={child.name} />
      <PatternGame childId={child.id} childName={child.name} />
    </main>
  );
}
