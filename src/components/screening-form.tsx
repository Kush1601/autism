"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitScreeningAction } from "@/app/actions/screening";
import { Button } from "@/components/ui/button";

const questions = [
  "Does your child enjoy being swung or bounced on your knee?", "Does your child take an interest in other children?", "Does your child like climbing on things?", "Does your child enjoy playing peek-a-boo?", "Does your child ever pretend, for example talking on a toy phone?", "Does your child ever use their index finger to point to ask for something?", "Does your child ever use their index finger to point to indicate interest in something?", "Can your child play properly with small toys?", "Does your child ever bring objects over to show you something?", "Does your child look you in the eye for more than a second or two?",
];

export function ScreeningForm({ childId }: { childId: string }) {
  const router = useRouter(); const [answers, setAnswers] = useState<Record<number, number>>({}); const [error, setError] = useState(""); const [pending, startTransition] = useTransition();
  function submit() {
    if (Object.keys(answers).length !== 10) return setError("Please answer all ten questions.");
    startTransition(async () => {
      const values = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`a${i + 1}Score`, answers[i + 1]]));
      const result = await submitScreeningAction({ childId, ...values } as Parameters<typeof submitScreeningAction>[0]);
      if (result.error) return setError(result.error);
      router.push(`/results/${result.screeningId}`);
    });
  }
  return <div className="space-y-6">{questions.map((question, index) => { const n = index + 1; return <fieldset key={n} className="rounded-xl border p-5"><legend className="font-medium">{n}. {question}</legend><div className="mt-4 flex gap-3"><button onClick={() => setAnswers({ ...answers, [n]: 0 })} className={`rounded-lg border px-4 py-2 text-sm ${answers[n] === 0 ? "border-primary bg-primary text-white" : "bg-white"}`}>No</button><button onClick={() => setAnswers({ ...answers, [n]: 1 })} className={`rounded-lg border px-4 py-2 text-sm ${answers[n] === 1 ? "border-primary bg-primary text-white" : "bg-white"}`}>Yes</button></div></fieldset>; })}{error && <p className="text-sm text-destructive">{error}</p>}<Button disabled={pending} onClick={submit} className="w-full">{pending ? "Calculating…" : "Complete screening"}</Button></div>;
}
