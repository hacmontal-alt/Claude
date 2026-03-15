import type { AnalysisResult, CitedSource } from '@/types';

export function computeBrandPresence(results: AnalysisResult[]): number {
  if (results.length === 0) return 0;
  const mentioned = results.filter(r => r.brand_mentioned).length;
  return Math.round((mentioned / results.length) * 1000) / 10;
}

export function computeAvgPosition(results: AnalysisResult[]): number | null {
  const withPosition = results.filter(r => r.brand_position !== null);
  if (withPosition.length === 0) return null;
  const sum = withPosition.reduce((a, r) => a + (r.brand_position || 0), 0);
  return Math.round((sum / withPosition.length) * 10) / 10;
}

export function computeCitationShare(sources: CitedSource[], brandDomain: string): number {
  if (sources.length === 0) return 0;
  const brandSources = sources.filter(s => s.domain.includes(brandDomain));
  const brandCitations = brandSources.reduce((a, s) => a + s.citation_count, 0);
  const totalCitations = sources.reduce((a, s) => a + s.citation_count, 0);
  if (totalCitations === 0) return 0;
  return Math.round((brandCitations / totalCitations) * 1000) / 10;
}

export function computeModelBreakdown(results: AnalysisResult[]): Record<string, { presence: number; avgPosition: number | null }> {
  const models = [...new Set(results.map(r => r.llm_model))];
  const breakdown: Record<string, { presence: number; avgPosition: number | null }> = {};

  for (const model of models) {
    const modelResults = results.filter(r => r.llm_model === model);
    breakdown[model] = {
      presence: computeBrandPresence(modelResults),
      avgPosition: computeAvgPosition(modelResults),
    };
  }

  return breakdown;
}

export function computeSentimentBreakdown(results: AnalysisResult[]): { positive: number; neutral: number; negative: number } {
  const mentioned = results.filter(r => r.brand_mentioned);
  if (mentioned.length === 0) return { positive: 0, neutral: 0, negative: 0 };
  return {
    positive: Math.round((mentioned.filter(r => r.sentiment === 'positive').length / mentioned.length) * 100),
    neutral: Math.round((mentioned.filter(r => r.sentiment === 'neutral').length / mentioned.length) * 100),
    negative: Math.round((mentioned.filter(r => r.sentiment === 'negative').length / mentioned.length) * 100),
  };
}

export function aggregateDomainSources(sources: CitedSource[]): {
  domain: string;
  contentType: string;
  usagePercent: number;
  avgCitations: number;
  totalCitations: number;
}[] {
  const domainMap = new Map<string, { type: string; count: number; citations: number }>();
  const totalPrompts = new Set(sources.map(s => s.prompt_id)).size || 1;

  for (const source of sources) {
    const existing = domainMap.get(source.domain) || { type: source.content_type || 'other', count: 0, citations: 0 };
    existing.count++;
    existing.citations += source.citation_count;
    domainMap.set(source.domain, existing);
  }

  return Array.from(domainMap.entries())
    .map(([domain, data]) => ({
      domain,
      contentType: data.type,
      usagePercent: Math.round((data.count / totalPrompts) * 100),
      avgCitations: Math.round((data.citations / data.count) * 10) / 10,
      totalCitations: data.citations,
    }))
    .sort((a, b) => b.usagePercent - a.usagePercent);
}
