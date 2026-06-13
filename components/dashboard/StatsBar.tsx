import { Sparkles, Bookmark, Send, TrendingUp } from "lucide-react";

interface StatsBarProps {
  total: number;
  saved: number;
  applied: number;
  topScore: number;
}

export function StatsBar({ total, saved, applied, topScore }: StatsBarProps) {
  const stats = [
    { icon: Sparkles, label: "Total Matches", value: total, color: "text-primary", bg: "bg-primary/10" },
    { icon: Bookmark, label: "Saved", value: saved, color: "text-secondary", bg: "bg-secondary/10" },
    { icon: Send, label: "Applied", value: applied, color: "text-tertiary", bg: "bg-tertiary/10" },
    { icon: TrendingUp, label: "Top Score", value: `${topScore}%`, color: "text-green-400", bg: "bg-green-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className={`font-headline font-bold text-xl ${color}`}>{value}</p>
            <p className="text-xs text-on-surface-variant">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
