"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import Callout from "@/components/ui/Callout";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";

const MODEL_DISPLAY: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

export default function CompetitorsPage() {
  const { hasBrand, hasRealData, results, competitors, activeBrand, triggerAnalysis } = useBrand();

  const competitorData = useMemo(() => {
    if (!hasRealData) {
      // Show competitors from onboarding even without analysis data
      return competitors.map((comp) => ({
        name: comp.competitor_name,
        mentionRate: 0,
        modelMentions: {},
        totalMentions: 0,
      }));
    }

    return competitors.map((comp) => {
      let mentionCount = 0;
      const modelMentions: Record<string, number> = {};

      for (const r of results) {
        const mentions = r.competitor_mentions as any[];
        const found = Array.isArray(mentions)
          ? mentions.some(
              (m: any) =>
                m.name?.toLowerCase() === comp.competitor_name.toLowerCase()
            )
          : false;
        if (found) {
          mentionCount++;
          modelMentions[r.llm_model] = (modelMentions[r.llm_model] || 0) + 1;
        }
      }

      const mentionRate =
        results.length > 0
          ? Math.round((mentionCount / results.length) * 1000) / 10
          : 0;

      return {
        name: comp.competitor_name,
        mentionRate,
        modelMentions,
        totalMentions: mentionCount,
      };
    });
  }, [hasRealData, results, competitors]);

  const brandMentionRate = useMemo(() => {
    if (!hasRealData) return 0;
    const mentioned = results.filter((r) => r.brand_mentioned).length;
    return results.length > 0
      ? Math.round((mentioned / results.length) * 1000) / 10
      : 0;
  }, [hasRealData, results]);

  if (!hasBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-[#8A9BA3] text-sm mb-4">Add a brand to track competitors.</p>
        <a href="/onboarding/step-1" className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold">
          Add your first brand
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Competitors</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          See how {activeBrand?.brand_name ?? "your brand"} compares to competitors across AI models.
        </p>
      </div>

      {!hasRealData && competitors.length > 0 && (
        <div className="mb-4">
          <Callout type="info">
            {competitors.length} competitors tracked. Run an analysis to see comparison data.
            <button
              onClick={() => triggerAnalysis()}
              className="ml-2 underline font-semibold text-[#EF4623]"
            >
              Run analysis now
            </button>
          </Callout>
        </div>
      )}

      {competitors.length === 0 && (
        <div className="bg-white border border-[#E8EAEB] rounded-xl p-8 text-center">
          <p className="text-[#8A9BA3] text-sm">No competitors tracked yet.</p>
        </div>
      )}

      {competitors.length > 0 && (
        <>
          <div className="flex gap-3 mb-5 flex-wrap">
            <Metric label="Your Brand" value={hasRealData ? `${brandMentionRate}%` : "—"} />
            <Metric label="Competitors Tracked" value={String(competitorData.length)} />
            <Metric
              label="Top Competitor"
              value={
                hasRealData
                  ? competitorData.sort((a, b) => b.mentionRate - a.mentionRate)[0]?.name ?? "N/A"
                  : competitorData[0]?.name ?? "N/A"
              }
            />
          </div>

          {/* Comparison bars */}
          <div className="bg-white border border-[#E8EAEB] rounded-lg p-4 mb-5">
            <h2 className="text-sm font-semibold text-[#2D3B42] mb-4">
              {hasRealData ? "AI Mention Rate Comparison" : "Tracked Competitors"}
            </h2>
            <div className="space-y-3">
              {hasRealData && (
                <div className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-xs font-semibold text-[#EF4623]">
                    {activeBrand?.brand_name ?? "Your Brand"}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded bg-[#F0F0F4]">
                    <div
                      className="absolute inset-y-0 left-0 rounded bg-[#EF4623] transition-all"
                      style={{ width: `${brandMentionRate}%` }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-semibold text-[#2D3B42]">
                    {brandMentionRate}%
                  </span>
                </div>
              )}
              {competitorData
                .sort((a, b) => b.mentionRate - a.mentionRate)
                .map((comp) => (
                  <div key={comp.name} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-xs font-medium text-[#4A5D66]">
                      {comp.name}
                    </span>
                    {hasRealData ? (
                      <>
                        <div className="relative h-6 flex-1 overflow-hidden rounded bg-[#F0F0F4]">
                          <div
                            className="absolute inset-y-0 left-0 rounded bg-[#8A9BA3] transition-all"
                            style={{ width: `${comp.mentionRate}%` }}
                          />
                        </div>
                        <span className="w-12 shrink-0 text-right text-xs font-semibold text-[#2D3B42]">
                          {comp.mentionRate}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-[#8A9BA3]">Pending analysis</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
