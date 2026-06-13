import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-12 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 blur-[120px] rounded-full" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-tertiary/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-label text-xs mb-8 animate-float">
          <span className="text-base">✦</span>
          AI-POWERED DISCOVERY FOR AFRICAN STUDENTS
        </div>

        <h1 className="font-headline text-4xl md:text-7xl font-extrabold max-w-4xl mx-auto mb-6 leading-tight tracking-tight">
          Opportunities Should{" "}
          <span className="text-gradient-primary">Find You</span>
        </h1>

        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop searching hundreds of websites. Create one profile and let AI discover
          scholarships, grants, fellowships, internships, and funding opportunities
          tailored specifically to your goals — delivered to your inbox.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/sign-in"
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary font-headline text-lg rounded-xl flex items-center justify-center gap-3 shadow-xl transition-transform hover:-translate-y-1 active:scale-95"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Link>
          <Link
            href="/sign-in"
            className="w-full md:w-auto px-10 py-4 border border-outline-variant bg-white/5 hover:bg-white/10 backdrop-blur-md text-on-surface font-headline text-lg rounded-xl transition-all"
          >
            Join Free
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-on-surface-variant/60 text-sm font-label">
          Join 10,000+ African scholars · $15M+ in secured funding
        </p>
      </div>

      {/* Dashboard preview mockup */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-0">
        <div className="md:col-span-8 glass-card rounded-2xl p-6 glow-edge">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-headline text-lg">Latest Matches for You</h3>
            <span className="text-tertiary font-label text-xs bg-tertiary/10 px-3 py-1 rounded-full border border-tertiary/20">
              3 New Opportunities
            </span>
          </div>
          <div className="space-y-3">
            {[
              { icon: "🎓", name: "Gates Cambridge Scholarship", sub: "Full Tuition + Living Stipend", amount: "£35,000" },
              { icon: "🔬", name: "Chevening Scholarship UK", sub: "Fully Funded Masters • United Kingdom", amount: "Fully Funded" },
              { icon: "🌍", name: "DAAD Research Fellowship", sub: "Research Residency in Germany", amount: "€934/mo" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-label text-sm text-on-surface">{item.name}</p>
                  <p className="font-label text-xs text-on-surface-variant">{item.sub}</p>
                </div>
                <span className="font-label text-xs text-tertiary font-semibold">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-lg mb-2">AI Insights</h3>
            <p className="font-label text-xs text-on-surface-variant">
              Your profile is 85% match for European PhD programs.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: "85%" }} />
            </div>
            <div className="flex justify-between font-label text-xs">
              <span className="text-on-surface-variant">Profile Strength</span>
              <span className="text-primary">Great</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
