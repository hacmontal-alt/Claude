import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ brands: [], brandData: null });
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user's org
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return NextResponse.json({ brands: [], brandData: null });
    }

    // Get all brands for this org
    const { data: brands } = await supabase
      .from("brands")
      .select("*")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: true });

    if (!brands || brands.length === 0) {
      return NextResponse.json({ brands: [], brandData: null });
    }

    // Get the brand ID from query param or default to first
    const url = new URL(req.url);
    const brandId = url.searchParams.get("brandId") || brands[0].id;

    // Load all brand data
    const [topicsRes, promptsRes, competitorsRes, runsRes] = await Promise.all([
      supabase.from("topics").select("*").eq("brand_id", brandId),
      supabase
        .from("prompts")
        .select("*")
        .eq("brand_id", brandId)
        .order("created_at"),
      supabase.from("competitors").select("*").eq("brand_id", brandId),
      supabase
        .from("analysis_runs")
        .select("*")
        .eq("brand_id", brandId)
        .order("started_at", { ascending: false })
        .limit(1),
    ]);

    const run = runsRes.data?.[0] ?? null;
    let results: any[] = [];
    let sources: any[] = [];

    if (run) {
      const [resultsRes, sourcesRes] = await Promise.all([
        supabase.from("analysis_results").select("*").eq("run_id", run.id),
        supabase.from("cited_sources").select("*").eq("run_id", run.id),
      ]);
      results = resultsRes.data ?? [];
      sources = sourcesRes.data ?? [];
    }

    return NextResponse.json({
      brands,
      brandData: {
        topics: topicsRes.data ?? [],
        prompts: promptsRes.data ?? [],
        competitors: competitorsRes.data ?? [],
        latestRun: run,
        results,
        sources,
      },
    });
  } catch (error) {
    console.error("Failed to load brands:", error);
    return NextResponse.json({ brands: [], brandData: null });
  }
}
