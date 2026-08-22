import Link from "next/link";
import { redirect } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TherapyManager } from "@/components/therapy-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TherapyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [children, plans] = await Promise.all([
    prisma.child.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true },
    }),
    prisma.therapyPlan.findMany({
      where: { child: { userId: session.user.id } },
      include: { child: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Therapy management</h1>
        <p className="mt-1 text-muted-foreground">Create plans and record sessions to track progress.</p>
      </div>

      {children.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Activities &amp; games
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {children.map((c) => (
              <Link
                key={c.id}
                href={`/therapy/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pine-50">
                  <Gamepad2 className="h-4 w-4 text-pine-600" />
                </span>
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Play the pattern and emotion games, or view offline activities.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {children.length ? (
        <TherapyManager profileChildren={children} plans={plans} />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            Add a child profile before creating a therapy plan.
          </CardContent>
        </Card>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Current plans
        </h2>
        <div className="space-y-3">
          {plans.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-0">
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                  <span>
                    {p.therapyType} <span className="font-normal text-muted-foreground">· {p.child.name}</span>
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {p.status.toLowerCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          ))}
          {!plans.length && (
            <p className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
              No therapy plans yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
