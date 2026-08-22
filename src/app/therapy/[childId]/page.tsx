import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildBackLink } from "@/components/child-back-link";

export default async function ActivitiesPage({ params }: { params: { childId: string } }) {
  const session = await auth(); if (!session?.user?.id) redirect("/login"); const child = await prisma.child.findFirst({ where: { id: params.childId, userId: session.user.id }, include: { therapyPlans: true } }); if (!child) notFound();
  return <main className="mx-auto max-w-3xl space-y-6"><ChildBackLink childId={child.id} childName={child.name} /><div><h1 className="text-3xl font-bold">Activities for {child.name}</h1><p className="text-muted-foreground">Use these brief, guided activities alongside your care plan.</p></div><div className="grid gap-4 md:grid-cols-2"><article className="rounded-xl border p-5"><h2 className="font-semibold">Emotion matching</h2><p className="mt-2 text-sm text-muted-foreground">Name an emotion in a picture or mirror and discuss clues in the face and body.</p></article><article className="rounded-xl border p-5"><h2 className="font-semibold">Pattern play</h2><p className="mt-2 text-sm text-muted-foreground">Create a simple colour or shape pattern together, then invite your child to continue it.</p></article><article className="rounded-xl border p-5"><h2 className="font-semibold">Turn-taking game</h2><p className="mt-2 text-sm text-muted-foreground">Practice short, predictable turns using a favourite toy or activity.</p></article><article className="rounded-xl border p-5"><h2 className="font-semibold">Sensory check-in</h2><p className="mt-2 text-sm text-muted-foreground">Ask what feels comfortable today and adjust the environment as needed.</p></article></div><Link href="/dashboard/therapy" className="text-sm text-primary underline">Log a therapy session or view plans</Link></main>;
}
