import Link from "next/link";
import { Button } from "@/components/ui/button";

const milestones = [
  {
    step: "Create an account",
    detail:
      "Sign up or log in to get started. Securely manage your child's data and screening history.",
  },
  {
    step: "Add your child's profile",
    detail:
      "Simple details like age, gender, and developmental history to personalize the screening experience.",
  },
  {
    step: "Complete & track",
    detail:
      "Answer the questionnaire and access results, therapy tips, and progress tracking tools in one place.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <p className="font-display text-sm tracking-[0.2em] uppercase text-pine-600 mb-5">
              Early Autism Screening
            </p>
            <h1 className="font-display text-[2.75rem] leading-[1.08] md:text-6xl md:leading-[1.05] text-foreground mb-6 max-w-xl">
              Every child grows at their own pace.
              <br />
              <span className="text-pine-600">Notice it sooner.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-9 leading-relaxed">
              A trusted screening tool to help parents spot potential autism risk
              patterns early, and follow their child&apos;s progress step by step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button size="lg" className="h-14 px-8 text-base rounded-full" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </div>
            <p className="mt-8 text-xs text-muted-foreground/80 max-w-sm">
              Screening only — not a medical diagnosis. Always consult healthcare
              professionals for evaluation.
            </p>
          </div>

          {/* Signature element: a hand-plotted developmental milestone curve, */}
          {/* the pediatrician's growth-chart made personal rather than clinical. */}
          <div className="relative hidden md:block">
            <svg viewBox="0 0 360 320" className="w-full h-auto" role="img" aria-label="A gently rising milestone curve with three markers, representing steady developmental progress">
              <path
                d="M 20 270 C 90 260, 130 180, 180 150 C 230 120, 260 70, 340 40"
                fill="none"
                stroke="#B9D7C1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 10"
              />
              <path
                d="M 20 270 C 90 260, 130 180, 180 150 C 230 120, 260 70, 340 40"
                fill="none"
                stroke="#386B52"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="20" cy="270" r="6" fill="#386B52" />
              <circle cx="180" cy="150" r="6" fill="#386B52" />
              <circle cx="340" cy="40" r="7" fill="#D98E3E" />
              <rect x="14" y="284" width="82" height="18" fill="#FAF8F5" />
              <rect x="139" y="166" width="94" height="18" fill="#FAF8F5" />
              <rect x="264" y="12" width="68" height="18" fill="#FAF8F5" />
              <text x="20" y="296" fontFamily="var(--font-display)" fontSize="13" fill="#5B6960">first steps</text>
              <text x="145" y="178" fontFamily="var(--font-display)" fontSize="13" fill="#5B6960">first words</text>
              <text x="270" y="24" fontFamily="var(--font-display)" fontSize="13" fill="#8A5A28">thriving</text>
            </svg>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/70 bg-secondary/50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-foreground mb-14">How it works</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
            {milestones.map((m, i) => (
              <li key={m.step} className="relative pl-0">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-display text-4xl text-pine-200 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl text-foreground">{m.step}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{m.detail}</p>
                {i < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-5 -right-5 w-5 h-px bg-border" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-border/70">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground/80">
          Screening only. Not a medical diagnosis.
        </div>
      </footer>
    </div>
  );
}
