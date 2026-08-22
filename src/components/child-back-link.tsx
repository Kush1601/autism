import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ChildBackLink({ childId, childName }: { childId: string; childName: string }) {
  return (
    <Link
      href={`/dashboard/child/${childId}`}
      className="group inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:border-emerald-200 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>Back to {childName}&apos;s profile</span>
    </Link>
  );
}
