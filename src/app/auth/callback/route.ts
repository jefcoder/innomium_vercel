import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ensureProfile } from "@/lib/profiles/queries";
import { homeForAccountType, normalizeAccountType } from "@/lib/auth/routes";
import { isFreshAuthUser } from "@/lib/auth/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const mode = searchParams.get("mode") ?? "login";
  const accountTypeParam = searchParams.get("accountType");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_error", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_error", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_error", request.url));
  }

  const signupCompleted = user.user_metadata?.signup_completed === true;
  const freshAccount = isFreshAuthUser(user.created_at);

  if (mode === "login") {
    if (!signupCompleted) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/signup?error=no_account", request.url));
    }
  }

  if (mode === "signup") {
    if (signupCompleted && !freshAccount) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=already_registered", request.url));
    }

    const accountType =
      accountTypeParam === "talent_applicant" ? "talent_applicant" : "client";

    await supabase.auth.updateUser({
      data: {
        signup_completed: true,
        account_type: accountType,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      },
    });

    await supabase
      .from("profiles")
      .update({
        account_type: accountType,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          null,
        display_name: user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.picture || null,
      })
      .eq("id", user.id);

    if (accountType === "client") {
      await supabase.from("client_profiles").upsert({ user_id: user.id });
    }
    if (accountType === "talent_applicant") {
      await supabase.from("talent_applications").upsert({ user_id: user.id });
    }

    const verifyPath =
      accountType === "talent_applicant" ? "/verify-email?next=/apply" : "/verify-email";
    return NextResponse.redirect(new URL(verifyPath, request.url));
  }

  const profile = await ensureProfile(user);
  if (!profile) {
    return NextResponse.redirect(new URL("/signup?error=no_account", request.url));
  }

  let path = next && next.startsWith("/") ? next : "/";
  if (!next) path = homeForAccountType(normalizeAccountType(profile.account_type));

  return NextResponse.redirect(new URL(path, request.url));
}
