"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, EyeOff, ExternalLink, Clock, MapPin, Zap } from "lucide-react";
import { MatchScoreRing } from "./MatchScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDeadline, deadlineUrgency, daysUntil, formatFundingType } from "@/lib/utils";
import type { OpportunityMatch } from "@/types";

interface MatchCardProps {
  match: OpportunityMatch;
  onSave?: (matchId: string, saved: boolean) => void;
  onHide?: (matchId: string) => void;
  compact?: boolean;
}

export function MatchCard({ match, onSave, onHide, compact }: MatchCardProps) {
  const [saving, setSaving] = useState(false);
  const opp = match.opportunity;
  if (!opp) return null;

  const urgency = deadlineUrgency(opp.deadline);
  const days = daysUntil(opp.deadline);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match.id, is_saved: !match.is_saved }),
      });
      if (res.ok) onSave?.(match.id, !match.is_saved);
    } finally {
      setSaving(false);
    }
  }

  async function handleHide() {
    const res = await fetch("/api/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: match.id, is_hidden: true }),
    });
    if (res.ok) onHide?.(match.id);
  }

  const deadlineBadgeColor =
    urgency === "critical" ? "destructive" : urgency === "upcoming" ? "tertiary" : "outline";

  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-4 hover:border-primary/30 transition-all group">
      {/* Top row */}
      <div className="flex items-start gap-4">
        <MatchScoreRing score={match.match_score} size={compact ? 48 : 56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/opportunity/${opp.id}`}
              className="font-headline font-bold text-on-surface hover:text-primary transition-colors text-base leading-tight line-clamp-2 group-hover:text-primary"
            >
              {opp.name}
            </Link>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                title={match.is_saved ? "Unsave" : "Save"}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all"
              >
                {match.is_saved ? (
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              {onHide && (
                <button
                  onClick={handleHide}
                  title="Hide"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {opp.country}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> {formatFundingType(opp.funding_type)}
            </span>
            {opp.deadline && (
              <span
                className={`flex items-center gap-1 ${
                  urgency === "critical"
                    ? "text-error"
                    : urgency === "upcoming"
                    ? "text-tertiary"
                    : ""
                }`}
              >
                <Clock className="w-3 h-3" />
                {days !== null && days <= 30 ? `${days}d left` : formatDeadline(opp.deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">{opp.program_type}</Badge>
        <Badge variant={opp.funding_type === "fully_funded" ? "success" : "outline"}>
          {formatFundingType(opp.funding_type)}
        </Badge>
        {urgency === "critical" && <Badge variant="destructive">⚠ Urgent</Badge>}
        {match.application_readiness_score > 0 && (
          <Badge variant="secondary">Readiness: {match.application_readiness_score}%</Badge>
        )}
      </div>

      {/* AI advice snippet */}
      {match.ai_advice && !compact && (
        <p className="text-xs text-on-surface-variant line-clamp-2 italic border-l-2 border-primary/30 pl-3">
          {match.ai_advice}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={`/opportunity/${opp.id}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={opp.application_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-3.5 h-3.5" />
            Apply
          </a>
        </Button>
      </div>
    </div>
  );
}
