import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';

export async function queryAIOverviews(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const response = await fetch(
      `https://serpapi.com/search?q=${encodeURIComponent(prompt)}&api_key=${process.env.SERPER_API_KEY}&engine=google`
    );

    const data = await response.json();
    const aiOverview = data.ai_overview;

    if (!aiOverview) {
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

    const rawResponse = typeof aiOverview === 'string'
      ? aiOverview
      : aiOverview.text || aiOverview.snippet || JSON.stringify(aiOverview);

    const citedSources: { url: string; domain: string }[] = [];
    const sources = aiOverview.sources || aiOverview.references || [];
    for (const source of sources) {
      const url = source.link || source.url || '';
      if (url) {
        citedSources.push({ url, domain: extractDomain(url) });
      }
    }

    const parsed = parseResponse(rawResponse, brandName, competitors);

    return {
      model: 'ai_overviews',
      promptId,
      rawResponse,
      citedSources,
      serpQueries: [prompt],
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
