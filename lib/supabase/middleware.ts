import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname.startsWith("/sign-in");
  const isOnboarding = url.pathname.startsWith("/onboarding");
  const isDashboard =
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/matches") ||
    url.pathname.startsWith("/saved") ||
    url.pathname.startsWith("/settings") ||
    url.pathname.startsWith("/opportunity");

  if (!user && isDashboard) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    // Check if onboarding completed
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .single();

    if (!profile?.onboarding_completed) {
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
