import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildBackLink } from "@/components/child-back-link";

export default async function FeedbackPage({ params }: { params: { childId: string } }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login"); const child = await prisma.child.findFirst({ where: { id: params.childId, userId: session.user.id }, include: { progressReports: { orderBy: { reportDate: "desc" } } } }); if (!child) notFound();
  return <main className="mx-auto max-w-3xl space-y-6"><ChildBackLink childId={child.id} childName={child.name} /><div><h1 className="text-3xl font-bold">Feedback history</h1><p className="text-muted-foreground">Progress snapshots for {child.name}.</p></div>{child.progressReports.length ? <div className="space-y-3">{child.progressReports.map((report) => <article key={report.id} className="rounded-xl border p-5"><div className="flex justify-between gap-4"><p className="font-medium">Score: {report.overallScore}/10</p><time className="text-sm text-muted-foreground">{report.reportDate.toLocaleDateString()}</time></div><p className="mt-2 text-sm text-muted-foreground">{report.concerns ?? "Progress is on track based on this session."}</p></article>)}</div> : <p className="rounded-lg border p-5 text-muted-foreground">No feedback snapshots yet. Log a therapy session to begin tracking progress.</p>}</main>;
}
