import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Handles Supabase email confirmation links (e.g. after sign-up)
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarding_completed")
          .eq("user_id", user.id)
          .single();

        if (!profile?.onboarding_completed) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
}
