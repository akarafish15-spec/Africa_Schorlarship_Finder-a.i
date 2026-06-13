"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";
import Step1Personal from "./steps/Step1Personal";
import Step2Academic from "./steps/Step2Academic";
import Step3Preferences from "./steps/Step3Preferences";
import Step4AIInstructions from "./steps/Step4AIInstructions";

const STEPS = [
  "Personal Info",
  "Academic Background",
  "Preferences",
  "AI Personalizer",
];

type FormData = Partial<UserProfile>;

export default function OnboardingForm({
  initialProfile,
  userId,
}: {
  initialProfile: Partial<UserProfile> | null;
  userId: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: initialProfile?.full_name || "",
    email: initialProfile?.email || "",
    country: initialProfile?.country || "",
    nationality: initialProfile?.nationality || "",
    current_location: initialProfile?.current_location || "",
    education_level: initialProfile?.education_level || "undergraduate",
    institution: initialProfile?.institution || "",
    course_of_study: initialProfile?.course_of_study || "",
    gpa: initialProfile?.gpa || "",
    graduation_year: initialProfile?.graduation_year,
    academic_interests: initialProfile?.academic_interests || [],
    opportunity_types: initialProfile?.opportunity_types || ["scholarship"],
    funding_preference: initialProfile?.funding_preference || "any",
    program_level: initialProfile?.program_level || ["masters"],
    preferred_countries: initialProfile?.preferred_countries || [],
    start_timeline: initialProfile?.start_timeline || "flexible",
    study_format: initialProfile?.study_format || "in_person",
    language_preferences: initialProfile?.language_preferences || ["English"],
    ielts_score: initialProfile?.ielts_score || "",
    toefl_score: initialProfile?.toefl_score || "",
    gre_score: initialProfile?.gre_score || "",
    gmat_score: initialProfile?.gmat_score || "",
    ai_instructions: initialProfile?.ai_instructions || "",
    email_notifications: initialProfile?.email_notifications ?? true,
    deadline_reminders: initialProfile?.deadline_reminders || ["7_days", "3_days", "24_hours"],
  });

  function updateForm(updates: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  async function handleFinish() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ ...formData, onboarding_completed: true, user_id: userId })
        .eq("user_id", userId);

      if (error) throw error;

      // Trigger AI matching in background
      await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Save error:", err);
      setSaving(false);
    }
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header progress bar */}
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="font-headline text-xl font-extrabold text-primary">Aura AI</span>
            </div>
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`font-label text-[10px] uppercase tracking-wider ${
                  i <= step ? "text-primary" : "text-on-surface-variant/40"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-grow max-w-3xl w-full mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-bold text-primary mb-2">
            {step === 0 && "Personal Information"}
            {step === 1 && "Academic Background"}
            {step === 2 && "Opportunity Preferences"}
            {step === 3 && "AI Personalizer"}
          </h2>
          <p className="text-on-surface-variant">
            Our AI uses this data to match you with opportunities worth billions. Be as precise as possible.
          </p>
        </div>

        {step === 0 && <Step1Personal data={formData} onChange={updateForm} />}
        {step === 1 && <Step2Academic data={formData} onChange={updateForm} />}
        {step === 2 && <Step3Preferences data={formData} onChange={updateForm} />}
        {step === 3 && <Step4AIInstructions data={formData} onChange={updateForm} />}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10 pt-8 border-t border-white/5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-8 py-3 border border-outline-variant text-on-surface-variant rounded-xl font-label text-sm hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-10 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full font-label text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-10 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full font-label text-sm flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-70"
            >
              {saving ? "⟳ Generating Matches..." : "✦ Generate My Matches →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
