"use client";

import { useMemo } from "react";
import { useBrand } from "@/lib/context/BrandContext";
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
      return {
        brandPresence: "—",
        brandPresenceChange: undefined,
        avgPosition: "—",
        avgPositionChange: undefined,
        citationRate: "—",
        citationRateChange: undefined,
        sentimentScore: "—",
        sentimentScoreChange: undefined,
        modelBreakdown: [],
        topSources: [],
        visibilityData: [],
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
    }).filter((m) => m.pct > 0 || results.some((r) => r.llm_model === m.model));

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

  // No brand onboarded yet
  if (!hasBrand) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-bold text-[#2D3B42] mb-2">Welcome to Trace</h2>
        <p className="text-[#8A9BA3] text-sm mb-4">Add your first brand to start monitoring AI visibility.</p>
        <a
          href="/onboarding/step-1"
          className="px-6 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold hover:bg-[#d93d1e] transition"
        >
          Add your first brand
        </a>
      </div>
    );
  }

  // Brand exists but no analysis run yet
  if (!hasRealData && !analyzing) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#2D3B42]">
          Overview — {activeBrand?.brand_name}
        </h1>

        <div className="bg-white border border-[#E8EAEB] rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF1EE] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#EF4623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#2D3B42] mb-2">
              Ready to analyze {activeBrand?.brand_name}
            </h2>
            <p className="text-[#8A9BA3] text-sm mb-2">
              We have <strong className="text-[#2D3B42]">{prompts.length} prompts</strong> ready to query across AI models.
            </p>
            <p className="text-[#8A9BA3] text-xs mb-6">
              This will query ChatGPT, Gemini, and other AI models to see how they talk about your brand.
            </p>
            <button
              onClick={() => triggerAnalysis()}
              className="px-8 py-3 bg-[#EF4623] text-white rounded-lg text-sm font-semibold hover:bg-[#d93d1e] transition"
            >
              Run first analysis
            </button>
          </div>
        </div>

        {/* Show brand info summary */}
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Prompts Tracked" value={String(prompts.length)} />
          <Metric label="Competitors" value={String(competitors.length)} />
          <Metric label="Analysis Runs" value="0" />
        </div>
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
      {computed.modelBreakdown.length > 0 && (
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
      )}

      {/* Top Cited Sources */}
      {computed.topSources.length > 0 && (
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
      )}
    </div>
  );
}

function aggregateSources(
  sources: { domain: string; citation_count?: number; content_type?: string | null; is_brand_owned?: boolean }[]
) {
  const domainMap: Record<
    string,
    { domain: string; citations: number; type: string; brandOwned: boolean }
  > = {};
  sources.forEach((s) => {
    const citations = s.citation_count ?? 1;
    const type = s.content_type ?? "unknown";
    const owned = s.is_brand_owned ?? false;
    if (!domainMap[s.domain]) {
      domainMap[s.domain] = { domain: s.domain, citations: 0, type, brandOwned: owned };
    }
    domainMap[s.domain].citations += citations;
  });
  return Object.values(domainMap)
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 6);
}
