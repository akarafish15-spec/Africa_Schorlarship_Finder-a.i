"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function SignInCard() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Account created! Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        // Check onboarding
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("onboarding_completed")
            .eq("user_id", user.id)
            .single();

          if (!profile?.onboarding_completed) {
            router.push("/onboarding");
          } else {
            router.push("/dashboard");
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel p-10 rounded-xl w-full flex flex-col items-center shadow-2xl relative overflow-hidden">
      {/* Corner glows */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-tertiary/10 blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-tertiary flex items-center justify-center shadow-lg shadow-primary/20 text-2xl">
          ✦
        </div>
      </div>

      <h1 className="relative z-10 font-headline text-3xl font-bold text-on-surface mb-1 tracking-tight">
        {mode === "signin" ? "Welcome back." : "Create your account."}
      </h1>
      <p className="relative z-10 text-sm text-on-surface-variant mb-8 text-center max-w-[320px] leading-relaxed">
        {mode === "signin"
          ? "Sign in to access your personalized scholarship matches."
          : "Join Aura AI and let opportunities find you."}
      </p>

      {/* Error / success messages */}
      {error && (
        <div className="relative z-10 w-full mb-4 px-4 py-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center">
          {error}
        </div>
      )}
      {message && (
        <div className="relative z-10 w-full mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full space-y-4">
        {mode === "signup" && (
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kola Adesina"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-glass w-full rounded-xl px-4 py-3 text-sm"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass w-full rounded-xl px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-label font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading
            ? "Please wait..."
            : mode === "signin"
            ? "Sign In →"
            : "Create Account →"}
        </button>
      </form>

      {/* Toggle mode */}
      <div className="relative z-10 mt-6 text-center">
        <p className="text-sm text-on-surface-variant">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}
            className="text-primary font-semibold hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>

      <p className="relative z-10 mt-4 text-xs text-on-surface-variant opacity-50 text-center px-4">
        By continuing, you agree to Aura AI&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
