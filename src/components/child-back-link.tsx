import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ChildBackLink({ childId, childName }: { childId: string; childName: string }) {
  return (
    <Link
      href={`/dashboard/child/${childId}`}
      className="group -ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{childName}&apos;s profile</span>
    </Link>
  );
}
