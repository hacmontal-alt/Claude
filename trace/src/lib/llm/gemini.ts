import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMQueryResult } from '@/types';
import { parseResponse, extractDomain } from './parser';

export async function queryGemini(
  prompt: string,
  promptId: string,
  brandName: string,
  competitors: string[]
): Promise<LLMQueryResult> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      tools: [{ googleSearch: {} } as any],
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawResponse = response.text();

    const citedSources: { url: string; domain: string }[] = [];
    const serpQueries: string[] = [];

    const groundingMetadata = (response as any).candidates?.[0]?.groundingMetadata;
    if (groundingMetadata) {
      if (groundingMetadata.groundingChunks) {
        for (const chunk of groundingMetadata.groundingChunks) {
          if (chunk.web?.uri) {
            const domain = extractDomain(chunk.web.uri);
            citedSources.push({ url: chunk.web.uri, domain });
          }
        }
      }
      if (groundingMetadata.webSearchQueries) {
        serpQueries.push(...groundingMetadata.webSearchQueries);
      }
    }

    const parsed = parseResponse(rawResponse, brandName, competitors);

    return {
      model: 'gemini',
      promptId,
      rawResponse,
      citedSources,
      serpQueries,
      ...parsed,
    };
  } catch (error) {
    console.error('Gemini query failed:', error);
    return {
      model: 'gemini',
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
