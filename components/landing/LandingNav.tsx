"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 flex justify-between items-center px-6 md:px-12 h-20 transition-colors duration-300 ${
        scrolled ? "bg-surface/80" : "bg-surface/30"
      }`}
    >
      <div className="flex items-center gap-8">
        <span className="font-headline text-2xl font-extrabold tracking-tighter text-primary">
          Aura AI
        </span>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-label">
            How It Works
          </a>
          <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-label">
            Features
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="hidden md:block text-on-surface-variant hover:text-primary transition-colors text-sm font-label"
        >
          Sign In
        </Link>
        <Link
          href="/sign-in"
          className="bg-primary text-on-primary font-label text-sm px-6 py-2.5 rounded-full transition-all hover:brightness-110 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
