export default function LandingFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <span className="font-headline text-2xl font-extrabold text-primary">Aura AI</span>
          <p className="font-label text-xs text-on-surface-variant max-w-xs mt-3 opacity-80 leading-relaxed">
            © 2024 Aura AI. Empowering Africa&apos;s next generation of global leaders with
            precision-matched opportunities.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <h5 className="font-label text-xs text-primary uppercase tracking-widest mb-1">Company</h5>
            <a href="#" className="font-label text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80">Privacy Policy</a>
            <a href="#" className="font-label text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="font-label text-xs text-primary uppercase tracking-widest mb-1">Resources</h5>
            <a href="#" className="font-label text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80">Scholarship Guide</a>
            <a href="#" className="font-label text-xs text-on-surface-variant hover:text-tertiary transition-colors opacity-80">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
