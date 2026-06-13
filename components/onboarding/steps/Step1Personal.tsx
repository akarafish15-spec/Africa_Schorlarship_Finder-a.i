import type { UserProfile } from "@/types";

const AFRICAN_COUNTRIES = [
  "Nigeria", "Kenya", "Ghana", "South Africa", "Ethiopia", "Tanzania", "Uganda",
  "Rwanda", "Senegal", "Côte d'Ivoire", "Cameroon", "Zimbabwe", "Zambia",
  "Botswana", "Mozambique", "Angola", "Egypt", "Morocco", "Tunisia", "Other"
];

export default function Step1Personal({
  data,
  onChange,
}: {
  data: Partial<UserProfile>;
  onChange: (d: Partial<UserProfile>) => void;
}) {
  return (
    <div className="glass-panel p-8 rounded-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <span className="text-2xl">👤</span>
        <h3 className="font-headline text-xl font-bold">Personal Credentials</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name">
          <input
            className="input-glass w-full rounded-lg px-4 py-3 text-sm"
            placeholder="e.g. Kola Adesina"
            value={data.full_name || ""}
            onChange={(e) => onChange({ full_name: e.target.value })}
          />
        </Field>

        <Field label="Email Address">
          <input
            className="input-glass w-full rounded-lg px-4 py-3 text-sm"
            type="email"
            placeholder="you@university.edu"
            value={data.email || ""}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </Field>

        <Field label="Nationality">
          <select
            className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container"
            value={data.nationality || ""}
            onChange={(e) => onChange({ nationality: e.target.value })}
          >
            <option value="">Select nationality...</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Country of Residence">
          <select
            className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container"
            value={data.country || ""}
            onChange={(e) => onChange({ country: e.target.value })}
          >
            <option value="">Select country...</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Current City / Location">
          <input
            className="input-glass w-full rounded-lg px-4 py-3 text-sm"
            placeholder="e.g. Lagos"
            value={data.current_location || ""}
            onChange={(e) => onChange({ current_location: e.target.value })}
          />
        </Field>

        <Field label="Languages Spoken">
          <input
            className="input-glass w-full rounded-lg px-4 py-3 text-sm"
            placeholder="e.g. English, French, Yoruba"
            value={data.language_preferences?.join(", ") || ""}
            onChange={(e) =>
              onChange({
                language_preferences: e.target.value.split(",").map((l) => l.trim()).filter(Boolean),
              })
            }
          />
        </Field>
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
