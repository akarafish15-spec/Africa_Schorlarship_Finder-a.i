"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, Filter, Search } from "lucide-react";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { StatsBar } from "@/components/dashboard/StatsBar";
import type { OpportunityMatch } from "@/types";

type SortOption = "score" | "deadline" | "recent";
type FilterOption = "all" | "scholarship" | "fellowship" | "grant" | "internship" | "research";
type FundingFilter = "all" | "fully_funded" | "partial";

export default function MatchesPage() {
  const [matches, setMatches] = useState<OpportunityMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("score");
  const [typeFilter, setTypeFilter] = useState<FilterOption>("all");
  const [fundingFilter, setFundingFilter] = useState<FundingFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/matches?limit=100");
    const json = await res.json();
    setMatches(json.matches || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleSave(matchId: string, saved: boolean) {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, is_saved: saved } : m))
    );
  }

  function handleHide(matchId: string) {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  }

  // Filter & sort
  let filtered = matches.filter((m) => {
    const q = search.toLowerCase();
    const name = m.opportunity?.name?.toLowerCase() || "";
    const country = m.opportunity?.country?.toLowerCase() || "";
    if (q && !name.includes(q) && !country.includes(q)) return false;
    if (typeFilter !== "all" && m.opportunity?.program_type !== typeFilter) return false;
    if (fundingFilter !== "all" && m.opportunity?.funding_type !== fundingFilter) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "score") return b.match_score - a.match_score;
    if (sort === "deadline") {
      const da = a.opportunity?.deadline ? new Date(a.opportunity.deadline).getTime() : Infinity;
      const db = b.opportunity?.deadline ? new Date(b.opportunity.deadline).getTime() : Infinity;
      return da - db;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const stats = {
    total: matches.length,
    saved: matches.filter((m) => m.is_saved).length,
    applied: matches.filter((m) => m.is_applied).length,
    topScore: matches.length > 0 ? Math.max(...matches.map((m) => m.match_score)) : 0,
  };

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" /> My Matches
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          AI-curated opportunities ranked by your profile compatibility.
        </p>
      </div>

      <StatsBar {...stats} />

      {/* Filters */}
      <div className="glass-panel rounded-xl p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass w-full rounded-lg pl-9 pr-4 py-2.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="text-xs font-label text-on-surface-variant">Sort:</span>
            {(["score", "deadline", "recent"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1 rounded-full text-xs font-label transition-all ${
                  sort === s
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "border border-outline-variant text-on-surface-variant hover:border-primary/30"
                }`}
              >
                {s === "score" ? "Match Score" : s === "deadline" ? "Deadline" : "Recent"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs font-label text-on-surface-variant">Type:</span>
            {(["all", "scholarship", "fellowship", "grant", "internship", "research"] as FilterOption[]).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-label capitalize transition-all ${
                  typeFilter === f
                    ? "bg-secondary/20 text-secondary border border-secondary/30"
                    : "border border-outline-variant text-on-surface-variant hover:border-secondary/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-label text-on-surface-variant self-center">Funding:</span>
          {(["all", "fully_funded", "partial"] as FundingFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFundingFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-label transition-all ${
                fundingFilter === f
                  ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                  : "border border-outline-variant text-on-surface-variant hover:border-tertiary/30"
              }`}
            >
              {f === "all" ? "All" : f === "fully_funded" ? "Fully Funded" : "Partial"}
            </button>
          ))}
          <span className="ml-auto text-xs text-on-surface-variant self-center">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-headline font-bold text-on-surface mb-1">No matches found</p>
          <p className="text-sm text-on-surface-variant">
            {search ? "Try a different search term" : "No opportunities match your current filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} onSave={handleSave} onHide={handleHide} />
          ))}
        </div>
      )}
    </div>
  );
}
