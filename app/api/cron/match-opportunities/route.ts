import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { calculateMatch } from "@/lib/ai/matching-engine";
import { sendEmail } from "@/lib/email/sender";
import { newMatchEmailHTML } from "@/lib/email/templates";
import type { UserProfile, Opportunity, OpportunityMatch } from "@/types";

// POST /api/cron/match-opportunities
// Called by cron job (e.g. daily). Runs AI matching for all users against new/unmatched opportunities.
// Requires Authorization: Bearer <CRON_SECRET>
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await createAdminClient();
  const stats = { users: 0, matched: 0, emails: 0, errors: 0 };

  try {
    // Fetch all users with completed onboarding
    const { data: profiles, error: profilesErr } = await admin
      .from("user_profiles")
      .select("*")
      .eq("onboarding_completed", true);

    if (profilesErr || !profiles) {
      return NextResponse.json({ error: "Could not fetch profiles" }, { status: 500 });
    }

    // Fetch all active opportunities
    const { data: opportunities, error: oppsErr } = await admin
      .from("opportunities")
      .select("*")
      .eq("is_active", true);

    if (oppsErr || !opportunities) {
      return NextResponse.json({ error: "Could not fetch opportunities" }, { status: 500 });
    }

    stats.users = profiles.length;

    for (const profile of profiles as UserProfile[]) {
      for (const opp of opportunities as Opportunity[]) {
        try {
          // Check if already matched
          const { data: existing } = await admin
            .from("opportunity_matches")
            .select("id")
            .eq("user_id", profile.user_id)
            .eq("opportunity_id", opp.id)
            .maybeSingle();

          if (existing) continue;

          const match = await calculateMatch(profile, opp);
          if (match.match_score < 40) continue;

          const { data: inserted, error: insertErr } = await admin
            .from("opportunity_matches")
            .insert({
              user_id: profile.user_id,
              opportunity_id: opp.id,
              match_score: match.match_score,
              match_reasons: match.match_reasons,
              missing_requirements: match.missing_requirements,
              application_readiness_score: match.application_readiness_score,
              improvement_suggestions: match.improvement_suggestions,
              ai_advice: match.ai_advice,
              notified_email: false,
            })
            .select()
            .single();

          if (insertErr) {
            stats.errors++;
            continue;
          }

          stats.matched++;

          // Send email notification for high-score new matches
          if (
            match.match_score >= 70 &&
            profile.email_notifications &&
            profile.email
          ) {
            try {
              const fullMatch: OpportunityMatch & { opportunity: Opportunity } = {
                ...(inserted as OpportunityMatch),
                opportunity: opp,
              };

              await sendEmail({
                to: profile.email,
                subject: `New Scholarship Match Found (${match.match_score}% Match) — Aura AI`,
                html: newMatchEmailHTML(profile, fullMatch),
              });

              // Mark as notified
              await admin
                .from("opportunity_matches")
                .update({ notified_email: true })
                .eq("id", inserted.id);

              stats.emails++;
            } catch (emailErr) {
              console.error("[Cron:match] Email error:", emailErr);
              stats.errors++;
            }
          }
        } catch (matchErr) {
          console.error(`[Cron:match] Error for user ${profile.user_id} / opp ${opp.id}:`, matchErr);
          stats.errors++;
        }
      }
    }

    console.log("[Cron:match] Complete:", stats);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("[Cron:match] Fatal error:", err);
    return NextResponse.json({ error: "Internal server error", stats }, { status: 500 });
  }
}
