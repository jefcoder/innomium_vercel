"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "@/lib/auth/schemas";
import { signInWithEmail } from "@/lib/auth/actions";
import { AuthCard, AuthField, GoogleSignInButton } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("redirectTo", redirectTo);
    const result = await signInWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in to Innomium Talent">
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <AuthField label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" className="field-input" />
        </AuthField>
        <AuthField label="Password" error={errors.password?.message}>
          <input {...register("password")} type="password" className="field-input" />
        </AuthField>
        <Button type="submit" className="w-full" showArrow={!loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-6">
        <GoogleSignInButton redirectTo={redirectTo} />
      </div>
      <div className="mt-6 flex flex-col gap-2 text-sm">
        <Link href="/forgot-password" className="text-brand hover:underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-text-muted hover:text-text">
          Create an account
        </Link>
      </div>
    </AuthCard>
  );
}
