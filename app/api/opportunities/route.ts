import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/opportunities — list active opportunities with optional filtering
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const programType = searchParams.get("program_type");
    const fundingType = searchParams.get("funding_type");
    const country = searchParams.get("country");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("opportunities")
      .select("*")
      .eq("is_active", true)
      .order("deadline", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (programType) query = query.eq("program_type", programType);
    if (fundingType) query = query.eq("funding_type", fundingType);
    if (country) query = query.eq("country", country);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ opportunities: data });
  } catch (err) {
    console.error("[Opportunities] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
