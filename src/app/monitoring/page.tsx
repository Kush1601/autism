import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProgressChart } from "@/components/monitoring/progress-chart";
import { TherapyTrendChart } from "@/components/monitoring/therapy-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { ClipboardList, Calendar, CheckSquare, Activity } from "lucide-react";
import Link from "next/link";

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: { childId?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const children = await prisma.child.findMany({
    where: { userId: session.user.id },
    include: {
      screenings: {
        orderBy: { completedAt: "asc" },
      },
      therapyPlans: {
        include: { sessions: { orderBy: { sessionDate: "asc" } } },
      },
      progressReports: true,
    },
  });

  if (children.length === 0) redirect("/dashboard");

  const selected =
    (searchParams.childId && children.find((c) => c.id === searchParams.childId)) || null;
  const mainChild = selected ?? children[0];

  const latestReport = [...mainChild.progressReports].sort(
    (a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
  )[0];
  let feedbackBanner: string | null = null;
  if (latestReport?.milestones) {
    try {
      const m = JSON.parse(latestReport.milestones) as { feedbackAgent?: string };
      if (m.feedbackAgent === "continue_plan") feedbackBanner = "Latest feedback: continue current plan";
      if (m.feedbackAgent === "adjust_therapy") feedbackBanner = "Latest feedback: consider adjusting therapy focus";
    } catch {
      /* ignore */
    }
  }

  const screeningChartData = mainChild.screenings.map((s) => ({
    date: new Date(s.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: s.totalScore,
  }));

  const allSessions = mainChild.therapyPlans.flatMap((p) => p.sessions);
  const therapyChartData = allSessions.map((s) => ({
    date: new Date(s.sessionDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: Number(s.improvementScore) || 0,
  }));

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center gap-4 border-b border-border/70 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg text-primary">
            <Activity className="h-5 w-5" />
            Early Autism
          </Link>
          <nav className="ml-auto flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/dashboard" className="transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/chatbot" className="transition-colors hover:text-primary">
              AI doctor
            </Link>
            <Link href="/dashboard/therapy" className="transition-colors hover:text-primary">
              Therapy
            </Link>
          </nav>
        </header>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-2xl text-foreground">Monitoring &amp; reports</h1>
            <p className="mt-1 text-muted-foreground">
              Track {mainChild.name}&apos;s developmental trends and therapy milestones.
            </p>
          </div>
          {children.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {children.map((c) => (
                <Link
                  key={c.id}
                  href={`/monitoring?childId=${c.id}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    c.id === mainChild.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {feedbackBanner && (
          <div className="rounded-xl border border-pine-100 bg-pine-50/60 px-4 py-3 text-sm font-medium text-pine-900">
            {feedbackBanner}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProgressChart data={screeningChartData} />
          <TherapyTrendChart data={therapyChartData} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{mainChild.screenings.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Completed evaluations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active therapies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{mainChild.therapyPlans.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Ongoing sessions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{mainChild.progressReports.length}</div>
              <p className="mt-1 text-xs text-muted-foreground">Progress snapshots</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="h-5 w-5 text-primary" />
                Recent evaluations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mainChild.screenings
                  .slice()
                  .reverse()
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(s.completedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Risk: {s.riskLevel}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-primary">Score: {s.totalScore}</div>
                    </div>
                  ))}
                {mainChild.screenings.length === 0 && (
                  <p className="text-sm text-muted-foreground">No screenings found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckSquare className="h-5 w-5 text-primary" />
                Recent feedback snapshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mainChild.progressReports.slice(0, 5).map((report) => {
                  let source = "Session";
                  let detail = "";
                  try {
                    const m = JSON.parse(report.milestones ?? "{}") as {
                      source?: string;
                      game?: string;
                      feedbackAgent?: string;
                      roundsCorrect?: number;
                      roundsTotal?: number;
                    };
                    source = m.source === "interactive_game" ? `Game: ${m.game ?? ""}` : "Therapy session";
                    if (m.roundsCorrect !== undefined) detail = `${m.roundsCorrect}/${m.roundsTotal} correct`;
                    const agent = m.feedbackAgent;
                    const isGood = agent === "continue_plan";
                    return (
                      <div
                        key={report.id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/40 p-3"
                      >
                        <div
                          className={`h-2 w-2 shrink-0 rounded-full ${isGood ? "bg-pine-500" : "bg-amber-500"}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium capitalize text-foreground">{source}</p>
                          {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
                        </div>
                        <Badge
                          variant="outline"
                          className={`ml-auto shrink-0 ${isGood ? "border-pine-200 bg-pine-50 text-pine-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                        >
                          {isGood ? "On track" : "Needs review"}
                        </Badge>
                      </div>
                    );
                  } catch {
                    return null;
                  }
                })}
                {mainChild.progressReports.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No progress reports yet. Log a therapy session to see feedback here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
