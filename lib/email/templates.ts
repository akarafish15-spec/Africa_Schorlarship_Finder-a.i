import type { OpportunityMatch, UserProfile, WeeklyDigestData } from "@/types";

export function newMatchEmailHTML(
  profile: UserProfile,
  match: OpportunityMatch & { opportunity: NonNullable<OpportunityMatch["opportunity"]> }
): string {
  const opp = match.opportunity;
  const deadline = opp.deadline
    ? new Date(opp.deadline).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Rolling";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Scholarship Match Found</title>
  <style>
    body { background:#0e1322; color:#dee1f7; font-family:'Inter',sans-serif; margin:0; padding:0; }
    .container { max-width:600px; margin:0 auto; padding:32px 24px; }
    .logo { font-size:24px; font-weight:800; color:#adc6ff; margin-bottom:32px; }
    .badge { display:inline-block; background:rgba(173,198,255,0.1); border:1px solid rgba(173,198,255,0.3); color:#adc6ff; padding:4px 12px; border-radius:999px; font-size:12px; font-weight:600; letter-spacing:0.05em; margin-bottom:24px; }
    .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px; margin:24px 0; }
    .score { font-size:48px; font-weight:800; color:#adc6ff; }
    .score-label { color:#c2c6d6; font-size:14px; margin-top:4px; }
    .opp-name { font-size:22px; font-weight:700; color:#dee1f7; margin:16px 0 8px; }
    h3 { font-size:14px; font-weight:600; color:#c2c6d6; letter-spacing:0.05em; text-transform:uppercase; margin:20px 0 8px; }
    ul { padding-left:20px; margin:0; }
    li { color:#dee1f7; font-size:15px; line-height:1.6; margin-bottom:6px; }
    .deadline { display:inline-block; background:rgba(255,185,95,0.1); border:1px solid rgba(255,185,95,0.3); color:#ffb95f; padding:6px 14px; border-radius:8px; font-size:14px; margin:16px 0; }
    .btn { display:inline-block; padding:14px 28px; border-radius:12px; font-weight:600; font-size:15px; text-decoration:none; margin:8px; }
    .btn-primary { background:linear-gradient(135deg,#adc6ff,#d0bcff); color:#002e6a; }
    .btn-secondary { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); color:#dee1f7; }
    .footer { margin-top:40px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.05); color:#8c909f; font-size:12px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Aura AI</div>
    <div class="badge">✦ New Match Found</div>
    <p style="font-size:16px;color:#c2c6d6;margin-bottom:24px;">Hello ${profile.full_name},</p>
    <p style="font-size:16px;line-height:1.6;color:#dee1f7;margin-bottom:24px;">
      We found a new opportunity that closely matches your profile. Our AI has analyzed your background and believes this is worth your attention.
    </p>
    <div class="card">
      <div class="score">${match.match_score}%</div>
      <div class="score-label">Match Score</div>
      <div class="opp-name">${opp.name}</div>
      <p style="color:#c2c6d6;font-size:14px;margin:0;">${opp.country} · ${opp.funding_type.replace("_", " ")} · ${opp.program_type}</p>
      <div class="deadline">📅 Deadline: ${deadline}</div>
      <h3>Why It Matches You</h3>
      <ul>
        ${match.match_reasons.map((r) => `<li>${r}</li>`).join("")}
      </ul>
      ${
        match.missing_requirements.length > 0
          ? `<h3>Requirements to Note</h3><ul>${match.missing_requirements.map((r) => `<li>⚠️ ${r}</li>`).join("")}</ul>`
          : ""
      }
      ${
        match.ai_advice
          ? `<div style="margin-top:20px;padding:16px;background:rgba(173,198,255,0.05);border-left:3px solid #adc6ff;border-radius:0 8px 8px 0;">
               <p style="margin:0;font-size:14px;color:#c2c6d6;font-style:italic;">${match.ai_advice}</p>
             </div>`
          : ""
      }
    </div>
    <div style="text-align:center;margin:32px 0;">
      <a class="btn btn-primary" href="${process.env.NEXT_PUBLIC_APP_URL}/opportunity/${opp.id}">View Opportunity</a>
      <a class="btn btn-secondary" href="${opp.application_url}" target="_blank">Apply Now</a>
    </div>
    <div class="footer">
      <p>© 2024 Aura AI · Empowering Africa's next generation</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#adc6ff;">Manage notifications</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function weeklyDigestEmailHTML(data: WeeklyDigestData): string {
  const { user, newMatches, topMatches, upcomingDeadlines, aiRecommendation } =
    data;

  const formatDeadline = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Ongoing";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Weekly Opportunity Digest</title>
  <style>
    body { background:#0e1322; color:#dee1f7; font-family:'Inter',sans-serif; margin:0; padding:0; }
    .container { max-width:600px; margin:0 auto; padding:32px 24px; }
    .logo { font-size:24px; font-weight:800; color:#adc6ff; }
    .hero { background:linear-gradient(135deg,rgba(173,198,255,0.1),rgba(208,188,255,0.05)); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:28px; margin:24px 0; text-align:center; }
    .section-title { font-size:13px; font-weight:600; color:#c2c6d6; letter-spacing:0.05em; text-transform:uppercase; margin:28px 0 12px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px; }
    .opp-row { display:flex; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
    .opp-score { min-width:52px; font-size:20px; font-weight:800; color:#adc6ff; }
    .opp-name { font-weight:600; font-size:14px; color:#dee1f7; }
    .opp-meta { font-size:12px; color:#8c909f; margin-top:2px; }
    .urgent-chip { display:inline-block; background:rgba(255,180,171,0.1); border:1px solid rgba(255,180,171,0.3); color:#ffb4ab; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; margin-left:8px; }
    .ai-box { background:rgba(173,198,255,0.05); border:1px solid rgba(173,198,255,0.2); border-radius:12px; padding:20px; margin:20px 0; }
    .btn-cta { display:block; text-align:center; background:linear-gradient(135deg,#adc6ff,#d0bcff); color:#002e6a; padding:14px; border-radius:12px; text-decoration:none; font-weight:700; margin:28px 0; }
    .footer { margin-top:40px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); color:#8c909f; font-size:12px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Aura AI</div>
    <div class="hero">
      <p style="font-size:13px;color:#adc6ff;letter-spacing:0.05em;text-transform:uppercase;margin:0 0 8px;">Weekly Digest</p>
      <h1 style="font-size:26px;font-weight:800;margin:0 0 8px;">Your Week in Opportunities</h1>
      <p style="color:#c2c6d6;margin:0;">Hello ${user.full_name} 👋 Here's what Aura AI found for you this week.</p>
    </div>

    ${
      newMatches.length > 0
        ? `<div class="section-title">🆕 New Matches This Week (${newMatches.length})</div>
           ${newMatches
             .slice(0, 5)
             .map(
               (m) => `<div class="opp-row">
               <div class="opp-score">${m.match_score}%</div>
               <div>
                 <div class="opp-name">${m.opportunity?.name || "Opportunity"}</div>
                 <div class="opp-meta">${m.opportunity?.country} · ${m.opportunity?.funding_type?.replace("_", " ")} · Deadline: ${formatDeadline(m.opportunity?.deadline)}</div>
               </div>
             </div>`
             )
             .join("")}`
        : `<p style="color:#8c909f;text-align:center;padding:20px;">No new matches this week — we're still searching!</p>`
    }

    ${
      topMatches.length > 0
        ? `<div class="section-title">⭐ Top 5 Highest Match Scores</div>
           ${topMatches
             .slice(0, 5)
             .map(
               (m, i) => `<div class="opp-row">
               <div class="opp-score" style="color:#ffb95f;">#${i + 1}</div>
               <div>
                 <div class="opp-name">${m.opportunity?.name || "Opportunity"} <span style="color:#adc6ff;font-size:12px;">${m.match_score}%</span></div>
                 <div class="opp-meta">${m.opportunity?.country} · ${m.opportunity?.program_type}</div>
               </div>
             </div>`
             )
             .join("")}`
        : ""
    }

    ${
      upcomingDeadlines.length > 0
        ? `<div class="section-title">⏰ Deadlines Approaching</div>
           ${upcomingDeadlines
             .map((m) => {
               const daysLeft = m.opportunity?.deadline
                 ? Math.ceil(
                     (new Date(m.opportunity.deadline).getTime() -
                       Date.now()) /
                       (1000 * 60 * 60 * 24)
                   )
                 : null;
               return `<div class="opp-row">
               <div style="min-width:52px;">
                 <div style="font-size:11px;color:#8c909f;">Days left</div>
                 <div style="font-size:20px;font-weight:800;color:${daysLeft && daysLeft <= 7 ? "#ffb4ab" : "#ffb95f"};">${daysLeft ?? "?"}</div>
               </div>
               <div>
                 <div class="opp-name">${m.opportunity?.name || "Opportunity"}${daysLeft && daysLeft <= 7 ? '<span class="urgent-chip">URGENT</span>' : ""}</div>
                 <div class="opp-meta">Deadline: ${formatDeadline(m.opportunity?.deadline)}</div>
               </div>
             </div>`;
             })
             .join("")}`
        : ""
    }

    <div class="ai-box">
      <p style="font-size:13px;font-weight:600;color:#adc6ff;margin:0 0 8px;">🤖 Aura AI Recommendation</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#dee1f7;">${aiRecommendation}</p>
    </div>

    <a class="btn-cta" href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Full Dashboard →</a>

    <div class="footer">
      <p>© 2024 Aura AI · Empowering Africa's next generation</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#adc6ff;">Manage email preferences</a> · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#adc6ff;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

export function deadlineReminderEmailHTML(
  profile: UserProfile,
  match: OpportunityMatch & { opportunity: NonNullable<OpportunityMatch["opportunity"]> },
  daysUntilDeadline: number
): string {
  const opp = match.opportunity;
  const urgency =
    daysUntilDeadline <= 3 ? "🚨 URGENT" : daysUntilDeadline <= 7 ? "⚠️ Soon" : "📅";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Deadline Reminder: ${opp.name}</title>
  <style>
    body { background:#0e1322; color:#dee1f7; font-family:'Inter',sans-serif; margin:0; padding:0; }
    .container { max-width:600px; margin:0 auto; padding:32px 24px; }
    .logo { font-size:24px; font-weight:800; color:#adc6ff; margin-bottom:24px; }
    .urgency-banner { background:${daysUntilDeadline <= 3 ? "rgba(255,180,171,0.1)" : "rgba(255,185,95,0.1)"}; border:1px solid ${daysUntilDeadline <= 3 ? "rgba(255,180,171,0.3)" : "rgba(255,185,95,0.3)"}; border-radius:12px; padding:16px 20px; margin-bottom:24px; text-align:center; }
    .urgency-text { font-size:20px; font-weight:800; color:${daysUntilDeadline <= 3 ? "#ffb4ab" : "#ffb95f"}; }
    .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px; }
    .btn { display:block; text-align:center; background:linear-gradient(135deg,#adc6ff,#d0bcff); color:#002e6a; padding:14px; border-radius:12px; text-decoration:none; font-weight:700; margin-top:24px; }
    .footer { margin-top:32px; color:#8c909f; font-size:12px; text-align:center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Aura AI</div>
    <div class="urgency-banner">
      <div class="urgency-text">${urgency} ${daysUntilDeadline} Day${daysUntilDeadline !== 1 ? "s" : ""} Left</div>
      <p style="margin:4px 0 0;color:#c2c6d6;font-size:14px;">Don't miss your deadline for</p>
    </div>
    <div class="card">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;">${opp.name}</h2>
      <p style="color:#c2c6d6;margin:0 0 16px;font-size:14px;">${opp.country} · ${opp.funding_type.replace("_", " ")} · ${match.match_score}% match</p>
      <p style="color:#dee1f7;line-height:1.6;">Hello ${profile.full_name}, your application deadline is approaching. Make sure you have everything ready:</p>
      ${
        match.missing_requirements.length > 0
          ? `<ul style="padding-left:20px;">${match.missing_requirements.map((r) => `<li style="color:#ffb4ab;margin-bottom:6px;">${r}</li>`).join("")}</ul>`
          : `<p style="color:#4ade80;">✅ You appear to meet all requirements. Time to submit!</p>`
      }
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/opportunity/${opp.id}">View Opportunity & Apply</a>
    </div>
    <div class="footer">
      <p>© 2024 Aura AI · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#adc6ff;">Manage reminders</a></p>
    </div>
  </div>
</body>
</html>`;
}
