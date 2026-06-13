"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile, DeadlineReminder, OpportunityType, ProgramLevel } from "@/types";

const REMINDER_OPTIONS: { value: DeadlineReminder; label: string }[] = [
  { value: "30_days", label: "30 days before" },
  { value: "14_days", label: "14 days before" },
  { value: "7_days", label: "7 days before" },
  { value: "3_days", label: "3 days before" },
  { value: "24_hours", label: "24 hours before" },
];

const AFRICAN_COUNTRIES = [
  "Nigeria", "Kenya", "Ghana", "South Africa", "Ethiopia", "Tanzania", "Uganda",
  "Rwanda", "Senegal", "Côte d'Ivoire", "Cameroon", "Zimbabwe", "Zambia",
  "Botswana", "Mozambique", "Angola", "Egypt", "Morocco", "Tunisia", "Other"
];

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string }[] = [
  { value: "scholarship", label: "Scholarships" },
  { value: "fellowship", label: "Fellowships" },
  { value: "grant", label: "Grants" },
  { value: "internship", label: "Internships" },
  { value: "competition", label: "Competitions" },
  { value: "research", label: "Research Programs" },
  { value: "conference", label: "Conferences" },
  { value: "exchange", label: "Exchange Programs" },
  { value: "bootcamp", label: "Bootcamps" },
  { value: "startup_funding", label: "Startup Funding" },
];

const PROGRAM_LEVELS: { value: ProgramLevel; label: string }[] = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  { value: "postdoctoral", label: "Postdoctoral" },
  { value: "professional_certificate", label: "Professional Certificate" },
];

const PREFERRED_COUNTRIES = [
  "USA", "UK", "Canada", "Germany", "Netherlands", "Australia",
  "France", "Sweden", "Norway", "Denmark", "Japan", "China",
  "South Africa", "Any / Worldwide"
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((json) => {
        setProfile(json.profile || {});
        setLoading(false);
      });
  }, []);

  function update(partial: Partial<UserProfile>) {
    setProfile((prev) => ({ ...(prev || {}), ...partial }));
  }

  function toggle<T extends string>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !profile) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-on-surface flex items-center gap-2">
            <Settings className="w-7 h-7" /> Settings
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Update your profile and notification preferences.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </Button>
      </div>

      {/* Personal Info */}
      <FormSection title="👤 Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" value={profile.full_name || ""} onChange={(e) => update({ full_name: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" type="email" value={profile.email || ""} onChange={(e) => update({ email: e.target.value })} />
          </Field>
          <Field label="Nationality">
            <select className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container" value={profile.nationality || ""} onChange={(e) => update({ nationality: e.target.value })}>
              <option value="">Select...</option>
              {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Country of Residence">
            <select className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container" value={profile.country || ""} onChange={(e) => update({ country: e.target.value })}>
              <option value="">Select...</option>
              {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Current City">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" value={profile.current_location || ""} onChange={(e) => update({ current_location: e.target.value })} />
          </Field>
          <Field label="Languages Spoken">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" placeholder="e.g. English, French" value={profile.language_preferences?.join(", ") || ""} onChange={(e) => update({ language_preferences: e.target.value.split(",").map((l) => l.trim()).filter(Boolean) })} />
          </Field>
        </div>
      </FormSection>

      {/* Academic */}
      <FormSection title="🎓 Academic Background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Education Level">
            <select className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container" value={profile.education_level || "undergraduate"} onChange={(e) => update({ education_level: e.target.value as UserProfile["education_level"] })}>
              {["high_school","undergraduate","masters","phd","postdoctoral","professional"].map((l) => (
                <option key={l} value={l}>{l.replace("_", " ")}</option>
              ))}
            </select>
          </Field>
          <Field label="Institution">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" value={profile.institution || ""} onChange={(e) => update({ institution: e.target.value })} />
          </Field>
          <Field label="Course of Study">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" value={profile.course_of_study || ""} onChange={(e) => update({ course_of_study: e.target.value })} />
          </Field>
          <Field label="Graduation Year">
            <input className="input-glass w-full rounded-lg px-4 py-3 text-sm" type="number" value={profile.graduation_year || ""} onChange={(e) => update({ graduation_year: e.target.value ? parseInt(e.target.value) : undefined })} />
          </Field>
        </div>
      </FormSection>

      {/* Opportunity Preferences */}
      <FormSection title="🎯 Opportunity Preferences">
        <Field label="Opportunity Types">
          <div className="flex flex-wrap gap-2 mt-1">
            {OPPORTUNITY_TYPES.map((t) => {
              const selected = (profile.opportunity_types || []).includes(t.value);
              return (
                <button key={t.value} type="button" onClick={() => update({ opportunity_types: toggle(profile.opportunity_types || [], t.value) as OpportunityType[] })}
                  className={`px-3 py-1.5 rounded-full text-xs font-label border transition-all ${selected ? "bg-primary/20 border-primary text-primary" : "border-outline-variant text-on-surface-variant hover:border-primary/40"}`}>
                  {selected && "✓ "}{t.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Program Level">
          <div className="flex flex-wrap gap-2 mt-1">
            {PROGRAM_LEVELS.map((l) => {
              const selected = (profile.program_level || []).includes(l.value);
              return (
                <button key={l.value} type="button" onClick={() => update({ program_level: toggle(profile.program_level || [], l.value) as ProgramLevel[] })}
                  className={`px-3 py-1.5 rounded-full text-xs font-label border transition-all ${selected ? "bg-secondary/20 border-secondary text-secondary" : "border-outline-variant text-on-surface-variant hover:border-secondary/40"}`}>
                  {selected && "✓ "}{l.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Preferred Countries">
          <div className="flex flex-wrap gap-2 mt-1">
            {PREFERRED_COUNTRIES.map((c) => {
              const selected = (profile.preferred_countries || []).includes(c);
              return (
                <button key={c} type="button" onClick={() => update({ preferred_countries: toggle(profile.preferred_countries || [], c) })}
                  className={`px-3 py-1.5 rounded-full text-xs font-label border transition-all ${selected ? "bg-tertiary/20 border-tertiary text-tertiary" : "border-outline-variant text-on-surface-variant hover:border-tertiary/40"}`}>
                  {selected && "✓ "}{c}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Funding Preference">
            <select className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container" value={profile.funding_preference || "any"} onChange={(e) => update({ funding_preference: e.target.value as UserProfile["funding_preference"] })}>
              <option value="fully_funded">Fully Funded Only</option>
              <option value="partial">Partial Funding</option>
              <option value="any">Any Funding</option>
            </select>
          </Field>
          <Field label="Start Timeline">
            <select className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container" value={profile.start_timeline || "flexible"} onChange={(e) => update({ start_timeline: e.target.value as UserProfile["start_timeline"] })}>
              <option value="immediately">Immediately</option>
              <option value="within_3_months">Within 3 Months</option>
              <option value="within_6_months">Within 6 Months</option>
              <option value="within_1_year">Within 1 Year</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
        </div>
      </FormSection>

      {/* AI Instructions */}
      <FormSection title="🤖 AI Instructions">
        <Field label="Custom Instructions for AI">
          <textarea
            className="input-glass w-full rounded-xl px-4 py-3 text-sm resize-none"
            rows={5}
            placeholder="e.g. No IELTS required, opportunities for Nigerians, AI-related programs..."
            value={profile.ai_instructions || ""}
            onChange={(e) => update({ ai_instructions: e.target.value })}
          />
        </Field>
      </FormSection>

      {/* Notifications */}
      <FormSection title="🔔 Notifications">
        <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-low">
          <div>
            <p className="font-label text-sm font-semibold text-on-surface">Email Notifications</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Receive personalized scholarship matches via email</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={profile.email_notifications ?? true}
            onClick={() => update({ email_notifications: !(profile.email_notifications ?? true) })}
            className={`relative w-12 h-6 rounded-full transition-colors ${(profile.email_notifications ?? true) ? "bg-primary" : "bg-outline-variant"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${(profile.email_notifications ?? true) ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>

        <Field label="Deadline Reminder Schedule">
          <div className="space-y-2 mt-1">
            {REMINDER_OPTIONS.map((r) => {
              const checked = (profile.deadline_reminders || []).includes(r.value);
              return (
                <button key={r.value} type="button" onClick={() => update({ deadline_reminders: toggle(profile.deadline_reminders || [], r.value) as DeadlineReminder[] })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${checked ? "bg-primary/10 border-primary/40" : "border-outline-variant hover:border-primary/30"}`}>
                  <span className={`text-sm font-label ${checked ? "text-primary" : "text-on-surface-variant"}`}>{r.label}</span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${checked ? "bg-primary border-primary" : "border-outline-variant"}`}>
                    {checked && <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4L4.5 7.5L11 1" stroke="#002e6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </button>
              );
            })}
          </div>
        </Field>
      </FormSection>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <h2 className="font-headline text-lg font-bold text-on-surface border-b border-white/5 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
