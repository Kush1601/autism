import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildBackLink } from "@/components/child-back-link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ActivitiesPage({ params }: { params: { childId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session.user.id },
    include: { therapyPlans: true },
  });
  if (!child) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <ChildBackLink childId={child.id} childName={child.name} />
      <div>
        <h1 className="text-3xl font-bold">Activities for {child.name}</h1>
        <p className="text-muted-foreground">Use these brief, guided activities alongside your care plan.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="ring-pine-100 transition-colors hover:ring-pine-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pine-600" />
              Emotion matching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Look at a face and pick the emotion it shows. A quick, playable game your child can try right on the
              screen.
            </p>
            <Button asChild size="sm">
              <Link href={`/therapy/${child.id}/games/emotion`}>Play emotion matching</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="ring-pine-100 transition-colors hover:ring-pine-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-pine-600" />
              Pattern play
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Watch a short sequence of shapes and colours, then pick what comes next. A gentle pattern-recognition
              game with a few rounds.
            </p>
            <Button asChild size="sm">
              <Link href={`/therapy/${child.id}/games/pattern`}>Play pattern play</Link>
            </Button>
          </CardContent>
        </Card>

        <article className="rounded-xl border p-5">
          <h2 className="font-semibold">Turn-taking game</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Practice short, predictable turns using a favourite toy or activity.
          </p>
        </article>

        <article className="rounded-xl border p-5">
          <h2 className="font-semibold">Sensory check-in</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask what feels comfortable today and adjust the environment as needed.
          </p>
        </article>
      </div>
      <Link
        href="/dashboard/therapy"
        className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
      >
        Log a therapy session or view plans
      </Link>
    </main>
  );
}
