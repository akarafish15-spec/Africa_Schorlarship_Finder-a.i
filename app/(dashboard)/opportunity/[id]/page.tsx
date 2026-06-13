import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Zap,
  Clock,
  BookOpen,
  ListChecks,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ActionPlanSection } from "@/components/dashboard/ActionPlanSection";
import { MatchScoreRing } from "@/components/dashboard/MatchScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDeadline, deadlineUrgency, daysUntil, formatFundingType } from "@/lib/utils";
import type { OpportunityMatch, Opportunity, UserProfile } from "@/types";

interface Props {
  params: { id: string };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [oppResult, matchResult, profileResult] = await Promise.all([
    supabase.from("opportunities").select("*").eq("id", params.id).single(),
    supabase
      .from("opportunity_matches")
      .select("*")
      .eq("user_id", user.id)
      .eq("opportunity_id", params.id)
      .maybeSingle(),
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
  ]);

  if (oppResult.error || !oppResult.data) notFound();

  const opp = oppResult.data as Opportunity;
  const match = matchResult.data as OpportunityMatch | null;
  const profile = profileResult.data as UserProfile | null;

  const urgency = deadlineUrgency(opp.deadline);
  const days = daysUntil(opp.deadline);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in max-w-5xl">
      {/* Back */}
      <Link
        href="/matches"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-label"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Matches
      </Link>

      {/* Header card */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {match && <MatchScoreRing score={match.match_score} size={72} strokeWidth={5} />}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge>{opp.program_type}</Badge>
              <Badge variant={opp.funding_type === "fully_funded" ? "success" : "outline"}>
                {formatFundingType(opp.funding_type)}
              </Badge>
              {urgency === "critical" && <Badge variant="destructive">⚠ Urgent</Badge>}
            </div>

            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface mb-2">
              {opp.name}
            </h1>

            {opp.host_institution && (
              <p className="text-on-surface-variant text-sm mb-3">{opp.host_institution}</p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {opp.country}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> {formatFundingType(opp.funding_type)}
              </span>
              {opp.deadline && (
                <span
                  className={`flex items-center gap-1.5 ${
                    urgency === "critical" ? "text-error" : urgency === "upcoming" ? "text-tertiary" : ""
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Deadline: {formatDeadline(opp.deadline)}
                  {days !== null && days <= 60 && ` (${days} days)`}
                </span>
              )}
              {opp.amount && (
                <span className="flex items-center gap-1.5 text-tertiary font-semibold">
                  💰 {opp.amount}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:min-w-[160px]">
            <Button asChild size="lg">
              <a href={opp.application_url} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — details */}
        <div className="lg:col-span-3 space-y-5">
          {/* Description */}
          <Section icon={<BookOpen className="w-4 h-4" />} title="About This Opportunity">
            <p className="text-sm text-on-surface-variant leading-relaxed">{opp.description}</p>
          </Section>

          {/* Benefits */}
          {opp.benefits.length > 0 && (
            <Section icon={<CheckCircle2 className="w-4 h-4" />} title="Benefits">
              <ul className="space-y-2">
                {opp.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Eligibility */}
          {opp.eligibility_requirements.length > 0 && (
            <Section icon={<ListChecks className="w-4 h-4" />} title="Eligibility Requirements">
              <ul className="space-y-2">
                {opp.eligibility_requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Tags */}
          {opp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {opp.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Right column — AI analysis + action plan */}
        <div className="lg:col-span-2 space-y-5">
          {match && (
            <>
              {/* Match analysis */}
              <Section icon={<Lightbulb className="w-4 h-4 text-primary" />} title="Why This Matches You">
                <ul className="space-y-2">
                  {match.match_reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                      <span className="text-primary mt-0.5">✦</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Missing requirements */}
              {match.missing_requirements.length > 0 && (
                <Section icon={<AlertTriangle className="w-4 h-4 text-tertiary" />} title="Requirements to Note">
                  <ul className="space-y-2">
                    {match.missing_requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <AlertTriangle className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Application readiness */}
              <Section icon={<Clock className="w-4 h-4 text-secondary" />} title="Application Readiness">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-headline font-bold text-secondary">
                    {match.application_readiness_score}
                    <span className="text-xl text-on-surface-variant">/100</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all"
                        style={{ width: `${match.application_readiness_score}%` }}
                      />
                    </div>
                  </div>
                </div>
                {match.improvement_suggestions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {match.improvement_suggestions.map((s, i) => (
                      <p key={i} className="text-xs text-on-surface-variant flex items-start gap-1.5">
                        <span className="text-secondary mt-0.5">→</span> {s}
                      </p>
                    ))}
                  </div>
                )}
              </Section>

              {/* AI advice */}
              {match.ai_advice && (
                <div className="glass-panel rounded-xl p-4 border-l-4 border-primary/40">
                  <p className="text-xs font-label text-primary uppercase tracking-wider mb-2">
                    🤖 AI Advisor
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed italic">
                    {match.ai_advice}
                  </p>
                </div>
              )}

              {/* Action Plan */}
              {profile && (
                <ActionPlanSection
                  opportunityId={opp.id}
                  profile={profile}
                  matchId={match.id}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-xl p-5 space-y-3">
      <h3 className="flex items-center gap-2 font-label text-sm font-semibold text-on-surface">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
