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
        include: { sessions: { orderBy: { sessionDate: "asc" } } }
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
    <div className="space-y-8 min-h-screen bg-background px-4 md:px-8 py-8">
      <header className="flex flex-wrap items-center gap-4 border-b border-neutral-100 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <Activity className="h-5 w-5" />
          Early Autism
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-neutral-600 ml-auto">
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link href="/chatbot" className="hover:text-primary">
            AI doctor
          </Link>
          <Link href="/dashboard/therapy" className="hover:text-primary">
            Therapy
          </Link>
        </nav>
      </header>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Monitoring & Reports</h1>
          <p className="text-neutral-500">Track {mainChild.name}&apos;s developmental trends and therapy milestones.</p>
        </div>
        {children.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {children.map((c) => (
              <Link
                key={c.id}
                href={`/monitoring?childId=${c.id}`}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                  c.id === mainChild.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-primary"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProgressChart data={screeningChartData} />
        <TherapyTrendChart data={therapyChartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary/5 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Total Screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mainChild.screenings.length}</div>
              <p className="text-xs text-neutral-500 mt-1">Completed evaluations</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/60 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Therapies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mainChild.therapyPlans.length}</div>
              <p className="text-xs text-neutral-500 mt-1">Ongoing sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-pine-50/50 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-pine-600">Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mainChild.progressReports.length}</div>
              <p className="text-xs text-neutral-500 mt-1">Progress snapshots</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Recent Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mainChild.screenings.slice().reverse().map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium">{new Date(s.completedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-neutral-500">Risk: {s.riskLevel}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary">Score: {s.totalScore}</div>
                </div>
              ))}
              {mainChild.screenings.length === 0 && (
                <p className="text-sm text-neutral-500 italic">No screenings found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Recent Feedback Snapshots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                    <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 border">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${isGood ? "bg-pine-500" : "bg-orange-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{source}</p>
                        {detail && <p className="text-xs text-neutral-400">{detail}</p>}
                      </div>
                      <Badge
                        variant="outline"
                        className={`ml-auto flex-shrink-0 ${isGood ? "bg-pine-50 text-pine-700" : "bg-orange-50 text-orange-700"}`}
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
                <p className="text-sm text-neutral-500 italic">No progress reports yet. Log a therapy session to see feedback here.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
