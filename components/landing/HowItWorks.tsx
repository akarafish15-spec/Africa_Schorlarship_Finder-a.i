const steps = [
  { icon: "👤", title: "Create Profile", desc: "One-time setup to define your academic background, goals, and preferences." },
  { icon: "🎯", title: "Tell Us Your Goals", desc: "Specify your field, funding needs, preferred countries, and start timeline." },
  { icon: "✦", title: "AI Finds Matches", desc: "Our engine scans thousands of opportunities in real-time and scores each match." },
  { icon: "🔔", title: "Get Reminders", desc: "Never miss a deadline with personalized email notifications." },
  { icon: "📋", title: "Receive Action Plans", desc: "Step-by-step AI-generated roadmaps for every application." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-12 bg-surface-container-low/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            How Aura{" "}
            <span className="text-gradient-primary">Accelerates</span> You
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Five simple steps from creating your profile to landing your dream opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {step.icon}
              </div>
              <div className="font-label text-xs text-primary/60 uppercase tracking-widest mb-2">
                Step {i + 1}
              </div>
              <h4 className="font-headline font-semibold text-base mb-2">{step.title}</h4>
              <p className="font-label text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
