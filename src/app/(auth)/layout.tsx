export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-secondary/40">
      {children}
      <p className="mt-8 text-xs text-muted-foreground/80">
        Screening only. Not a medical diagnosis.
      </p>
    </div>
  );
}
