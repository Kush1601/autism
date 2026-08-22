import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Gamepad2, MessageSquareText } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ChildProfileForm } from "@/components/child-profile-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ChildPage({ params }: { params: { childId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (params.childId === "new") {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Add a child profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ChildProfileForm />
        </CardContent>
      </Card>
    );
  }

  const child = await prisma.child.findFirst({
    where: { id: params.childId, userId: session.user.id },
    include: {
      screenings: { orderBy: { completedAt: "desc" }, take: 1 },
      therapyPlans: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!child) notFound();
  const screening = child.screenings[0];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">{child.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {child.age} years old · {child.gender}
          </p>
        </div>
        <Button asChild>
          <Link href={`/screening/${child.id}`}>
            {screening ? "Retake screening" : "Start screening"}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Latest screening</CardTitle>
          </CardHeader>
          <CardContent>
            {screening ? (
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-foreground">{screening.riskLevel} risk</p>
                <Link
                  className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
                  href={`/results/${screening.id}`}
                >
                  View results
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No screening yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Therapy plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold text-foreground">{child.therapyPlans.length}</p>
            <Link
              className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-dark hover:underline"
              href="/dashboard/therapy"
            >
              Manage therapy
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <Link
              href={`/therapy/${child.id}`}
              className="flex items-center gap-2 rounded-md py-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              Activities
            </Link>
            <Link
              href={`/feedback/${child.id}`}
              className="flex items-center gap-2 rounded-md py-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              <MessageSquareText className="h-4 w-4 text-muted-foreground" />
              Feedback history
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
