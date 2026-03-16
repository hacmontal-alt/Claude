"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
import {
  getSampleOverviewData,
  getSampleCitedSources,
} from "@/lib/utils/sample-data";
import Metric from "@/components/ui/Metric";
import Tag from "@/components/ui/Tag";
import Chart from "@/components/ui/Chart";
import Callout from "@/components/ui/Callout";

const modelLabels: Record<string, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  grok: "Grok",
  ai_overviews: "AI Overviews",
};

const modelColors: Record<string, string> = {
  chatgpt: "#10A37F",
  gemini: "#4285F4",
  perplexity: "#1A73E8",
  grok: "#2D3B42",
  ai_overviews: "#EF4623",
};

export default function OverviewPage() {
  const { activeBrand, results, sources, prompts, competitors, latestRun, hasBrand, hasRealData, loading, analyzing, triggerAnalysis } = useBrand();

  const computed = useMemo(() => {
    if (!hasRealData) {
      // Fall back to sample data so the platform always looks polished
      const sample = getSampleOverviewData();
      const sampleSources = getSampleCitedSources();
      return {
        brandPresence: "67%",
        brandPresenceChange: "+5.2%",
        avgPosition: "2.4",
        avgPositionChange: "-0.3",
        citationRate: "34%",
        citationRateChange: "+2.1%",
        sentimentScore: "78%",
        sentimentScoreChange: "+1.8%",
        modelBreakdown: sample.modelBreakdown.map((m) => ({
          model: m.model,
          pct: Math.round(m.presence),
        })),
        topSources: aggregateSources(sampleSources),
        visibilityData: [
          { label: "Jan", value: 42 },
          { label: "Feb", value: 48 },
          { label: "Mar", value: 55 },
          { label: "Apr", value: 59 },
          { label: "May", value: 63 },
          { label: "Jun", value: 67 },
        ],
      };
    }

    const totalResults = results.length;
    const mentioned = results.filter((r) => r.brand_mentioned).length;
    const brandPresence = totalResults > 0 ? Math.round((mentioned / totalResults) * 1000) / 10 : 0;

    const withPosition = results.filter((r) => r.brand_position !== null);
    const avgPosition =
      withPosition.length > 0
        ? Math.round(
            (withPosition.reduce((a, r) => a + (r.brand_position || 0), 0) /
              withPosition.length) *
              10
          ) / 10
        : 0;

    const totalCitations = sources.reduce((a, s) => a + s.citation_count, 0);
    const brandCitations = sources
      .filter((s) => s.is_brand_owned)
      .reduce((a, s) => a + s.citation_count, 0);
    const citationRate =
      totalCitations > 0
        ? Math.round((brandCitations / totalCitations) * 1000) / 10
        : 0;

    const mentionedResults = results.filter((r) => r.brand_mentioned);
    const positive = mentionedResults.filter(
      (r) => r.sentiment === "positive"
    ).length;
    const sentimentScore =
      mentionedResults.length > 0
        ? Math.round((positive / mentionedResults.length) * 1000) / 10
        : 0;

    const models = ["chatgpt", "gemini", "perplexity", "grok", "ai_overviews"];
    const modelBreakdown = models.map((model) => {
      const modelResults = results.filter((r) => r.llm_model === model);
      const modelMentioned = modelResults.filter(
        (r) => r.brand_mentioned
      ).length;
      return {
        model,
        pct:
          modelResults.length > 0
            ? Math.round((modelMentioned / modelResults.length) * 100)
            : 0,
      };
    });

    return {
      brandPresence: `${brandPresence}%`,
      brandPresenceChange: undefined,
      avgPosition: String(avgPosition),
      avgPositionChange: undefined,
      citationRate: `${citationRate}%`,
      citationRateChange: undefined,
      sentimentScore: `${sentimentScore}%`,
      sentimentScoreChange: undefined,
      modelBreakdown,
      topSources: aggregateSources(sources),
      visibilityData: [{ label: "Current", value: brandPresence }],
    };
  }, [hasRealData, results, sources]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8A9BA3] text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analyzing && (
        <Callout type="info">
          <span className="animate-pulse">Running analysis across AI models... This may take a few minutes.</span>
        </Callout>
      )}

      {!analyzing && !hasRealData && hasBrand && (
        <Callout type="info">
          Showing sample data for demo purposes. Run your first analysis to see real results for {activeBrand?.brand_name}.
          <button
            onClick={() => triggerAnalysis()}
            className="ml-2 underline font-semibold text-[#EF4623]"
          >
            Run analysis now
          </button>
        </Callout>
      )}

      {!analyzing && !hasRealData && !hasBrand && (
        <Callout type="info">
          Showing sample data. Add a brand and run analysis to see real results.
        </Callout>
      )}

      {!analyzing && hasRealData && latestRun && (
        <Callout type="success">
          Showing results from{" "}
          {new Date(latestRun.started_at).toLocaleDateString()} (
          {latestRun.status})
          <button
            onClick={() => triggerAnalysis()}
            className="ml-2 underline font-semibold text-[#EF4623]"
          >
            Run new analysis
          </button>
        </Callout>
      )}

      <h1 className="text-2xl font-bold text-[#2D3B42]">
        Overview{activeBrand ? ` — ${activeBrand.brand_name}` : ""}
      </h1>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label="Brand Presence"
          value={computed.brandPresence}
          change={computed.brandPresenceChange}
        />
        <Metric
          label="Avg. Position"
          value={computed.avgPosition}
          change={computed.avgPositionChange}
        />
        <Metric
          label="Citation Rate"
          value={computed.citationRate}
          change={computed.citationRateChange}
        />
        <Metric
          label="Sentiment Score"
          value={computed.sentimentScore}
          change={computed.sentimentScoreChange}
        />
      </div>

      {/* Visibility Chart */}
      {computed.visibilityData.length > 1 && (
        <div className="rounded-lg border border-[#E8EAEB] bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-[#2D3B42]">
            Visibility Over Time
          </h2>
          <Chart data={computed.visibilityData} color="#EF4623" height={200} />
        </div>
      )}

      {/* Model Breakdown */}
      <div className="rounded-lg border border-[#E8EAEB] bg-white p-4">
        <h2 className="mb-4 text-sm font-semibold text-[#2D3B42]">
          Model Breakdown
        </h2>
        <div className="space-y-3">
          {computed.modelBreakdown.map((m) => (
            <div key={m.model} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-medium text-[#4A5D66]">
                {modelLabels[m.model] ?? m.model}
              </span>
              <div className="relative h-5 flex-1 overflow-hidden rounded bg-[#F0F0F4]">
                <div
                  className="absolute inset-y-0 left-0 rounded transition-all"
                  style={{
                    width: `${m.pct}%`,
                    backgroundColor: modelColors[m.model] ?? "#8A9BA3",
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-xs font-semibold text-[#2D3B42]">
                {m.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cited Sources */}
      <div className="rounded-lg border border-[#E8EAEB] bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-[#2D3B42]">
          Top Cited Sources
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8EAEB] text-[10px] uppercase tracking-wider text-[#8A9BA3]">
                <th className="pb-2 pr-4 font-medium">Domain</th>
                <th className="pb-2 pr-4 font-medium">Citations</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Brand Owned?</th>
              </tr>
            </thead>
            <tbody>
              {computed.topSources.map((s) => (
                <tr
                  key={s.domain}
                  className="border-b border-[#E8EAEB] last:border-0"
                >
                  <td className="py-2 pr-4 font-medium text-[#2D3B42]">
                    {s.domain}
                  </td>
                  <td className="py-2 pr-4 text-[#4A5D66]">{s.citations}</td>
                  <td className="py-2 pr-4">
                    <Tag label={s.type} color="gray" small />
                  </td>
                  <td className="py-2">
                    {s.brandOwned ? (
                      <Tag label="Yes" color="green" small />
                    ) : (
                      <Tag label="No" color="gray" small />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function aggregateSources(
  sources: { domain: string; citation_count?: number; content_type?: string | null; is_brand_owned?: boolean; totalCitations?: number; contentType?: string; isBrandOwned?: boolean }[]
) {
  const domainMap: Record<
    string,
    { domain: string; citations: number; type: string; brandOwned: boolean }
  > = {};
  sources.forEach((s) => {
    const citations = (s as any).citation_count ?? (s as any).totalCitations ?? 1;
    const type = (s as any).content_type ?? (s as any).contentType ?? "unknown";
    const owned = (s as any).is_brand_owned ?? (s as any).isBrandOwned ?? false;
    if (!domainMap[s.domain]) {
      domainMap[s.domain] = { domain: s.domain, citations: 0, type, brandOwned: owned };
    }
    domainMap[s.domain].citations += citations;
  });
  return Object.values(domainMap)
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 6);
}
