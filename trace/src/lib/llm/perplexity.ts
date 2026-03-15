import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';

export async function queryPerplexity(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [{ role: 'user', content: prompt }],
        return_citations: true,
        search_recency_filter: 'month',
      }),
    });

    const data = await response.json();
    const rawResponse = data.choices?.[0]?.message?.content || '';

    const citedSources: { url: string; domain: string }[] = [];
    if (data.citations) {
      for (const url of data.citations) {
        const domain = extractDomain(url);
        citedSources.push({ url, domain });
      }
    }

    const serpQueries: string[] = [];
    if (data.search_queries) {
      serpQueries.push(...data.search_queries);
    }

    const parsed = parseResponse(rawResponse, brandName, competitors);

    return {
      model: 'perplexity',
      promptId,
      rawResponse,
      citedSources,
      serpQueries,
      ...parsed,
    };
  } catch (error) {
    console.error('Perplexity query failed:', error);
    return {
      model: 'perplexity',
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
