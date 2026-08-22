"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, Gamepad2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitInteractiveGameFeedbackAction } from "@/app/actions/therapy";

const SYMBOL_POOL = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"];
const TOTAL_ROUNDS = 6;

type Round = {
  sequence: string[];
  next: string;
  options: string[];
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRound(unitSize: number): Round {
  const unit = shuffle(SYMBOL_POOL).slice(0, unitSize);
  const repeats = unitSize === 2 ? 3 : 2;
  const extra = unitSize > 1 ? Math.floor(Math.random() * (unitSize - 1)) + 1 : 0;
  const totalShown = repeats * unitSize + extra;
  const sequence = Array.from({ length: totalShown }, (_, i) => unit[i % unitSize]);
  const next = unit[totalShown % unitSize];
  const wrongCandidates = shuffle(SYMBOL_POOL.filter((s) => s !== next)).slice(0, 3);
  const options = shuffle([next, ...wrongCandidates]);
  return { sequence, next, options };
}

function buildRounds(): Round[] {
  return Array.from({ length: TOTAL_ROUNDS }, (_, i) => buildRound(i < 3 ? 2 : 3));
}

export function PatternGame({ childId, childName }: { childId: string; childName: string }) {
  const [rounds] = useState<Round[]>(() => buildRounds());
  const [phase, setPhase] = useState<"intro" | "playing" | "complete">("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{ success?: boolean; feedback?: string; error?: string } | null>(
    null
  );

  const round = rounds[roundIndex];
  const isLastRound = roundIndex === TOTAL_ROUNDS - 1;
  const isCorrect = selected !== null && selected === round?.next;

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === round.next) setCorrectCount((c) => c + 1);
  }

  function handleContinue() {
    if (isLastRound) {
      const finalCorrect = correctCount;
      const score = Math.max(1, Math.round((finalCorrect / TOTAL_ROUNDS) * 10));
      startTransition(async () => {
        const result = await submitInteractiveGameFeedbackAction({
          childId,
          gameSlug: "pattern",
          score,
          roundsCorrect: finalCorrect,
          roundsTotal: TOTAL_ROUNDS,
        });
        setSubmitResult(result);
      });
      setPhase("complete");
    } else {
      setRoundIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (phase === "intro") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-pine-600" />
            Pattern play
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {childName} will see a short sequence of shapes. Look at the pattern together, then pick the shape that
            comes next. There are {TOTAL_ROUNDS} short rounds, no rush at all.
          </p>
          <Button size="lg" onClick={() => setPhase("playing")}>
            Start pattern play
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === "complete") {
    const score = Math.max(1, Math.round((correctCount / TOTAL_ROUNDS) * 10));
    return (
      <Card>
        <CardHeader>
          <CardTitle>Great work, {childName}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            {childName} got <span className="font-semibold text-foreground">{correctCount}</span> out of{" "}
            {TOTAL_ROUNDS} patterns correct.
          </p>
          <div className="rounded-lg bg-pine-50 px-4 py-3 text-sm font-medium text-pine-800">Score: {score} / 10</div>

          {isPending && <p className="text-sm text-muted-foreground">Saving progress…</p>}
          {submitResult?.success && (
            <div className="rounded-lg border border-pine-100 bg-pine-50/60 px-4 py-3 text-sm text-pine-900">
              Progress saved. {submitResult.feedback === "continue_plan"
                ? "Looks like the current plan is working well."
                : "The feedback agent suggests shorter rounds or a different activity next time."}
            </div>
          )}
          {submitResult?.error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submitResult.error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline">
              <Link href={`/therapy/${childId}`}>Back to activities</Link>
            </Button>
            <Button asChild>
              <Link href={`/monitoring?childId=${childId}`}>View progress in monitoring</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-pine-600" />
            Pattern play
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Round {roundIndex + 1} of {TOTAL_ROUNDS}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">What comes next in this pattern?</p>

        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 p-4 text-3xl">
          {round.sequence.map((symbol, i) => (
            <span key={i} className="flex h-12 w-12 items-center justify-center rounded-md bg-card ring-1 ring-border">
              {symbol}
            </span>
          ))}
          <span className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-pine-300 text-xl font-semibold text-pine-500">
            ?
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {round.options.map((option, i) => {
            const isSelected = selected === option;
            const showCorrect = selected !== null && option === round.next;
            const showWrong = isSelected && option !== round.next;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
                className={`flex h-20 items-center justify-center rounded-lg text-3xl ring-1 transition-colors ${
                  showCorrect
                    ? "bg-pine-50 ring-2 ring-pine-500"
                    : showWrong
                      ? "bg-destructive/5 ring-2 ring-destructive/40"
                      : "bg-card ring-border hover:bg-muted"
                } disabled:cursor-default`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
              isCorrect ? "bg-pine-50 text-pine-800" : "bg-amber-50 text-amber-800"
            }`}
          >
            {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {isCorrect ? "That's right!" : `Not quite — the pattern continues with ${round.next}`}
          </div>
        )}

        {selected !== null && (
          <Button size="lg" onClick={handleContinue}>
            {isLastRound ? "See results" : "Next round"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
