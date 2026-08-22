import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TherapyManager } from "@/components/therapy-manager";

export default async function TherapyPage() {
  const session = await auth(); if (!session?.user?.id) redirect("/login");
  const [children, plans] = await Promise.all([prisma.child.findMany({ where: { userId: session.user.id }, select: { id: true, name: true } }), prisma.therapyPlan.findMany({ where: { child: { userId: session.user.id } }, include: { child: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } })]);
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Therapy management</h1><p className="text-muted-foreground">Create plans and record sessions to track progress.</p></div>{children.length > 0 && <section><h2 className="mb-3 text-xl font-semibold">Activities &amp; games</h2><div className="grid gap-3 sm:grid-cols-2">{children.map((c) => <Link key={c.id} href={`/therapy/${c.id}`} className="rounded-lg border p-4 transition-colors hover:border-primary hover:bg-accent"><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">Play the pattern and emotion games, or view offline activities.</p></Link>)}</div></section>}{children.length ? <TherapyManager profileChildren={children} plans={plans} /> : <p className="rounded-lg border p-5">Add a child profile before creating a therapy plan.</p>}<section><h2 className="mb-3 text-xl font-semibold">Current plans</h2><div className="space-y-3">{plans.map((p) => <div key={p.id} className="rounded-lg border p-4"><p className="font-medium">{p.therapyType} · {p.child.name}</p><p className="text-sm text-muted-foreground">{p.description}</p><p className="mt-1 text-xs">Status: {p.status}</p></div>)}{!plans.length && <p className="text-sm text-muted-foreground">No therapy plans yet.</p>}</div></section></div>;
}
