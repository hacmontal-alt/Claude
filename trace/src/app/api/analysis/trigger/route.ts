import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { inngest } from "@/lib/inngest/client";

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandId } = await request.json();

  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }

  // Fetch brand details
  const { data: brand } = await supabase
    .from("brands")
    .select("id, brand_name, brand_url")
    .eq("id", brandId)
    .single();

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  // Fetch prompts for this brand
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id")
    .eq("brand_id", brandId)
    .eq("is_active", true);

  if (!prompts || prompts.length === 0) {
    return NextResponse.json({ error: "No active prompts found" }, { status: 400 });
  }

  // Fetch competitors
  const { data: competitors } = await supabase
    .from("competitors")
    .select("competitor_name")
    .eq("brand_id", brandId);

  const competitorNames = (competitors || []).map(c => c.competitor_name);

  // Create analysis run record
  const models = ["chatgpt", "gemini", "perplexity", "grok", "ai_overviews"];
  const { data: run, error: runError } = await supabase
    .from("analysis_runs")
    .insert({
      brand_id: brandId,
      status: "queued",
      prompt_count: prompts.length,
      models,
      is_sample: false,
    })
    .select("id")
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: "Failed to create analysis run" }, { status: 500 });
  }

  // Trigger Inngest job
  await inngest.send({
    name: "analysis/run.requested",
    data: {
      runId: run.id,
      brandId,
      promptIds: prompts.map(p => p.id),
      models,
      brandName: brand.brand_name,
      competitors: competitorNames,
    },
  });

  return NextResponse.json({ runId: run.id, status: "queued" });
}
