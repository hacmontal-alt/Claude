import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { queryChatGPT } from "@/lib/llm/chatgpt";
import { queryGemini } from "@/lib/llm/gemini";
import { queryPerplexity } from "@/lib/llm/perplexity";
import { queryGrok } from "@/lib/llm/grok";
import { queryAIOverviews } from "@/lib/llm/ai-overviews";
import { classifyContentType } from "@/lib/llm/parser";
import type { LLMQueryResult } from "@/types";

const MODEL_FUNCTIONS: Record<
  string,
  (prompt: string, promptId: string, brand: string, competitors: string[]) => Promise<LLMQueryResult>
> = {
  chatgpt: queryChatGPT,
  gemini: queryGemini,
  perplexity: queryPerplexity,
  grok: queryGrok,
  ai_overviews: queryAIOverviews,
};

/**
 * Direct synchronous analysis — no Inngest needed.
 * Runs all queries inline and returns when done.
 * Use for testing / small prompt sets. For production, use /api/analysis/trigger with Inngest.
 */
export async function POST(request: NextRequest) {
  const authClient = await createServerClient();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandId } = await request.json();
  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Fetch brand
  const { data: brand } = await supabase
    .from("brands")
    .select("id, brand_name, brand_url")
    .eq("id", brandId)
    .single();

  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  // Fetch active prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, prompt_text")
    .eq("brand_id", brandId)
    .eq("is_active", true);

  if (!prompts || prompts.length === 0) {
    return NextResponse.json({ error: "No active prompts" }, { status: 400 });
  }

  // Fetch competitors
  const { data: competitors } = await supabase
    .from("competitors")
    .select("competitor_name")
    .eq("brand_id", brandId);

  const competitorNames = (competitors || []).map((c) => c.competitor_name);

  // Only run models that have API keys configured (skip empty/whitespace keys)
  const hasKey = (key?: string) => !!key && key.trim().length > 1;
  const availableModels: string[] = [];
  if (hasKey(process.env.OPENAI_API_KEY)) availableModels.push("chatgpt");
  if (hasKey(process.env.GOOGLE_AI_API_KEY)) availableModels.push("gemini");
  if (hasKey(process.env.PERPLEXITY_API_KEY)) availableModels.push("perplexity");
  if (hasKey(process.env.XAI_API_KEY)) availableModels.push("grok");
  if (hasKey(process.env.BRIGHTDATA_API_TOKEN)) availableModels.push("ai_overviews");

  if (availableModels.length === 0) {
    return NextResponse.json(
      { error: "No AI model API keys configured" },
      { status: 500 }
    );
  }

  // Create analysis run
  const { data: run, error: runError } = await supabase
    .from("analysis_runs")
    .insert({
      brand_id: brandId,
      status: "running",
      prompt_count: prompts.length,
      models: availableModels,
      is_sample: false,
    })
    .select("id")
    .single();

  if (runError || !run) {
    return NextResponse.json(
      { error: "Failed to create run", detail: runError?.message },
      { status: 500 }
    );
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Run each prompt against each available model
  for (const prompt of prompts) {
    for (const model of availableModels) {
      try {
        const queryFn = MODEL_FUNCTIONS[model];
        if (!queryFn) continue;

        const result = await queryFn(
          prompt.prompt_text,
          prompt.id,
          brand.brand_name,
          competitorNames
        );

        // Store result
        await supabase.from("analysis_results").insert({
          run_id: run.id,
          prompt_id: prompt.id,
          llm_model: model,
          brand_mentioned: result.brandMentioned,
          brand_position: result.brandPosition,
          sentiment: result.sentiment,
          raw_response: result.rawResponse,
          competitor_mentions: result.competitorMentions,
        });

        // Store cited sources
        for (const source of result.citedSources) {
          await supabase.from("cited_sources").insert({
            run_id: run.id,
            prompt_id: prompt.id,
            llm_model: model,
            url: source.url,
            domain: source.domain,
            content_type: classifyContentType(source.domain, source.url),
            is_brand_owned: isBrandOwnedDomain(source.domain, brand.brand_url, brand.brand_name),
          });
        }

        // Store SERP queries
        for (const query of result.serpQueries) {
          await supabase.from("serp_queries").insert({
            run_id: run.id,
            prompt_id: prompt.id,
            llm_model: model,
            original_prompt: prompt.prompt_text,
            web_search_query: query,
          });
        }

        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push(`${model}/${prompt.id}: ${err.message}`);
      }
    }
  }

  // Mark run complete
  await supabase
    .from("analysis_runs")
    .update({
      status: errorCount === 0 ? "complete" : successCount > 0 ? "complete" : "failed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", run.id);

  return NextResponse.json({
    runId: run.id,
    status: "complete",
    models: availableModels,
    prompts: prompts.length,
    successCount,
    errorCount,
    errors: errors.slice(0, 10),
  });
}

/** Check if a cited domain belongs to the brand */
function isBrandOwnedDomain(domain: string, brandUrl: string, brandName: string): boolean {
  const d = domain.toLowerCase().replace(/^www\./, "");
  // Match against brand URL
  try {
    const brandDomain = new URL(brandUrl.startsWith("http") ? brandUrl : `https://${brandUrl}`).hostname.replace(/^www\./, "");
    if (d === brandDomain || d.endsWith(`.${brandDomain}`)) return true;
  } catch {}
  // Fallback: check if domain contains brand name
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleanName.length >= 3 && d.includes(cleanName)) return true;
  return false;
}
