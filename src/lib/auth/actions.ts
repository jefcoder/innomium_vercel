"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authCopy } from "@/lib/auth/copy";
import { ensureProfile } from "@/lib/profiles/queries";
import { homeForAccountType } from "@/lib/supabase/middleware";
import type { AccountType } from "@/lib/profiles/types";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: authCopy.loginError };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await ensureProfile(user);
    const home = redirectTo || homeForAccountType(profile.account_type);
    redirect(home);
  }

  redirect(redirectTo || "/");
}

export async function signUpWithEmail(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const accountType = (formData.get("accountType") as AccountType) || "client";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, account_type: accountType },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: authCopy.emailAlreadyRegistered };
    }
    return { error: authCopy.signupError };
  }

  if (accountType === "talent_applicant") {
    redirect("/verify-email?next=/apply");
  }
  redirect("/verify-email");
}

export async function resetPasswordForEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/client/settings`,
  });
  return { success: authCopy.passwordResetSuccess };
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();
  const next = redirectTo || "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) return { error: authCopy.loginError };
  redirect(data.url);
}
