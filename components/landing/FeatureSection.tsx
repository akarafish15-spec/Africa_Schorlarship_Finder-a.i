export default function FeatureSection() {
  return (
    <section id="features" className="py-24 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Animated card mockup */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-primary/10 blur-[60px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-tertiary/10 blur-[40px] rounded-full" />
          </div>
          <div className="glass-card rounded-3xl p-8 max-w-xs text-center animate-float border-primary/20 relative z-10">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✦
            </div>
            <h3 className="font-headline text-2xl font-bold mb-2 text-gradient-primary">
              98% Match
            </h3>
            <p className="font-label text-xs text-on-surface-variant mb-4 leading-relaxed">
              Commonwealth Scholarship for African Leaders matched your profile perfectly
            </p>
            <div className="space-y-1 text-left">
              {["Fully funded", "Open to Nigerian students", "AI-related field", "Masters level"].map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="text-primary">✓</span> {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text content */}
        <div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
            Designed for Global{" "}
            <span className="text-tertiary">Ambition</span>
          </h2>
          <p className="text-body text-lg text-on-surface-variant mb-8 leading-relaxed">
            Aura AI is more than a search engine. It&apos;s a strategic partner built to
            level the playing field for students who have the talent but lack access to
            complex global funding networks.
          </p>
          <div className="space-y-5">
            {[
              {
                title: "AI Match Scoring",
                desc: "Every opportunity gets a 0-100 match score against your profile, with detailed reasoning.",
              },
              {
                title: "Personalized Action Plans",
                desc: "Week-by-week AI-generated roadmaps so you know exactly what to do each step of the way.",
              },
              {
                title: "Continuous Monitoring",
                desc: "New opportunities are discovered daily and automatically matched to your profile.",
              },
              {
                title: "Smart Email Alerts",
                desc: "Receive personalized alerts when new high-match scholarships are found — no login required.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="text-primary mt-0.5 text-lg">✓</span>
                <div>
                  <h4 className="font-headline font-semibold text-base mb-1">{f.title}</h4>
                  <p className="font-label text-xs text-on-surface-variant">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
