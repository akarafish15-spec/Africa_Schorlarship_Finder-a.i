"use client";

import { useEffect, useState } from "react";
import { Map, Loader2 } from "lucide-react";
import { ActionPlanView } from "./ActionPlanView";
import { Button } from "@/components/ui/button";
import type { ActionPlan, UserProfile } from "@/types";

interface ActionPlanSectionProps {
  opportunityId: string;
  profile: UserProfile;
  matchId: string;
}

export function ActionPlanSection({ opportunityId }: ActionPlanSectionProps) {
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/action-plan?opportunityId=${opportunityId}`)
      .then((r) => r.json())
      .then((json) => {
        setPlan(json.plan || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [opportunityId]);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      });
      const json = await res.json();
      if (json.plan) setPlan(json.plan);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 font-label text-sm font-semibold text-on-surface">
        <Map className="w-4 h-4 text-tertiary" />
        AI Action Plan
      </h3>

      {plan ? (
        <ActionPlanView plan={plan} onUpdate={setPlan} />
      ) : (
        <div className="text-center py-4 space-y-3">
          <p className="text-sm text-on-surface-variant">
            Generate a personalized week-by-week application roadmap powered by AI.
          </p>
          <Button
            onClick={generate}
            disabled={generating}
            variant="ai"
            size="sm"
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>✦ Generate Action Plan</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
