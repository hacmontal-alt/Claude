import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const brandId = request.nextUrl.searchParams.get("brandId");
  const runId = request.nextUrl.searchParams.get("runId");

  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }

  // Get the latest run or specific run
  let runQuery = supabase
    .from("analysis_runs")
    .select("*")
    .eq("brand_id", brandId);

  if (runId) {
    runQuery = runQuery.eq("id", runId);
  } else {
    runQuery = runQuery.order("started_at", { ascending: false }).limit(1);
  }

  const { data: runs } = await runQuery;
  const run = runs?.[0];

  if (!run) {
    return NextResponse.json({ run: null, results: [], sources: [] });
  }

  // Fetch results for this run
  const { data: results } = await supabase
    .from("analysis_results")
    .select("*, prompts(prompt_text, topics(name))")
    .eq("run_id", run.id);

  // Fetch cited sources
  const { data: sources } = await supabase
    .from("cited_sources")
    .select("*")
    .eq("run_id", run.id);

  return NextResponse.json({
    run,
    results: results || [],
    sources: sources || [],
  });
}
