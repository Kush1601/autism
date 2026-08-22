import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChildBackLink } from "@/components/child-back-link";

export default async function ResultsPage({ params }: { params: { screeningId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const screening = await prisma.screening.findFirst({
    where: { id: params.screeningId, child: { userId: session.user.id } },
    include: { child: true },
  });
  if (!screening) notFound();

  const color =
    screening.riskLevel === "High"
      ? "text-red-600"
      : screening.riskLevel === "Medium"
        ? "text-amber-600"
        : "text-pine-600";

  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <ChildBackLink childId={screening.childId} childName={screening.child.name} />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Screening results for {screening.child.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Risk level</p>
            <p className={`text-4xl font-semibold ${color}`}>{screening.riskLevel}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">Question score</p>
              <p className="text-2xl font-semibold text-foreground">{screening.totalScore}/10</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="text-sm text-muted-foreground">
                {screening.mlModelUsed ? "AI model prediction" : "Rule-based estimate"}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {screening.aiPrediction} ({screening.confidence.toFixed(1)}%)
              </p>
              {!screening.mlModelUsed && (
                <p className="mt-1 text-xs text-muted-foreground">
                  The ML prediction service wasn&apos;t available, so this estimate comes from the
                  questionnaire score alone.
                </p>
              )}
            </div>
          </div>

          <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            This result is a screening indicator only, not a medical diagnosis. Discuss concerns with a
            qualified healthcare professional.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
              href={`/therapy/${screening.childId}`}
            >
              View activities
            </Link>
            <Link
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
              href={`/monitoring?childId=${screening.childId}`}
            >
              View monitoring
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
