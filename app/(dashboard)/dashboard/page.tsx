import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { formatDeadline, daysUntil, deadlineUrgency } from "@/lib/utils";
import type { OpportunityMatch, UserProfile } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [profileResult, matchesResult] = await Promise.all([
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("opportunity_matches")
      .select("*, opportunity:opportunities(*)")
      .eq("user_id", user.id)
      .eq("is_hidden", false)
      .order("match_score", { ascending: false })
      .limit(50),
  ]);

  const profile = profileResult.data as UserProfile | null;
  const allMatches = (matchesResult.data || []) as OpportunityMatch[];

  // Stats
  const saved = allMatches.filter((m) => m.is_saved).length;
  const applied = allMatches.filter((m) => m.is_applied).length;
  const topScore = allMatches.length > 0 ? allMatches[0].match_score : 0;

  // Top 6 recent matches
  const topMatches = allMatches.slice(0, 6);

  // Upcoming deadlines (sorted by urgency, next 30 days)
  const upcomingDeadlines = allMatches
    .filter((m) => {
      const days = daysUntil(m.opportunity?.deadline);
      return days !== null && days > 0 && days <= 60;
    })
    .sort((a, b) => {
      const da = daysUntil(a.opportunity?.deadline) ?? 999;
      const db = daysUntil(b.opportunity?.deadline) ?? 999;
      return da - db;
    })
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const name = profile?.full_name?.split(" ")[0] || "Scholar";

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-on-surface-variant text-sm font-label">{greeting}</p>
        <h1 className="font-headline text-3xl font-extrabold text-on-surface mt-1">
          {name}, here&apos;s your overview ✦
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Aura AI is actively searching for opportunities that match your profile.
        </p>
      </div>

      {/* Stats */}
      <StatsBar total={allMatches.length} saved={saved} applied={applied} topScore={topScore} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top matches */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Top Matches
            </h2>
            <Link
              href="/matches"
              className="text-sm text-primary font-label flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topMatches.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-headline font-bold text-on-surface mb-1">
                Matches being generated
              </p>
              <p className="text-sm text-on-surface-variant">
                Our AI is analyzing opportunities. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMatches.map((match) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="space-y-4">
          <h2 className="font-headline text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-tertiary" />
            Upcoming Deadlines
          </h2>

          {upcomingDeadlines.length === 0 ? (
            <div className="glass-panel rounded-xl p-6 text-center">
              <p className="text-2xl mb-2">📅</p>
              <p className="text-sm text-on-surface-variant">No urgent deadlines right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((match) => {
                const days = daysUntil(match.opportunity?.deadline);
                const urgency = deadlineUrgency(match.opportunity?.deadline);
                return (
                  <Link
                    key={match.id}
                    href={`/opportunity/${match.opportunity?.id}`}
                    className="glass-panel rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all block"
                  >
                    <div
                      className={`text-center min-w-[48px] ${
                        urgency === "critical"
                          ? "text-error"
                          : urgency === "upcoming"
                          ? "text-tertiary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      <p className="font-headline font-bold text-xl leading-none">
                        {days}
                      </p>
                      <p className="text-[10px] font-label uppercase">days</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {match.opportunity?.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {formatDeadline(match.opportunity?.deadline)} · {match.match_score}% match
                      </p>
                    </div>
                    {urgency === "critical" && (
                      <span className="text-[10px] font-label font-bold text-error bg-error/10 border border-error/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        URGENT
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
