import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateWeeklyDigestRecommendation } from "@/lib/ai/matching-engine";
import { sendEmail } from "@/lib/email/sender";
import { weeklyDigestEmailHTML } from "@/lib/email/templates";
import type { UserProfile, Opportunity, OpportunityMatch, WeeklyDigestData } from "@/types";

// POST /api/cron/weekly-digest
// Run every Monday. Sends a personalized weekly opportunity digest to all users.
// Requires Authorization: Bearer <CRON_SECRET>
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await createAdminClient();
  const stats = { users: 0, sent: 0, errors: 0 };

  try {
    // Fetch users with email notifications enabled
    const { data: profiles, error: profilesErr } = await admin
      .from("user_profiles")
      .select("*")
      .eq("onboarding_completed", true)
      .eq("email_notifications", true);

    if (profilesErr || !profiles) {
      return NextResponse.json({ error: "Could not fetch profiles" }, { status: 500 });
    }

    stats.users = profiles.length;

    // "New this week" = matches created in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const profile of profiles as UserProfile[]) {
      try {
        // All non-hidden matches for this user
        const { data: allMatches } = await admin
          .from("opportunity_matches")
          .select("*, opportunity:opportunities(*)")
          .eq("user_id", profile.user_id)
          .eq("is_hidden", false)
          .order("match_score", { ascending: false });

        if (!allMatches || allMatches.length === 0) continue;

        const typed = allMatches as (OpportunityMatch & { opportunity: Opportunity })[];

        // New matches this week
        const newMatches = typed.filter(
          (m) => new Date(m.created_at) >= oneWeekAgo
        );

        // Top 5 by score
        const topMatches = typed.slice(0, 5);

        // Upcoming deadlines (next 30 days, sorted)
        const now = Date.now();
        const in30Days = now + 30 * 24 * 60 * 60 * 1000;
        const upcomingDeadlines = typed
          .filter((m) => {
            if (!m.opportunity?.deadline) return false;
            const d = new Date(m.opportunity.deadline).getTime();
            return d > now && d <= in30Days;
          })
          .sort((a, b) => {
            const da = new Date(a.opportunity!.deadline!).getTime();
            const db = new Date(b.opportunity!.deadline!).getTime();
            return da - db;
          })
          .slice(0, 5);

        // Generate AI recommendation text
        const topNames = topMatches
          .slice(0, 3)
          .map((m) => m.opportunity?.name)
          .filter(Boolean) as string[];

        let aiRecommendation = "";
        try {
          aiRecommendation = await generateWeeklyDigestRecommendation(profile, topNames);
        } catch (aiErr) {
          console.error("[Cron:digest] AI error for user", profile.user_id, aiErr);
          aiRecommendation =
            "Keep applying to your top matches and focus on opportunities with deadlines in the next 30 days. Your profile is well-positioned for several high-match opportunities.";
        }

        const digestData: WeeklyDigestData = {
          user: profile,
          newMatches,
          topMatches,
          upcomingDeadlines,
          aiRecommendation,
        };

        await sendEmail({
          to: profile.email,
          subject: `📬 Your Weekly Scholarship Digest — ${newMatches.length} New Match${newMatches.length !== 1 ? "es" : ""} This Week`,
          html: weeklyDigestEmailHTML(digestData),
        });

        stats.sent++;
        console.log(`[Cron:digest] Sent to ${profile.email}`);
      } catch (userErr) {
        console.error("[Cron:digest] Error for user", profile.user_id, userErr);
        stats.errors++;
      }
    }

    console.log("[Cron:digest] Complete:", stats);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("[Cron:digest] Fatal error:", err);
    return NextResponse.json({ error: "Internal server error", stats }, { status: 500 });
  }
}
