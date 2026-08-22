import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChildBackLink } from "@/components/child-back-link";

export default async function ResultsPage({ params }: { params: { screeningId: string } }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  const screening = await prisma.screening.findFirst({ where: { id: params.screeningId, child: { userId: session.user.id } }, include: { child: true } }); if (!screening) notFound();
  const color = screening.riskLevel === "High" ? "text-red-600" : screening.riskLevel === "Medium" ? "text-orange-600" : "text-emerald-600";
  return <main className="mx-auto max-w-2xl space-y-6"><ChildBackLink childId={screening.childId} childName={screening.child.name} /><Card><CardHeader><CardTitle>Screening results for {screening.child.name}</CardTitle></CardHeader><CardContent className="space-y-5"><div><p className="text-sm text-muted-foreground">Risk level</p><p className={`text-4xl font-bold ${color}`}>{screening.riskLevel}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Question score</p><p className="text-2xl font-bold">{screening.totalScore}/10</p></div><div><p className="text-sm text-muted-foreground">Model signal</p><p className="text-2xl font-bold">{screening.aiPrediction} ({screening.confidence.toFixed(1)}%)</p></div></div><p className="rounded-lg bg-muted p-4 text-sm">This result is a screening indicator only, not a medical diagnosis. Discuss concerns with a qualified healthcare professional.</p><div className="flex gap-3"><Link className="text-sm text-primary underline" href={`/therapy/${screening.childId}`}>View activities</Link><Link className="text-sm text-primary underline" href={`/monitoring?childId=${screening.childId}`}>View monitoring</Link></div></CardContent></Card></main>;
}
