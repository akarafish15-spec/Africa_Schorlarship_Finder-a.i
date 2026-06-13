import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sender";
import { deadlineReminderEmailHTML } from "@/lib/email/templates";
import type { UserProfile, Opportunity, OpportunityMatch, DeadlineReminder } from "@/types";

// POST /api/cron/deadline-reminders
// Run daily. Sends deadline reminder emails to users whose saved/matched opportunities are approaching.
// Requires Authorization: Bearer <CRON_SECRET>
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await createAdminClient();
  const stats = { checked: 0, sent: 0, errors: 0 };

  try {
    // Fetch all users with email notifications enabled
    const { data: profiles, error: profilesErr } = await admin
      .from("user_profiles")
      .select("*")
      .eq("onboarding_completed", true)
      .eq("email_notifications", true);

    if (profilesErr || !profiles) {
      return NextResponse.json({ error: "Could not fetch profiles" }, { status: 500 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const profile of profiles as UserProfile[]) {
      const reminderDays = getReminderDays(profile.deadline_reminders || ["7_days", "3_days", "24_hours"]);

      // Fetch user's non-hidden matches with upcoming deadlines
      const { data: matches } = await admin
        .from("opportunity_matches")
        .select("*, opportunity:opportunities(*)")
        .eq("user_id", profile.user_id)
        .eq("is_hidden", false)
        .not("opportunity", "is", null);

      if (!matches) continue;

      for (const match of matches as (OpportunityMatch & { opportunity: Opportunity })[]) {
        const opp = match.opportunity;
        if (!opp?.deadline) continue;

        const deadline = new Date(opp.deadline);
        deadline.setHours(0, 0, 0, 0);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (!reminderDays.includes(daysLeft)) continue;
        if (daysLeft < 0) continue; // Past deadline

        stats.checked++;

        // Check if we've already sent a reminder for this exact day
        const reminderKey = `reminder_${daysLeft}d`;
        const { data: existing } = await admin
          .from("opportunity_matches")
          .select("notified_email")
          .eq("id", match.id)
          .single();

        // Use a simple dedup: store sent reminder intervals in a JSON column if you want
        // For now we just send — production should track sent reminders

        try {
          await sendEmail({
            to: profile.email,
            subject: `⏰ ${daysLeft} Day${daysLeft !== 1 ? "s" : ""} Left — ${opp.name} Deadline`,
            html: deadlineReminderEmailHTML(profile, { ...match, opportunity: opp }, daysLeft),
          });
          stats.sent++;
          console.log(`[Cron:reminders] Sent ${reminderKey} reminder to ${profile.email} for ${opp.name}`);
        } catch (emailErr) {
          console.error("[Cron:reminders] Email error:", emailErr);
          stats.errors++;
        }
      }
    }

    console.log("[Cron:reminders] Complete:", stats);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    console.error("[Cron:reminders] Fatal error:", err);
    return NextResponse.json({ error: "Internal server error", stats }, { status: 500 });
  }
}

function getReminderDays(reminders: string[]): number[] {
  const map: Record<string, number> = {
    "30_days": 30,
    "14_days": 14,
    "7_days": 7,
    "3_days": 3,
    "24_hours": 1,
  };
  return reminders.map((r) => map[r]).filter(Boolean);
}
