"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Something went wrong</h1>
          <p className="text-neutral-500 mt-2 text-sm">
            An unexpected error occurred. Your data is safe — please try again or return to the dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="rounded-xl">
            Try Again
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
