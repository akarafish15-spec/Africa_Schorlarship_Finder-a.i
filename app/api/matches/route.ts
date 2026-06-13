import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { calculateMatch } from "@/lib/ai/matching-engine";
import { sendEmail } from "@/lib/email/sender";
import { newMatchEmailHTML } from "@/lib/email/templates";
import type { UserProfile, Opportunity, OpportunityMatch } from "@/types";

// POST /api/matches — trigger matching for a single user (called at onboarding finish)
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const admin = await createAdminClient();

    // Fetch the user profile
    const { data: profile, error: profileErr } = await admin
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch active opportunities
    const { data: opportunities, error: oppErr } = await admin
      .from("opportunities")
      .select("*")
      .eq("is_active", true);

    if (oppErr || !opportunities) {
      return NextResponse.json({ error: "Could not fetch opportunities" }, { status: 500 });
    }

    const results: { id: string; score: number }[] = [];

    for (const opp of opportunities as Opportunity[]) {
      try {
        // Skip already-matched
        const { data: existing } = await admin
          .from("opportunity_matches")
          .select("id")
          .eq("user_id", userId)
          .eq("opportunity_id", opp.id)
          .single();

        if (existing) continue;

        const match = await calculateMatch(profile as UserProfile, opp);

        // Only store matches with score >= 40
        if (match.match_score < 40) continue;

        const { data: inserted, error: insertErr } = await admin
          .from("opportunity_matches")
          .insert({
            user_id: userId,
            opportunity_id: opp.id,
            match_score: match.match_score,
            match_reasons: match.match_reasons,
            missing_requirements: match.missing_requirements,
            application_readiness_score: match.application_readiness_score,
            improvement_suggestions: match.improvement_suggestions,
            ai_advice: match.ai_advice,
          })
          .select()
          .single();

        if (insertErr) {
          console.error("[Matches] Insert error:", insertErr);
          continue;
        }

        results.push({ id: opp.id, score: match.match_score });

        // Send email for high-score matches (>= 70)
        if (
          match.match_score >= 70 &&
          profile.email_notifications &&
          profile.email
        ) {
          const fullMatch: OpportunityMatch & { opportunity: Opportunity } = {
            ...(inserted as OpportunityMatch),
            opportunity: opp,
          };

          await sendEmail({
            to: profile.email,
            subject: `New Scholarship Match Found (${match.match_score}% Match) — Aura AI`,
            html: newMatchEmailHTML(profile as UserProfile, fullMatch),
          }).catch((e) => console.error("[Matches] Email error:", e));
        }
      } catch (err) {
        console.error(`[Matches] Error processing opp ${opp.id}:`, err);
      }
    }

    return NextResponse.json({ matched: results.length, results });
  } catch (err) {
    console.error("[Matches] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/matches — return current user's matches (authenticated)
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const savedOnly = searchParams.get("saved") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase
      .from("opportunity_matches")
      .select("*, opportunity:opportunities(*)")
      .eq("user_id", user.id)
      .eq("is_hidden", false)
      .order("match_score", { ascending: false })
      .limit(limit);

    if (savedOnly) query = query.eq("is_saved", true);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ matches: data });
  } catch (err) {
    console.error("[Matches] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/matches — update a match (save, hide, apply)
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { matchId, ...updates } = body;

    if (!matchId) return NextResponse.json({ error: "Missing matchId" }, { status: 400 });

    const allowedFields = ["is_saved", "is_hidden", "is_applied"];
    const filteredUpdates: Record<string, boolean> = {};
    for (const key of allowedFields) {
      if (key in updates) filteredUpdates[key] = updates[key] as boolean;
    }

    const { data, error } = await supabase
      .from("opportunity_matches")
      .update(filteredUpdates)
      .eq("id", matchId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ match: data });
  } catch (err) {
    console.error("[Matches] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
