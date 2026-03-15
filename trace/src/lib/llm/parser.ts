import type { Sentiment, CompetitorMention } from '@/types';

export function parseResponse(
  rawResponse: string,
  brandName: string,
  competitors: string[]
): {
  brandMentioned: boolean;
  brandPosition: number | null;
  sentiment: Sentiment;
  competitorMentions: CompetitorMention[];
} {
  const sentences = rawResponse.split(/[.!?\n]+/).filter(s => s.trim().length > 0);
  const brandLower = brandName.toLowerCase();

  let brandMentioned = false;
  let brandPosition: number | null = null;
  let sentimentScore = 0;
  let sentimentCount = 0;

  const positiveWords = ['best', 'excellent', 'great', 'top', 'recommend', 'popular', 'leading', 'premium', 'quality', 'innovative', 'trusted', 'reliable', 'superior', 'outstanding', 'favorite', 'loved'];
  const negativeWords = ['worst', 'poor', 'expensive', 'overpriced', 'mediocre', 'disappointing', 'lacking', 'inferior', 'avoid', 'complaint', 'issue', 'problem', 'downside', 'drawback'];

  sentences.forEach((sentence, idx) => {
    const sentLower = sentence.toLowerCase();
    if (sentLower.includes(brandLower)) {
      brandMentioned = true;
      if (brandPosition === null) {
        brandPosition = idx + 1;
      }
      const words = sentLower.split(/\s+/);
      const posCount = words.filter(w => positiveWords.some(p => w.includes(p))).length;
      const negCount = words.filter(w => negativeWords.some(n => w.includes(n))).length;
      sentimentScore += posCount - negCount;
      sentimentCount++;
    }
  });

  const sentiment: Sentiment = sentimentCount === 0
    ? null
    : sentimentScore > 0
      ? 'positive'
      : sentimentScore < 0
        ? 'negative'
        : 'neutral';

  const competitorMentions: CompetitorMention[] = [];
  competitors.forEach(comp => {
    const compLower = comp.toLowerCase();
    sentences.forEach((sentence, idx) => {
      if (sentence.toLowerCase().includes(compLower)) {
        if (!competitorMentions.find(m => m.name === comp)) {
          competitorMentions.push({ name: comp, position: idx + 1 });
        }
      }
    });
  });

  return { brandMentioned, brandPosition, sentiment, competitorMentions };
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function classifyContentType(domain: string, url: string): string {
  const editorialDomains = ['cnet.com', 'wirecutter.com', 'techradar.com', 'tomsguide.com', 'goodhousekeeping.com', 'seriouseats.com', 'consumerreports.org'];
  const ugcDomains = ['reddit.com', 'youtube.com', 'quora.com', 'trustpilot.com'];
  const referenceDomains = ['wikipedia.org', 'britannica.com'];

  if (editorialDomains.some(d => domain.includes(d))) return 'editorial';
  if (ugcDomains.some(d => domain.includes(d))) return 'ugc';
  if (referenceDomains.some(d => domain.includes(d))) return 'reference';
  if (url.includes('/blog') || url.includes('/article')) return 'blog';
  if (url.includes('/review')) return 'review';
  return 'other';
}
