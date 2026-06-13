"use client";

import { useState } from "react";
import type { UserProfile, DeadlineReminder } from "@/types";

const EXAMPLE_INSTRUCTIONS = [
  "No IELTS required",
  "Opportunities for Nigerians",
  "Women in STEM programs",
  "AI-related programs only",
  "Visa sponsorship preferred",
  "Can only travel after September",
  "Family-friendly options",
];

const REMINDER_OPTIONS: { value: DeadlineReminder; label: string }[] = [
  { value: "30_days", label: "30 days before" },
  { value: "14_days", label: "14 days before" },
  { value: "7_days", label: "7 days before" },
  { value: "3_days", label: "3 days before" },
  { value: "24_hours", label: "24 hours before" },
];

export default function Step4AIInstructions({
  data,
  onChange,
}: {
  data: Partial<UserProfile>;
  onChange: (d: Partial<UserProfile>) => void;
}) {
  const [charCount, setCharCount] = useState((data.ai_instructions || "").length);
  const reminders = data.deadline_reminders || ["7_days", "3_days", "24_hours"];

  function toggleReminder(r: DeadlineReminder) {
    if (reminders.includes(r)) {
      onChange({ deadline_reminders: reminders.filter((x) => x !== r) });
    } else {
      onChange({ deadline_reminders: [...reminders, r] });
    }
  }

  function appendExample(example: string) {
    const current = data.ai_instructions || "";
    const separator = current && !current.endsWith("\n") ? "\n" : "";
    const updated = `${current}${separator}${example}`;
    onChange({ ai_instructions: updated });
    setCharCount(updated.length);
  }

  return (
    <div className="space-y-6">
      {/* AI Instructions */}
      <div className="glass-panel p-8 rounded-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="font-headline text-xl font-bold">AI Personalizer</h3>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            <span className="text-primary font-semibold">Tell the AI anything important</span> when searching for opportunities.
            The more specific you are, the better your matches will be.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
            Your AI Instructions
          </label>
          <textarea
            className="input-glass w-full rounded-xl px-4 py-3 text-sm resize-none"
            placeholder="e.g. No IELTS required, opportunities for Nigerian students, AI-related programs, visa sponsorship preferred..."
            rows={6}
            maxLength={2000}
            value={data.ai_instructions || ""}
            onChange={(e) => {
              onChange({ ai_instructions: e.target.value });
              setCharCount(e.target.value.length);
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-on-surface-variant">Be as specific as possible for better results.</p>
            <span className="text-xs text-on-surface-variant">{charCount}/2000</span>
          </div>
        </div>

        {/* Quick Add Examples */}
        <div className="flex flex-col gap-3">
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Quick Add Examples</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_INSTRUCTIONS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => appendExample(ex)}
                className="px-3 py-1.5 text-xs border border-dashed border-outline-variant text-on-surface-variant rounded-full hover:border-primary hover:text-primary transition-all"
              >
                + {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-panel p-8 rounded-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">🔔</span>
          <h3 className="font-headline text-xl font-bold">Notification Preferences</h3>
        </div>

        {/* Email toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface-container-low">
          <div>
            <p className="font-label text-sm font-semibold text-on-surface">Email Notifications</p>
            <p className="text-xs text-on-surface-variant mt-1">Receive personalized scholarship matches via email</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.email_notifications ?? true}
            onClick={() => onChange({ email_notifications: !(data.email_notifications ?? true) })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              (data.email_notifications ?? true) ? "bg-primary" : "bg-outline-variant"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                (data.email_notifications ?? true) ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Deadline reminders */}
        <div className="flex flex-col gap-3">
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
            Deadline Reminder Schedule
          </p>
          <div className="space-y-2">
            {REMINDER_OPTIONS.map((r) => {
              const checked = reminders.includes(r.value);
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleReminder(r.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    checked
                      ? "bg-primary/10 border-primary/40"
                      : "border-outline-variant hover:border-primary/30"
                  }`}
                >
                  <span className={`text-sm font-label ${checked ? "text-primary" : "text-on-surface-variant"}`}>
                    {r.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      checked ? "bg-primary border-primary" : "border-outline-variant"
                    }`}
                  >
                    {checked && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="#002e6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ready summary */}
      <div className="glass-panel p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">✦</span>
          <div>
            <h4 className="font-headline font-bold text-primary mb-1">You're almost ready</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Once you click <strong className="text-on-surface">"Generate My Matches"</strong>, our AI will immediately start
              analyzing all available opportunities against your profile and surface the best ones for you — ranked by match score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
