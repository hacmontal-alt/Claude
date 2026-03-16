"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import Callout from "@/components/ui/Callout";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";

export default function ContentPage() {
  const { hasRealData, results, prompts, sources, activeBrand, competitors } = useBrand();

  const recommendations = useMemo(() => {
    if (!hasRealData) return getSampleRecommendations();

    const recs: {
      type: string;
      priority: string;
      title: string;
      description: string;
      affectedPrompts: string[];
    }[] = [];

    // Find prompts where brand is NOT mentioned — need content
    const promptMentionMap = new Map<string, { mentioned: number; total: number }>();
    for (const r of results) {
      const existing = promptMentionMap.get(r.prompt_id) || { mentioned: 0, total: 0 };
      existing.total++;
      if (r.brand_mentioned) existing.mentioned++;
      promptMentionMap.set(r.prompt_id, existing);
    }

    // Content gap: prompts with low mention rate
    const weakPrompts = prompts.filter((p) => {
      const stats = promptMentionMap.get(p.id);
      if (!stats || stats.total === 0) return true;
      return stats.mentioned / stats.total < 0.3;
    });

    if (weakPrompts.length > 0) {
      recs.push({
        type: "content_gap",
        priority: "high",
        title: `Create content targeting ${weakPrompts.length} weak prompts`,
        description: `Your brand is rarely mentioned in ${weakPrompts.length} tracked prompts. Creating authoritative content around these topics can improve AI visibility.`,
        affectedPrompts: weakPrompts.slice(0, 5).map((p) => p.prompt_text),
      });
    }

    // Source gap: brand domain barely cited
    const brandSources = sources.filter((s) => s.is_brand_owned);
    const totalCitations = sources.reduce((a, s) => a + s.citation_count, 0);
    const brandCitations = brandSources.reduce((a, s) => a + s.citation_count, 0);
    if (totalCitations > 0 && brandCitations / totalCitations < 0.15) {
      recs.push({
        type: "citation_gap",
        priority: "high",
        title: "Increase brand website authority",
        description: `Only ${Math.round((brandCitations / totalCitations) * 100)}% of citations point to your website. Create detailed, factual pages that AI models can reference.`,
        affectedPrompts: [],
      });
    }

    // Competitor content: where competitors are mentioned more
    for (const comp of competitors) {
      let compMentions = 0;
      for (const r of results) {
        const mentions = r.competitor_mentions as any[];
        if (
          Array.isArray(mentions) &&
          mentions.some(
            (m: any) =>
              m.name?.toLowerCase() === comp.competitor_name.toLowerCase()
          )
        ) {
          compMentions++;
        }
      }
      const brandMentions = results.filter((r) => r.brand_mentioned).length;
      if (compMentions > brandMentions && results.length > 0) {
        recs.push({
          type: "competitor_content",
          priority: "medium",
          title: `Create comparison content: ${activeBrand?.brand_name} vs ${comp.competitor_name}`,
          description: `${comp.competitor_name} is mentioned ${Math.round((compMentions / results.length) * 100)}% of the time vs your ${Math.round((brandMentions / results.length) * 100)}%. Comparison pages help AI models understand your differentiators.`,
          affectedPrompts: [],
        });
      }
    }

    // Negative sentiment content
    const negativeResults = results.filter(
      (r) => r.brand_mentioned && r.sentiment === "negative"
    );
    if (negativeResults.length > 0) {
      const negPromptTexts = negativeResults
        .map((r) => prompts.find((p) => p.id === r.prompt_id)?.prompt_text)
        .filter(Boolean) as string[];
      recs.push({
        type: "sentiment_fix",
        priority: "medium",
        title: "Address negative sentiment topics",
        description: `AI models express negative sentiment about your brand in ${negativeResults.length} responses. Create content addressing these concerns.`,
        affectedPrompts: [...new Set(negPromptTexts)].slice(0, 3),
      });
    }

    return recs;
  }, [hasRealData, results, prompts, sources, competitors, activeBrand]);

  const PRIORITY_COLOR: Record<string, string> = {
    high: "red",
    medium: "orange",
    low: "gray",
  };

  const TYPE_LABEL: Record<string, string> = {
    content_gap: "Content Gap",
    citation_gap: "Citation Gap",
    competitor_content: "Competitor",
    sentiment_fix: "Sentiment",
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Content Recommendations</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          Actionable content suggestions to improve your AI visibility.
        </p>
      </div>

      {!hasRealData && (
        <div className="mb-4">
          <Callout type="info">
            Showing sample recommendations. Run analysis to get personalized suggestions.
          </Callout>
        </div>
      )}

      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Recommendations" value={String(recommendations.length)} />
        <Metric
          label="High Priority"
          value={String(recommendations.filter((r) => r.priority === "high").length)}
        />
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="bg-white border border-[#E8EAEB] rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag
                  label={rec.priority}
                  color={PRIORITY_COLOR[rec.priority] ?? "gray"}
                  small
                />
                <Tag
                  label={TYPE_LABEL[rec.type] ?? rec.type}
                  color="gray"
                  small
                />
              </div>
            </div>
            <h3 className="text-[14px] font-semibold text-[#2D3B42] mb-1">
              {rec.title}
            </h3>
            <p className="text-[13px] text-[#4A5D66] mb-2">
              {rec.description}
            </p>
            {rec.affectedPrompts.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium">
                  Related prompts
                </div>
                {rec.affectedPrompts.map((p, j) => (
                  <div
                    key={j}
                    className="text-[12px] text-[#4A5D66] bg-[#F8F9FA] rounded px-2 py-1"
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSampleRecommendations() {
  return [
    {
      type: "content_gap",
      priority: "high",
      title: "Create content for \"cheapest espresso at home\" queries",
      description:
        "Nespresso is rarely mentioned when users ask about affordable espresso. A cost-per-cup comparison page could help AI models include Nespresso in value-focused answers.",
      affectedPrompts: [
        "Cheapest way to make espresso at home",
        "Best espresso machine under $300",
      ],
    },
    {
      type: "citation_gap",
      priority: "high",
      title: "Build authoritative product comparison pages",
      description:
        "Only 12% of citations point to nespresso.com. AI models prefer third-party review sites. Create detailed, factual comparison pages on your own domain.",
      affectedPrompts: [],
    },
    {
      type: "competitor_content",
      priority: "medium",
      title: "Create Nespresso vs Keurig comparison content",
      description:
        "Keurig is mentioned 45% of the time. A balanced, detailed comparison page helps AI models accurately position your brand.",
      affectedPrompts: [
        "Nespresso vs Keurig which one should I buy?",
      ],
    },
    {
      type: "sentiment_fix",
      priority: "medium",
      title: "Address sustainability concerns with content",
      description:
        "AI models mention environmental concerns about aluminum capsules. Publish content about your recycling program and B Corp certification.",
      affectedPrompts: [
        "Are coffee pods bad for the environment?",
        "Is Nespresso sustainable?",
      ],
    },
    {
      type: "content_gap",
      priority: "low",
      title: "Create eco-friendly brand positioning content",
      description:
        "Your brand is absent from \"eco-friendly coffee machine\" queries despite your sustainability programs.",
      affectedPrompts: [
        "Most eco-friendly coffee machine brands",
      ],
    },
  ];
}
