"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
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
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Something went wrong</h2>
          <p className="text-neutral-500 mt-1 text-sm">
            An error occurred in this section. Try refreshing or go back to the dashboard home.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="rounded-xl">
            Try Again
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/dashboard">Dashboard Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
