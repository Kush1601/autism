"use client";

import { useState, useTransition } from "react";
import { createTherapyPlanAction, logTherapySessionAction } from "@/app/actions/therapy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Child = { id: string; name: string };
type Plan = { id: string; childId: string; therapyType: string; status: string; child: Child };

type Message = { text: string; isError: boolean } | null;

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TherapyManager({ profileChildren, plans }: { profileChildren: Child[]; plans: Plan[] }) {
  const [message, setMessage] = useState<Message>(null);
  const [pending, startTransition] = useTransition();

  const submitPlan = (data: FormData) =>
    startTransition(async () => {
      const r = await createTherapyPlanAction({
        childId: String(data.get("childId")),
        therapyType: String(data.get("therapyType")),
        description: String(data.get("description")),
        startDate: new Date(String(data.get("startDate"))),
      });
      setMessage(r.error ? { text: r.error, isError: true } : { text: r.success ?? "", isError: false });
    });

  const submitSession = (data: FormData) =>
    startTransition(async () => {
      const r = await logTherapySessionAction({
        therapyPlanId: String(data.get("therapyPlanId")),
        sessionDate: new Date(String(data.get("sessionDate"))),
        duration: Number(data.get("duration")),
        improvementScore: Number(data.get("improvementScore")),
        notes: String(data.get("notes") || ""),
      });
      setMessage(r.error ? { text: r.error, isError: true } : { text: r.success ?? "", isError: false });
    });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create therapy plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitPlan} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="plan-childId">Child</Label>
              <select id="plan-childId" name="childId" required defaultValue="" className={selectClassName}>
                <option value="" disabled>
                  Select a child
                </option>
                {profileChildren.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-therapyType">Therapy type</Label>
              <Input id="plan-therapyType" name="therapyType" required placeholder="e.g. Speech therapy" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-description">Goals and plan details</Label>
              <Textarea id="plan-description" name="description" required className="min-h-24" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan-startDate">Start date</Label>
              <Input id="plan-startDate" name="startDate" type="date" required />
            </div>
            <Button disabled={pending} type="submit" className="mt-1">
              Create plan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Log therapy session</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitSession} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="session-therapyPlanId">Therapy plan</Label>
              <select
                id="session-therapyPlanId"
                name="therapyPlanId"
                required
                defaultValue=""
                className={selectClassName}
              >
                <option value="" disabled>
                  Select a plan
                </option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.child.name} — {p.therapyType}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="session-sessionDate">Session date</Label>
              <Input id="session-sessionDate" name="sessionDate" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="session-duration">Duration (min)</Label>
                <Input id="session-duration" name="duration" type="number" min="1" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="session-improvementScore">Improvement (1–10)</Label>
                <Input id="session-improvementScore" name="improvementScore" type="number" min="1" max="10" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="session-notes">Notes (optional)</Label>
              <Textarea id="session-notes" name="notes" className="min-h-20" />
            </div>
            <Button disabled={pending || plans.length === 0} type="submit" className="mt-1">
              Log session
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <p className={`text-sm lg:col-span-2 ${message.isError ? "text-destructive" : "text-primary"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
