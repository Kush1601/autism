import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in to continue to your child&apos;s dashboard.
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-neutral-600">
        New here?{" "}
        <Link className="font-medium text-primary hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </main>
  );
}
