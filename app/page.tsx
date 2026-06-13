import Link from "next/link";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureSection from "@/components/landing/FeatureSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <LandingNav />
      <main className="pt-20">
        <HeroSection />
        <HowItWorks />
        <FeatureSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
