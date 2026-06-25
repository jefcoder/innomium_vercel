"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordForEmail } from "@/lib/auth/actions";
import { AuthCard, AuthField } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    const formData = new FormData();
    formData.set("email", data.email);
    const result = await resetPasswordForEmail(formData);
    setMessage(result.success ?? "Check your email.");
    setLoading(false);
  };

  return (
    <AuthCard title="Reset your password">
      {message && <p className="mb-4 text-sm text-success">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthField label="Email">
          <input {...register("email")} type="email" className="field-input" required />
        </AuthField>
        <Button type="submit" className="w-full" showArrow={!loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthCard>
  );
}
