"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import { getSampleCompetitorData } from "@/lib/utils/sample-data";
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
  const { hasRealData, results, competitors, activeBrand } = useBrand();

  const competitorData = useMemo(() => {
    if (!hasRealData) return getSampleCompetitorData();

    return competitors.map((comp) => {
      // Count how often this competitor appears in results
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
        domain: "",
        mentionRate,
        modelMentions,
        totalMentions: mentionCount,
      };
    });
  }, [hasRealData, results, competitors]);

  // Brand's own mention rate for comparison
  const brandMentionRate = useMemo(() => {
    if (!hasRealData) return 67;
    const mentioned = results.filter((r) => r.brand_mentioned).length;
    return results.length > 0
      ? Math.round((mentioned / results.length) * 1000) / 10
      : 0;
  }, [hasRealData, results]);

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#2D3B42]">Competitors</h1>
        <p className="text-[13px] text-[#8A9BA3] mt-0.5">
          See how your brand compares to competitors across AI models.
        </p>
      </div>

      {!hasRealData && (
        <div className="mb-4">
          <Callout type="info">
            Showing sample data. Run analysis to see real competitor insights.
          </Callout>
        </div>
      )}

      <div className="flex gap-3 mb-5 flex-wrap">
        <Metric label="Your Brand" value={`${brandMentionRate}%`} />
        <Metric label="Competitors Tracked" value={String(competitorData.length)} />
        <Metric
          label="Top Competitor"
          value={
            competitorData.sort((a, b) => b.mentionRate - a.mentionRate)[0]
              ?.name ?? "N/A"
          }
        />
      </div>

      {/* Comparison bars */}
      <div className="bg-white border border-[#E8EAEB] rounded-lg p-4 mb-5">
        <h2 className="text-sm font-semibold text-[#2D3B42] mb-4">
          AI Mention Rate Comparison
        </h2>
        <div className="space-y-3">
          {/* Brand's own bar */}
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
          {/* Competitor bars */}
          {competitorData
            .sort((a, b) => b.mentionRate - a.mentionRate)
            .map((comp) => (
              <div key={comp.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-xs font-medium text-[#4A5D66]">
                  {comp.name}
                </span>
                <div className="relative h-6 flex-1 overflow-hidden rounded bg-[#F0F0F4]">
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-[#8A9BA3] transition-all"
                    style={{ width: `${comp.mentionRate}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-semibold text-[#2D3B42]">
                  {comp.mentionRate}%
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Competitor detail table */}
      <div className="bg-white border border-[#E8EAEB] rounded-lg overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#E8EAEB] bg-[#F8F9FA]">
              <th className="text-left text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Competitor
              </th>
              <th className="text-right text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                Mention Rate
              </th>
              <th className="text-center text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5">
                vs You
              </th>
              {hasRealData &&
                Object.keys(MODEL_DISPLAY).map((model) => (
                  <th
                    key={model}
                    className="text-right text-[10px] text-[#8A9BA3] uppercase tracking-wider font-medium px-3 py-2.5"
                  >
                    {MODEL_DISPLAY[model]}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {competitorData
              .sort((a, b) => b.mentionRate - a.mentionRate)
              .map((comp) => {
                const diff = Math.round((comp.mentionRate - brandMentionRate) * 10) / 10;
                return (
                  <tr
                    key={comp.name}
                    className="border-b border-[#E8EAEB] hover:bg-[#F8F9FA] transition"
                  >
                    <td className="px-3 py-2.5 font-medium text-[#2D3B42]">
                      {comp.name}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[#4A5D66] tabular-nums">
                      {comp.mentionRate}%
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Tag
                        label={diff > 0 ? `+${diff}%` : `${diff}%`}
                        color={diff > 0 ? "red" : "green"}
                        small
                      />
                    </td>
                    {hasRealData &&
                      Object.keys(MODEL_DISPLAY).map((model) => (
                        <td
                          key={model}
                          className="px-3 py-2.5 text-right text-[#8A9BA3] tabular-nums"
                        >
                          {(comp as any).modelMentions?.[model] ?? 0}
                        </td>
                      ))}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
