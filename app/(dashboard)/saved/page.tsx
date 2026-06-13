"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { MatchCard } from "@/components/dashboard/MatchCard";
import type { OpportunityMatch } from "@/types";

export default function SavedPage() {
  const [matches, setMatches] = useState<OpportunityMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches?saved=true&limit=50")
      .then((r) => r.json())
      .then((json) => {
        setMatches(json.matches || []);
        setLoading(false);
      });
  }, []);

  function handleSave(matchId: string, saved: boolean) {
    if (!saved) {
      // Unsaved — remove from list
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    } else {
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, is_saved: saved } : m))
      );
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-secondary" /> Saved Opportunities
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          {matches.length} saved opportunit{matches.length !== 1 ? "ies" : "y"}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <p className="text-4xl mb-3">🔖</p>
          <p className="font-headline font-bold text-on-surface mb-1">No saved opportunities yet</p>
          <p className="text-sm text-on-surface-variant">
            Bookmark opportunities from the Matches page to find them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
