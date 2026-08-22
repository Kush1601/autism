import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100-4rem)]">
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-28 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6 max-w-4xl">
          Supporting Your Child&apos;s <span className="text-primary">Development</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-10 leading-relaxed">
          A trusted screening tool to help parents identify potential autism risk patterns
          and track their child&apos;s progress over time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
        <p className="mt-8 text-xs text-neutral-400">
          Screening only — not a medical diagnosis. Always consult healthcare professionals for evaluation.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="bg-neutral-50/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Create an account</h3>
              <p className="text-neutral-500 leading-relaxed">
                Sign up or log in to get started. Securely manage your child&apos;s data and screening history.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Add your child&apos;s profile</h3>
              <p className="text-neutral-500 leading-relaxed">
                Simple details like age, gender, and developmental history to personalize the screening experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Complete & track</h3>
              <p className="text-neutral-500 leading-relaxed">
                Answer the questionnaire and access results, therapy tips, and progress tracking tools in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="mt-auto py-10 border-t">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-neutral-400">
          Screening only. Not a medical diagnosis.
        </div>
      </footer>
    </div>
  );
}
