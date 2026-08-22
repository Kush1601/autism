"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitInteractiveGameFeedbackAction } from "@/app/actions/therapy";

const FACES = [
  { emotion: "Happy", emoji: "😀" },
  { emotion: "Sad", emoji: "😢" },
  { emotion: "Angry", emoji: "😠" },
  { emotion: "Surprised", emoji: "😲" },
  { emotion: "Scared", emoji: "😨" },
  { emotion: "Calm", emoji: "😌" },
];

const TOTAL_ROUNDS = 6;

type Round = {
  emoji: string;
  emotion: string;
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

function buildRounds(): Round[] {
  const order = shuffle(FACES);
  return Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
    const face = order[i % order.length];
    const wrongCandidates = shuffle(FACES.filter((f) => f.emotion !== face.emotion))
      .slice(0, 3)
      .map((f) => f.emotion);
    const options = shuffle([face.emotion, ...wrongCandidates]);
    return { emoji: face.emoji, emotion: face.emotion, options };
  });
}

export function EmotionGame({ childId, childName }: { childId: string; childName: string }) {
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
  const isCorrect = selected !== null && selected === round?.emotion;

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === round.emotion) setCorrectCount((c) => c + 1);
  }

  function handleContinue() {
    if (isLastRound) {
      const finalCorrect = correctCount;
      const score = Math.max(1, Math.round((finalCorrect / TOTAL_ROUNDS) * 10));
      startTransition(async () => {
        const result = await submitInteractiveGameFeedbackAction({
          childId,
          gameSlug: "emotion",
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
            <Sparkles className="h-5 w-5 text-pine-600" />
            Emotion matching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {childName} will see a face and pick the word that matches how it feels. There are {TOTAL_ROUNDS} short
            rounds — talk through the clues in the face together as you go.
          </p>
          <Button size="lg" onClick={() => setPhase("playing")}>
            Start emotion matching
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
            {childName} matched <span className="font-semibold text-foreground">{correctCount}</span> out of{" "}
            {TOTAL_ROUNDS} emotions correctly.
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
            <Sparkles className="h-5 w-5 text-pine-600" />
            Emotion matching
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Round {roundIndex + 1} of {TOTAL_ROUNDS}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">Which word matches this face?</p>

        <div className="flex items-center justify-center rounded-lg bg-muted/50 p-8">
          <span className="text-7xl">{round.emoji}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {round.options.map((option, i) => {
            const isSelected = selected === option;
            const showCorrect = selected !== null && option === round.emotion;
            const showWrong = isSelected && option !== round.emotion;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
                className={`flex h-16 items-center justify-center rounded-lg text-base font-medium ring-1 transition-colors ${
                  showCorrect
                    ? "bg-pine-50 text-pine-800 ring-2 ring-pine-500"
                    : showWrong
                      ? "bg-destructive/5 text-destructive ring-2 ring-destructive/40"
                      : "bg-card text-foreground ring-border hover:bg-muted"
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
            {isCorrect ? "That's right!" : `Not quite — this face looks ${round.emotion.toLowerCase()}`}
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
