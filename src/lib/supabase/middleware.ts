import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { AccountType } from "@/lib/profiles/types";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/verify-email"];

const ROLE_PREFIXES: { prefix: string; roles: AccountType[] }[] = [
  { prefix: "/client", roles: ["client", "admin"] },
  { prefix: "/talent", roles: ["talent", "talent_applicant", "admin"] },
  { prefix: "/admin", roles: ["admin"] },
];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

function getRoleGuard(pathname: string) {
  return ROLE_PREFIXES.find(
    (g) => pathname === g.prefix || pathname.startsWith(`${g.prefix}/`)
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const guard = getRoleGuard(pathname);

  if (guard && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    if (error) loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthRoute(pathname)) {
    const home = await resolveHomePath(supabase, user.id);
    const url = request.nextUrl.clone();
    url.pathname = home;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (guard && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single();

    const accountType = (profile?.account_type ?? "client") as AccountType;
    if (!guard.roles.includes(accountType)) {
      const home = homeForAccountType(accountType);
      const url = request.nextUrl.clone();
      url.pathname = home;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export function homeForAccountType(accountType: AccountType): string {
  switch (accountType) {
    case "admin":
      return "/admin";
    case "talent":
    case "talent_applicant":
      return "/talent";
    case "client":
    default:
      return "/client";
  }
}

async function resolveHomePath(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", userId)
    .single();
  return homeForAccountType((profile?.account_type ?? "client") as AccountType);
}
