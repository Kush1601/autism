import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ScreeningForm } from "@/components/screening-form";
import { ChildBackLink } from "@/components/child-back-link";

export default async function ScreeningPage({ params }: { params: { childId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session.user.id },
  });
  if (!child) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <ChildBackLink childId={child.id} childName={child.name} />
      <div>
        <h1 className="font-display text-3xl text-foreground">Autism screening</h1>
        <p className="mt-2 text-muted-foreground">
          Answer these ten questions about {child.name}. This is a screening tool, not a diagnosis.
        </p>
      </div>
      <ScreeningForm childId={child.id} />
    </main>
  );
}
