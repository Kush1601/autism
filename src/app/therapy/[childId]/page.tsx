import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ClipboardList, Gamepad2, Sparkles } from "lucide-react";
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
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Play on screen
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden ring-pine-100 transition-colors hover:ring-pine-300">
            <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-400 to-pine-400" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </span>
                  Emotion matching
                </span>
                <span className="rounded-full bg-pine-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pine-700">
                  Game
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Look at a face and pick the emotion it shows. A quick, playable game your child can try right on the
                screen.
              </p>
              <Button asChild size="sm" className="rounded-full">
                <Link href={`/therapy/${child.id}/games/emotion`}>Play emotion matching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden ring-pine-100 transition-colors hover:ring-pine-300">
            <div className="h-1.5 bg-gradient-to-r from-pine-300 via-pine-500 to-amber-400" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-50">
                    <Gamepad2 className="h-4 w-4 text-pine-600" />
                  </span>
                  Pattern play
                </span>
                <span className="rounded-full bg-pine-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-pine-700">
                  Game
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Watch a short sequence of shapes and colours, then pick what comes next. A gentle pattern-recognition
                game with a few rounds.
              </p>
              <Button asChild size="sm" className="rounded-full">
                <Link href={`/therapy/${child.id}/games/pattern`}>Play pattern play</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Do together, offline
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-dashed p-5">
            <h3 className="font-semibold">Turn-taking game</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Practice short, predictable turns using a favourite toy or activity.
            </p>
          </article>

          <article className="rounded-xl border border-dashed p-5">
            <h3 className="font-semibold">Sensory check-in</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask what feels comfortable today and adjust the environment as needed.
            </p>
          </article>
        </div>
      </div>
      <Card className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50">
            <ClipboardList className="h-5 w-5 text-pine-600" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Therapy plans & sessions</p>
            <p className="text-sm text-muted-foreground">Log a session or review the current care plan.</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href="/dashboard/therapy">
            Go to therapy management
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Card>
    </main>
  );
}
