"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { submitScreeningAction } from "@/app/actions/screening";
import { Button } from "@/components/ui/button";

const questions = [
  "Does your child enjoy being swung or bounced on your knee?",
  "Does your child take an interest in other children?",
  "Does your child like climbing on things?",
  "Does your child enjoy playing peek-a-boo?",
  "Does your child ever pretend, for example talking on a toy phone?",
  "Does your child ever use their index finger to point to ask for something?",
  "Does your child ever use their index finger to point to indicate interest in something?",
  "Can your child play properly with small toys?",
  "Does your child ever bring objects over to show you something?",
  "Does your child look you in the eye for more than a second or two?",
];

export function ScreeningForm({ childId }: { childId: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const answeredCount = Object.keys(answers).length;

  function submit() {
    if (answeredCount !== 10) return setError("Please answer all ten questions.");
    startTransition(async () => {
      const values = Object.fromEntries(
        Array.from({ length: 10 }, (_, i) => [`a${i + 1}Score`, answers[i + 1]])
      );
      const result = await submitScreeningAction({
        childId,
        ...values,
      } as Parameters<typeof submitScreeningAction>[0]);
      if (result.error) return setError(result.error);
      router.push(`/results/${result.screeningId}`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator, in the same dot language as the games */}
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-4 rounded-xl border border-border bg-card/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5" aria-label={`${answeredCount} of 10 questions answered`}>
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className={
                i < answeredCount
                  ? "h-2 w-2 rounded-full bg-pine-500"
                  : "h-2 w-2 rounded-full bg-pine-100"
              }
            />
          ))}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{answeredCount} / 10 answered</p>
      </div>

      {questions.map((question, index) => {
        const n = index + 1;
        const value = answers[n];
        return (
          <fieldset
            key={n}
            className="rounded-xl border border-border bg-card p-5 transition-colors data-[answered=true]:border-pine-200"
            data-answered={value !== undefined}
          >
            <legend className="sr-only">{question}</legend>
            <p className="flex items-baseline gap-2 font-medium text-foreground">
              <span className="text-muted-foreground">{n}.</span>
              {question}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, [n]: 0 })}
                aria-pressed={value === 0}
                className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors sm:flex-none sm:px-6 ${
                  value === 0
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {value === 0 && <X className="h-4 w-4" />}
                No
              </button>
              <button
                type="button"
                onClick={() => setAnswers({ ...answers, [n]: 1 })}
                aria-pressed={value === 1}
                className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors sm:flex-none sm:px-6 ${
                  value === 1
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {value === 1 && <Check className="h-4 w-4" />}
                Yes
              </button>
            </div>
          </fieldset>
        );
      })}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button disabled={pending} onClick={submit} size="lg" className="w-full">
        {pending ? "Calculating…" : "Complete screening"}
      </Button>
    </div>
  );
}
