import { inngest } from '../client';
import { createServiceClient } from '@/lib/supabase/server';
import { queryChatGPT } from '@/lib/llm/chatgpt';
import { queryGemini } from '@/lib/llm/gemini';
import { queryPerplexity } from '@/lib/llm/perplexity';
import { queryGrok } from '@/lib/llm/grok';
import { queryAIOverviews } from '@/lib/llm/ai-overviews';
import { classifyContentType } from '@/lib/llm/parser';
import type { LLMQueryResult } from '@/types';

const MODEL_FUNCTIONS: Record<string, (prompt: string, promptId: string, brand: string, competitors: string[]) => Promise<LLMQueryResult>> = {
  chatgpt: queryChatGPT,
  gemini: queryGemini,
  perplexity: queryPerplexity,
  grok: queryGrok,
  ai_overviews: queryAIOverviews,
};

export const runAnalysis = inngest.createFunction(
  { id: 'run-analysis', concurrency: { limit: 5 }, retries: 3 },
  { event: 'analysis/run.requested' },
  async ({ event, step }) => {
    const { runId, brandId, promptIds, models, brandName, competitors } = event.data as {
      runId: string;
      brandId: string;
      promptIds: string[];
      models: string[];
      brandName: string;
      competitors: string[];
    };

    const supabase = await createServiceClient();

    await supabase.from('analysis_runs').update({ status: 'running' }).eq('id', runId);

    for (const promptId of promptIds) {
      const { data: prompt } = await supabase
        .from('prompts')
        .select('prompt_text')
        .eq('id', promptId)
        .single();

      if (!prompt) continue;

      for (const model of models) {
        await step.run(`query-${model}-${promptId}`, async () => {
          const queryFn = MODEL_FUNCTIONS[model];
          if (!queryFn) return;

          const result = await queryFn(prompt.prompt_text, promptId, brandName, competitors);

          await supabase.from('analysis_results').insert({
            run_id: runId,
            prompt_id: promptId,
            llm_model: model,
            brand_mentioned: result.brandMentioned,
            brand_position: result.brandPosition,
            sentiment: result.sentiment,
            raw_response: result.rawResponse,
            competitor_mentions: result.competitorMentions,
          });

          for (const source of result.citedSources) {
            await supabase.from('cited_sources').insert({
              run_id: runId,
              prompt_id: promptId,
              llm_model: model,
              url: source.url,
              domain: source.domain,
              content_type: classifyContentType(source.domain, source.url),
              is_brand_owned: source.domain.includes(brandName.toLowerCase().replace(/[^a-z]/g, '')),
            });
          }

          for (const query of result.serpQueries) {
            await supabase.from('serp_queries').insert({
              run_id: runId,
              prompt_id: promptId,
              llm_model: model,
              original_prompt: prompt.prompt_text,
              web_search_query: query,
            });
          }
        });
      }
    }

    await step.run('complete-run', async () => {
      await supabase.from('analysis_runs').update({
        status: 'complete',
        completed_at: new Date().toISOString(),
      }).eq('id', runId);
    });

    return { success: true, runId };
  }
);
