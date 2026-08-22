import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, LogOut, MessageSquare, Activity, Menu, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Session } from "next-auth";

const SidebarContent = ({ session }: { session: Session | null }) => (
  <div className="flex flex-col h-full bg-white">
    <div className="p-8">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
        <div className="bg-emerald-50 p-2 rounded-lg">
          <Activity className="h-6 w-6" />
        </div>
        <span className="tracking-tight">Early Autism</span>
      </Link>
    </div>

    <nav className="flex-1 px-6 space-y-2">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-600 rounded-2xl hover:bg-neutral-50 hover:text-primary transition-all group"
      >
        <LayoutDashboard className="h-5 w-5 group-hover:text-primary transition-colors" />
        Dashboard
      </Link>
      <Link
        href="/dashboard/child/new"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-600 rounded-2xl hover:bg-neutral-50 hover:text-primary transition-all group"
      >
        <Users className="h-5 w-5 group-hover:text-primary transition-colors" />
        Add Child
      </Link>
      <Link
        href="/dashboard/therapy"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-600 rounded-2xl hover:bg-neutral-50 hover:text-primary transition-all group"
      >
        <Gamepad2 className="h-5 w-5 group-hover:text-primary transition-colors" />
        Therapy
      </Link>
      <Link
        href="/chatbot"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-600 rounded-2xl hover:bg-neutral-50 hover:text-primary transition-all group"
      >
        <MessageSquare className="h-5 w-5 group-hover:text-primary transition-colors" />
        AI Doctor
      </Link>
      <Link
        href="/monitoring"
        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-neutral-600 rounded-2xl hover:bg-neutral-50 hover:text-primary transition-all group"
      >
        <FileText className="h-5 w-5 group-hover:text-primary transition-colors" />
        Reports
      </Link>
    </nav>

    <div className="p-6 border-t border-neutral-100">
      <div className="flex items-center gap-3 px-2 py-4 mb-4 bg-neutral-50 rounded-2xl border border-neutral-100">
        <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200">
          {session?.user?.name?.[0] || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 truncate">
            {session?.user?.name}
          </p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 truncate">
            Parent Account
          </p>
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-2xl h-12 transition-all"
          type="submit"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </form>
    </div>
  </div>
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-[#fcfcfc]">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-100 hidden md:flex flex-col shrink-0">
        <SidebarContent session={session} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent session={session} />
              </SheetContent>
            </Sheet>
            
            <h2 className="text-xl font-bold text-primary md:hidden">
              Early Autism
            </h2>
            <h2 className="text-2xl font-bold text-neutral-900 hidden md:block">
              Welcome back, <span className="text-primary">{session?.user?.name?.split(' ')[0]}</span>
            </h2>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-xs font-bold text-primary uppercase tracking-widest leading-none mt-0.5">Live Agent Active</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
        
        <footer className="py-8 border-t border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold">
              Screening only. Not a medical diagnosis.
            </p>
        </footer>
      </main>
    </div>
  );
}
