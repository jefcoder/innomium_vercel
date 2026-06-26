import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import { createClient } from "@/lib/supabase/server";
import { userNeedsOnboarding } from "@/lib/auth/onboarding";

export const metadata = { title: "Get Started" };

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOnboarding = user ? await userNeedsOnboarding(supabase, user) : false;

  return (
    <Suspense>
      <SignupForm isOnboarding={isOnboarding} />
    </Suspense>
  );
}
