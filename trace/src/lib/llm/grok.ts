import OpenAI from 'openai';
import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';

const client = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY,
});

export async function queryGrok(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const response = await client.chat.completions.create({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawResponse = response.choices[0]?.message?.content || '';
    const parsed = parseResponse(rawResponse, brandName, competitors);

    // Grok doesn't natively return citations or SERP queries
    return {
      model: 'grok',
      promptId,
      rawResponse,
      citedSources: [],
      serpQueries: [],
      ...parsed,
    };
  } catch (error) {
    console.error('Grok query failed:', error);
    return {
      model: 'grok',
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
