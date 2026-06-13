import type { UserProfile } from "@/types";

const EDUCATION_LEVELS = [
  { value: "high_school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "masters", label: "Masters" },
  { value: "phd", label: "PhD" },
  { value: "postdoctoral", label: "Postdoctoral" },
  { value: "professional", label: "Professional" },
];

const ACADEMIC_INTERESTS = [
  "AI & Machine Learning", "Data Science", "Engineering", "Medicine & Health",
  "Agriculture", "Law", "Public Policy", "Climate & Environment",
  "Business", "Entrepreneurship", "Education", "Arts & Humanities",
  "Social Sciences", "Mathematics", "Physics", "Chemistry", "Biology",
  "Computer Science", "Architecture", "Economics",
];

export default function Step2Academic({
  data,
  onChange,
}: {
  data: Partial<UserProfile>;
  onChange: (d: Partial<UserProfile>) => void;
}) {
  const interests = data.academic_interests || [];

  function toggleInterest(interest: string) {
    if (interests.includes(interest)) {
      onChange({ academic_interests: interests.filter((i) => i !== interest) });
    } else {
      onChange({ academic_interests: [...interests, interest] });
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">🎓</span>
          <h3 className="font-headline text-xl font-bold">Academic Background</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Education Level">
            <select
              className="input-glass w-full rounded-lg px-4 py-3 text-sm bg-surface-container"
              value={data.education_level || "undergraduate"}
              onChange={(e) =>
                onChange({ education_level: e.target.value as UserProfile["education_level"] })
              }
            >
              {EDUCATION_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Graduation Year">
            <input
              className="input-glass w-full rounded-lg px-4 py-3 text-sm"
              type="number"
              placeholder="e.g. 2025"
              min={2020}
              max={2035}
              value={data.graduation_year || ""}
              onChange={(e) =>
                onChange({ graduation_year: e.target.value ? parseInt(e.target.value) : undefined })
              }
            />
          </Field>

          <Field label="Institution / University">
            <input
              className="input-glass w-full rounded-lg px-4 py-3 text-sm"
              placeholder="e.g. University of Lagos"
              value={data.institution || ""}
              onChange={(e) => onChange({ institution: e.target.value })}
            />
          </Field>

          <Field label="Course of Study">
            <input
              className="input-glass w-full rounded-lg px-4 py-3 text-sm"
              placeholder="e.g. Computer Science"
              value={data.course_of_study || ""}
              onChange={(e) => onChange({ course_of_study: e.target.value })}
            />
          </Field>

          <Field label="GPA (Optional)">
            <input
              className="input-glass w-full rounded-lg px-4 py-3 text-sm"
              placeholder="e.g. 3.8 / 4.0"
              value={data.gpa || ""}
              onChange={(e) => onChange({ gpa: e.target.value })}
            />
          </Field>
        </div>
      </div>

      {/* Exam Scores */}
      <div className="glass-panel p-8 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">📝</span>
          <h3 className="font-headline text-xl font-bold">Exam Scores <span className="text-on-surface-variant font-normal text-sm">(Optional)</span></h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "ielts_score", label: "IELTS", placeholder: "e.g. 7.0" },
            { key: "toefl_score", label: "TOEFL", placeholder: "e.g. 100" },
            { key: "gre_score", label: "GRE", placeholder: "e.g. 320" },
            { key: "gmat_score", label: "GMAT", placeholder: "e.g. 650" },
          ].map((exam) => (
            <Field key={exam.key} label={exam.label}>
              <input
                className="input-glass w-full rounded-lg px-4 py-3 text-sm"
                placeholder={exam.placeholder}
                value={(data as Record<string, unknown>)[exam.key] as string || ""}
                onChange={(e) => onChange({ [exam.key]: e.target.value })}
              />
            </Field>
          ))}
        </div>
      </div>

      {/* Academic Interests */}
      <div className="glass-panel p-8 rounded-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <span className="text-2xl">💡</span>
          <h3 className="font-headline text-xl font-bold">Academic Interests</h3>
        </div>
        <p className="text-on-surface-variant text-sm -mt-2">
          Select all that apply — the AI uses this to identify relevant opportunities.
        </p>

        <div className="flex flex-wrap gap-2">
          {ACADEMIC_INTERESTS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-label transition-all border ${
                  selected
                    ? "bg-primary/20 border-primary text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                }`}
              >
                {selected && "✓ "}{interest}
              </button>
            );
          })}
        </div>

        {/* Custom interest */}
        <div className="flex gap-3 items-center">
          <input
            className="input-glass flex-1 rounded-lg px-4 py-3 text-sm"
            placeholder="Add a custom interest..."
            id="custom-interest"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !interests.includes(val)) {
                  onChange({ academic_interests: [...interests, val] });
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <button
            type="button"
            className="px-5 py-3 border border-primary/40 text-primary rounded-lg text-sm hover:bg-primary/10 transition-all"
            onClick={() => {
              const input = document.getElementById("custom-interest") as HTMLInputElement;
              const val = input?.value.trim();
              if (val && !interests.includes(val)) {
                onChange({ academic_interests: [...interests, val] });
                input.value = "";
              }
            }}
          >
            + Add
          </button>
        </div>

        {interests.length > 0 && (
          <p className="text-xs text-on-surface-variant">
            {interests.length} interest{interests.length !== 1 ? "s" : ""} selected
          </p>
        )}
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
