import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessRoute,
  homeForAccountType,
  normalizeAccountType,
} from "@/lib/auth/routes";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/verify-email"];

const PROTECTED_PREFIXES = ["/client", "/talent", "/admin"];

function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

function isProtectedRoute(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
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

  if (isProtectedRoute(pathname) && !user) {
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

  if (user && isProtectedRoute(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", user.id)
      .single();

    const accountType = normalizeAccountType(profile?.account_type);

    if (!canAccessRoute(accountType, pathname)) {
      const home = homeForAccountType(accountType);
      if (home !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = home;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
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
  return homeForAccountType(profile?.account_type);
}

// Re-export for server modules that already import from here
export { homeForAccountType, normalizeAccountType } from "@/lib/auth/routes";
