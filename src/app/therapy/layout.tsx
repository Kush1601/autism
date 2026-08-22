import Link from "next/link";
import { Activity } from "lucide-react";

export default function TherapySectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <header className="h-14 border-b bg-white/90 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <Activity className="h-5 w-5" />
          <span>Early Autism</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-neutral-600">
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link href="/chatbot" className="hover:text-primary">
            AI doctor
          </Link>
          <Link href="/monitoring" className="hover:text-primary">
            Reports
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
