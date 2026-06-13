"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignInCard() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleGoogleSignIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      console.error("Sign in error:", error);
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel p-10 rounded-xl w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
      {/* Corner glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-tertiary/10 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20 text-2xl">
          ✦
        </div>
      </div>

      <h1 className="relative z-10 font-headline text-3xl md:text-4xl font-bold text-on-surface mb-3 tracking-tight">
        Welcome to your future.
      </h1>
      <p className="relative z-10 text-base text-on-surface-variant mb-8 max-w-[360px] leading-relaxed">
        Aura AI connects Africa&apos;s brightest minds to global scholarships,
        fellowships, and opportunities.
      </p>

      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="relative z-10 group w-full max-w-[320px] bg-white text-[#1f1f1f] py-4 px-6 rounded-full font-label font-semibold flex items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="animate-spin text-xl">⟳</span>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        {loading ? "Connecting..." : "Sign in with Google"}
      </button>

      <div className="relative z-10 mt-6 space-y-4 w-full">
        <p className="text-xs text-on-surface-variant opacity-60 px-8 leading-relaxed">
          By signing in, you agree to Aura AI&apos;s{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
