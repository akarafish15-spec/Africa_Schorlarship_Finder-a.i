import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto glass-card rounded-[2rem] p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary/10 blur-[60px] -ml-24 -mb-24 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your{" "}
            <span className="text-gradient-primary">Future?</span>
          </h2>
          <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">
            Join over 10,000+ African scholars who have secured funding worth over $15M
            using Aura AI. Create your profile in under 10 minutes.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="px-12 py-4 bg-primary text-on-primary font-headline text-lg rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              Create Free Profile
            </Link>
            <span className="font-label text-xs text-on-surface-variant">
              No credit card · Free forever
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
