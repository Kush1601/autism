"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  
  // Don't show this navbar on dashboard pages as they have their own navigation
  if (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/screening") ||
      pathname.startsWith("/results") ||
      pathname.startsWith("/chatbot") ||
      pathname.startsWith("/therapy") ||
      pathname.startsWith("/monitoring") ||
      pathname.startsWith("/feedback")) {
    return null;
  }

  return (
    <nav className="w-full h-16 border-b border-border/70 bg-background/90 backdrop-blur-sm flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-display text-lg text-foreground">
          Early Autism <span className="text-pine-600">Screening</span>
        </span>
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <Link
          href="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-pine-600",
            pathname === "/" ? "text-pine-600" : "text-muted-foreground"
          )}
        >
          Home
        </Link>
        <Link
          href="/login"
          className={cn(
            "text-sm font-medium transition-colors hover:text-pine-600",
            pathname === "/login" ? "text-pine-600" : "text-muted-foreground"
          )}
        >
          Login
        </Link>
        <Button asChild className="hidden sm:flex rounded-full">
          <Link href="/register">Get started</Link>
        </Button>
      </div>
    </nav>
  );
}
