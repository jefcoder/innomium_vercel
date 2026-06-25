"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Building2 } from "lucide-react";
import { signupSchema, type SignupForm } from "@/lib/auth/schemas";
import { signUpWithEmail } from "@/lib/auth/actions";
import { AuthCard, AuthField, GoogleSignInButton } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";
import type { AccountType } from "@/lib/profiles/types";

export function SignupForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("type") as AccountType | null;
  const [accountType, setAccountType] = useState<"client" | "talent_applicant" | null>(
    preselected === "client" || preselected === "talent_applicant" ? preselected : null
  );
  const [showForm, setShowForm] = useState(Boolean(accountType));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { accountType: accountType ?? "client" },
  });

  if (!showForm) {
    return (
      <div className="space-y-6">
        <AuthCard title="How will you use Innomium?">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setAccountType("client");
                setValue("accountType", "client");
                setShowForm(true);
              }}
              className="card-surface p-6 text-left hover:shadow-md"
            >
              <Building2 className="mb-3 text-brand" size={24} />
              <h3 className="font-semibold text-text">Client Account</h3>
              <p className="mt-2 text-sm text-text-muted">
                Browse verified talent, create requests, launch competitions.
              </p>
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountType("talent_applicant");
                setValue("accountType", "talent_applicant");
                setShowForm(true);
              }}
              className="card-surface p-6 text-left hover:shadow-md"
            >
              <GraduationCap className="mb-3 text-brand" size={24} />
              <h3 className="font-semibold text-text">Talent Account</h3>
              <p className="mt-2 text-sm text-text-muted">
                Apply to join the verified AI/ML talent network.
              </p>
            </button>
          </div>
        </AuthCard>
        <p className="text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set("fullName", data.fullName);
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("accountType", accountType ?? data.accountType);
    const result = await signUpWithEmail(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => setShowForm(false)} className="text-sm text-text-muted">
        ← Back
      </button>
      <AuthCard title="Create your account">
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <input type="hidden" {...register("accountType")} value={accountType ?? "client"} />
          <AuthField label="Full name" error={errors.fullName?.message}>
            <input {...register("fullName")} className="field-input" />
          </AuthField>
          <AuthField label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className="field-input" />
          </AuthField>
          <AuthField label="Password" error={errors.password?.message}>
            <input {...register("password")} type="password" className="field-input" />
          </AuthField>
          <AuthField label="Confirm password" error={errors.confirmPassword?.message}>
            <input {...register("confirmPassword")} type="password" className="field-input" />
          </AuthField>
          <Button type="submit" className="w-full" showArrow={!loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </AuthCard>
    </div>
  );
}
