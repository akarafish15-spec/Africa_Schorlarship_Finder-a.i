import type { UserProfile, OpportunityType, ProgramLevel, FundingPreference, StartTimeline, StudyFormat } from "@/types";

const OPPORTUNITY_TYPES: { value: OpportunityType; label: string; emoji: string }[] = [
  { value: "scholarship", label: "Scholarships", emoji: "🎓" },
  { value: "fellowship", label: "Fellowships", emoji: "🏛️" },
  { value: "grant", label: "Grants", emoji: "💰" },
  { value: "internship", label: "Internships", emoji: "💼" },
  { value: "competition", label: "Competitions", emoji: "🏆" },
  { value: "research", label: "Research Programs", emoji: "🔬" },
  { value: "conference", label: "Conferences", emoji: "🎤" },
  { value: "exchange", label: "Exchange Programs", emoji: "✈️" },
  { value: "bootcamp", label: "Bootcamps", emoji: "💻" },
  { value: "startup_funding", label: "Startup Funding", emoji: "🚀" },
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

export default function Step3Preferences({
  data,
  onChange,
}: {
  data: Partial<UserProfile>;
  onChange: (d: Partial<UserProfile>) => void;
}) {
  const oppTypes = data.opportunity_types || [];
  const programLevels = data.program_level || [];
  const preferredCountries = data.preferred_countries || [];

  function toggle<T extends string>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  return (
    <div className="space-y-6">
      {/* Opportunity Types */}
      <div className="glass-panel p-8 rounded-xl space-y-5">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">🎯</span>
          <h3 className="font-headline text-xl font-bold">Opportunity Types</h3>
        </div>
        <p className="text-on-surface-variant text-sm -mt-1">What kinds of opportunities are you looking for?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {OPPORTUNITY_TYPES.map((t) => {
            const selected = oppTypes.includes(t.value);
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onChange({ opportunity_types: toggle(oppTypes, t.value) as OpportunityType[] })}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selected
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="text-sm font-label">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Funding & Level */}
      <div className="glass-panel p-8 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">💎</span>
          <h3 className="font-headline text-xl font-bold">Funding & Program Level</h3>
        </div>

        <Field label="Funding Preference">
          <div className="flex gap-3 flex-wrap">
            {[
              { value: "fully_funded", label: "Fully Funded", desc: "All costs covered" },
              { value: "partial", label: "Partial Funding", desc: "Some support" },
              { value: "any", label: "Any Funding", desc: "Show everything" },
            ].map((f) => {
              const selected = data.funding_preference === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onChange({ funding_preference: f.value as FundingPreference })}
                  className={`flex-1 min-w-[130px] p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? "bg-primary/10 border-primary"
                      : "border-outline-variant hover:border-primary/40"
                  }`}
                >
                  <div className={`font-label text-sm font-semibold ${selected ? "text-primary" : "text-on-surface"}`}>
                    {f.label}
                  </div>
                  <div className="text-on-surface-variant text-xs mt-1">{f.desc}</div>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Program Level">
          <div className="flex flex-wrap gap-2">
            {PROGRAM_LEVELS.map((l) => {
              const selected = programLevels.includes(l.value);
              return (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => onChange({ program_level: toggle(programLevels, l.value) as ProgramLevel[] })}
                  className={`px-4 py-2 rounded-full text-sm font-label border transition-all ${
                    selected
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary/50"
                  }`}
                >
                  {selected && "✓ "}{l.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {/* Countries & Timeline */}
      <div className="glass-panel p-8 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">🌍</span>
          <h3 className="font-headline text-xl font-bold">Location & Timeline</h3>
        </div>

        <Field label="Preferred Countries / Destinations">
          <div className="flex flex-wrap gap-2">
            {PREFERRED_COUNTRIES.map((c) => {
              const selected = preferredCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange({ preferred_countries: toggle(preferredCountries, c) })}
                  className={`px-4 py-2 rounded-full text-sm font-label border transition-all ${
                    selected
                      ? "bg-tertiary/20 border-tertiary text-tertiary"
                      : "border-outline-variant text-on-surface-variant hover:border-tertiary/50"
                  }`}
                >
                  {selected && "✓ "}{c}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Start Timeline">
            <select
              className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container"
              value={data.start_timeline || "flexible"}
              onChange={(e) => onChange({ start_timeline: e.target.value as StartTimeline })}
            >
              <option value="immediately">Immediately</option>
              <option value="within_3_months">Within 3 Months</option>
              <option value="within_6_months">Within 6 Months</option>
              <option value="within_1_year">Within 1 Year</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>

          <Field label="Study Format">
            <select
              className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container"
              value={data.study_format || "in_person"}
              onChange={(e) => onChange({ study_format: e.target.value as StudyFormat })}
            >
              <option value="remote">Remote</option>
              <option value="in_person">In-Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
