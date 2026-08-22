import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Start tracking your child&apos;s screening and progress.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{" "}
        <Link className="font-medium text-primary hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </main>
  );
}
