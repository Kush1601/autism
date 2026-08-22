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
      pathname.startsWith("/monitoring")) {
    return null;
  }

  return (
    <nav className="w-full h-16 border-b bg-white flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">Early Autism Screening</span>
      </Link>

      <div className="flex items-center gap-6 md:gap-8">
        <Link 
          href="/" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-neutral-600"
          )}
        >
          Home
        </Link>
        <Link 
          href="/login" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/login" ? "text-primary" : "text-neutral-600"
          )}
        >
          Login
        </Link>
        <Button asChild className="hidden sm:flex">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
}
