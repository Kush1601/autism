import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to your child&apos;s dashboard.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link className="font-medium text-pine-600 hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </main>
  );
}
