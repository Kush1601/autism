import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl text-foreground">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start tracking your child&apos;s screening and progress.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-pine-600 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
