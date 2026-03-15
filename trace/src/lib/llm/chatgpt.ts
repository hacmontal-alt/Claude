import OpenAI from 'openai';
import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function queryChatGPT(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const response = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' as any }],
      input: prompt,
    });

    let rawResponse = '';
    const citedSources: { url: string; domain: string }[] = [];
    const serpQueries: string[] = [];

    if (Array.isArray(response.output)) {
      for (const item of response.output) {
        if (item.type === 'message') {
          for (const content of item.content) {
            if (content.type === 'output_text') {
              rawResponse += content.text;
              if (content.annotations) {
                for (const ann of content.annotations as any[]) {
                  if (ann.type === 'url_citation' && ann.url) {
                    const domain = extractDomain(ann.url);
                    if (!citedSources.find(s => s.url === ann.url)) {
                      citedSources.push({ url: ann.url, domain });
                    }
                  }
                }
              }
            }
          }
        } else if (item.type === 'web_search_call') {
          if ((item as any).query) {
            serpQueries.push((item as any).query);
          }
        }
      }
    }

    const parsed = parseResponse(rawResponse, brandName, competitors);

    return {
      model: 'chatgpt',
      promptId,
      rawResponse,
      citedSources,
      serpQueries,
      ...parsed,
    };
  } catch (error) {
    console.error('ChatGPT query failed:', error);
    return {
      model: 'chatgpt',
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
