// Sample data for Nespresso coffee brand — used to populate dashboards with realistic data

const BRAND = {
  id: 'brand-001',
  name: 'Nespresso',
  domain: 'nespresso.com',
  industry: 'Premium Coffee',
  market: 'US',
  language: 'en',
};

const COMPETITORS = [
  { name: 'Keurig', domain: 'keurig.com' },
  { name: 'Dolce Gusto', domain: 'dolce-gusto.com' },
  { name: 'Breville', domain: 'breville.com' },
  { name: 'De\'Longhi', domain: 'delonghi.com' },
  { name: 'Lavazza', domain: 'lavazza.com' },
  { name: 'Illy', domain: 'illy.com' },
];

const TOPICS = [
  { id: 'topic-01', name: 'Machine Recommendations', promptCount: 6 },
  { id: 'topic-02', name: 'Coffee Quality & Taste', promptCount: 5 },
  { id: 'topic-03', name: 'Sustainability & Ethics', promptCount: 4 },
  { id: 'topic-04', name: 'Price & Value', promptCount: 5 },
  { id: 'topic-05', name: 'Capsule Compatibility', promptCount: 4 },
];

const PROMPTS = [
  // Machine Recommendations
  { id: 'p-001', topicId: 'topic-01', text: 'What is the best single-serve coffee machine for home use?', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 45000 },
  { id: 'p-002', topicId: 'topic-01', text: 'Nespresso vs Keurig which one should I buy?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 22000 },
  { id: 'p-003', topicId: 'topic-01', text: 'What Nespresso machine makes the best espresso?', tags: ['branded', 'decision'], journeyStage: 'decision', estimatedVolume: 18000 },
  { id: 'p-004', topicId: 'topic-01', text: 'Is the Nespresso Vertuo worth it?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 31000 },
  { id: 'p-005', topicId: 'topic-01', text: 'Best espresso machine under $300', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 62000 },
  { id: 'p-006', topicId: 'topic-01', text: 'How to set up my new Nespresso machine', tags: ['branded', 'post-purchase'], journeyStage: 'post-purchase', estimatedVolume: 14000 },

  // Coffee Quality & Taste
  { id: 'p-007', topicId: 'topic-02', text: 'Which coffee pods taste the most like real espresso?', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 28000 },
  { id: 'p-008', topicId: 'topic-02', text: 'Does Nespresso coffee taste good?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 19000 },
  { id: 'p-009', topicId: 'topic-02', text: 'Best Nespresso capsules for a strong coffee', tags: ['branded', 'decision'], journeyStage: 'decision', estimatedVolume: 25000 },
  { id: 'p-010', topicId: 'topic-02', text: 'What are the top-rated single-serve coffee brands?', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 35000 },
  { id: 'p-011', topicId: 'topic-02', text: 'How does Nespresso compare to fresh ground coffee?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 12000 },

  // Sustainability
  { id: 'p-012', topicId: 'topic-03', text: 'Are coffee pods bad for the environment?', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 41000 },
  { id: 'p-013', topicId: 'topic-03', text: 'Is Nespresso sustainable?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 15000 },
  { id: 'p-014', topicId: 'topic-03', text: 'How to recycle Nespresso capsules', tags: ['branded', 'post-purchase'], journeyStage: 'post-purchase', estimatedVolume: 21000 },
  { id: 'p-015', topicId: 'topic-03', text: 'Most eco-friendly coffee machine brands', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 18000 },

  // Price & Value
  { id: 'p-016', topicId: 'topic-04', text: 'How much does it cost per cup with Nespresso?', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 27000 },
  { id: 'p-017', topicId: 'topic-04', text: 'Is a Nespresso machine worth the investment?', tags: ['branded', 'decision'], journeyStage: 'decision', estimatedVolume: 33000 },
  { id: 'p-018', topicId: 'topic-04', text: 'Cheapest way to make espresso at home', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 52000 },
  { id: 'p-019', topicId: 'topic-04', text: 'Nespresso capsule subscription deals', tags: ['branded', 'decision'], journeyStage: 'decision', estimatedVolume: 9000 },
  { id: 'p-020', topicId: 'topic-04', text: 'Are third-party Nespresso pods any good?', tags: ['branded', 'post-purchase'], journeyStage: 'post-purchase', estimatedVolume: 24000 },

  // Capsule Compatibility
  { id: 'p-021', topicId: 'topic-05', text: 'Can I use other brands in a Nespresso machine?', tags: ['branded', 'post-purchase'], journeyStage: 'post-purchase', estimatedVolume: 38000 },
  { id: 'p-022', topicId: 'topic-05', text: 'Nespresso Original vs Vertuo capsules difference', tags: ['branded', 'consideration'], journeyStage: 'consideration', estimatedVolume: 29000 },
  { id: 'p-023', topicId: 'topic-05', text: 'Best compatible capsules for Nespresso machines', tags: ['branded', 'decision'], journeyStage: 'decision', estimatedVolume: 34000 },
  { id: 'p-024', topicId: 'topic-05', text: 'Do reusable coffee pods work well?', tags: ['non-branded', 'awareness'], journeyStage: 'awareness', estimatedVolume: 19000 },
];

const MODELS = ['chatgpt', 'gemini', 'perplexity', 'grok', 'ai_overviews'] as const;

type Sentiment = 'positive' | 'neutral' | 'negative';

function generateAnalysisResults() {
  const results: {
    id: string;
    run_id: string;
    prompt_id: string;
    llm_model: string;
    brand_mentioned: boolean;
    brand_position: number | null;
    sentiment: Sentiment;
    competitor_mentions: Record<string, boolean>;
    created_at: string;
  }[] = [];

  const runId = 'run-001';
  let idx = 0;

  // Predefined patterns per model to make data realistic
  const modelPatterns: Record<string, { mentionRate: number; avgPos: number; positiveBias: number }> = {
    chatgpt: { mentionRate: 0.79, avgPos: 2.1, positiveBias: 0.65 },
    gemini: { mentionRate: 0.71, avgPos: 2.8, positiveBias: 0.55 },
    perplexity: { mentionRate: 0.83, avgPos: 1.9, positiveBias: 0.70 },
    grok: { mentionRate: 0.63, avgPos: 3.2, positiveBias: 0.50 },
    ai_overviews: { mentionRate: 0.75, avgPos: 2.4, positiveBias: 0.60 },
  };

  // Use a simple seeded-like pattern (deterministic based on index)
  for (const prompt of PROMPTS) {
    for (const model of MODELS) {
      idx++;
      const pattern = modelPatterns[model];
      const isBranded = prompt.tags.includes('branded');
      const mentionChance = isBranded ? Math.min(pattern.mentionRate + 0.15, 1) : pattern.mentionRate;
      const mentioned = (idx * 7 + idx * 3) % 100 < mentionChance * 100;

      let position: number | null = null;
      if (mentioned) {
        const base = pattern.avgPos;
        position = Math.max(1, Math.min(5, Math.round(base + ((idx % 5) - 2) * 0.5)));
      }

      const sentimentRoll = (idx * 13) % 100;
      let sentiment: Sentiment = 'neutral';
      if (mentioned) {
        if (sentimentRoll < pattern.positiveBias * 100) sentiment = 'positive';
        else if (sentimentRoll < (pattern.positiveBias + 0.25) * 100) sentiment = 'neutral';
        else sentiment = 'negative';
      }

      const competitorMentions: Record<string, boolean> = {};
      for (const comp of COMPETITORS) {
        competitorMentions[comp.name] = (idx * 11 + COMPETITORS.indexOf(comp) * 17) % 100 < 45;
      }

      results.push({
        id: `result-${String(idx).padStart(4, '0')}`,
        run_id: runId,
        prompt_id: prompt.id,
        llm_model: model,
        brand_mentioned: mentioned,
        brand_position: position,
        sentiment,
        competitor_mentions: competitorMentions,
        created_at: '2026-03-14T10:30:00Z',
      });
    }
  }

  return results;
}

function generateCitedSources() {
  const sources: {
    id: string;
    run_id: string;
    prompt_id: string;
    llm_model: string;
    url: string;
    domain: string;
    content_type: string;
    is_brand_owned: boolean;
    citation_count: number;
  }[] = [];

  const domainPool = [
    { domain: 'nespresso.com', type: 'brand', owned: true },
    { domain: 'nespresso.com', type: 'brand', owned: true },
    { domain: 'keurig.com', type: 'competitor', owned: false },
    { domain: 'reddit.com', type: 'ugc', owned: false },
    { domain: 'reddit.com', type: 'ugc', owned: false },
    { domain: 'youtube.com', type: 'video', owned: false },
    { domain: 'wirecutter.com', type: 'review', owned: false },
    { domain: 'cnet.com', type: 'review', owned: false },
    { domain: 'techradar.com', type: 'review', owned: false },
    { domain: 'amazon.com', type: 'ecommerce', owned: false },
    { domain: 'wikipedia.org', type: 'reference', owned: false },
    { domain: 'coffeereview.com', type: 'review', owned: false },
    { domain: 'home-barista.com', type: 'ugc', owned: false },
    { domain: 'foodnetwork.com', type: 'editorial', owned: false },
    { domain: 'goodhousekeeping.com', type: 'review', owned: false },
    { domain: 'sustainablecoffee.org', type: 'reference', owned: false },
  ];

  let idx = 0;
  for (const prompt of PROMPTS) {
    for (const model of MODELS) {
      // Each prompt-model combo cites 2-4 sources
      const numSources = 2 + ((idx * 7) % 3);
      for (let s = 0; s < numSources; s++) {
        const sourceInfo = domainPool[(idx + s * 3) % domainPool.length];
        idx++;
        sources.push({
          id: `source-${String(idx).padStart(4, '0')}`,
          run_id: 'run-001',
          prompt_id: prompt.id,
          llm_model: model,
          url: `https://${sourceInfo.domain}/article-${idx}`,
          domain: sourceInfo.domain,
          content_type: sourceInfo.type,
          is_brand_owned: sourceInfo.owned,
          citation_count: 1 + ((idx * 3) % 5),
        });
      }
    }
  }

  return sources;
}

function generateSerpQueries() {
  const queries: {
    id: string;
    run_id: string;
    prompt_id: string;
    llm_model: string;
    original_prompt: string;
    web_search_query: string;
  }[] = [];

  const queryTransforms = [
    (p: string) => p,
    (p: string) => `${p} 2026`,
    (p: string) => `best ${p.replace(/^(what is the |which |how to )/i, '')}`,
    (p: string) => `${p} reviews`,
  ];

  let idx = 0;
  for (const prompt of PROMPTS.slice(0, 12)) {
    for (const model of ['perplexity', 'ai_overviews'] as const) {
      const numQueries = 1 + (idx % 3);
      for (let q = 0; q < numQueries; q++) {
        idx++;
        const transform = queryTransforms[q % queryTransforms.length];
        queries.push({
          id: `serp-${String(idx).padStart(4, '0')}`,
          run_id: 'run-001',
          prompt_id: prompt.id,
          llm_model: model,
          original_prompt: prompt.text,
          web_search_query: transform(prompt.text),
        });
      }
    }
  }

  return queries;
}

// ── Exported getters ──

export function getSampleBrand() {
  return BRAND;
}

export function getSampleCompetitors() {
  return COMPETITORS;
}

export function getSampleTopics() {
  return TOPICS;
}

export function getSamplePrompts() {
  return PROMPTS;
}

export function getSampleAnalysisResults() {
  return generateAnalysisResults();
}

export function getSampleCitedSources() {
  return generateCitedSources();
}

export function getSampleSerpQueries() {
  return generateSerpQueries();
}

export function getSampleOverviewData() {
  const results = generateAnalysisResults();
  const sources = generateCitedSources();
  const totalResults = results.length;
  const mentioned = results.filter(r => r.brand_mentioned).length;
  const brandPresence = Math.round((mentioned / totalResults) * 1000) / 10;

  const withPosition = results.filter(r => r.brand_position !== null);
  const avgPosition = withPosition.length > 0
    ? Math.round((withPosition.reduce((a, r) => a + (r.brand_position || 0), 0) / withPosition.length) * 10) / 10
    : null;

  const brandSources = sources.filter(s => s.is_brand_owned);
  const totalCitations = sources.reduce((a, s) => a + s.citation_count, 0);
  const brandCitations = brandSources.reduce((a, s) => a + s.citation_count, 0);
  const citationShare = totalCitations > 0 ? Math.round((brandCitations / totalCitations) * 1000) / 10 : 0;

  const mentionedResults = results.filter(r => r.brand_mentioned);
  const sentimentBreakdown = {
    positive: mentionedResults.filter(r => r.sentiment === 'positive').length,
    neutral: mentionedResults.filter(r => r.sentiment === 'neutral').length,
    negative: mentionedResults.filter(r => r.sentiment === 'negative').length,
  };

  const modelBreakdown = MODELS.map(model => {
    const modelResults = results.filter(r => r.llm_model === model);
    const modelMentioned = modelResults.filter(r => r.brand_mentioned).length;
    const modelWithPos = modelResults.filter(r => r.brand_position !== null);
    return {
      model,
      presence: Math.round((modelMentioned / modelResults.length) * 1000) / 10,
      avgPosition: modelWithPos.length > 0
        ? Math.round((modelWithPos.reduce((a, r) => a + (r.brand_position || 0), 0) / modelWithPos.length) * 10) / 10
        : null,
      totalQueries: modelResults.length,
    };
  });

  return {
    brand: BRAND,
    metrics: {
      brandPresence,
      avgPosition,
      citationShare,
      totalPrompts: PROMPTS.length,
      totalResults,
      lastRunDate: '2026-03-14T10:30:00Z',
    },
    sentimentBreakdown,
    modelBreakdown,
    trends: generateTrendData(),
  };
}

export function getSampleSources() {
  const sources = generateCitedSources();
  const domainMap = new Map<string, { type: string; count: number; citations: number; owned: boolean }>();

  for (const source of sources) {
    const existing = domainMap.get(source.domain) || { type: source.content_type, count: 0, citations: 0, owned: source.is_brand_owned };
    existing.count++;
    existing.citations += source.citation_count;
    domainMap.set(source.domain, existing);
  }

  return Array.from(domainMap.entries())
    .map(([domain, data]) => ({
      domain,
      contentType: data.type,
      isBrandOwned: data.owned,
      frequency: data.count,
      totalCitations: data.citations,
      avgCitations: Math.round((data.citations / data.count) * 10) / 10,
    }))
    .sort((a, b) => b.frequency - a.frequency);
}

export function getSampleOpportunities() {
  return [
    {
      id: 'opp-001',
      type: 'missing_presence' as const,
      severity: 'high' as const,
      title: 'Not mentioned in "cheapest way to make espresso at home"',
      description: 'This high-volume query (52K monthly) rarely includes Nespresso. Consider creating content around value and cost-per-cup.',
      promptId: 'p-018',
      promptText: 'Cheapest way to make espresso at home',
      affectedModels: ['chatgpt', 'grok'],
      estimatedImpact: 52000,
    },
    {
      id: 'opp-002',
      type: 'low_position' as const,
      severity: 'medium' as const,
      title: 'Ranked #4-5 for "best single-serve coffee machine"',
      description: 'Nespresso appears but in low position. Competitors Keurig and Breville are consistently ranked higher. Strengthen product comparison content.',
      promptId: 'p-001',
      promptText: 'What is the best single-serve coffee machine for home use?',
      affectedModels: ['gemini', 'grok', 'ai_overviews'],
      estimatedImpact: 45000,
    },
    {
      id: 'opp-003',
      type: 'negative_sentiment' as const,
      severity: 'medium' as const,
      title: 'Negative sentiment in sustainability queries',
      description: 'AI models often cite environmental concerns about aluminum capsules. Nespresso\'s recycling program is underrepresented in AI responses.',
      promptId: 'p-012',
      promptText: 'Are coffee pods bad for the environment?',
      affectedModels: ['chatgpt', 'gemini', 'perplexity'],
      estimatedImpact: 41000,
    },
    {
      id: 'opp-004',
      type: 'citation_gap' as const,
      severity: 'high' as const,
      title: 'Nespresso.com rarely cited as source',
      description: 'Despite brand mentions, AI models prefer third-party review sites (Wirecutter, CNET). Only 12% of citations link to nespresso.com.',
      promptId: null,
      promptText: null,
      affectedModels: ['chatgpt', 'gemini', 'perplexity', 'grok', 'ai_overviews'],
      estimatedImpact: null,
    },
    {
      id: 'opp-005',
      type: 'competitor_threat' as const,
      severity: 'low' as const,
      title: 'Keurig dominates "best value" narratives',
      description: 'In cost-related queries, Keurig is positioned as the better value option 73% of the time. Nespresso is framed as premium/expensive.',
      promptId: 'p-016',
      promptText: 'How much does it cost per cup with Nespresso?',
      affectedModels: ['chatgpt', 'grok'],
      estimatedImpact: 27000,
    },
    {
      id: 'opp-006',
      type: 'missing_presence' as const,
      severity: 'medium' as const,
      title: 'Absent from "most eco-friendly coffee machine brands"',
      description: 'Despite Nespresso\'s B Corp certification and recycling programs, it is not mentioned in eco-friendly brand queries.',
      promptId: 'p-015',
      promptText: 'Most eco-friendly coffee machine brands',
      affectedModels: ['chatgpt', 'gemini', 'grok', 'ai_overviews'],
      estimatedImpact: 18000,
    },
  ];
}

export function getSampleRecentChats() {
  return [
    {
      id: 'chat-001',
      model: 'chatgpt',
      prompt: 'What is the best single-serve coffee machine for home use?',
      brandMentioned: true,
      position: 2,
      sentiment: 'positive' as const,
      timestamp: '2026-03-14T10:32:00Z',
      snippet: 'For home espresso enthusiasts, the Nespresso Vertuo Next offers an excellent balance of convenience and quality...',
    },
    {
      id: 'chat-002',
      model: 'perplexity',
      prompt: 'Nespresso vs Keurig which one should I buy?',
      brandMentioned: true,
      position: 1,
      sentiment: 'positive' as const,
      timestamp: '2026-03-14T10:33:00Z',
      snippet: 'Nespresso excels in espresso quality with its pressure-based extraction system, while Keurig offers more variety...',
    },
    {
      id: 'chat-003',
      model: 'gemini',
      prompt: 'Are coffee pods bad for the environment?',
      brandMentioned: true,
      position: 3,
      sentiment: 'negative' as const,
      timestamp: '2026-03-14T10:34:00Z',
      snippet: 'Coffee pods generate significant waste. While Nespresso offers a recycling program, only about 30% of capsules are actually recycled...',
    },
    {
      id: 'chat-004',
      model: 'grok',
      prompt: 'Cheapest way to make espresso at home',
      brandMentioned: false,
      position: null,
      sentiment: 'neutral' as const,
      timestamp: '2026-03-14T10:35:00Z',
      snippet: 'The most affordable options include the Moka pot ($25-40) or a manual lever espresso maker like the Flair...',
    },
    {
      id: 'chat-005',
      model: 'ai_overviews',
      prompt: 'Best Nespresso capsules for a strong coffee',
      brandMentioned: true,
      position: 1,
      sentiment: 'positive' as const,
      timestamp: '2026-03-14T10:36:00Z',
      snippet: 'For the strongest Nespresso capsules, try the Kazaar (intensity 12) or Napoli (intensity 13) in the Original line...',
    },
  ];
}

export function getSampleCompetitorData() {
  const results = generateAnalysisResults();

  return COMPETITORS.map(comp => {
    // Simulate competitor mention rates
    const mentionCounts = results.reduce((acc, r) => {
      if (r.competitor_mentions[comp.name]) acc++;
      return acc;
    }, 0);
    const mentionRate = Math.round((mentionCounts / results.length) * 1000) / 10;

    return {
      name: comp.name,
      domain: comp.domain,
      mentionRate,
      avgPosition: Math.round((1.5 + Math.random() * 3) * 10) / 10,
      coOccurrenceWithBrand: Math.round(mentionRate * 0.6 * 10) / 10,
      topPrompts: PROMPTS.filter(p => p.tags.includes('non-branded')).slice(0, 3).map(p => p.text),
    };
  });
}

function generateTrendData() {
  // Generate 8 weeks of trend data
  const weeks = [];
  const baseDate = new Date('2026-01-19');
  let presence = 62;
  let position = 2.8;
  let citation = 8;

  for (let i = 0; i < 8; i++) {
    const weekDate = new Date(baseDate);
    weekDate.setDate(weekDate.getDate() + i * 7);

    // Gradual improvement trend
    presence = Math.min(95, presence + (Math.random() * 4 - 1));
    position = Math.max(1, position - (Math.random() * 0.3 - 0.05));
    citation = Math.min(25, citation + (Math.random() * 2 - 0.3));

    weeks.push({
      week: weekDate.toISOString().slice(0, 10),
      brandPresence: Math.round(presence * 10) / 10,
      avgPosition: Math.round(position * 10) / 10,
      citationShare: Math.round(citation * 10) / 10,
    });
  }

  return weeks;
}

export function getSampleTrends() {
  return generateTrendData();
}

export function getSampleModelComparison() {
  return MODELS.map(model => {
    const results = generateAnalysisResults().filter(r => r.llm_model === model);
    const mentioned = results.filter(r => r.brand_mentioned);
    const withPos = results.filter(r => r.brand_position !== null);

    return {
      model,
      displayName: model === 'ai_overviews' ? 'AI Overviews' : model.charAt(0).toUpperCase() + model.slice(1),
      presence: Math.round((mentioned.length / results.length) * 1000) / 10,
      avgPosition: withPos.length > 0
        ? Math.round((withPos.reduce((a, r) => a + (r.brand_position || 0), 0) / withPos.length) * 10) / 10
        : null,
      sentimentBreakdown: {
        positive: mentioned.filter(r => r.sentiment === 'positive').length,
        neutral: mentioned.filter(r => r.sentiment === 'neutral').length,
        negative: mentioned.filter(r => r.sentiment === 'negative').length,
      },
      totalQueries: results.length,
    };
  });
}
