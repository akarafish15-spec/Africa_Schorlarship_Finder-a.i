import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateActionPlan } from "@/lib/ai/matching-engine";
import type { UserProfile, Opportunity } from "@/types";

// POST /api/action-plan — generate and store action plan for an opportunity
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { opportunityId } = await request.json();
    if (!opportunityId) return NextResponse.json({ error: "Missing opportunityId" }, { status: 400 });

    // Check if plan already exists
    const { data: existing } = await supabase
      .from("action_plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId)
      .single();

    if (existing) {
      // Return existing plan
      const { data: opp } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", opportunityId)
        .single();
      return NextResponse.json({ plan: { ...existing, opportunity: opp } });
    }

    // Fetch profile and opportunity
    const [profileResult, oppResult] = await Promise.all([
      supabase.from("user_profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("opportunities").select("*").eq("id", opportunityId).single(),
    ]);

    if (profileResult.error || !profileResult.data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (oppResult.error || !oppResult.data) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const profile = profileResult.data as UserProfile;
    const opportunity = oppResult.data as Opportunity;

    // Generate the plan via AI
    const generatedPlan = await generateActionPlan(profile, opportunity);

    // Store it
    const { data: inserted, error: insertErr } = await supabase
      .from("action_plans")
      .insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        plan: generatedPlan.weeks,
        progress: 0,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[ActionPlan] Insert error:", insertErr);
      return NextResponse.json({ error: "Could not save action plan" }, { status: 500 });
    }

    return NextResponse.json({ plan: { ...inserted, opportunity } });
  } catch (err) {
    console.error("[ActionPlan] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/action-plan?opportunityId=xxx — get existing plan
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get("opportunityId");

    if (!opportunityId) return NextResponse.json({ error: "Missing opportunityId" }, { status: 400 });

    const { data, error } = await supabase
      .from("action_plans")
      .select("*, opportunity:opportunities(*)")
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId)
      .single();

    if (error || !data) {
      return NextResponse.json({ plan: null });
    }

    return NextResponse.json({ plan: data });
  } catch (err) {
    console.error("[ActionPlan] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/action-plan — update task completion / progress
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { planId, plan, progress } = await request.json();
    if (!planId) return NextResponse.json({ error: "Missing planId" }, { status: 400 });

    const { data, error } = await supabase
      .from("action_plans")
      .update({ plan, progress })
      .eq("id", planId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ plan: data });
  } catch (err) {
    console.error("[ActionPlan] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
