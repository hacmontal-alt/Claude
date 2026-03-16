import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';
import { queryGoogleSerp } from '@/lib/brightdata/serp';

export async function queryAIOverviews(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const serpResult = await queryGoogleSerp(prompt, { aiOverview: true });

    if (!serpResult.aiOverview) {
      return {
        model: 'ai_overviews',
        promptId,
        brandMentioned: false,
        brandPosition: null,
        sentiment: null,
        rawResponse: '',
        citedSources: [],
        serpQueries: [prompt],
        competitorMentions: [],
      };
    }

    const rawResponse = serpResult.aiOverview;

    const citedSources: { url: string; domain: string }[] = [];
    for (const source of serpResult.aiOverviewSources) {
      citedSources.push({ url: source.url, domain: extractDomain(source.url) });
    }

    // Also include top organic results as additional context
    for (const organic of serpResult.organicResults.slice(0, 5)) {
      if (organic.url && !citedSources.find(s => s.url === organic.url)) {
        citedSources.push({ url: organic.url, domain: extractDomain(organic.url) });
      }
    }

    const parsed = parseResponse(rawResponse, brandName, competitors);

    return {
      model: 'ai_overviews',
      promptId,
      rawResponse,
      citedSources,
      serpQueries: [prompt, ...serpResult.relatedSearches],
      ...parsed,
    };
  } catch (error) {
    console.error('AI Overviews query failed:', error);
    return {
      model: 'ai_overviews',
      promptId,
      brandMentioned: false,
      brandPosition: null,
      sentiment: null,
      rawResponse: '',
      citedSources: [],
      serpQueries: [],
      competitorMentions: [],
    };
  }
}
