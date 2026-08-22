import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildProfileForm } from "@/components/child-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChildPage({ params }: { params: { childId: string } }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  if (params.childId === "new") return <Card className="mx-auto max-w-2xl"><CardHeader><CardTitle>Add a child profile</CardTitle></CardHeader><CardContent><ChildProfileForm /></CardContent></Card>;
  const child = await prisma.child.findFirst({ where: { id: params.childId, userId: session.user.id }, include: { screenings: { orderBy: { completedAt: "desc" }, take: 1 }, therapyPlans: { orderBy: { createdAt: "desc" } } } });
  if (!child) notFound(); const screening = child.screenings[0];
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">{child.name}</h1><p className="text-muted-foreground">{child.age} years old · {child.gender}</p></div><Link href={`/screening/${child.id}`}><Button>{screening ? "Retake screening" : "Start screening"}</Button></Link></div><div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardTitle className="text-sm">Latest screening</CardTitle></CardHeader><CardContent>{screening ? <><p className="text-2xl font-bold">{screening.riskLevel} risk</p><Link className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline" href={`/results/${screening.id}`}>View results</Link></> : <p className="text-sm text-muted-foreground">No screening yet.</p>}</CardContent></Card><Card><CardHeader><CardTitle className="text-sm">Therapy plans</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{child.therapyPlans.length}</p><Link className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline" href="/dashboard/therapy">Manage therapy</Link></CardContent></Card><Card><CardHeader><CardTitle className="text-sm">Quick actions</CardTitle></CardHeader><CardContent className="space-y-2"><Link className="block text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline" href={`/therapy/${child.id}`}>Activities</Link><Link className="block text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline" href={`/feedback/${child.id}`}>Feedback history</Link></CardContent></Card></div></div>;
}
