import SignInCard from "@/components/onboarding/SignInCard";

export const metadata = { title: "Sign In – Aura AI" };

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-surface text-on-surface overflow-hidden relative">
      {/* Background orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-96 h-96 bg-primary/15 blur-[80px] rounded-full pointer-events-none animate-float" />
      <div className="fixed bottom-[-100px] right-[-100px] w-96 h-96 bg-tertiary/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Progress header */}
      <div className="w-full max-w-[600px] px-4 pt-12 flex flex-col gap-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-label text-xs text-primary tracking-widest uppercase">Step 1 of 2</span>
          <span className="font-label text-xs text-on-surface-variant uppercase">Getting Started</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500" style={{ width: "50%" }} />
        </div>
      </div>

      {/* Main card */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-[600px] px-4 py-8">
        <SignInCard />
      </main>

      <footer className="w-full py-6 flex justify-center border-t border-white/5 bg-surface-container-lowest/50">
        <p className="font-label text-xs text-on-surface-variant opacity-60">
          © 2024 Aura AI. Empowering Africa&apos;s next generation.
        </p>
      </footer>
    </div>
  );
}
