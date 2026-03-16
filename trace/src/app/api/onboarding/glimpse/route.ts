import { NextRequest, NextResponse } from 'next/server';
import { queryChatGPT } from '@/lib/llm/chatgpt';
import { queryGemini } from '@/lib/llm/gemini';
import { extractDomain } from '@/lib/llm/parser';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompts, brandName, competitors } = await req.json();

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: 'No prompts provided' }, { status: 400 });
    }
    if (!brandName) {
      return NextResponse.json({ error: 'Brand name required' }, { status: 400 });
    }

    // Pick up to 3 prompts for the glimpse
    const glimpsePrompts = prompts.slice(0, 3);
    const competitorList = competitors || [];

    // Query ChatGPT and Gemini in parallel for each prompt
    const results = await Promise.all(
      glimpsePrompts.map(async (prompt: { text: string; id: string }) => {
        const [chatgptResult, geminiResult] = await Promise.allSettled([
          queryChatGPT(prompt.text, prompt.id, brandName, competitorList),
          queryGemini(prompt.text, prompt.id, brandName, competitorList),
        ]);

        return {
          promptText: prompt.text,
          promptId: prompt.id,
          chatgpt: chatgptResult.status === 'fulfilled' ? chatgptResult.value : null,
          gemini: geminiResult.status === 'fulfilled' ? geminiResult.value : null,
        };
      })
    );

    // Build summary stats
    let totalMentions = 0;
    let totalPrompts = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    const allSources: string[] = [];
    const competitorCounts: Record<string, number> = {};

    for (const r of results) {
      for (const engineResult of [r.chatgpt, r.gemini]) {
        if (!engineResult) continue;
        totalPrompts++;
        if (engineResult.brandMentioned) totalMentions++;
        if (engineResult.sentiment === 'positive') positiveCount++;
        else if (engineResult.sentiment === 'negative') negativeCount++;
        else if (engineResult.sentiment === 'neutral') neutralCount++;
        for (const src of engineResult.citedSources) {
          if (!allSources.includes(src.domain)) allSources.push(src.domain);
        }
        for (const comp of engineResult.competitorMentions) {
          competitorCounts[comp.name] = (competitorCounts[comp.name] || 0) + 1;
        }
      }
    }

    const brandUrl = ''; // not needed for domain check in glimpse
    const brandDomain = brandName.toLowerCase().replace(/\s+/g, '') + '.com';

    return NextResponse.json({
      results,
      summary: {
        brandPresence: totalPrompts > 0 ? Math.round((totalMentions / totalPrompts) * 100) : 0,
        totalMentions,
        totalQueries: totalPrompts,
        sentiment: {
          positive: positiveCount,
          neutral: neutralCount,
          negative: negativeCount,
        },
        topSources: allSources.slice(0, 6),
        topCompetitors: Object.entries(competitorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, mentions: count })),
      },
    });
  } catch (error) {
    console.error('Glimpse analysis failed:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
