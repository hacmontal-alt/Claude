import { inngest } from '../client';
import OpenAI from 'openai';
import type { AutoGenerateResult } from '@/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert AI search strategist who deeply understands how real people use ChatGPT, Perplexity, Gemini, and other AI chatbots to research products, services, and brands before making decisions.

Your job: Given a brand's website content, figure out EXACTLY what the brand does, who their customers are, what problems they solve, and what ecosystem they operate in. Then generate the precise questions that real people would type into an AI chatbot when they're looking for solutions in that space.

## How to think about this:

1. **Understand the brand deeply** — What do they sell? Who buys it? What pain points do they solve? What category are they in? Who are their competitors?

2. **Think like the customer** — A person doesn't ask an AI "tell me about BrandX." They ask things like:
   - "What's the best tool for [problem the brand solves]?"
   - "I need help with [specific use case] — what should I use?"
   - "Is [brand] better than [competitor] for [specific need]?"
   - "What do people think about [brand] for [use case]?"
   - "Can you recommend a [product category] that does [specific feature]?"

3. **Cover the full customer journey**:
   - **Discovery**: Person doesn't know the brand exists yet, asking about the problem space
   - **Research**: Person is comparing options
   - **Evaluation**: Person is deciding
   - **Validation**: Person wants social proof
   - **How-to**: Person is already using or considering

4. **Generate topics that map to the brand's ecosystem**, NOT generic marketing categories.

## Rules:
- Every single prompt MUST be something a real person would actually type into ChatGPT or Perplexity
- Prompts should be natural and conversational — not keyword-stuffed SEO phrases
- Mix of branded (~30-40%) and non-branded (~60-70%) prompts
- Estimated volumes should reflect realistic monthly AI search interest (100-50,000 range)
- Generate EXACTLY 5 topics with 5-7 prompts each
- Topics should be named after real customer concerns, not marketing jargon
- Identify 3-6 real competitors based on the brand's actual market
- Generate prompts in the specified language

Return JSON:
{
  "brandName": "string",
  "industry": "string",
  "topics": [
    {
      "name": "string",
      "prompts": [
        {
          "text": "string",
          "tags": ["branded|non-branded", "discovery|research|evaluation|validation|how-to"],
          "estimatedVolume": number
        }
      ]
    }
  ],
  "competitors": ["string"]
}`;

export const autoGenerate = inngest.createFunction(
  { id: 'auto-generate', retries: 2 },
  { event: 'onboarding/generate.requested' },
  async ({ event, step }) => {
    const { brandUrl, language, market } = event.data as {
      brandUrl: string;
      language: string;
      market: string;
    };

    const result = await step.run('fetch-and-generate', async () => {
      let siteContent = '';
      const normalizedUrl = brandUrl.startsWith('http') ? brandUrl : `https://${brandUrl}`;

      try {
        const res = await fetch(normalizedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          signal: AbortSignal.timeout(15000),
        });
        const html = await res.text();

        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        const title = titleMatch?.[1]?.trim() || '';
        const metaDesc = metaDescMatch?.[1]?.trim() || '';

        const bodyText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        siteContent = `Page title: ${title}\nMeta description: ${metaDesc}\n\nPage content:\n${bodyText.slice(0, 6000)}`;
      } catch {
        siteContent = `Brand website URL: ${brandUrl} (could not fetch — generate based on the domain name and URL structure)`;
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Analyze this brand and generate smart tracking prompts.\n\nBrand URL: ${brandUrl}\nTarget market: ${market}\nLanguage: ${language}\n\n--- WEBSITE CONTENT ---\n${siteContent}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(content) as AutoGenerateResult;
    });

    return result;
  }
);
